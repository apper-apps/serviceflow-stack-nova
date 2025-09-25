import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({
  className,
  variant = "default",
  hover = false,
  children,
  ...props
}, ref) => {
  const baseStyles = "bg-white rounded-xl border border-gray-100 overflow-hidden";
  
  const variants = {
    default: "shadow-lg",
    elevated: "shadow-xl",
    flat: "shadow-sm"
  };

  const hoverStyles = hover ? "transition-all duration-300 hover:shadow-2xl hover:-translate-y-1" : "";

  return (
    <div
      className={cn(baseStyles, variants[variant], hoverStyles, className)}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;