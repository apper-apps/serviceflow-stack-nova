import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import StepIndicator from "@/components/molecules/StepIndicator";
import ApperIcon from "@/components/ApperIcon";
import { customerService } from "@/services/api/customerService";
import { appointmentService } from "@/services/api/appointmentService";
import { toast } from "react-toastify";

const CheckoutForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedPlan } = location.state || {};

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [customerData, setCustomerData] = useState({
    name: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: ""
    }
  });

  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: ""
  });

  const steps = ["Account Info", "Address", "Payment", "Confirmation"];

  if (!selectedPlan) {
    navigate("/plans");
    return null;
  }

  const handleCustomerDataChange = (field, value) => {
    setCustomerData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddressChange = (field, value) => {
    setCustomerData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };

  const handlePaymentDataChange = (field, value) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // Create customer account
      const newCustomer = {
        ...customerData,
        planId: selectedPlan.Id,
        stripeCustomerId: `stripe_${Date.now()}`, // Mock Stripe ID
        createdAt: new Date().toISOString()
      };
      
      const customer = await customerService.create(newCustomer);
      
      // Create initial appointment
      const appointment = {
        customerId: customer.Id,
        planId: selectedPlan.Id,
        scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
        status: "Scheduled",
        technicianId: "tech_1",
        notes: "Initial maintenance visit"
      };
      
      await appointmentService.create(appointment);
      
      toast.success("Account created successfully! Welcome to ServiceFlow Pro!");
      navigate("/dashboard", { state: { newCustomer: customer } });
      
    } catch (error) {
      console.error("Error creating customer:", error);
      toast.error("Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(price);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Create Your Account
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={customerData.name}
                onChange={(e) => handleCustomerDataChange("name", e.target.value)}
                required
                icon="User"
              />
              <Input
                label="Phone Number"
                type="tel"
                value={customerData.phone}
                onChange={(e) => handleCustomerDataChange("phone", e.target.value)}
                required
                icon="Phone"
              />
            </div>
            <Input
              label="Email Address"
              type="email"
              value={customerData.email}
              onChange={(e) => handleCustomerDataChange("email", e.target.value)}
              required
              icon="Mail"
            />
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Service Address
            </h3>
            <Input
              label="Street Address"
              value={customerData.address.street}
              onChange={(e) => handleAddressChange("street", e.target.value)}
              required
              icon="MapPin"
            />
            <div className="grid md:grid-cols-3 gap-4">
              <Input
                label="City"
                value={customerData.address.city}
                onChange={(e) => handleAddressChange("city", e.target.value)}
                required
              />
              <Input
                label="State"
                value={customerData.address.state}
                onChange={(e) => handleAddressChange("state", e.target.value)}
                required
              />
              <Input
                label="ZIP Code"
                value={customerData.address.zipCode}
                onChange={(e) => handleAddressChange("zipCode", e.target.value)}
                required
              />
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Payment Information
            </h3>
            <Input
              label="Name on Card"
              value={paymentData.nameOnCard}
              onChange={(e) => handlePaymentDataChange("nameOnCard", e.target.value)}
              required
              icon="User"
            />
            <Input
              label="Card Number"
              value={paymentData.cardNumber}
              onChange={(e) => handlePaymentDataChange("cardNumber", e.target.value)}
              required
              icon="CreditCard"
              placeholder="1234 5678 9012 3456"
            />
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Expiry Date"
                value={paymentData.expiryDate}
                onChange={(e) => handlePaymentDataChange("expiryDate", e.target.value)}
                required
                placeholder="MM/YY"
              />
              <Input
                label="CVV"
                value={paymentData.cvv}
                onChange={(e) => handlePaymentDataChange("cvv", e.target.value)}
                required
                placeholder="123"
              />
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Shield" className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-blue-800">
                  Your payment information is secure and encrypted
                </span>
              </div>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="CheckCircle" className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Ready to Complete Your Order
              </h3>
              <p className="text-gray-600">
                Review your information and confirm your maintenance plan
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div className="flex justify-between">
                <span className="font-medium">Plan:</span>
                <span>{selectedPlan.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Price:</span>
                <span>{formatPrice(selectedPlan.price)}/{selectedPlan.interval}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Service Frequency:</span>
                <span>Every {selectedPlan.serviceFrequency}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span className="text-primary-600">
                    {formatPrice(selectedPlan.price)}/{selectedPlan.interval}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <StepIndicator steps={steps} currentStep={currentStep} />
      
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card className="p-8">
            {renderStepContent()}
            
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <Button
                variant="secondary"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              
              {currentStep === steps.length ? (
                <Button
                  onClick={handleSubmit}
                  loading={loading}
                  icon="CreditCard"
                >
                  Complete Order
                </Button>
              ) : (
                <Button onClick={handleNext}>
                  Next
                </Button>
              )}
            </div>
          </Card>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-24">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Order Summary
            </h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Plan:</span>
                <span className="font-medium">{selectedPlan.name}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Service:</span>
                <span className="font-medium">Every {selectedPlan.serviceFrequency}</span>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-xl font-bold text-primary-600">
                    {formatPrice(selectedPlan.price)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Billed {selectedPlan.interval}
                </p>
              </div>
            </div>
            
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Check" className="w-4 h-4 text-green-500" />
                <span>No setup fees</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="Check" className="w-4 h-4 text-green-500" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="Check" className="w-4 h-4 text-green-500" />
                <span>Priority scheduling</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="Check" className="w-4 h-4 text-green-500" />
                <span>24/7 emergency support</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;