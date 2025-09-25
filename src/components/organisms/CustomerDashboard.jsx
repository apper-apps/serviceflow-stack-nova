import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { customerService } from "@/services/api/customerService";
import { planService } from "@/services/api/planService";
import { appointmentService } from "@/services/api/appointmentService";
import { brandService } from "@/services/api/brandService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
const CustomerDashboard = () => {
  const location = useLocation();
  const { newCustomer } = location.state || {};
  
  const [customer, setCustomer] = useState(newCustomer || null);
  const [plan, setPlan] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(!newCustomer);
  const [error, setError] = useState("");
  const [brandSettings, setBrandSettings] = useState(null);
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      // For demo purposes, we'll use the first customer if no newCustomer
      let customerData = customer;
      if (!customerData) {
        const customers = await customerService.getAll();
        customerData = customers[0];
        setCustomer(customerData);
      }
      
      if (customerData) {
        // Load plan data
        const planData = await planService.getById(customerData.planId);
        setPlan(planData);
        
        // Load appointments
        const appointmentData = await appointmentService.getAll();
        const customerAppointments = appointmentData.filter(
          apt => apt.customerId === customerData.Id
        );
        setAppointments(customerAppointments);
      }
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
    loadDashboardData();
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(price);
  };

  const getStatusVariant = (status) => {
    switch (status.toLowerCase()) {
      case "scheduled":
        return "info";
      case "completed":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const handleScheduleAppointment = () => {
    toast.info("Scheduling feature coming soon!");
  };

  const handleUpdatePlan = () => {
    toast.info("Plan update feature coming soon!");
  };

  if (loading) {
    return <Loading type="page" />;
  }

  if (error) {
    return (
      <Error
        title="Dashboard Unavailable"
        message={error}
        onRetry={loadDashboardData}
      />
    );
  }

  if (!customer) {
    return (
      <Error
        title="No Customer Data"
        message="Unable to find customer information. Please try again."
        onRetry={loadDashboardData}
      />
    );
  }

  const nextAppointment = appointments
    .filter(apt => new Date(apt.scheduledDate) > new Date() && apt.status === "Scheduled")
    .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {customer.name.split(" ")[0]}!
        </h1>
        <p className="text-gray-600">
          Manage your maintenance plan and appointments
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center">
<div 
              className="w-12 h-12 rounded-lg flex items-center justify-center mr-4"
              style={{ 
                backgroundColor: `${brandSettings?.primaryColor || '#2563eb'}20` 
              }}
            >
              <ApperIcon 
                name="Package" 
                className="w-6 h-6"
                style={{ color: brandSettings?.primaryColor || '#2563eb' }}
              />
            </div>
            <div>
              <p className="text-sm text-gray-600">Current Plan</p>
              <p className="text-xl font-bold text-gray-900">
                {plan?.name || "Loading..."}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <ApperIcon name="CheckCircle" className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed Services</p>
              <p className="text-xl font-bold text-gray-900">
                {appointments.filter(apt => apt.status === "Completed").length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <ApperIcon name="Calendar" className="w-6 h-6 text-blue-600" />
            </div>
            <div>
<p className="text-sm text-gray-600">Next Service</p>
              <p className="text-xl font-bold text-gray-900">
                {nextAppointment ? 
                  new Date(nextAppointment.scheduledDate).toLocaleDateString() : 
                  "None scheduled"
                }
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mr-4">
              <ApperIcon name="DollarSign" className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Monthly Cost</p>
              <p className="text-xl font-bold text-gray-900">
                {plan ? formatPrice(plan.price) : "Loading..."}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Current Plan */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Current Plan
              </h2>
              <Button variant="secondary" size="sm" onClick={handleUpdatePlan}>
                Update Plan
              </Button>
            </div>
            
            {plan && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {plan.name}
                    </h3>
                    <p className="text-gray-600">
                      {formatPrice(plan.price)} per {plan.interval}
                    </p>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Service Frequency: Every {plan.serviceFrequency}
                  </h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <ApperIcon name="Check" className="w-4 h-4 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </Card>

          {/* Recent Appointments */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Service History
              </h2>
              <Button variant="secondary" size="sm" onClick={handleScheduleAppointment}>
                Schedule Service
              </Button>
            </div>
            
            {appointments.length > 0 ? (
              <div className="space-y-4">
                {appointments
                  .sort((a, b) => new Date(b.scheduledDate) - new Date(a.scheduledDate))
                  .slice(0, 5)
                  .map((appointment) => (
                    <div 
                      key={appointment.Id} 
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                          <ApperIcon name="Wrench" className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            Maintenance Service
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatDate(appointment.scheduledDate)}
                          </p>
                        </div>
                      </div>
                      <Badge variant={getStatusVariant(appointment.status)}>
                        {appointment.status}
                      </Badge>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ApperIcon name="Calendar" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No service history yet</p>
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Next Appointment */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Next Appointment
            </h3>
            
            {nextAppointment ? (
              <div className="space-y-4">
<div 
                  className="text-center p-4 rounded-lg"
                  style={{ 
                    backgroundColor: `${brandSettings?.primaryColor || '#2563eb'}10` 
                  }}
                >
<p 
                    className="text-sm font-medium"
                    style={{ color: brandSettings?.primaryColor || '#2563eb' }}
                  >
                    Scheduled for
                  </p>
                  <p 
                    className="text-lg font-bold"
                    style={{ color: brandSettings?.primaryColor || '#2563eb' }}
                  >
                    {formatDate(nextAppointment.scheduledDate)}
                  </p>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <ApperIcon name="User" className="w-4 h-4 text-gray-400 mr-2" />
                    <span>Technician: {nextAppointment.technicianId}</span>
                  </div>
                  <div className="flex items-center">
                    <ApperIcon name="FileText" className="w-4 h-4 text-gray-400 mr-2" />
                    <span>{nextAppointment.notes}</span>
                  </div>
                </div>
                
                <Button variant="secondary" className="w-full" size="sm">
                  Reschedule
                </Button>
              </div>
            ) : (
              <div className="text-center py-4">
                <ApperIcon name="Calendar" className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 text-sm mb-4">
                  No upcoming appointments
                </p>
                <Button 
                  variant="primary" 
                  className="w-full" 
                  size="sm"
                  onClick={handleScheduleAppointment}
                >
                  Schedule Now
                </Button>
              </div>
            )}
          </Card>

          {/* Contact Support */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Need Help?
            </h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center">
                <ApperIcon name="Phone" className="w-4 h-4 text-gray-400 mr-2" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <ApperIcon name="Mail" className="w-4 h-4 text-gray-400 mr-2" />
                <span>support@serviceflow.com</span>
              </div>
              <div className="flex items-center">
                <ApperIcon name="Clock" className="w-4 h-4 text-gray-400 mr-2" />
                <span>24/7 Emergency Service</span>
              </div>
            </div>
            
            <Button variant="accent" className="w-full mt-4" size="sm">
              Contact Support
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;