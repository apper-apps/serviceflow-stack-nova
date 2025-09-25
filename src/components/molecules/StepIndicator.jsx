import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const StepIndicator = ({
  className,
  steps,
  currentStep,
  ...props
}) => {
  return (
    <nav className={cn("mb-8", className)} {...props}>
      <ol className="flex items-center justify-center space-x-4">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          const isUpcoming = stepNumber > currentStep;

          return (
            <li key={step} className="flex items-center">
              <div className="flex items-center space-x-2">
                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-200",
                    isCompleted && "bg-green-500 border-green-500 text-white",
                    isActive && "bg-primary-500 border-primary-500 text-white",
                    isUpcoming && "bg-white border-gray-300 text-gray-500"
                  )}
                >
                  {isCompleted ? (
                    <ApperIcon name="Check" className="w-4 h-4" />
                  ) : (
                    <span className="text-sm font-medium">{stepNumber}</span>
                  )}
                </div>
                <span
                  className={cn(
                    "text-sm font-medium transition-colors duration-200",
                    isCompleted && "text-green-600",
                    isActive && "text-primary-600",
                    isUpcoming && "text-gray-500"
                  )}
                >
                  {step}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "w-8 h-0.5 ml-4 transition-colors duration-200",
                    stepNumber < currentStep ? "bg-green-500" : "bg-gray-300"
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default StepIndicator;