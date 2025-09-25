import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { customerService } from "@/services/api/customerService";
import { planService } from "@/services/api/planService";
import { appointmentService } from "@/services/api/appointmentService";
import { toast } from "react-toastify";

const AdminDashboard = ({ activeSection = "overview" }) => {
  const [customers, setCustomers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [customersData, plansData, appointmentsData] = await Promise.all([
        customerService.getAll(),
        planService.getAll(),
        appointmentService.getAll()
      ]);
      
      setCustomers(customersData);
      setPlans(plansData);
      setAppointments(appointmentsData);
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
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

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = customers.reduce((sum, customer) => {
    const plan = plans.find(p => p.Id === customer.planId);
    return sum + (plan ? plan.price : 0);
  }, 0);

  const upcomingAppointments = appointments
    .filter(apt => new Date(apt.scheduledDate) > new Date() && apt.status === "Scheduled")
    .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));

  const completedThisMonth = appointments.filter(apt => {
    const date = new Date(apt.scheduledDate);
    const now = new Date();
    return apt.status === "Completed" && 
           date.getMonth() === now.getMonth() && 
           date.getFullYear() === now.getFullYear();
  }).length;

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

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <ApperIcon name="Users" className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <ApperIcon name="DollarSign" className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatPrice(totalRevenue)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
              <ApperIcon name="Calendar" className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Upcoming Appointments</p>
              <p className="text-2xl font-bold text-gray-900">{upcomingAppointments.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mr-4">
              <ApperIcon name="CheckCircle" className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed This Month</p>
              <p className="text-2xl font-bold text-gray-900">{completedThisMonth}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Customers
          </h3>
          <div className="space-y-4">
            {customers.slice(0, 5).map((customer) => {
              const plan = plans.find(p => p.Id === customer.planId);
              return (
                <div key={customer.Id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                      <ApperIcon name="User" className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{customer.name}</p>
                      <p className="text-sm text-gray-600">{plan?.name || "Unknown Plan"}</p>
                    </div>
                  </div>
                  <Badge variant="success" size="sm">
                    Active
                  </Badge>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Upcoming Appointments
          </h3>
          <div className="space-y-4">
            {upcomingAppointments.slice(0, 5).map((appointment) => {
              const customer = customers.find(c => c.Id === appointment.customerId);
              return (
                <div key={appointment.Id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <ApperIcon name="Calendar" className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{customer?.name || "Unknown Customer"}</p>
                      <p className="text-sm text-gray-600">{formatDate(appointment.scheduledDate)}</p>
                    </div>
                  </div>
                  <Badge variant="info" size="sm">
                    {appointment.status}
                  </Badge>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );

  const renderCustomers = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Customer Management
        </h2>
        <div className="flex items-center space-x-4">
          <SearchBar
            placeholder="Search customers..."
            value={searchTerm}
            onChange={setSearchTerm}
            className="w-64"
          />
          <Button variant="primary" size="sm">
            Add Customer
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => {
                const plan = plans.find(p => p.Id === customer.planId);
                return (
                  <tr key={customer.Id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                          <ApperIcon name="User" className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {customer.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {customer.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {plan?.name || "Unknown Plan"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {plan ? formatPrice(plan.price) : "N/A"}/{plan?.interval || ""}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="success" size="sm">
                        Active
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(customer.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const renderAppointments = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Appointment Management
        </h2>
        <Button variant="primary" size="sm">
          Schedule Appointment
        </Button>
      </div>

      <div className="grid gap-4">
        {appointments.map((appointment) => {
          const customer = customers.find(c => c.Id === appointment.customerId);
          return (
            <Card key={appointment.Id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <ApperIcon name="Calendar" className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {customer?.name || "Unknown Customer"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {formatDate(appointment.scheduledDate)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {appointment.notes}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant={getStatusVariant(appointment.status)}>
                    {appointment.status}
                  </Badge>
                  <Button variant="secondary" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Manage your HVAC maintenance business
        </p>
</div>

      {/* Content */}
      {activeSection === "overview" && renderOverview()}
      {activeSection === "customers" && renderCustomers()}
      {activeSection === "appointments" && renderAppointments()}
    </div>
  );
};

export default AdminDashboard;