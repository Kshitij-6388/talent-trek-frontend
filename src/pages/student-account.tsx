import React, { useState, useEffect, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Loader2, Upload, User } from "lucide-react";
import { toast } from "sonner";
import { put } from "@vercel/blob";

// Define interfaces
interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  profilephoto: string;
}

const StudentAccountPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [initialUserData, setInitialUserData] = useState<UserData | null>(null);
  const [userData, setUserData] = useState<UserData>({
    id: "",
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    profilephoto: "",
  });

  useEffect(() => {
    async function fetchUserData() {
      try {
        setLoading(true);
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (!session?.user) {
          toast.warning("Please login to access your account");
          navigate("/login");
          return;
        }

        const { name, phone, linkedin, profilephoto } = session.user.user_metadata || {};

        const updatedUserData: UserData = {
          id: session.user.id,
          name: name || "",
          email: session.user.email || "",
          phone: phone || "",
          linkedin: linkedin || "",
          profilephoto: profilephoto || "",
        };

        setImagePreview(profilephoto || "");
        setUserData(updatedUserData);
        setInitialUserData({ ...updatedUserData });
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load account data. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [navigate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.warning("Profile image must be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setImageFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadProfilePhoto = async (): Promise<string | null> => {
    if (!imageFile) return null;

    try {
      const { url } = await put(imageFile.name, imageFile, {
        access: "public",
        token: import.meta.env.VITE_BLOB_READ_WRITE_TOKEN,
      });

      return url;
    } catch (error) {
      console.error("Error uploading profile photo:", error);
      toast.error("Failed to upload profile photo. Please try again.");
      return null;
    }
  };

  const getUpdatedFields = (): Record<string, any> => {
    const updatedFields: Record<string, any> = {};
    if (initialUserData) {
      if (userData.name !== initialUserData.name) updatedFields.name = userData.name;
      if (userData.phone !== initialUserData.phone) updatedFields.phone = userData.phone;
      if (userData.linkedin !== initialUserData.linkedin) updatedFields.linkedin = userData.linkedin;

      if (imageFile) {
        updatedFields.profilephoto = "";
      } else if (userData.profilephoto !== initialUserData.profilephoto) {
        updatedFields.profilephoto = userData.profilephoto;
      }
    }
    return updatedFields;
  };

  const handleSaveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedFields = getUpdatedFields();
    if (Object.keys(updatedFields).length === 0 && !imageFile) {
      toast.warning("No changes detected to save.");
      return;
    }

    try {
      setSaving(true);

      let profilePhotoUrl: string | null = null;
      if (imageFile) {
        profilePhotoUrl = await uploadProfilePhoto();
        if (!profilePhotoUrl) {
          throw new Error("Failed to upload profile photo");
        }
        updatedFields.profilephoto = profilePhotoUrl;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        data: updatedFields,
      });

      if (updateError) throw updateError;

      setUserData((prev) => ({
        ...prev,
        ...updatedFields,
        profilephoto: profilePhotoUrl || prev.profilephoto,
      }));

      setInitialUserData({
        ...userData,
        ...updatedFields,
        profilephoto: profilePhotoUrl || userData.profilephoto,
      });

      toast.success("Your profile has been successfully updated.");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to update profile. Please try again");
    } finally {
      setSaving(false);
      setImageFile(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading account information...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Profile Information</CardTitle>
          <CardDescription>
            Update your personal information and profile picture. This information may be visible to recruiters.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSaveProfile}>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center justify-center sm:flex-row sm:items-start sm:justify-start">
              <div className="relative mb-4 sm:mb-0 sm:mr-6">
                <Avatar className="h-32 w-32 border-2 border-border">
                  <AvatarImage src={imagePreview || userData.profilephoto || ""} className="object-cover" />
                  <AvatarFallback className="text-2xl">
                    {userData.name?.charAt(0)?.toUpperCase() || userData.email?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="profile-upload"
                  className="absolute -bottom-2 -right-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Upload className="h-4 w-4" />
                  <input
                    type="file"
                    id="profile-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              <div className="w-full space-y-1 text-center sm:text-left">
                <h3 className="text-lg font-medium">{userData.name || "Update your name"}</h3>
                <p className="text-sm text-muted-foreground">{userData.email}</p>
                <p className="text-xs text-muted-foreground">
                  {userData.phone ? `Phone: ${userData.phone}` : "Add your phone number"}
                </p>
                {userData.linkedin && (
                  <a
                    href={`${userData.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center text-xs text-blue-600 hover:underline"
                  >
                    <Globe className="mr-1 h-3 w-3" />
                    LinkedIn Profile
                  </a>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={userData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={userData.email} disabled className="bg-muted/50" />
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={userData.phone}
                  onChange={handleChange}
                  placeholder="Your phone number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn Profile</Label>
                <Input
                  id="linkedin"
                  name="linkedin"
                  value={userData.linkedin}
                  onChange={handleChange}
                  placeholder="Your LinkedIn profile URL"
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => navigate("/student/jobs")}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default StudentAccountPage;