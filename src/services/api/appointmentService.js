import { toast } from "react-toastify";

export const appointmentService = {
  // Get all appointments
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
          { field: { Name: "customer_id_c" } },
          { field: { Name: "plan_id_c" } },
          { field: { Name: "scheduled_date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "technician_id_c" } },
          { field: { Name: "notes_c" } }
        ]
      };

      const response = await apperClient.fetchRecords("appointment_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      // Transform data to match UI expectations
      return response.data.map(appointment => ({
        ...appointment,
        customerId: appointment.customer_id_c?.Id || appointment.customer_id_c,
        planId: appointment.plan_id_c?.Id || appointment.plan_id_c,
        scheduledDate: appointment.scheduled_date_c,
        status: appointment.status_c,
        technicianId: appointment.technician_id_c,
        notes: appointment.notes_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching appointments:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  },

  // Get appointment by ID
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
          { field: { Name: "customer_id_c" } },
          { field: { Name: "plan_id_c" } },
          { field: { Name: "scheduled_date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "technician_id_c" } },
          { field: { Name: "notes_c" } }
        ]
      };

      const response = await apperClient.getRecordById("appointment_c", Id, params);

      if (!response || !response.data) {
        throw new Error(`Appointment with ID ${Id} not found`);
      }

      const appointment = response.data;
      return {
        ...appointment,
        customerId: appointment.customer_id_c?.Id || appointment.customer_id_c,
        planId: appointment.plan_id_c?.Id || appointment.plan_id_c,
        scheduledDate: appointment.scheduled_date_c,
        status: appointment.status_c,
        technicianId: appointment.technician_id_c,
        notes: appointment.notes_c
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching appointment with ID ${Id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  // Get appointments by customer ID
  getByCustomerId: async (customerId) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "customer_id_c" } },
          { field: { Name: "plan_id_c" } },
          { field: { Name: "scheduled_date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "technician_id_c" } },
          { field: { Name: "notes_c" } }
        ],
        where: [
          {
            FieldName: "customer_id_c",
            Operator: "EqualTo",
            Values: [customerId]
          }
        ]
      };

      const response = await apperClient.fetchRecords("appointment_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data ? response.data.map(appointment => ({
        ...appointment,
        customerId: appointment.customer_id_c?.Id || appointment.customer_id_c,
        planId: appointment.plan_id_c?.Id || appointment.plan_id_c,
        scheduledDate: appointment.scheduled_date_c,
        status: appointment.status_c,
        technicianId: appointment.technician_id_c,
        notes: appointment.notes_c
      })) : [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching appointments by customer ID:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  },

  // Create new appointment
  create: async (appointmentData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [
          {
            Name: appointmentData.Name || "Maintenance Service",
            customer_id_c: appointmentData.customerId,
            plan_id_c: appointmentData.planId,
            scheduled_date_c: appointmentData.scheduledDate,
            status_c: appointmentData.status || "Scheduled",
            technician_id_c: appointmentData.technicianId,
            notes_c: appointmentData.notes
          }
        ]
      };

      const response = await apperClient.createRecord("appointment_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create appointment ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          const appointment = successfulRecords[0].data;
          return {
            ...appointment,
            customerId: appointment.customer_id_c,
            planId: appointment.plan_id_c,
            scheduledDate: appointment.scheduled_date_c,
            status: appointment.status_c,
            technicianId: appointment.technician_id_c,
            notes: appointment.notes_c
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating appointment:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  },

  // Update appointment
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
            ...(updates.Name && { Name: updates.Name }),
            ...(updates.customerId && { customer_id_c: updates.customerId }),
            ...(updates.planId && { plan_id_c: updates.planId }),
            ...(updates.scheduledDate && { scheduled_date_c: updates.scheduledDate }),
            ...(updates.status && { status_c: updates.status }),
            ...(updates.technicianId && { technician_id_c: updates.technicianId }),
            ...(updates.notes && { notes_c: updates.notes })
          }
        ]
      };

      const response = await apperClient.updateRecord("appointment_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update appointment ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
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
        console.error("Error updating appointment:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  },

  // Delete appointment
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

      const response = await apperClient.deleteRecord("appointment_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete appointment ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting appointment:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return false;
    }
  }
};