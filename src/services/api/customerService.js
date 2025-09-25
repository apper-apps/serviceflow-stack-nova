import { toast } from "react-toastify";
import React from "react";
import Error from "@/components/ui/Error";

export const customerService = {
  // Get all customers
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
          { field: { Name: "email_c" } },
          { field: { Name: "name_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "address_street_c" } },
          { field: { Name: "address_city_c" } },
          { field: { Name: "address_state_c" } },
          { field: { Name: "address_zip_code_c" } },
          { field: { Name: "stripe_customer_id_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "plan_id_c" } }
        ]
      };

      const response = await apperClient.fetchRecords("customer_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      // Transform data to match UI expectations
      return response.data.map(customer => ({
        ...customer,
        name: customer.name_c,
        email: customer.email_c,
        phone: customer.phone_c,
        address: {
          street: customer.address_street_c,
          city: customer.address_city_c,
          state: customer.address_state_c,
          zipCode: customer.address_zip_code_c
        },
        stripeCustomerId: customer.stripe_customer_id_c,
        createdAt: customer.created_at_c,
        planId: customer.plan_id_c?.Id || customer.plan_id_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching customers:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  },

  // Get customer by ID
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
          { field: { Name: "email_c" } },
          { field: { Name: "name_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "address_street_c" } },
          { field: { Name: "address_city_c" } },
          { field: { Name: "address_state_c" } },
          { field: { Name: "address_zip_code_c" } },
          { field: { Name: "stripe_customer_id_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "plan_id_c" } }
        ]
      };

      const response = await apperClient.getRecordById("customer_c", Id, params);

      if (!response || !response.data) {
        throw new Error(`Customer with ID ${Id} not found`);
      }

      const customer = response.data;
      return {
        ...customer,
        name: customer.name_c,
        email: customer.email_c,
        phone: customer.phone_c,
        address: {
          street: customer.address_street_c,
          city: customer.address_city_c,
          state: customer.address_state_c,
          zipCode: customer.address_zip_code_c
        },
        stripeCustomerId: customer.stripe_customer_id_c,
        createdAt: customer.created_at_c,
        planId: customer.plan_id_c?.Id || customer.plan_id_c
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching customer with ID ${Id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  // Create new customer
  create: async (customerData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [
          {
            Name: customerData.name,
            name_c: customerData.name,
            email_c: customerData.email,
            phone_c: customerData.phone,
            address_street_c: customerData.address?.street,
            address_city_c: customerData.address?.city,
            address_state_c: customerData.address?.state,
            address_zip_code_c: customerData.address?.zipCode,
            stripe_customer_id_c: customerData.stripeCustomerId,
            created_at_c: new Date().toISOString(),
            plan_id_c: customerData.planId
          }
        ]
      };

      const response = await apperClient.createRecord("customer_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create customer ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          const customer = successfulRecords[0].data;
          return {
            ...customer,
            name: customer.name_c,
            email: customer.email_c,
            phone: customer.phone_c,
            address: {
              street: customer.address_street_c,
              city: customer.address_city_c,
              state: customer.address_state_c,
              zipCode: customer.address_zip_code_c
            },
            stripeCustomerId: customer.stripe_customer_id_c,
            createdAt: customer.created_at_c,
            planId: customer.plan_id_c
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating customer:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  },

  // Update customer
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
            ...(updates.email && { email_c: updates.email }),
            ...(updates.phone && { phone_c: updates.phone }),
            ...(updates.address?.street && { address_street_c: updates.address.street }),
            ...(updates.address?.city && { address_city_c: updates.address.city }),
            ...(updates.address?.state && { address_state_c: updates.address.state }),
            ...(updates.address?.zipCode && { address_zip_code_c: updates.address.zipCode }),
            ...(updates.stripeCustomerId && { stripe_customer_id_c: updates.stripeCustomerId }),
            ...(updates.planId && { plan_id_c: updates.planId })
          }
        ]
      };

      const response = await apperClient.updateRecord("customer_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update customer ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
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
        console.error("Error updating customer:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  },

  // Delete customer
  delete: async (Id) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [Id]
      };

      const response = await apperClient.deleteRecord("customer_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete customer ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting customer:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return false;
    }
}
};