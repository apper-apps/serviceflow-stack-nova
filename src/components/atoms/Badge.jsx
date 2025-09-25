import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({
  className,
  variant = "default",
  size = "md",
  children,
  ...props
}, ref) => {
  const baseStyles = "inline-flex items-center font-medium rounded-full border";
  
  const variants = {
    default: "bg-gray-100 text-gray-800 border-gray-200",
    success: "bg-green-100 text-green-800 border-green-200",
    warning: "bg-amber-100 text-amber-800 border-amber-200",
    error: "bg-red-100 text-red-800 border-red-200",
    info: "bg-blue-100 text-blue-800 border-blue-200",
    primary: "bg-primary-100 text-primary-800 border-primary-200"
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base"
  };

  return (
    <span
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;