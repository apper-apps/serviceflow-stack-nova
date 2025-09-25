import customerData from "@/services/mockData/customers.json";

let customers = [...customerData];

export const customerService = {
  // Get all customers
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...customers];
  },

  // Get customer by ID
  getById: async (Id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const customer = customers.find(c => c.Id === Id);
    if (!customer) {
      throw new Error(`Customer with ID ${Id} not found`);
    }
    return { ...customer };
  },

  // Create new customer
  create: async (customerData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newCustomer = {
      ...customerData,
      Id: Math.max(...customers.map(c => c.Id)) + 1,
      createdAt: new Date().toISOString()
    };
    customers.push(newCustomer);
    return { ...newCustomer };
  },

  // Update customer
  update: async (Id, updates) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = customers.findIndex(c => c.Id === Id);
    if (index === -1) {
      throw new Error(`Customer with ID ${Id} not found`);
    }
    customers[index] = { ...customers[index], ...updates };
    return { ...customers[index] };
  },

  // Delete customer
  delete: async (Id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = customers.findIndex(c => c.Id === Id);
    if (index === -1) {
      throw new Error(`Customer with ID ${Id} not found`);
    }
    customers.splice(index, 1);
    return true;
  }
};