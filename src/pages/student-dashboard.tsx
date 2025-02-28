import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '@/lib/supabase';
import { 
  Card, CardContent, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Assuming you have this component
import { 
  Loader2, Briefcase, MapPin, Clock, Filter, Eye, CheckCircle, Building, Search 
} from "lucide-react";
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';

interface Job {
  job_id: string;
  title: string;
  company_id: string;
  description: string;
  requirements: string;
  salary: number | null;
  location: string;
  created_at: string;
}

interface Application {
  application_id: string;
  job_id: string;
  student_id: string;
  status: string;
  applied_at: string;
  cover_letter?: string;
}

interface Company {
  company_id: string;
  name: string;
  user_id: string;
}

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [myApplications, setMyApplications] = useState<Application[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState<boolean>(false);
  const [coverLetter, setCoverLetter] = useState<string>('');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterLocation, setFilterLocation] = useState<string>('');

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (!session?.user?.id) {
          toast.warning("Please login to access the dashboard");
          navigate('/login');
          return;
        }

        const [companiesData, jobsData, applicationsData] = await Promise.all([
          supabase.from('companies').select('*'),
          supabase.from('jobs').select('*').order('created_at', { ascending: false }),
          supabase.from('applications').select('*').eq('user_id', session.user.id).order('applied_at', { ascending: false })
        ]);

        if (companiesData.error) throw companiesData.error;
        if (jobsData.error) throw jobsData.error;
        if (applicationsData.error) throw applicationsData.error;

        setCompanies(companiesData.data || []);
        setAllJobs(jobsData.data || []);
        setMyApplications(applicationsData.data || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, [navigate]);

  const handleViewDetails = async (jobId: string) => {
    const { data, error } = await supabase.from('jobs').select('*').eq('job_id', jobId).single();
    if (error) {
      toast.error("Failed to load job details.");
      return;
    }
    setSelectedJob(data);
    setIsDialogOpen(true);
  };

  const handleApplyJob = async (jobId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) throw new Error("User not authenticated");

      // Open apply dialog instead of direct application
      setSelectedJobId(jobId);
      setCoverLetter('');
      setIsApplyDialogOpen(true);
    } catch (error) {
      toast.error("Failed to initiate application.");
    }
  };

  const submitApplication = async () => {
    if (!selectedJobId) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) throw new Error("User not authenticated");

      const { error } = await supabase.from('applications').insert({
        job_id: selectedJobId,
        user_id: session.user.id,
        status: 'pending',
        applied_at: new Date().toISOString(),
        cover_letter: coverLetter || null,
      });
      if (error) throw error;

      toast.success("Application submitted successfully!");
      setMyApplications(prev => [
        ...prev,
        { 
          application_id: `${Date.now()}`, 
          job_id: selectedJobId, 
          student_id: session.user.id, 
          status: 'pending', 
          applied_at: new Date().toISOString(), 
          cover_letter: coverLetter || undefined 
        }
      ]);
      setIsApplyDialogOpen(false);
    } catch (error) {
      toast.error("Failed to apply for job.");
    }
  };

  const filteredJobs = allJobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (!filterLocation || job.location.toLowerCase().includes(filterLocation.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
        <span className="ml-3 text-lg font-medium text-gray-700">Loading opportunities...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Job Opportunities</h1>
        <p className="text-gray-600 mt-1">Explore and apply to the latest job openings</p>
      </header>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search jobs by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Filter by location..."
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            className="pl-10 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Job Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map((job) => {
          const company = companies.find(c => c.company_id === job.company_id);
          const hasApplied = myApplications.some(app => app.job_id === job.job_id);
          return (
            <Card key={job.job_id} className="bg-white shadow-md hover:shadow-lg transition-shadow border-none">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Building className="h-10 w-10 text-indigo-500" />
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900">{job.title}</CardTitle>
                    <p className="text-sm text-gray-600">{company?.name || 'Unknown Company'}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">{job.description}</p>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {format(new Date(job.created_at), "MMM d, yyyy")}
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    {job.salary ? `$${job.salary.toLocaleString()} / yr` : 'Salary TBD'}
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "flex-1",
                      hasApplied ? "bg-green-100 text-green-700 border-green-300" : "text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                    )}
                    onClick={() => !hasApplied ? handleApplyJob(job.job_id) : null}
                    disabled={hasApplied}
                  >
                    {hasApplied ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" /> Applied
                      </>
                    ) : (
                      "Apply Now"
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-indigo-600 hover:bg-indigo-50"
                    onClick={() => handleViewDetails(job.job_id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {filteredJobs.length === 0 && (
          <div className="col-span-full text-center py-10 text-gray-500">
            No jobs match your criteria. Try adjusting your filters.
          </div>
        )}
      </div>

      {/* Job Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">{selectedJob?.title}</DialogTitle>
            <DialogDescription className="text-gray-600">
              {companies.find(c => c.company_id === selectedJob?.company_id)?.name || 'Unknown Company'}
            </DialogDescription>
          </DialogHeader>
          {selectedJob && (
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold">Description</h3>
                <p className="text-sm">{selectedJob.description}</p>
              </div>
              <div>
                <h3 className="font-semibold">Requirements</h3>
                <p className="text-sm">{selectedJob.requirements}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Salary</h3>
                  <p className="text-sm">{selectedJob.salary ? `$${selectedJob.salary.toLocaleString()} / yr` : 'Not specified'}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Location</h3>
                  <p className="text-sm">{selectedJob.location}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold">Posted</h3>
                <p className="text-sm">{format(new Date(selectedJob.created_at), "MMMM d, yyyy")}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Apply Now Dialog */}
      <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">Apply for Job</DialogTitle>
            <DialogDescription className="text-gray-600">
              Submit your application for {allJobs.find(j => j.job_id === selectedJobId)?.title}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Write your cover letter here (optional)..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="w-full border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              rows={6}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="mr-2">Cancel</Button>
            </DialogClose>
            <Button onClick={submitApplication} className="bg-indigo-600 text-white hover:bg-indigo-700">
              Submit Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentDashboard;