import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import { brandService } from "@/services/api/brandService";
import { toast } from "react-toastify";

const AdminSettingsPage = () => {
  const [brandSettings, setBrandSettings] = useState({
    logo: "",
    primaryColor: "#2563eb",
    accentColor: "#f59e0b",
    companyName: "ServiceFlow Pro"
  });
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState("");

  useEffect(() => {
    loadBrandSettings();
  }, []);

  const loadBrandSettings = async () => {
    try {
      const settings = await brandService.getBrandSettings();
      setBrandSettings(settings);
      setLogoPreview(settings.logo);
    } catch (err) {
      console.error("Error loading brand settings:", err);
    }
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Simulate file upload - in real app would upload to server
      const reader = new FileReader();
      reader.onload = (e) => {
        const logoUrl = e.target.result;
        setLogoPreview(logoUrl);
        setBrandSettings(prev => ({ ...prev, logo: logoUrl }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorChange = (colorType, color) => {
    setBrandSettings(prev => ({
      ...prev,
      [colorType]: color
    }));
  };

  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      await brandService.updateBrandSettings(brandSettings);
      toast.success("Brand settings saved successfully!");
      
      // Apply changes to document root for CSS variables
      document.documentElement.style.setProperty('--primary-color', brandSettings.primaryColor);
      document.documentElement.style.setProperty('--accent-color', brandSettings.accentColor);
    } catch (err) {
      toast.error("Failed to save brand settings. Please try again.");
      console.error("Error saving brand settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const presetColors = {
    primary: [
      "#2563eb", "#059669", "#dc2626", "#7c3aed", "#ea580c", "#0891b2"
    ],
    accent: [
      "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#f97316", "#06b6d4"
    ]
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Brand Settings
        </h1>
        <p className="text-gray-600">
          Customize your company branding and apply it across the customer experience
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Settings Form */}
        <div className="space-y-6">
          {/* Logo Upload */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Company Logo
            </h3>
            
            <div className="space-y-4">
              {logoPreview && (
                <div className="flex items-center justify-center w-32 h-32 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              )}
              
              <Input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                label="Upload Logo"
              />
              
              <p className="text-sm text-gray-600">
                Upload your company logo. Recommended size: 200x200px, PNG or JPG format.
              </p>
            </div>
          </Card>

          {/* Company Name */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Company Information
            </h3>
            
            <Input
              label="Company Name"
              value={brandSettings.companyName}
              onChange={(e) => setBrandSettings(prev => ({ 
                ...prev, 
                companyName: e.target.value 
              }))}
              placeholder="Your company name"
            />
          </Card>

          {/* Primary Color */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Primary Brand Color
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Input
                  type="color"
                  value={brandSettings.primaryColor}
                  onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                  className="w-16 h-12 rounded-lg border"
                />
                <Input
                  value={brandSettings.primaryColor}
                  onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                  placeholder="#2563eb"
                  className="flex-1"
                />
              </div>
              
              <div className="grid grid-cols-6 gap-2">
                {presetColors.primary.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => handleColorChange('primaryColor', color)}
                    className="w-10 h-10 rounded-lg border-2 border-gray-200 hover:border-gray-400 transition-colors"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </Card>

          {/* Accent Color */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Accent Color
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Input
                  type="color"
                  value={brandSettings.accentColor}
                  onChange={(e) => handleColorChange('accentColor', e.target.value)}
                  className="w-16 h-12 rounded-lg border"
                />
                <Input
                  value={brandSettings.accentColor}
                  onChange={(e) => handleColorChange('accentColor', e.target.value)}
                  placeholder="#f59e0b"
                  className="flex-1"
                />
              </div>
              
              <div className="grid grid-cols-6 gap-2">
                {presetColors.accent.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => handleColorChange('accentColor', color)}
                    className="w-10 h-10 rounded-lg border-2 border-gray-200 hover:border-gray-400 transition-colors"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </Card>

          {/* Save Button */}
          <Button
            variant="primary"
            onClick={handleSaveSettings}
            loading={loading}
            className="w-full"
            icon="Save"
          >
            Save Brand Settings
          </Button>
        </div>

        {/* Live Preview */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Live Preview
            </h3>
            
            <div className="space-y-4">
              {/* Header Preview */}
              <div 
                className="p-4 rounded-lg border"
                style={{ 
                  backgroundColor: `${brandSettings.primaryColor}10`,
                  borderColor: brandSettings.primaryColor 
                }}
              >
                <div className="flex items-center space-x-3">
                  {logoPreview ? (
                    <img 
                      src={logoPreview} 
                      alt="Logo" 
                      className="w-8 h-8 object-contain"
                    />
                  ) : (
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: brandSettings.primaryColor }}
                    >
                      <ApperIcon name="Wrench" className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <span 
                    className="text-xl font-bold"
                    style={{ color: brandSettings.primaryColor }}
                  >
                    {brandSettings.companyName}
                  </span>
                </div>
              </div>

              {/* Button Preview */}
              <div className="space-y-3">
                <button
                  className="px-6 py-3 text-white font-medium rounded-lg shadow-lg transition-all duration-200 hover:opacity-90"
                  style={{ backgroundColor: brandSettings.primaryColor }}
                >
                  Primary Button
                </button>
                
                <button
                  className="px-6 py-3 text-white font-medium rounded-lg shadow-lg transition-all duration-200 hover:opacity-90"
                  style={{ backgroundColor: brandSettings.accentColor }}
                >
                  Accent Button
                </button>
              </div>

              {/* Card Preview */}
              <div className="p-4 bg-white rounded-lg shadow-lg border">
                <h4 className="font-semibold text-gray-900 mb-2">Sample Card</h4>
                <p className="text-gray-600 text-sm mb-3">
                  This is how your brand colors will appear in customer-facing components.
                </p>
                <div 
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                  style={{ 
                    backgroundColor: `${brandSettings.primaryColor}20`,
                    color: brandSettings.primaryColor 
                  }}
                >
                  Active Status
                </div>
              </div>
            </div>
          </Card>

          {/* Application Info */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Where These Changes Apply
            </h3>
            
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center">
                <ApperIcon name="Check" className="w-4 h-4 text-green-500 mr-2" />
                <span>Customer-facing header and navigation</span>
              </div>
              <div className="flex items-center">
                <ApperIcon name="Check" className="w-4 h-4 text-green-500 mr-2" />
                <span>Plan selection and pricing pages</span>
              </div>
              <div className="flex items-center">
                <ApperIcon name="Check" className="w-4 h-4 text-green-500 mr-2" />
                <span>Customer dashboard and components</span>
              </div>
              <div className="flex items-center">
                <ApperIcon name="Check" className="w-4 h-4 text-green-500 mr-2" />
                <span>Buttons, badges, and interactive elements</span>
              </div>
              <div className="flex items-center">
                <ApperIcon name="Info" className="w-4 h-4 text-blue-500 mr-2" />
                <span>Admin interface maintains its styling</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;