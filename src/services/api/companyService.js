import { toast } from "react-toastify";

export const companyService = {
  // Get all companies
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
          { field: { Name: "logo_c" } },
          { field: { Name: "primary_color_c" } },
          { field: { Name: "contact_email_c" } },
          { field: { Name: "embed_code_c" } }
        ]
      };

      const response = await apperClient.fetchRecords("company_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      // Transform data to match UI expectations
      return response.data.map(company => ({
        ...company,
        name: company.name_c,
        logo: company.logo_c,
        primaryColor: company.primary_color_c,
        contactEmail: company.contact_email_c,
        embedCode: company.embed_code_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching companies:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  },

  // Get company by ID
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
          { field: { Name: "logo_c" } },
          { field: { Name: "primary_color_c" } },
          { field: { Name: "contact_email_c" } },
          { field: { Name: "embed_code_c" } }
        ]
      };

      const response = await apperClient.getRecordById("company_c", Id, params);

      if (!response || !response.data) {
        throw new Error(`Company with ID ${Id} not found`);
      }

      const company = response.data;
      return {
        ...company,
        name: company.name_c,
        logo: company.logo_c,
        primaryColor: company.primary_color_c,
        contactEmail: company.contact_email_c,
        embedCode: company.embed_code_c
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching company with ID ${Id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  // Create new company
  create: async (companyData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [
          {
            Name: companyData.name,
            name_c: companyData.name,
            logo_c: companyData.logo,
            primary_color_c: companyData.primaryColor,
            contact_email_c: companyData.contactEmail,
            embed_code_c: `<script src='https://serviceflow.com/embed/${companyData.name.toLowerCase().replace(/\s+/g, '-')}'></script>`
          }
        ]
      };

      const response = await apperClient.createRecord("company_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create company ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          const company = successfulRecords[0].data;
          return {
            ...company,
            name: company.name_c,
            logo: company.logo_c,
            primaryColor: company.primary_color_c,
            contactEmail: company.contact_email_c,
            embedCode: company.embed_code_c
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating company:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  },

  // Update company
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
            ...(updates.logo && { logo_c: updates.logo }),
            ...(updates.primaryColor && { primary_color_c: updates.primaryColor }),
            ...(updates.contactEmail && { contact_email_c: updates.contactEmail }),
            ...(updates.embedCode && { embed_code_c: updates.embedCode })
          }
        ]
      };

      const response = await apperClient.updateRecord("company_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update company ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
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
        console.error("Error updating company:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  },

  // Delete company
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

      const response = await apperClient.deleteRecord("company_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete company ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting company:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return false;
    }
  }
};