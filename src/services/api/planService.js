import { toast } from "react-toastify";

export const planService = {
  // Get all plans
  getAll: async () => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "name_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "interval_c" } },
          { field: { Name: "features_c" } },
          { field: { Name: "service_frequency_c" } },
          { field: { Name: "is_active_c" } }
        ],
        where: [
          {
            FieldName: "is_active_c",
            Operator: "EqualTo",
            Values: [true]
          }
        ]
      };

      const response = await apperClient.fetchRecords("plan_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      // Transform data to match UI expectations
      return response.data.map(plan => ({
        ...plan,
        name: plan.name_c,
        price: plan.price_c,
        interval: plan.interval_c,
        features: plan.features_c ? plan.features_c.split('\n') : [],
        serviceFrequency: plan.service_frequency_c,
        isActive: plan.is_active_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching plans:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  },

  // Get plan by ID
  getById: async (Id) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "name_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "interval_c" } },
          { field: { Name: "features_c" } },
          { field: { Name: "service_frequency_c" } },
          { field: { Name: "is_active_c" } }
        ]
      };

      const response = await apperClient.getRecordById("plan_c", Id, params);

      if (!response || !response.data) {
        throw new Error(`Plan with ID ${Id} not found`);
      }

      const plan = response.data;
      return {
        ...plan,
        name: plan.name_c,
        price: plan.price_c,
        interval: plan.interval_c,
        features: plan.features_c ? plan.features_c.split('\n') : [],
        serviceFrequency: plan.service_frequency_c,
        isActive: plan.is_active_c
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching plan with ID ${Id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  // Create new plan
  create: async (planData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [
          {
            Name: planData.name || planData.Name,
            name_c: planData.name || planData.Name,
            price_c: parseFloat(planData.price),
            interval_c: planData.interval,
            features_c: Array.isArray(planData.features) ? planData.features.join('\n') : planData.features,
            service_frequency_c: planData.serviceFrequency,
            is_active_c: true
          }
        ]
      };

      const response = await apperClient.createRecord("plan_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create plan ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating plan:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  },

  // Update plan
  update: async (Id, updates) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [
          {
            Id: Id,
            ...(updates.name && { Name: updates.name, name_c: updates.name }),
            ...(updates.price && { price_c: parseFloat(updates.price) }),
            ...(updates.interval && { interval_c: updates.interval }),
            ...(updates.features && { features_c: Array.isArray(updates.features) ? updates.features.join('\n') : updates.features }),
            ...(updates.serviceFrequency && { service_frequency_c: updates.serviceFrequency }),
            ...(updates.isActive !== undefined && { is_active_c: updates.isActive })
          }
        ]
      };

      const response = await apperClient.updateRecord("plan_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update plan ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating plan:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  },

  // Delete plan (soft delete)
  delete: async (Id) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [
          {
            Id: Id,
            is_active_c: false
          }
        ]
      };

      const response = await apperClient.updateRecord("plan_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to delete plan ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successfulUpdates.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting plan:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return false;
    }
  }
};