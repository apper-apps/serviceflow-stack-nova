import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { appointmentService } from "@/services/api/appointmentService";
import { customerService } from "@/services/api/customerService";
import { toast } from "react-toastify";

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [appointmentsData, customersData] = await Promise.all([
        appointmentService.getAll(),
        customerService.getAll()
      ]);
      
      setAppointments(appointmentsData);
      setCustomers(customersData);
    } catch (err) {
      setError("Failed to load appointments. Please try again.");
      console.error("Error loading appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatusVariant = (status) => {
    switch (status.toLowerCase()) {
      case "scheduled":
        return "info";
      case "completed":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const filterAppointments = () => {
    const now = new Date();
    switch (filter) {
      case "upcoming":
        return appointments.filter(apt => 
          new Date(apt.scheduledDate) > now && apt.status === "Scheduled"
        );
      case "completed":
        return appointments.filter(apt => apt.status === "Completed");
      case "cancelled":
        return appointments.filter(apt => apt.status === "Cancelled");
      default:
        return appointments;
    }
  };

  const filteredAppointments = filterAppointments();

  const handleReschedule = (appointmentId) => {
    toast.info("Reschedule feature coming soon!");
  };

  const handleCancel = async (appointmentId) => {
    try {
      await appointmentService.update(appointmentId, { status: "Cancelled" });
      toast.success("Appointment cancelled successfully");
      loadData();
    } catch (error) {
      toast.error("Failed to cancel appointment");
    }
  };

  const handleScheduleNew = () => {
    toast.info("Schedule new appointment feature coming soon!");
  };

  if (loading) {
    return <Loading type="page" />;
  }

  if (error) {
    return (
      <Error
        title="Unable to Load Appointments"
        message={error}
        onRetry={loadData}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Appointments
          </h1>
          <p className="text-gray-600">
            Manage your maintenance appointments
          </p>
        </div>
        <Button onClick={handleScheduleNew} icon="Plus">
          Schedule Appointment
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: "all", label: "All Appointments" },
              { id: "upcoming", label: "Upcoming" },
              { id: "completed", label: "Completed" },
              { id: "cancelled", label: "Cancelled" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  filter === tab.id
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <Empty
          title="No Appointments Found"
          message={
            filter === "all" 
              ? "You don't have any appointments scheduled yet."
              : `No ${filter} appointments found.`
          }
          actionLabel="Schedule Appointment"
          onAction={handleScheduleNew}
          icon="Calendar"
        />
      ) : (
        <div className="space-y-4">
          {filteredAppointments
            .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
            .map((appointment) => {
              const customer = customers.find(c => c.Id === appointment.customerId);
              const isUpcoming = new Date(appointment.scheduledDate) > new Date();
              
              return (
                <Card key={appointment.Id} className="p-6" hover>
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start lg:items-center space-x-4 mb-4 lg:mb-0">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        appointment.status === "Completed" 
                          ? "bg-green-100" 
                          : appointment.status === "Cancelled"
                          ? "bg-red-100"
                          : "bg-blue-100"
                      }`}>
                        <ApperIcon 
                          name={
                            appointment.status === "Completed" 
                              ? "CheckCircle" 
                              : appointment.status === "Cancelled"
                              ? "XCircle"
                              : "Calendar"
                          }
                          className={`w-6 h-6 ${
                            appointment.status === "Completed" 
                              ? "text-green-600" 
                              : appointment.status === "Cancelled"
                              ? "text-red-600"
                              : "text-blue-600"
                          }`}
                        />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Maintenance Service
                          </h3>
                          <Badge variant={getStatusVariant(appointment.status)}>
                            {appointment.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center">
                            <ApperIcon name="Clock" className="w-4 h-4 mr-2" />
                            <span>{formatDate(appointment.scheduledDate)}</span>
                          </div>
                          <div className="flex items-center">
                            <ApperIcon name="User" className="w-4 h-4 mr-2" />
                            <span>Technician: {appointment.technicianId}</span>
                          </div>
                          {appointment.notes && (
                            <div className="flex items-center">
                              <ApperIcon name="FileText" className="w-4 h-4 mr-2" />
                              <span>{appointment.notes}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {appointment.status === "Scheduled" && isUpcoming && (
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleReschedule(appointment.Id)}
                        >
                          Reschedule
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleCancel(appointment.Id)}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
        </div>
      )}

      {/* Quick Stats */}
      <div className="mt-12 grid md:grid-cols-4 gap-6">
        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="Calendar" className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Total Appointments
          </h3>
          <p className="text-2xl font-bold text-primary-600">
            {appointments.length}
          </p>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="CheckCircle" className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Completed
          </h3>
          <p className="text-2xl font-bold text-green-600">
            {appointments.filter(apt => apt.status === "Completed").length}
          </p>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="Clock" className="w-6 h-6 text-amber-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Upcoming
          </h3>
          <p className="text-2xl font-bold text-amber-600">
            {appointments.filter(apt => 
              new Date(apt.scheduledDate) > new Date() && apt.status === "Scheduled"
            ).length}
          </p>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="XCircle" className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Cancelled
          </h3>
          <p className="text-2xl font-bold text-red-600">
            {appointments.filter(apt => apt.status === "Cancelled").length}
          </p>
        </Card>
      </div>
    </div>
  );
};

export default AppointmentsPage;