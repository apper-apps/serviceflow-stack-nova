import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "@/components/organisms/Header";
import PlansPage from "@/components/pages/PlansPage";
import CheckoutPage from "@/components/pages/CheckoutPage";
import DashboardPage from "@/components/pages/DashboardPage";
import AppointmentsPage from "@/components/pages/AppointmentsPage";
import BillingPage from "@/components/pages/BillingPage";
import AdminDashboardPage from "@/components/pages/AdminDashboardPage";
import AdminCustomersPage from "@/components/pages/AdminCustomersPage";
import AdminPlansPage from "@/components/pages/AdminPlansPage";
import AdminReportsPage from "@/components/pages/AdminReportsPage";
import AdminSettingsPage from "@/components/pages/AdminSettingsPage";
const AppContent = () => {
  const location = useLocation();
  const [userRole, setUserRole] = useState(() => {
    // Determine role based on current path
    return location.pathname.startsWith("/admin") ? "admin" : "customer";
  });

  // Update user role based on current path
  React.useEffect(() => {
    if (location.pathname.startsWith("/admin")) {
      setUserRole("admin");
    } else {
      setUserRole("customer");
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userRole={userRole} />
      
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

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;