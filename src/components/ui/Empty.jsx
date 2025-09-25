import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "Nothing to see here",
  message = "It looks like there's no content available right now.",
  actionLabel = "Get Started",
  onAction,
  icon = "Inbox",
  className = ""
}) => {
  return (
    <div className={`flex flex-col items-center justify-center min-h-[300px] p-8 text-center ${className}`}>
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} className="w-8 h-8 text-gray-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {message}
      </p>

      {onAction && (
        <button
          onClick={onAction}
          className="btn-primary"
        >
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default Empty;