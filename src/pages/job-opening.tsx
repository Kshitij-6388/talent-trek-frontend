import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "@/lib/supabase";
import { 
  Card, CardContent, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Loader2, Briefcase, MapPin, Clock, Eye, CheckCircle, Building, Search 
} from "lucide-react";
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

interface Job {
  job_id: string;
  company_id: string;
  title: string;
  description: string;
  requirements: string;
  salary: number | null;
  location: string;
  created_at: string;
}

interface Application {
  application_id: string;
  job_id: string;
  user_id: string;
  status: string;
  applied_at: string;
  cover_letter?: string;
}

interface Company {
  company_id: string;
  name: string;
  user_id: string;
}

const JobOpenings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [myApplications, setMyApplications] = useState<Application[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState<boolean>(false);
  const [coverLetter, setCoverLetter] = useState<string>('');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (!session?.user?.id) {
          toast.warning("Please login to access job openings");
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
        setJobs(jobsData.data || []);
        setFilteredJobs(jobsData.data || []);
        setMyApplications(applicationsData.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error("Failed to load job data.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [navigate]);

  useEffect(() => {
    const filtered = jobs.filter(job => 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      companies.find(c => c.company_id === job.company_id)?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredJobs(filtered);
  }, [searchTerm, jobs, companies]);

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
          user_id: session.user.id, 
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

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <span className="ml-4 text-xl font-semibold text-gray-700">Loading job openings...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Search Section */}
      <section className="mb-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search jobs by title, company, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 py-3 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>
      </section>

      {/* Jobs List */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Available Jobs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => {
            const company = companies.find(c => c.company_id === job.company_id);
            const hasApplied = myApplications.some(app => app.job_id === job.job_id);
            return (
              <Card 
                key={job.job_id} 
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Building className="h-12 w-12 text-blue-500 p-2 bg-blue-50 rounded-full" />
                    <div>
                      <CardTitle className="text-xl font-semibold text-gray-900">{job.title}</CardTitle>
                      <p className="text-sm text-gray-500">{company?.name || 'Unknown Company'}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {format(new Date(job.created_at), "MMM d, yyyy")}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      className={cn(
                        "flex-1",
                        hasApplied 
                          ? "bg-green-100 text-green-700 hover:bg-green-200" 
                          : "bg-blue-600 text-white hover:bg-blue-700"
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
                      variant="outline"
                      size="sm"
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
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
            <div className="col-span-full text-center py-12 text-gray-500 text-lg">
              No jobs match your search. Try a different keyword.
            </div>
          )}
        </div>
      </section>

      {/* Job Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">{selectedJob?.title}</DialogTitle>
            <DialogDescription className="text-gray-600">
              {companies.find(c => c.company_id === selectedJob?.company_id)?.name || 'Unknown Company'}
            </DialogDescription>
          </DialogHeader>
          {selectedJob && (
            <div className="space-y-6 text-gray-700">
              <div>
                <h3 className="font-semibold text-lg">Description</h3>
                <p className="text-sm">{selectedJob.description}</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Requirements</h3>
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
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Apply Now Dialog */}
      <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">Apply for Job</DialogTitle>
            <DialogDescription className="text-gray-600">
              Submit your application for {jobs.find(j => j.job_id === selectedJobId)?.title}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Write your cover letter here (optional)..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="w-full border-gray-200 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
              rows={6}
            />
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsApplyDialogOpen(false)}
              className="mr-2 border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button 
              onClick={submitApplication} 
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Submit Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobOpenings;