import companyData from "@/services/mockData/companies.json";

let companies = [...companyData];

export const companyService = {
  // Get all companies
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...companies];
  },

  // Get company by ID
  getById: async (Id) => {
    await new Promise(resolve => setTimeout(resolve, 150));
    const company = companies.find(c => c.Id === Id);
    if (!company) {
      throw new Error(`Company with ID ${Id} not found`);
    }
    return { ...company };
  },

  // Create new company
  create: async (companyData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newCompany = {
      ...companyData,
      Id: Math.max(...companies.map(c => c.Id)) + 1,
      embedCode: `<script src='https://serviceflow.com/embed/${companyData.name.toLowerCase().replace(/\s+/g, '-')}'></script>`
    };
    companies.push(newCompany);
    return { ...newCompany };
  },

  // Update company
  update: async (Id, updates) => {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = companies.findIndex(c => c.Id === Id);
    if (index === -1) {
      throw new Error(`Company with ID ${Id} not found`);
    }
    companies[index] = { ...companies[index], ...updates };
    return { ...companies[index] };
  },

  // Delete company
  delete: async (Id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = companies.findIndex(c => c.Id === Id);
    if (index === -1) {
      throw new Error(`Company with ID ${Id} not found`);
    }
    companies.splice(index, 1);
    return true;
  }
};