import React, { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, BriefcaseBusiness } from "lucide-react";
import { toast } from 'sonner';

// Define interfaces for type safety
interface Company {
  company_id: string;
  name: string;
  recruiter_id: string;
}

interface FormData {
  company_id: string;
  title: string;
  description: string;
  requirements: string;
  salary: string;
  location: string;
}

const PostJob: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [userCompanies, setUserCompanies] = useState<Company[]>([]);
  const [formData, setFormData] = useState<FormData>({
    company_id: '',
    title: '',
    description: '',
    requirements: '',
    salary: '',
    location: ''
  });

  useEffect(() => {
    async function fetchUserCompanies() {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user?.id) {
          toast.error("Please login to post a job");
          navigate('/login');
          return;
        }
        
        const { data, error } = await supabase
          .from('companies')
          .select('*')
          .eq('user_id', session.user.id);
          
        if (error) throw error;
        
        const companies = data as Company[] || [];
        setUserCompanies(companies);
        
        if (companies.length === 1) {
          setFormData(prev => ({ ...prev, company_id: companies[0].company_id }));
        }
      } catch (error) {
        console.error('Error fetching companies:', error);
        toast.error("Failed to load company data. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchUserCompanies();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, company_id: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.company_id) {
      toast.warning("Please select a company");
      return;
    }
    
    try {
      setSubmitting(true);
      const now = new Date().toISOString();
      
      const { error } = await supabase
        .from('jobs')
        .insert({
          company_id: formData.company_id,
          title: formData.title,
          description: formData.description,
          requirements: formData.requirements,
          salary: formData.salary ? parseFloat(formData.salary) : null,
          location: formData.location,
          created_at: now
        });
      
      if (error) throw error;
      
      toast.success("Job posted successfully.");
      navigate('/recruiter/dashboard');
      
    } catch (error) {
      console.error('Error posting job:', error);
      toast.error("Failed to post job. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl py-6">
      <Card>
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <BriefcaseBusiness className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Post a New Job</CardTitle>
          </div>
          <CardDescription>
            Fill out the form below to create a new job listing. All fields are required unless marked optional.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company_id">Company</Label>
              <Select 
                value={formData.company_id} 
                onValueChange={handleSelectChange}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a company" />
                </SelectTrigger>
                <SelectContent>
                  {userCompanies.length ? (
                    userCompanies.map((company) => (
                      <SelectItem key={company.company_id} value={company.company_id}>
                        {company.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No companies available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {userCompanies.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  You need to create a company profile first.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Job Title</Label>
              <Input 
                id="title" 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                placeholder="e.g. Senior Frontend Developer" 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Job Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                placeholder="Describe the job role, responsibilities, and company culture" 
                rows={5} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements</Label>
              <Textarea 
                id="requirements" 
                name="requirements" 
                value={formData.requirements} 
                onChange={handleChange} 
                placeholder="List the required skills, qualifications, and experience" 
                rows={3} 
                required 
              />
            </div>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="salary">Salary (optional)</Label>
                <Input 
                  id="salary" 
                  name="salary" 
                  type="number" 
                  value={formData.salary} 
                  onChange={handleChange} 
                  placeholder="e.g. 75000" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  name="location" 
                  value={formData.location} 
                  onChange={handleChange} 
                  placeholder="e.g. Remote, New York, NY" 
                  required 
                />
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => navigate('/dashboard')}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || userCompanies.length === 0}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                "Post Job"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default PostJob;