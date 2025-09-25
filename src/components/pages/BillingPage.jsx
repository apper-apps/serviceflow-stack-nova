import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { customerService } from "@/services/api/customerService";
import { planService } from "@/services/api/planService";
import { toast } from "react-toastify";

const BillingPage = () => {
  const [customer, setCustomer] = useState(null);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBillingData = async () => {
    try {
      setLoading(true);
      setError("");
      
      // For demo purposes, get the first customer
      const customers = await customerService.getAll();
      if (customers.length > 0) {
        const customerData = customers[0];
        setCustomer(customerData);
        
        const planData = await planService.getById(customerData.planId);
        setPlan(planData);
      }
    } catch (err) {
      setError("Failed to load billing information. Please try again.");
      console.error("Error loading billing data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBillingData();
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
      month: "long",
      day: "numeric"
    });
  };

  const handleUpdatePaymentMethod = () => {
    toast.info("Payment method update coming soon!");
  };

  const handleDownloadInvoice = (invoiceId) => {
    toast.info("Invoice download coming soon!");
  };

  const handleCancelSubscription = () => {
    toast.info("Subscription management coming soon!");
  };

  if (loading) {
    return <Loading type="page" />;
  }

  if (error) {
    return (
      <Error
        title="Unable to Load Billing"
        message={error}
        onRetry={loadBillingData}
      />
    );
  }

  if (!customer || !plan) {
    return (
      <Error
        title="No Billing Information"
        message="Unable to find billing information for your account."
        onRetry={loadBillingData}
      />
    );
  }

  // Mock billing data
  const nextBillingDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const mockInvoices = [
    {
      Id: 1,
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      amount: plan.price,
      status: "Paid",
      invoiceNumber: "INV-2024-001"
    },
    {
      Id: 2,
      date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      amount: plan.price,
      status: "Paid",
      invoiceNumber: "INV-2024-002"
    },
    {
      Id: 3,
      date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      amount: plan.price,
      status: "Paid",
      invoiceNumber: "INV-2024-003"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Billing & Payments
        </h1>
        <p className="text-gray-600">
          Manage your subscription and payment information
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Current Subscription */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Current Subscription
              </h2>
              <Badge variant="success">Active</Badge>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-3xl font-bold text-primary-600 mb-2">
                  {formatPrice(plan.price)}
                </p>
                <p className="text-gray-600">
                  Billed {plan.interval}
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Next Billing Date</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatDate(nextBillingDate.toISOString())}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Service Frequency</p>
                  <p className="text-lg font-semibold text-gray-900">
                    Every {plan.serviceFrequency}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <Button variant="secondary">
                  Change Plan
                </Button>
                <Button variant="danger" onClick={handleCancelSubscription}>
                  Cancel Subscription
                </Button>
              </div>
            </div>
          </Card>

          {/* Payment Method */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Payment Method
              </h2>
              <Button variant="secondary" size="sm" onClick={handleUpdatePaymentMethod}>
                Update
              </Button>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-12 h-8 bg-gray-800 rounded flex items-center justify-center">
                <ApperIcon name="CreditCard" className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
                <p className="text-sm text-gray-600">Expires 12/25</p>
              </div>
            </div>
          </Card>

          {/* Billing History */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Billing History
            </h2>
            
            <div className="space-y-4">
              {mockInvoices.map((invoice) => (
                <div key={invoice.Id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <ApperIcon name="FileText" className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {invoice.invoiceNumber}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatDate(invoice.date)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {formatPrice(invoice.amount)}
                      </p>
                      <Badge variant="success" size="sm">
                        {invoice.status}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownloadInvoice(invoice.Id)}
                    >
                      <ApperIcon name="Download" className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Billing Summary */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Billing Summary
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Current Plan</span>
                <span className="font-medium">{plan.name}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Cost</span>
                <span className="font-medium">{formatPrice(plan.price)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Next Billing</span>
                <span className="font-medium">
                  {formatDate(nextBillingDate.toISOString())}
                </span>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-primary-600">{formatPrice(plan.price)}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Support */}
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
                <span>billing@serviceflow.com</span>
              </div>
            </div>
            
            <Button variant="accent" className="w-full mt-4" size="sm">
              Contact Support
            </Button>
          </Card>

          {/* Features */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Plan Features
            </h3>
            
            <ul className="space-y-2 text-sm">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <ApperIcon name="Check" className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;