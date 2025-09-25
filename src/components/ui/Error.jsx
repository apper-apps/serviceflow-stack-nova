import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  title = "Something went wrong",
  message = "We encountered an error while loading this content. Please try again.",
  onRetry,
  className = ""
}) => {
  return (
    <div className={`flex flex-col items-center justify-center min-h-[300px] p-8 text-center ${className}`}>
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name="AlertCircle" className="w-8 h-8 text-red-600" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {message}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-primary"
        >
          <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
          Try Again
        </button>
      )}
    </div>
  );
};

export default Error;