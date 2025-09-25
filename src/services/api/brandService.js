// Brand Settings Service
const STORAGE_KEY = 'serviceflow_brand_settings';

const defaultBrandSettings = {
  logo: "",
  primaryColor: "#2563eb",
  accentColor: "#f59e0b",
  companyName: "ServiceFlow Pro"
};

// Get current brand settings
export const getBrandSettings = async () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultBrandSettings, ...JSON.parse(stored) };
    }
    return defaultBrandSettings;
  } catch (error) {
    console.error('Error getting brand settings:', error);
    return defaultBrandSettings;
  }
};

// Update brand settings
export const updateBrandSettings = async (settings) => {
  try {
    const updatedSettings = { ...defaultBrandSettings, ...settings };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSettings));
    
    // Apply CSS variables for dynamic theming
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--primary-color', updatedSettings.primaryColor);
      document.documentElement.style.setProperty('--accent-color', updatedSettings.accentColor);
    }
    
    return updatedSettings;
  } catch (error) {
    console.error('Error updating brand settings:', error);
    throw error;
  }
};

// Initialize brand settings on app start
export const initializeBrandSettings = async () => {
  try {
    const settings = await getBrandSettings();
    
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
      document.documentElement.style.setProperty('--accent-color', settings.accentColor);
    }
    
    return settings;
  } catch (error) {
    console.error('Error initializing brand settings:', error);
    return defaultBrandSettings;
  }
};

export const brandService = {
  getBrandSettings,
  updateBrandSettings,
  initializeBrandSettings
};