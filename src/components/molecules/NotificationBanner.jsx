import React, { useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const NotificationBanner = ({
  className,
  type = "info",
  title,
  message,
  dismissible = true,
  onDismiss,
  action,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  const types = {
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-800",
      icon: "Info"
    },
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-800",
      icon: "CheckCircle"
    },
    warning: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-800",
      icon: "AlertTriangle"
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-800",
      icon: "AlertCircle"
    }
  };

  const typeStyles = types[type];

  return (
    <div
      className={cn(
        "p-4 border rounded-lg",
        typeStyles.bg,
        typeStyles.border,
        className
      )}
      {...props}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <ApperIcon 
            name={typeStyles.icon} 
            className={cn("w-5 h-5", typeStyles.text)} 
          />
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={cn("text-sm font-medium", typeStyles.text)}>
              {title}
            </h3>
          )}
          {message && (
            <p className={cn("text-sm", title ? "mt-1" : "", typeStyles.text)}>
              {message}
            </p>
          )}
          {action && (
            <div className="mt-3">
              {action}
            </div>
          )}
        </div>
        {dismissible && (
          <div className="ml-auto pl-3">
            <button
              type="button"
              className={cn(
                "inline-flex rounded-md p-1.5 hover:bg-black/5 transition-colors duration-200",
                typeStyles.text
              )}
              onClick={handleDismiss}
            >
              <ApperIcon name="X" className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationBanner;