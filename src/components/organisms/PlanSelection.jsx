import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PlanCard from "@/components/molecules/PlanCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { planService } from "@/services/api/planService";
import { toast } from "react-toastify";

const PlanSelection = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadPlans = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await planService.getAll();
      setPlans(data);
    } catch (err) {
      setError("Failed to load maintenance plans. Please try again.");
      console.error("Error loading plans:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const handleSelectPlan = (plan) => {
    toast.success(`Selected ${plan.name} plan`);
    navigate("/checkout", { state: { selectedPlan: plan } });
  };

  if (loading) {
    return <Loading type="cards" />;
  }

  if (error) {
    return (
      <Error
        title="Unable to Load Plans"
        message={error}
        onRetry={loadPlans}
      />
    );
  }

  if (plans.length === 0) {
    return (
      <Empty
        title="No Plans Available"
        message="There are currently no maintenance plans available. Please check back later."
        icon="Package"
      />
    );
  }

  const popularPlanId = plans.length > 1 ? plans[1].Id : plans[0]?.Id;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Choose Your <span className="text-gradient-primary">Maintenance Plan</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Protect your HVAC investment with our professional maintenance plans. 
          Regular service keeps your system running efficiently and extends its lifespan.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {plans.map((plan) => (
          <PlanCard
            key={plan.Id}
            plan={plan}
            isPopular={plan.Id === popularPlanId}
            onSelect={handleSelectPlan}
          />
        ))}
      </div>

      {/* Features Section */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose Professional Maintenance?
          </h2>
          <p className="text-gray-600">
            Regular maintenance keeps your HVAC system running at peak performance
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: "Shield",
              title: "Prevent Breakdowns",
              description: "Catch issues before they become costly repairs"
            },
            {
              icon: "Zap",
              title: "Save Energy",
              description: "Well-maintained systems use up to 15% less energy"
            },
            {
              icon: "Clock",
              title: "Extend Lifespan",
              description: "Regular service can double your system's lifespan"
            },
            {
              icon: "DollarSign",
              title: "Save Money",
              description: "Avoid emergency repairs and high energy bills"
            }
          ].map((feature, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name={feature.icon} className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-8 text-gray-500">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Shield" className="w-5 h-5" />
            <span className="text-sm">Fully Insured</span>
          </div>
          <div className="flex items-center space-x-2">
            <ApperIcon name="Award" className="w-5 h-5" />
            <span className="text-sm">Licensed Technicians</span>
          </div>
          <div className="flex items-center space-x-2">
            <ApperIcon name="Clock" className="w-5 h-5" />
            <span className="text-sm">24/7 Emergency Service</span>
          </div>
          <div className="flex items-center space-x-2">
            <ApperIcon name="ThumbsUp" className="w-5 h-5" />
            <span className="text-sm">Satisfaction Guaranteed</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanSelection;