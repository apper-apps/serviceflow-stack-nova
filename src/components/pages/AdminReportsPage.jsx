import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { customerService } from "@/services/api/customerService";
import { planService } from "@/services/api/planService";
import { appointmentService } from "@/services/api/appointmentService";

const AdminReportsPage = () => {
  const [customers, setCustomers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReportsData = async () => {
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
      setError("Failed to load reports data. Please try again.");
      console.error("Error loading reports data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReportsData();
  }, []);

  if (loading) {
    return <Loading type="page" />;
  }

  if (error) {
    return (
      <Error
        title="Reports Unavailable"
        message={error}
        onRetry={loadReportsData}
      />
    );
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(price);
  };

  const totalRevenue = customers.reduce((sum, customer) => {
    const plan = plans.find(p => p.Id === customer.planId);
    return sum + (plan ? plan.price : 0);
  }, 0);

  const completedThisMonth = appointments.filter(apt => {
    const date = new Date(apt.scheduledDate);
    const now = new Date();
    return apt.status === "Completed" && 
           date.getMonth() === now.getMonth() && 
           date.getFullYear() === now.getFullYear();
  }).length;

  const planDistribution = plans.map(plan => {
    const customerCount = customers.filter(c => c.planId === plan.Id).length;
    return {
      plan: plan.name,
      customers: customerCount,
      revenue: customerCount * plan.price
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Business Reports
        </h1>
        <p className="text-gray-600">
          Analyze your business performance and growth metrics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
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
              <p className="text-sm text-gray-600">Services This Month</p>
              <p className="text-2xl font-bold text-gray-900">{completedThisMonth}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mr-4">
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Growth Rate</p>
              <p className="text-2xl font-bold text-gray-900">+12%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Plan Performance */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Plan Distribution
          </h3>
          <div className="space-y-4">
            {planDistribution.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-primary-500 rounded mr-3"></div>
                  <span className="font-medium text-gray-900">{item.plan}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{item.customers} customers</p>
                  <p className="text-sm text-gray-600">{formatPrice(item.revenue)}/mo</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Service Status Overview
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Badge variant="success" className="mr-3">Completed</Badge>
                <span className="text-gray-900">Services</span>
              </div>
              <span className="font-semibold">
                {appointments.filter(apt => apt.status === "Completed").length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Badge variant="info" className="mr-3">Scheduled</Badge>
                <span className="text-gray-900">Upcoming</span>
              </div>
              <span className="font-semibold">
                {appointments.filter(apt => apt.status === "Scheduled").length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Badge variant="error" className="mr-3">Cancelled</Badge>
                <span className="text-gray-900">Cancelled</span>
              </div>
              <span className="font-semibold">
                {appointments.filter(apt => apt.status === "Cancelled").length}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Coming Soon */}
      <Card className="p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="BarChart3" className="w-8 h-8 text-gray-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Advanced Analytics Coming Soon
          </h3>
          <p className="text-gray-600">
            Detailed charts, revenue trends, and customer insights will be available in the next update.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default AdminReportsPage;