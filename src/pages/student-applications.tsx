import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "@/lib/supabase";
import { 
  Card, CardContent, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Loader2, Briefcase, MapPin, Clock, Eye 
} from "lucide-react";
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface Application {
  application_id: string;
  job_id: string;
  user_id: string;
  status: string;
  applied_at: string;
  cover_letter?: string;
}

interface Job {
  job_id: string;
  company_id: string;
  title: string;
  description: string;
  requirements: string;
  location: string;
  created_at: string;
}

interface Company {
  company_id: string;
  name: string;
  user_id: string;
}

const MyApplications = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);

  // Define statusStyles at the component level to make it accessible everywhere
  const statusStyles = {
    pending: "text-yellow-600 bg-yellow-100",
    accepted: "text-green-600 bg-green-100",
    rejected: "text-red-600 bg-red-100",
    interviewing: "text-blue-600 bg-blue-100",
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (!session?.user?.id) {
          toast.warning("Please login to view your applications");
          navigate('/login');
          return;
        }

        const [applicationsData, jobsData, companiesData] = await Promise.all([
          supabase.from('applications').select('*').eq('user_id', session.user.id).order('applied_at', { ascending: false }),
          supabase.from('jobs').select('*'),
          supabase.from('companies').select('*')
        ]);

        if (applicationsData.error) throw applicationsData.error;
        if (jobsData.error) throw jobsData.error;
        if (companiesData.error) throw companiesData.error;

        setApplications(applicationsData.data || []);
        setJobs(jobsData.data || []);
        setCompanies(companiesData.data || []);
      } catch (error) {
        console.error('Error fetching applications:', error);
        toast.error("Failed to load your applications.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [navigate]);


  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
        <span className="ml-3 text-lg font-medium text-gray-700">Loading applications...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen  p-6">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
        <p className="text-gray-600 mt-1">View the status of your job applications</p>
      </header>

      {/* Applications List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {applications.length === 0 ? (
          <div className="col-span-full text-center py-10 text-gray-500">
            You have not applied to any jobs yet. Check out the <a href="/student/jobs" className="text-indigo-600 hover:underline">Job Openings</a> page!
          </div>
        ) : (
          applications.map((application) => {
            const job = jobs.find(j => j.job_id === application.job_id);
            const company = job ? companies.find(c => c.company_id === job.company_id) : null;

            if (!job) return null;

            return (
              <Card key={application.application_id} className="bg-white shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-10 w-10 text-indigo-500" />
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900">{job.title}</CardTitle>
                      <p className="text-sm text-gray-600">{company?.name || 'Unknown Company'}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Applied on {format(new Date(application.applied_at), "MMM d, yyyy")}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span
                      className={cn(
                        "px-2 py-1 rounded-full text-xs font-semibold",
                        statusStyles[application.status.toLowerCase() as keyof typeof statusStyles] || "text-gray-600 bg-gray-100"
                      )}
                    >
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

    </div>
  );
};

export default MyApplications;