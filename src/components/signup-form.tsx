import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GalleryVerticalEnd } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { put } from "@vercel/blob"
import supabase from "@/lib/supabase"

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [error, setError] = useState<string | null>(null)
  const [role, setRole] = useState<"student" | "recruiter">("student") // Default role
  const navigate = useNavigate()

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const phone = formData.get("phone") as string
    const linkedin = formData.get("linkedin") as string
    const resumeFile = formData.get("resume") as File

    let resumeUrl = null
    if (resumeFile && role === "student") { // Only students need to upload resumes
      try {
        const { url } = await put(resumeFile.name, resumeFile, {
          access: "public",
          token: import.meta.env.VITE_BLOB_READ_WRITE_TOKEN,
        })
        resumeUrl = url // The URL where the resume is stored
      } catch (uploadError) {
        setError("Failed to upload resume: " + (uploadError as Error).message)
        return
      }
    }

    // Sign up the user with Supabase auth
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          phone,
          linkedin,
          resume: resumeUrl,
          role,
        },
      },
    })

    navigate(data.session?.user.user_metadata.role === "student" ? "/student/dashboard" : "/recruiter/dashboard") // Redirect to home or dashboard


    if (signUpError) {
      setError(signUpError.message)
    } 
  }

  return (
    <form onSubmit={handleSignUp} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Fill in the details below to sign up
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" type="text" placeholder="John Doe" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" placeholder="••••••••••" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 123-4567" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="linkedin">LinkedIn URL</Label>
          <Input id="linkedin" name="linkedin" type="url" placeholder="https://linkedin.com/in/username" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="role">Role</Label>
          <select
            id="role"
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value as "student" | "recruiter")}
            className="w-full p-2 border rounded"
            required
          >
            <option value="student">Student</option>
            <option value="recruiter">Recruiter</option>
          </select>
        </div>
        {role === "student" && (
          <div className="grid gap-2">
            <Label htmlFor="resume">Upload Resume</Label>
            <Input id="resume" name="resume" type="file" accept=".pdf,.doc,.docx" required={role === "student"} />
          </div>
        )}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit" className="w-full">
          Sign Up
        </Button>
      </div>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link to="/signin" className="underline underline-offset-4">
          Login
        </Link>
      </div>
    </form>
  )
}