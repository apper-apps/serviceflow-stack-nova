import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = forwardRef(({ 
  className,
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  iconPosition = "left",
  children,
  disabled,
  ...props
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg hover:shadow-xl focus:ring-primary-500",
    secondary: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm hover:shadow-md focus:ring-primary-500",
    accent: "bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl focus:ring-accent-500",
    ghost: "hover:bg-gray-100 text-gray-700 focus:ring-primary-500",
    danger: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl focus:ring-red-500"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  const renderIcon = () => {
    if (loading) {
      return <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />;
    }
    if (icon) {
      return <ApperIcon name={icon} className="w-4 h-4" />;
    }
    return null;
  };

  const iconElement = renderIcon();

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      ref={ref}
      {...props}
    >
      {iconPosition === "left" && iconElement && (
        <span className={children ? "mr-2" : ""}>
          {iconElement}
        </span>
      )}
      {children}
      {iconPosition === "right" && iconElement && (
        <span className={children ? "ml-2" : ""}>
          {iconElement}
        </span>
      )}
    </button>
  );
});

Button.displayName = "Button";

export default Button;