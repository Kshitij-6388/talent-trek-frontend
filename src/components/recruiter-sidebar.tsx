import { useState, useEffect } from 'react';
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  FileUser,
  Repeat2,
  GalleryVerticalEnd,
  Loader2,
  User2,
} from "lucide-react";
import supabase from '@/lib/supabase';

// Define the user data type to match NavUser requirements
interface UserData {
  name: string;
  email: string;
  avatar?: string;
}

export function RecruiterSidebar({ ...props }) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sample project data (this could also come from Supabase)
  const projects = [
    {
      name: "Dashboard",
      url: "/recruiter/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Applications",
      url: "/recruiter/applications",
      icon: FileUser,
    },
    {
      name: "Post Job",
      url: "/recruiter/post",
      icon: Repeat2,
    },
    {
      name: "Account",
      url: "/recruiter/account",
      icon: User2,
    },
  ];

  useEffect(() => {
    async function getUserData() {
      try {
        setLoading(true);
        
        // Get the current user session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }
        
        if (!session?.user?.email) {
          throw new Error('No user email found in session');
        }
        
        // Format the user data
        setUserData({
          name: session.user.email.split('@')[0] || "",
          email: session.user.email,
          avatar: '/default-avatar.jpg', // Default avatar
        });
      } catch (error: any) {
        console.error('Error fetching user data:', error);
        setError(error.message);
        
        try {
          // Fallback to session email if profile fetch fails
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user?.email) {
            setUserData({
              name: session.user.email.split('@')[0],
              email: session.user.email,
              avatar: '/default-avatar.jpg',
            });
          } else {
            // If we can't get user data, set a default
            setUserData({
              name: "Guest User",
              email: "guest@example.com",
              avatar: '/default-avatar.jpg',
            });
          }
        } catch (fallbackError) {
          console.error('Fallback error:', fallbackError);
        }
      } finally {
        setLoading(false);
      }
    }
    
    getUserData();
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">TalentTrek</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent>
        <NavProjects projects={projects} />
      </SidebarContent>
      
      <SidebarFooter>
        {loading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="p-4 text-sm text-red-500">
            Failed to load user data
          </div>
        ) : userData ? (
          <NavUser user={userData} />
        ) : (
          <div className="p-4 text-sm text-muted-foreground">
            No user data available
          </div>
        )}
      </SidebarFooter>
      
      <SidebarRail />
    </Sidebar>
  );
}