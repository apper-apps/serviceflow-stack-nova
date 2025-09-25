import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { planService } from "@/services/api/planService";
import { toast } from "react-toastify";

const AdminPlansPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingPlan, setEditingPlan] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    monthlyPrice: "",
    annualPrice: "",
    features: []
  });

  const loadPlans = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await planService.getAll();
      setPlans(data);
    } catch (err) {
      setError("Failed to load plans. Please try again.");
      console.error("Error loading plans:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(price);
  };

  const handleEditPlan = (plan) => {
    setEditingPlan(plan.Id);
    setEditForm({
      name: plan.name,
      monthlyPrice: plan.price.toString(),
      annualPrice: (plan.price * 10).toString(), // Assume 10x monthly for annual
      features: [...plan.features]
    });
  };

  const handleSavePlan = async () => {
    try {
      const updatedPlan = {
        ...plans.find(p => p.Id === editingPlan),
        name: editForm.name,
        price: parseFloat(editForm.monthlyPrice),
        features: editForm.features
      };

      await planService.update(editingPlan, updatedPlan);
      await loadPlans();
      setEditingPlan(null);
      toast.success("Plan updated successfully!");
    } catch (err) {
      toast.error("Failed to update plan. Please try again.");
      console.error("Error updating plan:", err);
    }
  };

  const handleCancelEdit = () => {
    setEditingPlan(null);
    setEditForm({
      name: "",
      monthlyPrice: "",
      annualPrice: "",
      features: []
    });
  };

  const handleAddFeature = () => {
    setEditForm(prev => ({
      ...prev,
      features: [...prev.features, ""]
    }));
  };

  const handleUpdateFeature = (index, value) => {
    setEditForm(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }));
  };

  const handleRemoveFeature = (index) => {
    setEditForm(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return <Loading type="page" />;
  }

  if (error) {
    return (
      <Error
        title="Plans Unavailable"
        message={error}
        onRetry={loadPlans}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Plan Management
        </h1>
        <p className="text-gray-600">
          Manage pricing and features for your maintenance plans
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card key={plan.Id} className="p-6">
            {editingPlan === plan.Id ? (
              // Edit Mode
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Edit Plan
                  </h3>
                  <Badge variant="info" size="sm">
                    Editing
                  </Badge>
                </div>

                <div className="space-y-4">
                  <Input
                    label="Plan Name"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Plan name"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Monthly Price"
                      type="number"
                      value={editForm.monthlyPrice}
                      onChange={(e) => setEditForm(prev => ({ ...prev, monthlyPrice: e.target.value }))}
                      placeholder="0.00"
                      icon="DollarSign"
                    />
                    <Input
                      label="Annual Price"
                      type="number"
                      value={editForm.annualPrice}
                      onChange={(e) => setEditForm(prev => ({ ...prev, annualPrice: e.target.value }))}
                      placeholder="0.00"
                      icon="DollarSign"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium text-gray-700">
                        Features
                      </label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleAddFeature}
                        icon="Plus"
                      >
                        Add Feature
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {editForm.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input
                            value={feature}
                            onChange={(e) => handleUpdateFeature(index, e.target.value)}
                            placeholder="Feature description"
                            className="flex-1"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFeature(index)}
                            icon="X"
                            className="text-red-600 hover:text-red-700"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button
                    variant="primary"
                    onClick={handleSavePlan}
                    className="flex-1"
                    icon="Check"
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleCancelEdit}
                    icon="X"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              // View Mode
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {plan.name}
                    </h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <p className="text-2xl font-bold text-primary-600">
                        {formatPrice(plan.price)}
                        <span className="text-sm font-normal text-gray-600">/month</span>
                      </p>
                      <p className="text-lg font-semibold text-gray-600">
                        {formatPrice(plan.price * 10)}
                        <span className="text-sm font-normal text-gray-500">/year</span>
                      </p>
                    </div>
                  </div>
                  <Badge variant="success" size="sm">
                    Active
                  </Badge>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    Features ({plan.features.length})
                  </h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <ApperIcon 
                          name="Check" 
                          className="w-4 h-4 text-green-500 mt-0.5 mr-3 flex-shrink-0" 
                        />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex space-x-3">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleEditPlan(plan)}
                      icon="Edit"
                      className="flex-1"
                    >
                      Edit Plan
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      icon="Eye"
                    >
                      Preview
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Add New Plan */}
      <Card className="mt-8 p-6">
        <div className="text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="Plus" className="w-6 h-6 text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Add New Plan
          </h3>
          <p className="text-gray-600 mb-4">
            Create additional maintenance plans for your customers
          </p>
          <Button variant="primary" icon="Plus">
            Create New Plan
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AdminPlansPage;