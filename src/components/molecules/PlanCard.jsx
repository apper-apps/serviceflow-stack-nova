import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const PlanCard = ({
  className,
  plan,
  onSelect,
  isPopular = false,
  ...props
}) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(price);
  };

  return (
    <Card
      className={cn(
        "relative p-6 h-full transition-all duration-300",
        isPopular && "ring-2 ring-primary-500 shadow-xl scale-105",
        className
      )}
      hover={!isPopular}
      {...props}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge variant="primary" className="px-4 py-1">
            Most Popular
          </Badge>
        </div>
      )}

      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {plan.name}
        </h3>
        
        <div className="mb-6">
          <span className="text-4xl font-bold text-gradient-primary">
            {formatPrice(plan.price)}
          </span>
          <span className="text-gray-600 ml-1">/{plan.interval}</span>
        </div>

        <p className="text-gray-600 text-sm mb-6">
          Service visits every {plan.serviceFrequency}
        </p>
      </div>

      <div className="space-y-3 mb-8">
        {plan.features.map((feature, index) => (
          <div key={index} className="flex items-center text-sm">
            <ApperIcon 
              name="Check" 
              className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" 
            />
            <span className="text-gray-700">{feature}</span>
          </div>
        ))}
      </div>

      <Button
        variant={isPopular ? "primary" : "secondary"}
        className="w-full"
        onClick={() => onSelect && onSelect(plan)}
      >
        Select Plan
      </Button>
    </Card>
  );
};

export default PlanCard;