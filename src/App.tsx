import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  data,
} from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./pages/home";
import JobOpenings from "./pages/job-opening";
import JobApply from "./pages/job-apply";
import ResumeFeedback from "./pages/interview-questionsPage";
import PostJob from "./pages/post-job";
import JobApplications from "./pages/job-applications";
import LoginPage from "./pages/signin";
import SignUpPage from "./pages/signup";
import supabase from "./lib/supabase";
import StudentLayout from "./layout/student-layout";
import AccountPage from "./pages/account";
import { Toaster } from "sonner";
import RecruiterLayout from "./layout/recruiter-layout";
import RecruiterDashboard from "./pages/recruiter-dashboard";
import StudentDashboard from "./pages/student-dashboard";
import MyApplications from "./pages/student-applications";
import StudentAccountPage from "./pages/student-account";

const ProtectedRoute = ({
  children,
  role,
}: {
  children: JSX.Element;
  role: "student" | "recruiter";
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<"student" | "recruiter" | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          setIsAuthenticated(true);
          const { user } = session;

          setUserRole(user.user_metadata.role)
        } else {
          setIsAuthenticated(false);
          setUserRole(null);
        }
      } catch (error) {
        setIsAuthenticated(false);
        setUserRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [location]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (userRole !== role) {
    console.log(
      `Access denied: User role (${userRole}) doesn't match required role (${role})`
    );
    return <Navigate to="/" />;
  }

  return children;
};
// AuthGuard Component to prevent access to signin/signup for authenticated users
const AuthGuard = ({ children }: { children: JSX.Element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<"student" | "recruiter" | null>(
    null
  );
  const location = useLocation();
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setUserRole(session?.user.user_metadata.role)
    };
    checkAuth();
  }, [location]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to={userRole === "student" ? "/student/jobs" : "/recruiter/dashboard"} replace />; // Redirect to a default protected route
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Home />} />

        <Route path="/student" element={<StudentLayout />}>
          {/* Student Routes */}
          <Route
            path="jobs"
            element={
              <ProtectedRoute role="student">
                <JobOpenings />
              </ProtectedRoute>
            }
          />

          <Route
            path="applications"
            element={
              <ProtectedRoute role="student">
                <MyApplications />
              </ProtectedRoute>
            }
          />
          <Route
            path="generate"
            element={
              <ProtectedRoute role="student">
                <ResumeFeedback />
              </ProtectedRoute>
            }
          />

<Route
            path="account"
            element={
              <ProtectedRoute role="student">
                <StudentAccountPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Recruiter Routes */}

        <Route path="/recruiter" element={<RecruiterLayout />}>
          <Route
            path="dashboard"
            element={
              <ProtectedRoute role="recruiter">
                <RecruiterDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="post"
            element={
              <ProtectedRoute role="recruiter">
                <PostJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="applications"
            element={
              <ProtectedRoute role="recruiter">
                <JobApplications />
              </ProtectedRoute>
            }
          />
          <Route
            path="account"
            element={
              <ProtectedRoute role="recruiter">
                <AccountPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Auth Guard for Signin and Signup */}
        <Route
          path="/signin"
          element={
            <AuthGuard>
              <LoginPage />
            </AuthGuard>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthGuard>
              <SignUpPage />
            </AuthGuard>
          }
        />

        {/* Catch-all route for 404 */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
