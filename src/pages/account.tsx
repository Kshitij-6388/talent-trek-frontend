import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Drawer, 
  DrawerClose, 
  DrawerContent, 
  DrawerDescription, 
  DrawerFooter, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerTrigger 
} from "@/components/ui/drawer";
import { Loader2, Upload, User, Building2, Plus, MapPin, Globe, Briefcase, Pencil, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from 'sonner';
import { put } from '@vercel/blob';

// Define interfaces
interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  profilephoto: string;
}

interface CompanyData {
  company_id?: string;
  name: string;
  description: string;
  location: string;
  user_id?: string;
  created_at?: string;
}

interface CompanyFormData {
  name: string;
  description: string;
  location: string;
}

interface EditCompanyState {
  isOpen: boolean;
  company: CompanyData | null;
}

const AccountPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [addingCompany, setAddingCompany] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [editCompanyState, setEditCompanyState] = useState<EditCompanyState>({
    isOpen: false,
    company: null
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [initialUserData, setInitialUserData] = useState<UserData | null>(null);
  const [userData, setUserData] = useState<UserData>({
    id: '',
    name: '',
    email: '',
    phone: '',
    linkedin: '',
    profilephoto: '',
  });
  
  const [companyData, setCompanyData] = useState<CompanyFormData>({
    name: '',
    description: '',
    location: '',
  });
  
  const [userCompanies, setUserCompanies] = useState<CompanyData[]>([]);

  useEffect(() => {
    async function fetchUserData() {
      try {
        setLoading(true);
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (!session?.user) {
          toast.warning("Please login to access your account");
          navigate('/login');
          return;
        }
        
        const { name, phone, linkedin, profilephoto } = session.user.user_metadata || {};
        
        const updatedUserData: UserData = {
          id: session.user.id,
          name: name || '',
          email: session.user.email || '',
          phone: phone || '',
          linkedin: linkedin || '',
          profilephoto: profilephoto || '',
        };
        
        setImagePreview(profilephoto);
        setUserData(updatedUserData);
        setInitialUserData({ ...updatedUserData });
        
        const { data: companies, error: companiesError } = await supabase
          .from('companies')
          .select('*')
          .eq('user_id', session.user.id);
          
        if (companiesError) throw companiesError;
        
        setUserCompanies(companies as CompanyData[] || []);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error("Failed to load account data. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchUserData();
  }, [navigate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCompanyChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCompanyData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditCompanyChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditCompanyState(prev => ({
      ...prev,
      company: {
        ...prev.company!,
        [e.target.name]: e.target.value
      }
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      toast.warning("Profile image must be less than 5MB");
      return;
    }
    
    if (!file.type.startsWith('image/')) {
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
      console.error('Error uploading profile photo:', error);
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
        updatedFields.profilephoto = '';
      } else if (userData.profilephoto !== initialUserData.profilephoto) {
        updatedFields.profilephoto = userData.profilephoto;
      }
    }
    return updatedFields;
  };

  const handleSaveProfile = async (e: FormEvent<HTMLFormElement>) => {
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
        data: updatedFields
      });
        
      if (updateError) throw updateError;
      
      setUserData(prev => ({
        ...prev,
        ...updatedFields,
        profilephoto: profilePhotoUrl || prev.profilephoto,
      }));
      
      setInitialUserData({ 
        ...userData, 
        ...updatedFields, 
        profilephoto: profilePhotoUrl || userData.profilephoto 
      });
      
      toast.success("Your profile has been successfully updated.");
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error("Failed to update profile. Please try again");
    } finally {
      setSaving(false);
      setImageFile(null);
    }
  };

  const handleAddCompany = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!companyData.name || !companyData.location) {
      toast.warning("Company name and location are required");
      return;
    }
    
    try {
      setAddingCompany(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("User session not found");
      
      const { data, error } = await supabase
        .from('companies')
        .insert({
          name: companyData.name,
          description: companyData.description,
          location: companyData.location,
          user_id: session.user.id,
          created_at: new Date().toISOString()
        })
        .select();
        
      if (error) throw error;
      
      setUserCompanies(prev => [...prev, data[0] as CompanyData]);
      
      setCompanyData({
        name: '',
        description: '',
        location: '',
      });
      
      setDrawerOpen(false);
      
      toast.success("Company profile has been successfully created.");
    } catch (error) {
      console.error('Error adding company:', error);
      toast.error("Failed to add company. Please try again.");
    } finally {
      setAddingCompany(false);
    }
  };

  const handleEditCompany = (company: CompanyData) => {
    setEditCompanyState({
      isOpen: true,
      company: { ...company }
    });
  };

  const handleUpdateCompany = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!editCompanyState.company?.company_id) return;
    
    try {
      setAddingCompany(true);
      
      const { error } = await supabase
        .from('companies')
        .update({
          name: editCompanyState.company.name,
          description: editCompanyState.company.description,
          location: editCompanyState.company.location,
        })
        .eq('company_id', editCompanyState.company.company_id);
        
      if (error) throw error;
      
      setUserCompanies(prev => prev.map(company => 
        company.company_id === editCompanyState.company?.company_id 
          ? editCompanyState.company! 
          : company
      ));
      
      setEditCompanyState({ isOpen: false, company: null });
      toast.success("Company updated successfully");
    } catch (error) {
      console.error('Error updating company:', error);
      toast.error("Failed to update company");
    } finally {
      setAddingCompany(false);
    }
  };

  const handleDeleteCompany = async (companyId: string) => {
    if (!confirm("Are you sure you want to delete this company?")) return;
    
    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('company_id', companyId);
        
      if (error) throw error;
      
      setUserCompanies(prev => prev.filter(company => company.company_id !== companyId));
      toast.success("Company deleted successfully");
    } catch (error) {
      console.error('Error deleting company:', error);
      toast.error("Failed to delete company");
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
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-2">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="companies" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span>Companies</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and profile picture. This information will be visible to job seekers.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSaveProfile}>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center justify-center sm:flex-row sm:items-start sm:justify-start">
                  <div className="relative mb-4 sm:mb-0 sm:mr-6">
                    <Avatar className="h-32 w-32 border-2 border-border">
                      <AvatarImage src={imagePreview || userData.profilephoto || ''} className="object-cover" />
                      <AvatarFallback className="text-2xl">
                        {userData.name?.charAt(0)?.toUpperCase() || userData.email?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <label htmlFor="profile-upload" className="absolute -bottom-2 -right-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
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
                
                <Separator />
                
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
                    <Input 
                      id="email" 
                      value={userData.email} 
                      disabled
                      className="bg-muted/50"
                    />
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
                <Button variant="outline" type="button" onClick={() => navigate('/dashboard')}>
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
        </TabsContent>
        
        <TabsContent value="companies">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Your Companies</CardTitle>
                <CardDescription>
                  Manage companies you're recruiting for. Add new companies to post jobs.
                </CardDescription>
              </div>
              <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                <DrawerTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    <span>Add Company</span>
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="max-w-xl mx-auto">
                  <form onSubmit={handleAddCompany}>
                    <DrawerHeader>
                      <DrawerTitle>Add New Company</DrawerTitle>
                      <DrawerDescription>
                        Create a new company profile to post jobs.
                      </DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="company-name">Company Name</Label>
                        <Input 
                          id="company-name" 
                          name="name" 
                          value={companyData.name} 
                          onChange={handleCompanyChange} 
                          placeholder="Enter company name" 
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company-description">Company Description</Label>
                        <Textarea 
                          id="company-description" 
                          name="description" 
                          value={companyData.description} 
                          onChange={handleCompanyChange} 
                          placeholder="Enter company description" 
                          rows={4} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company-location">Location</Label>
                        <Input 
                          id="company-location" 
                          name="location" 
                          value={companyData.location} 
                          onChange={handleCompanyChange} 
                          placeholder="Enter company location" 
                          required 
                        />
                      </div>
                    </div>
                    <DrawerFooter>
                      <Button type="submit" disabled={addingCompany}>
                        {addingCompany ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          "Add Company"
                        )}
                      </Button>
                      <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </form>
                </DrawerContent>
              </Drawer>
            </CardHeader>
            <CardContent>
              {userCompanies.length > 0 ? (
                <div className="space-y-4">
                  {userCompanies.map((company) => (
                    <Card key={company.company_id} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="flex h-24 w-full items-center justify-center bg-primary/10 p-4 md:h-auto md:w-24">
                          <Building2 className="h-10 w-10 text-primary" />
                        </div>
                        <div className="flex-1 p-4">
                          <h3 className="text-lg font-semibold">{company.name}</h3>
                          <div className="mt-1 flex items-center text-sm text-muted-foreground">
                            <MapPin className="mr-1 h-4 w-4" />
                            <span>{company.location}</span>
                          </div>
                          {company.description && (
                            <p className="mt-2 text-sm line-clamp-2">{company.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 p-4">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditCompany(company)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-destructive"
                            onClick={() => handleDeleteCompany(company.company_id!)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center gap-1"
                            onClick={() => navigate(`/companies/${company.company_id}`)}
                          >
                            <Briefcase className="h-4 w-4" />
                            <span>View Jobs</span>
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                  <Building2 className="mb-2 h-10 w-10 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No Companies Yet</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Add your first company to start posting jobs
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setDrawerOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    <span>Add Company</span>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Company Drawer */}
      <Drawer open={editCompanyState.isOpen} onOpenChange={(open) => setEditCompanyState(prev => ({ ...prev, isOpen: open }))}>
        <DrawerContent className="max-w-xl mx-auto">
          <form onSubmit={handleUpdateCompany}>
            <DrawerHeader>
              <DrawerTitle>Edit Company</DrawerTitle>
              <DrawerDescription>
                Update company details below.
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-company-name">Company Name</Label>
                <Input 
                  id="edit-company-name" 
                  name="name" 
                  value={editCompanyState.company?.name || ''} 
                  onChange={handleEditCompanyChange} 
                  placeholder="Enter company name" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-company-description">Company Description</Label>
                <Textarea 
                  id="edit-company-description" 
                  name="description" 
                  value={editCompanyState.company?.description || ''} 
                  onChange={handleEditCompanyChange} 
                  placeholder="Enter company description" 
                  rows={4} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-company-location">Location</Label>
                <Input 
                  id="edit-company-location" 
                  name="location" 
                  value={editCompanyState.company?.location || ''} 
                  onChange={handleEditCompanyChange} 
                  placeholder="Enter company location" 
                  required 
                />
              </div>
            </div>
            <DrawerFooter>
              <Button type="submit" disabled={addingCompany}>
                {addingCompany ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Company"
                )}
              </Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default AccountPage;