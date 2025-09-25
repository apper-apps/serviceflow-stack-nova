import planData from "@/services/mockData/plans.json";

let plans = [...planData];

export const planService = {
  // Get all plans
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return plans.filter(plan => plan.isActive);
  },

  // Get plan by ID
  getById: async (Id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const plan = plans.find(p => p.Id === Id);
    if (!plan) {
      throw new Error(`Plan with ID ${Id} not found`);
    }
    return { ...plan };
  },

  // Create new plan
  create: async (planData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newPlan = {
      ...planData,
      Id: Math.max(...plans.map(p => p.Id)) + 1,
      isActive: true
    };
    plans.push(newPlan);
    return { ...newPlan };
  },

  // Update plan
  update: async (Id, updates) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = plans.findIndex(p => p.Id === Id);
    if (index === -1) {
      throw new Error(`Plan with ID ${Id} not found`);
    }
    plans[index] = { ...plans[index], ...updates };
    return { ...plans[index] };
  },

  // Delete plan (soft delete)
  delete: async (Id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = plans.findIndex(p => p.Id === Id);
    if (index === -1) {
      throw new Error(`Plan with ID ${Id} not found`);
    }
    plans[index].isActive = false;
    return true;
  }
};