import React, { useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const SearchBar = ({
  className,
  placeholder = "Search...",
  onSearch,
  value = "",
  onChange,
  ...props
}) => {
  const [searchValue, setSearchValue] = useState(value);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
    if (onSearch) {
      onSearch(newValue);
    }
  };

  const handleClear = () => {
    setSearchValue("");
    if (onChange) {
      onChange("");
    }
    if (onSearch) {
      onSearch("");
    }
  };

  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-y-0 left-0 flex items-center pl-4">
        <ApperIcon name="Search" className="w-5 h-5 text-gray-400" />
      </div>
      <input
        type="text"
        className="block w-full pl-12 pr-12 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
        placeholder={placeholder}
        value={searchValue}
        onChange={handleChange}
        {...props}
      />
      {searchValue && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
          <button
            type="button"
            onClick={handleClear}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <ApperIcon name="X" className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;