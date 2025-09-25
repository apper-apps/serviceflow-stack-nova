import appointmentData from "@/services/mockData/appointments.json";

let appointments = [...appointmentData];

export const appointmentService = {
  // Get all appointments
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...appointments];
  },

  // Get appointment by ID
  getById: async (Id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const appointment = appointments.find(a => a.Id === Id);
    if (!appointment) {
      throw new Error(`Appointment with ID ${Id} not found`);
    }
    return { ...appointment };
  },

  // Get appointments by customer ID
  getByCustomerId: async (customerId) => {
    await new Promise(resolve => setTimeout(resolve, 250));
    return appointments.filter(a => a.customerId === customerId);
  },

  // Create new appointment
  create: async (appointmentData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newAppointment = {
      ...appointmentData,
      Id: Math.max(...appointments.map(a => a.Id)) + 1
    };
    appointments.push(newAppointment);
    return { ...newAppointment };
  },

  // Update appointment
  update: async (Id, updates) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = appointments.findIndex(a => a.Id === Id);
    if (index === -1) {
      throw new Error(`Appointment with ID ${Id} not found`);
    }
    appointments[index] = { ...appointments[index], ...updates };
    return { ...appointments[index] };
  },

  // Delete appointment
  delete: async (Id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = appointments.findIndex(a => a.Id === Id);
    if (index === -1) {
      throw new Error(`Appointment with ID ${Id} not found`);
    }
    appointments.splice(index, 1);
    return true;
  }
};