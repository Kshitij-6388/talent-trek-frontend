import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '@/lib/supabase';
import { format } from 'date-fns';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { 
  Loader2, 
  Search, 
  Filter, 
  User, 
  Mail, 
  Calendar as CalendarIcon,
  Phone, 
  Linkedin,
  FileText,
  Clock,
  BriefcaseIcon,
  Building,
  MoreHorizontal,
  Check,
  X,
  MessageSquare,
  Trash2
} from "lucide-react";
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

// Define interfaces
interface Application {
  application_id: string;
  job_id: string;
  user_id: string;
  status: string;
  applied_at: string;
  cover_letter: string;
  submission_date: string;
  job_title?: string;
  user?: UserDetails;
  company?: Company;
}

interface Job {
  job_id: string;
  title: string;
  company_id: string;
}

interface UserDetails {
  id: string;
  email: string;
  name: string;
  role: string;
  phone: string;
  linkedin: string;
  profilephoto: string;
}

interface Company {
  company_id: string;
  name: string;
  description: string;
  location: string;
  created_at: string;
}

const JobApplications: React.FC = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<string>('grid');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
  const [applicationToDelete, setApplicationToDelete] = useState<string | null>(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    try {
      setLoading(true);
      
      const { data: appData, error: appError } = await supabase
        .from('applications')
        .select('*')
        .order('applied_at', { ascending: false });
      
      if (appError) throw appError;

      const applicationsWithDetails = await Promise.all(appData.map(async (app) => {
        // Fetch job title and company_id
        const { data: jobData, error: jobError } = await supabase
          .from('jobs')
          .select('title, company_id')
          .eq('job_id', app.job_id)
          .single();
        
        if (jobError) console.warn(`Could not fetch job details for ID ${app.job_id}:`, jobError);

        // Fetch company details
        let companyDetails: Company | undefined;
        if (jobData?.company_id) {
          const { data: companyData, error: companyError } = await supabase
            .from('companies')
            .select('*')
            .eq('company_id', jobData.company_id)
            .single();
          if (companyError) console.warn(`Could not fetch company details for ID ${jobData.company_id}:`, companyError);
          else companyDetails = companyData;
        }

        // Fetch user details from auth
        const { data: userData, error: userError } = await supabase.auth.admin.getUserById(app.user_id);
        
        if (userError) console.warn(`Could not fetch user details for ID ${app.user_id}:`, userError);

        let userDetails: UserDetails | undefined;
        if (userData) {
          const metadata = userData?.user?.user_metadata;
          userDetails = {
            id: userData?.user?.id || '',
            email: userData?.user?.email || '',
            name: metadata?.name || 'Unknown User',
            role: metadata?.role || 'user',
            phone: metadata?.phone || 'N/A',
            linkedin: metadata?.linkedin || '#',
            profilephoto: metadata?.profilephoto || ''
          };
        }

        return {
          ...app,
          job_title: jobData?.title || 'Unknown Job',
          user: userDetails,
          company: companyDetails
        };
      }));

      setApplications(applicationsWithDetails);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error("Failed to load job applications. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const updateApplicationStatus = async (applicationId: string, newStatus: string) => {
    try {
      setStatusUpdateLoading(applicationId);
      
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('application_id', applicationId);
      
      if (error) throw error;
      
      // Update local state
      setApplications(applications.map(app => 
        app.application_id === applicationId 
          ? { ...app, status: newStatus } 
          : app
      ));
      
      toast.success(`Application status updated to ${newStatus}`);
      
      // If we're viewing application details, update that too
      if (selectedApplication && selectedApplication.application_id === applicationId) {
        setSelectedApplication({ ...selectedApplication, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      toast.error("Failed to update application status. Please try again.");
    } finally {
      setStatusUpdateLoading(null);
    }
  };

  const deleteApplication = async () => {
    if (!applicationToDelete) return;
    
    try {
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('application_id', applicationToDelete);
      
      if (error) throw error;
      
      // Remove from local state
      setApplications(applications.filter(app => app.application_id !== applicationToDelete));
      toast.success("Application deleted successfully");
      
      // Close dialog and clear selection
      setDeleteDialog(false);
      setApplicationToDelete(null);
      
      // If we were viewing this application details, close that too
      if (selectedApplication && selectedApplication.application_id === applicationToDelete) {
        setSelectedApplication(null);
      }
    } catch (error) {
      console.error('Error deleting application:', error);
      toast.error("Failed to delete application. Please try again.");
    }
  };

  const handleDeleteClick = (applicationId: string) => {
    setApplicationToDelete(applicationId);
    setDeleteDialog(true);
  };

  const filteredApplications = applications.filter((app) => {
    const matchesStatus = filterStatus === 'all' || app.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesDate = !filterDate || new Date(app.applied_at).toDateString() === filterDate.toDateString();
    const matchesSearch = app.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.job_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.company?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesDate && matchesSearch;
  });

  const statusOptions = ['all', 'pending', 'accepted', 'rejected', 'interview'];

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'interview': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading applications...</span>
      </div>
    );
  }

  return (
    <div className=" py-6">
      <Card className=" overflow-hidden">
        <CardHeader className="bg-white p-6 border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-800">Job Applications</CardTitle>
              <CardDescription className="text-gray-500 mt-1">
                View and manage all job applications submitted by users
              </CardDescription>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center gap-4 mt-4">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name, job, or status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9 text-sm border-gray-200"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[160px] h-9 text-sm border-gray-200">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status} className="text-sm capitalize">
                      {status === 'all' ? 'All Statuses' : status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[160px] h-9 text-sm border-gray-200">
                    <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                    {filterDate ? format(filterDate, "MMM d, yyyy") : "Filter by date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filterDate}
                    onSelect={setFilterDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {(filterStatus !== 'all' || filterDate) && (
                <Button 
                  variant="ghost" 
                  className="h-9 text-sm text-gray-500"
                  onClick={() => {
                    setFilterStatus('all');
                    setFilterDate(undefined);
                  }}
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 bg-gray-50">
          <div className={cn("grid gap-4", viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1')}>
            {filteredApplications.length > 0 ? (
              filteredApplications.map((application) => (
                <Card key={application.application_id} className="bg-white border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
                  <CardHeader className="p-4">
                    <div className="flex items-center justify-between">
                      <Badge className={cn("px-2 py-1 text-xs font-medium", getStatusBadgeColor(application.status))}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            {statusUpdateLoading === application.application_id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <MoreHorizontal className="h-4 w-4" />
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem 
                            className="text-green-600 cursor-pointer flex items-center"
                            onClick={() => updateApplicationStatus(application.application_id, 'accepted')}
                            disabled={application.status === 'accepted'}
                          >
                            <Check className="mr-2 h-4 w-4" />
                            Accept Application
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-blue-600 cursor-pointer flex items-center"
                            onClick={() => updateApplicationStatus(application.application_id, 'interview')}
                            disabled={application.status === 'interview'}
                          >
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Schedule Interview
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600 cursor-pointer flex items-center"
                            onClick={() => updateApplicationStatus(application.application_id, 'rejected')}
                            disabled={application.status === 'rejected'}
                          >
                            <X className="mr-2 h-4 w-4" />
                            Reject Application
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600 cursor-pointer flex items-center"
                            onClick={() => handleDeleteClick(application.application_id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Application
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="mt-3 flex items-center">
                      <Avatar className="h-10 w-10 mr-3 ring-1 ring-gray-100">
                        <AvatarImage src={application.user?.profilephoto} alt={application.user?.name} />
                        <AvatarFallback className="bg-gray-50 text-gray-500 text-xs">
                          {application.user?.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-gray-800">{application.user?.name || "Unknown User"}</h3>
                        <p className="text-xs text-gray-500">{application.user?.email}</p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <Separator className="bg-gray-100" />
                  
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <div className="flex items-center mb-1">
                        <BriefcaseIcon className="h-3 w-3 mr-2 text-gray-400" />
                        <p className="text-xs font-medium text-gray-500">Job Position</p>
                      </div>
                      <p className="text-sm font-medium text-gray-800 ml-5">{application.job_title}</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center mb-1">
                        <Building className="h-3 w-3 mr-2 text-gray-400" />
                        <p className="text-xs font-medium text-gray-500">Company</p>
                      </div>
                      <p className="text-sm font-medium text-gray-800 ml-5">{application.company?.name || 'Unknown Company'}</p>
                      <p className="text-xs text-gray-500 ml-5">{application.company?.location || 'N/A'}</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                        <div className="flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          <span className="truncate max-w-[100px]">{application.user?.phone || 'N/A'}</span>
                        </div>
                        <div className="flex items-center">
                          <Linkedin className="h-3 w-3 mr-1" />
                          <a 
                            href={application.user?.linkedin} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-600 hover:underline truncate max-w-[100px]"
                          >
                            Profile
                          </a>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                    <div className="text-xs text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      Applied {format(new Date(application.applied_at), "MMM d, yyyy")}
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-transparent hover:border-blue-100"
                      onClick={() => setSelectedApplication(application)}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex justify-center items-center h-40 bg-white rounded-lg border border-gray-100">
                <div className="text-center">
                  <Filter className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No applications match your current filters.</p>
                  <Button 
                    variant="link" 
                    className="text-blue-600 text-sm hover:underline mt-1"
                    onClick={() => {
                      setFilterStatus('all');
                      setFilterDate(undefined);
                      setSearchTerm('');
                    }}
                  >
                    Clear all filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Application Details Dialog */}
      <Dialog open={!!selectedApplication} onOpenChange={(open) => !open && setSelectedApplication(null)}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800">Application Details</DialogTitle>
            <DialogDescription className="text-gray-500">
              Detailed view of the selected job application
            </DialogDescription>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-5 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12 ring-2 ring-gray-100">
                    <AvatarImage src={selectedApplication.user?.profilephoto} alt={selectedApplication.user?.name} />
                    <AvatarFallback className="bg-gray-50 text-gray-500">
                      {selectedApplication.user?.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-800">{selectedApplication.user?.name}</h3>
                    <p className="text-sm text-gray-500">{selectedApplication.user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Select 
                    value={selectedApplication.status} 
                    onValueChange={(value) => updateApplicationStatus(selectedApplication.application_id, value)}
                    disabled={!!statusUpdateLoading}
                  >
                    <SelectTrigger className="h-9 border-gray-200 min-w-[140px]">
                      <SelectValue>
                        <div className="flex items-center">
                          {statusUpdateLoading === selectedApplication.application_id ? (
                            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                          ) : (
                            <div className={cn("w-2 h-2 rounded-full mr-2", {
                              'bg-green-500': selectedApplication.status === 'accepted',
                              'bg-red-500': selectedApplication.status === 'rejected',
                              'bg-yellow-500': selectedApplication.status === 'pending',
                              'bg-blue-500': selectedApplication.status === 'interview'
                            })} />
                          )}
                          <span className="capitalize">{selectedApplication.status}</span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="interview">Interview</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-9 border-gray-200 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200"
                    onClick={() => handleDeleteClick(selectedApplication.application_id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Separator className="bg-gray-100" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Job Information</h4>
                  <Card className="border border-gray-100 shadow-sm">
                    <CardContent className="p-4 space-y-3">
                      <div>
                        <p className="text-xs font-medium text-gray-500">Position</p>
                        <p className="text-sm font-medium text-gray-800">{selectedApplication.job_title}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">Company</p>
                        <p className="text-sm font-medium text-gray-800">{selectedApplication.company?.name || 'Unknown Company'}</p>
                        <p className="text-xs text-gray-500">{selectedApplication.company?.location || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">Applied On</p>
                        <p className="text-sm text-gray-800">{format(new Date(selectedApplication.applied_at), "MMMM d, yyyy")}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">Submission Date</p>
                        <p className="text-sm text-gray-800">{format(new Date(selectedApplication.submission_date), "MMMM d, yyyy")}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Applicant Information</h4>
                  <Card className="border border-gray-100 shadow-sm">
                    <CardContent className="p-4 space-y-3">
                      <div>
                        <p className="text-xs font-medium text-gray-500">Contact</p>
                        <div className="flex items-center space-x-1 text-sm text-gray-800">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <span>{selectedApplication.user?.email}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-gray-800">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span>{selectedApplication.user?.phone || 'N/A'}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">LinkedIn</p>
                        <div className="flex items-center space-x-1 text-sm">
                          <Linkedin className="h-3 w-3 text-gray-400" />
                          <a href={selectedApplication.user?.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate max-w-[250px]">
                            {selectedApplication.user?.linkedin}
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">Cover Letter</h4>
                <Card className="border border-gray-100 shadow-sm">
                  <CardContent className="p-4">
                    <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md max-h-48 overflow-y-auto whitespace-pre-line">
                      {selectedApplication.cover_letter || 'No cover letter provided.'}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="pt-2">
                <p className="text-xs text-gray-500">
                  Application ID: {selectedApplication.application_id}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Application</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this application? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={deleteApplication}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default JobApplications;