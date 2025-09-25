import React, { createContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { clearUser, setUser } from "@/store/userSlice";
import Login from "@/components/pages/Login";
import Signup from "@/components/pages/Signup";
import Callback from "@/components/pages/Callback";
import ErrorPage from "@/components/pages/ErrorPage";
import ResetPassword from "@/components/pages/ResetPassword";
import PromptPassword from "@/components/pages/PromptPassword";
import App from "@/index.css";
import App from "@/services/mockData/customers.json";
import App from "@/services/mockData/companies.json";
import App from "@/services/mockData/plans.json";
import App from "@/services/mockData/appointments.json";
import Header from "@/components/organisms/Header";
import AdminCustomersPage from "@/components/pages/AdminCustomersPage";
import CheckoutPage from "@/components/pages/CheckoutPage";
import AdminReportsPage from "@/components/pages/AdminReportsPage";
import BillingPage from "@/components/pages/BillingPage";
import AppointmentsPage from "@/components/pages/AppointmentsPage";
import AdminDashboardPage from "@/components/pages/AdminDashboardPage";
import DashboardPage from "@/components/pages/DashboardPage";
import AdminPlansPage from "@/components/pages/AdminPlansPage";
import AdminSettingsPage from "@/components/pages/AdminSettingsPage";
import PlansPage from "@/components/pages/PlansPage";
// Create auth context
export const AuthContext = createContext(null);

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);
  const [userRole, setUserRole] = useState(() => {
    // Determine role based on current path
    return location.pathname.startsWith("/admin") ? "admin" : "customer";
  });
  
  // Get authentication status with proper error handling
  const userState = useSelector((state) => state.user);
  const isAuthenticated = userState?.isAuthenticated || false;

  // Update user role based on current path
// Initialize ApperUI once when the app loads
  useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK;
    
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Initialize but don't show login yet
    ApperUI.setup(client, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
      onSuccess: function (user) {
        setIsInitialized(true);
        // CRITICAL: This exact currentPath logic must be preserved in all implementations
        // DO NOT simplify or modify this pattern as it ensures proper redirection flow
        let currentPath = window.location.pathname + window.location.search;
        let redirectPath = new URLSearchParams(window.location.search).get('redirect');
        const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || 
                           currentPath.includes('/callback') || currentPath.includes('/error') || 
                           currentPath.includes('/prompt-password') || currentPath.includes('/reset-password');
        
        if (user) {
          // User is authenticated
          if (redirectPath) {
            navigate(redirectPath);
          } else if (!isAuthPage) {
            if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
              navigate(currentPath);
            } else {
              navigate('/');
            }
          } else {
            navigate('/');
          }
          // Store user information in Redux
          dispatch(setUser(JSON.parse(JSON.stringify(user))));
        } else {
          // User is not authenticated
          if (!isAuthPage) {
            navigate(
              currentPath.includes('/signup')
                ? `/signup?redirect=${currentPath}`
                : currentPath.includes('/login')
                ? `/login?redirect=${currentPath}`
                : '/login'
            );
          } else if (redirectPath) {
            if (
              !['error', 'signup', 'login', 'callback', 'prompt-password', 'reset-password'].some((path) => currentPath.includes(path))
            ) {
              navigate(`/login?redirect=${redirectPath}`);
            } else {
              navigate(currentPath);
            }
          } else if (isAuthPage) {
            navigate(currentPath);
          } else {
            navigate('/login');
          }
          dispatch(clearUser());
        }
      },
      onError: function(error) {
        console.error("Authentication failed:", error);
      }
    });
  }, []);

  React.useEffect(() => {
    if (location.pathname.startsWith("/admin")) {
      setUserRole("admin");
    } else {
      setUserRole("customer");
    }
  }, [location.pathname]);

  // Authentication methods to share via context
  const authMethods = {
    isInitialized,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK;
        await ApperUI.logout();
        dispatch(clearUser());
        navigate('/login');
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };

  // Don't render routes until initialization is complete
  if (!isInitialized) {
    return <div className="loading flex items-center justify-center p-6 h-full w-full"><svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><path d="M12 2v4"></path><path d="m16.2 7.8 2.9-2.9"></path><path d="M18 12h4"></path><path d="m16.2 16.2 2.9 2.9"></path><path d="M12 18v4"></path><path d="m4.9 19.1 2.9-2.9"></path><path d="M2 12h4"></path><path d="m4.9 4.9 2.9 2.9"></path></svg></div>;
  }

return (
    <AuthContext.Provider value={authMethods}>
      <div className="min-h-screen bg-gray-50">
        <Header userRole={userRole} />
        
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="/prompt-password/:appId/:emailAddress/:provider" element={<PromptPassword />} />
          <Route path="/reset-password/:appId/:fields" element={<ResetPassword />} />
      <main>
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<PlansPage />} />
          <Route path="/plans" element={<PlansPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/billing" element={<BillingPage />} />
          
{/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/customers" element={<AdminCustomersPage />} />
          <Route path="/admin/plans" element={<AdminPlansPage />} />
          <Route path="/admin/reports" element={<AdminReportsPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
        </Routes>
      </main>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </div>
  );
};

</div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </AuthContext.Provider>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;