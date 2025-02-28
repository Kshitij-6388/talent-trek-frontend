import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '@/lib/supabase';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Loader2, Briefcase, Users, Clock, Menu, Trash2, Eye } from "lucide-react";
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

// Define interfaces
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
  user?: { name: string; email: string }; // Add user details to the application
}

interface Company {
  company_id: string;
  name: string;
  recruiter_id: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [jobsCount, setJobsCount] = useState<number>(0);
  const [applicationsCount, setApplicationsCount] = useState<number>(0);
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

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

        // Fetch companies associated with the recruiter
        const { data: companiesData, error: companiesError } = await supabase
          .from('companies')
          .select('*')
          .eq('user_id', session.user.id);
        
        if (companiesError) throw companiesError;
        setCompanies(companiesData || []);

        if (!companiesData || companiesData.length === 0) {
          toast.warning("No companies found for this recruiter.");
          setRecentJobs([]);
          setJobsCount(0);
          setLoading(false);
          return;
        }

        const companyIds = companiesData.map(company => company.company_id);

        // Fetch total jobs count
        const { count: jobsCount, error: jobsError } = await supabase
          .from('jobs')
          .select('*', { count: 'exact' })
          .in('company_id', companyIds);
        
        if (jobsError) throw jobsError;
        setJobsCount(jobsCount || 0);

        // Fetch total applications count
        const { count: applicationsCount, error: applicationsError } = await supabase
          .from('applications')
          .select('*', { count: 'exact' });
        
        if (applicationsError) throw applicationsError;
        setApplicationsCount(applicationsCount || 0);

        // Fetch recent jobs (last 5)
        const { data: recentJobsData, error: recentJobsError } = await supabase
          .from('jobs')
          .select('*')
          .in('company_id', companyIds)
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (recentJobsError) throw recentJobsError;
        setRecentJobs(recentJobsData || []);

        // Fetch recent applications (last 5) and include user details
        const { data: recentAppsData, error: recentAppsError } = await supabase
          .from('applications')
          .select('*')
          .in('job_id', recentJobsData?.map(job => job.job_id) || [])
          .order('applied_at', { ascending: false })
          .limit(5);
        
        if (recentAppsError) throw recentAppsError;

        // Fetch user details for each application
        const applicationsWithUserDetails = await Promise.all(
          (recentAppsData || []).map(async (app) => {
            const { data: userData, error: userError } = await supabase.auth.admin.getUserById(app.student_id);
            if (userError) {
              console.warn(`Could not fetch user details for ID ${app.student_id}:`, userError);
              return { ...app, user: { name: 'Unknown User', email: 'N/A' } };
            }
            const metadata = userData?.user?.user_metadata;
            return {
              ...app,
              user: {
                name: metadata?.name || 'Unknown User',
                email: userData?.user?.email || 'N/A',
              },
            };
          })
        );

        setRecentApplications(applicationsWithUserDetails);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [navigate]);

  const handleViewDetails = async (jobId: string) => {
    try {
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .select('*')
        .eq('job_id', jobId)
        .single();
      
      if (jobError) throw jobError;
      setSelectedJob(jobData);
      setIsDialogOpen(true);
    } catch (error) {
      console.error('Error fetching job details:', error);
      toast.error("Failed to load job details. Please try again.");
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('job_id', jobId);
      
      if (error) throw error;
      
      setRecentJobs(recentJobs.filter(job => job.job_id !== jobId));
      toast.success("Job post deleted successfully.");
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error("Failed to delete job. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/recruiter/post')}
            className="flex items-center gap-2"
          >
            <Briefcase className="h-4 w-4" />
            Post New Job
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Menu className="h-4 w-4" />
                Menu
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate('/recruiter/account')}>
                My Account
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/recruiter/applications')}>
                All Applications
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => supabase.auth.signOut().then(() => navigate('/login'))}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Metrics Cards */}
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs Posted</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobsCount}</div>
            <p className="text-xs text-muted-foreground">Active job listings</p>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applicationsCount}</div>
            <p className="text-xs text-muted-foreground">Received applications</p>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentApplications.length + recentJobs.length}</div>
            <p className="text-xs text-muted-foreground">Recent actions in last 24 hours</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Jobs */}
      <Card className="mt-6 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Recent Job Postings</CardTitle>
          <CardDescription>View your most recent job listings.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table className="min-w-full">
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[300px] font-bold">Job Title</TableHead>
                <TableHead className="w-[200px] font-bold">Posted Date</TableHead>
                <TableHead className="w-[150px] font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentJobs.map((job) => (
                <TableRow key={job.job_id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell>{format(new Date(job.created_at), "PPP")}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(job.job_id)}>
                          <Eye /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteJob(job.job_id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {recentJobs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                    No recent jobs found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>



      {/* Job Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Job Details</DialogTitle>
            <DialogDescription>
              View and manage the details of this job posting.
            </DialogDescription>
          </DialogHeader>
          {selectedJob && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">Job Title</h3>
                <p className="text-muted-foreground">{selectedJob.title}</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Description</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{selectedJob.description}</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Requirements</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{selectedJob.requirements}</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Salary</h3>
                <p className="text-muted-foreground">
                  {selectedJob.salary ? `$${selectedJob.salary.toLocaleString()}` : 'Not specified'}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Location</h3>
                <p className="text-muted-foreground">{selectedJob.location}</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Posted Date</h3>
                <p className="text-muted-foreground">{format(new Date(selectedJob.created_at), "PPP")}</p>
              </div>
            </div>
          )}
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                if (selectedJob) handleDeleteJob(selectedJob.job_id);
                setIsDialogOpen(false);
              }}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;