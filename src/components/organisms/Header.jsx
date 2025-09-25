import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../App";
import { brandService, getBrandSettings } from "@/services/api/brandService";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = ({ userRole = "customer" }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [brandSettings, setBrandSettings] = useState(null);
const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  
  const customerNavItems = [
    { label: "Plans", path: "/plans", icon: "Package" },
    { label: "My Account", path: "/dashboard", icon: "User" },
    { label: "Appointments", path: "/appointments", icon: "Calendar" },
    { label: "Billing", path: "/billing", icon: "CreditCard" }
  ];

  const adminNavItems = [
    { label: "Dashboard", path: "/admin", icon: "BarChart3" },
    { label: "Customers", path: "/admin/customers", icon: "Users" },
    { label: "Plans", path: "/admin/plans", icon: "Package" },
    { label: "Reports", path: "/admin/reports", icon: "FileText" },
    { label: "Settings", path: "/admin/settings", icon: "Settings" }
  ];

  const navItems = userRole === "admin" ? adminNavItems : customerNavItems;

  useEffect(() => {
    loadBrandSettings();
  }, []);

  const loadBrandSettings = async () => {
    try {
      const settings = await brandService.getBrandSettings();
      setBrandSettings(settings);
    } catch (err) {
      console.error("Error loading brand settings:", err);
    }
  };

  const isActive = (path) => location.pathname === path;

  const handleRoleSwitch = () => {
    if (userRole === "admin") {
      navigate("/plans");
    } else {
      navigate("/admin");
    }
  };

  // Use brand settings or fallback to defaults
  const logoSrc = brandSettings?.logo;
  const companyName = brandSettings?.companyName || "ServiceFlow Pro";
  const primaryColor = brandSettings?.primaryColor || "#2563eb";
  return (
    <header className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
<Link
            to={userRole === "admin" ? "/admin" : "/plans"}
            className="flex items-center space-x-2"
          >
            {logoSrc ? (
              <img 
                src={logoSrc} 
                alt={companyName}
                className="w-8 h-8 object-contain"
              />
            ) : (
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ 
                  background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)` 
                }}
              >
                <ApperIcon name="Wrench" className="w-5 h-5 text-white" />
              </div>
            )}
            <span 
              className="text-xl font-bold"
              style={{ color: userRole === "customer" ? primaryColor : undefined }}
            >
              {companyName}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
className={cn(
                  "flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive(item.path)
                    ? userRole === "customer" 
                      ? "bg-gray-50" 
                      : "text-primary-600 bg-primary-50"
                    : "text-gray-600 hover:bg-gray-50",
                  isActive(item.path) && userRole === "customer" && {
                    color: primaryColor
                  }
                )}
                style={isActive(item.path) && userRole === "customer" ? { color: primaryColor } : {}}
              >
                <ApperIcon name={item.icon} className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleRoleSwitch}
              icon={userRole === "admin" ? "User" : "Settings"}
            >
              {userRole === "admin" ? "Customer View" : "Admin"}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-colors duration-200"
          >
            <ApperIcon 
              name={isMobileMenuOpen ? "X" : "Menu"} 
              className="w-6 h-6" 
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive(item.path)
                    ? userRole === "customer"
                      ? "bg-gray-50"
                      : "text-primary-600 bg-primary-50"
                    : "text-gray-600 hover:bg-gray-50"
)}
                style={isActive(item.path) && userRole === "customer" ? { color: primaryColor } : {}}
              >
                <ApperIcon 
                  name={item.icon} 
                  className="w-4 h-4" 
                />
                <span>{item.label}</span>
              </Link>
            ))}
<div className="pt-2 border-t border-gray-100">
              <button
                onClick={() => {
                  handleRoleSwitch();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-all duration-200 w-full"
              >
                <ApperIcon 
                  name={userRole === "admin" ? "User" : "Settings"} 
                  className="w-4 h-4" 
                />
                <span>{userRole === "admin" ? "Customer View" : "Admin"}</span>
              </button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 w-full mt-2"
              >
                <ApperIcon name="LogOut" className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
)}
    </header>
  );
};

export default Header;