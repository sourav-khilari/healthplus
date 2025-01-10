import { useState, useEffect } from "react";

import axiosInstance from "../../axios/axios_interceptor.js";
const BookDoctor = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [formData, setFormData] = useState({
    patientName: "",
    patientEmail: "",
    doctorId: "",
    date: "",
    timeSlot: "",
  });

  // Fetch all appointments
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        "/users/onlinegetUserAppointments"
      );
      setAppointments(response.data.appointments);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
      setLoading(false);
    }
  };

  // Fetch all doctors
  const fetchDoctors = async () => {
    try {
      const response = await axiosInstance.get(
        "/users/onlinegetAvailableDoctors"
      );
      setDoctors(response.data.doctors);
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
    }
  };

  // Fetch available slots for a doctor on a specific date
  const fetchAvailableSlots = async (doctorId, date) => {
    try {
      const response = await axiosInstance.get(
        `/users/onlinegetAvailableSlots/${doctorId}/${date}`
      );
      setAvailableSlots(response.data.slots);
    } catch (error) {
      console.error("Failed to fetch available slots:", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "doctorId" || name === "date") {
      const doctorId = name === "doctorId" ? value : formData.doctorId;
      const date = name === "date" ? value : formData.date;

      if (doctorId && date) {
        fetchAvailableSlots(doctorId, date);
      }
    }
  };

  // Book appointment
  const bookAppointment = async () => {
    try {
      const response = await axiosInstance.post(
        "/users/onlinebookAppointment",
        formData
      );
      alert("Appointment booked successfully!");
      setAppointments([...appointments, response.data.appointment]);
    } catch (error) {
      console.error("Failed to book appointment:", error);
      alert("Error booking appointment.");
    }
  };

  // Cancel appointment
  const cancelAppointment = async (appointmentId) => {
    try {
      await axiosInstance.delete(
        `/users/onlinedeleteAppointment/${appointmentId}`
      );
      setAppointments(appointments.filter((a) => a._id !== appointmentId));
      alert("Appointment canceled successfully!");
    } catch (error) {
      console.error("Failed to cancel appointment:", error);
      alert("Error canceling appointment.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Manage Appointments</h2>

      <h3>Book Appointment</h3>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Patient Name"
          name="patientName"
          value={formData.patientName}
          onChange={handleChange}
          style={{ display: "block", marginBottom: "10px", width: "100%" }}
        />
        <input
          type="email"
          placeholder="Patient Email"
          name="patientEmail"
          value={formData.patientEmail}
          onChange={handleChange}
          style={{ display: "block", marginBottom: "10px", width: "100%" }}
        />
        <select
          name="doctorId"
          value={formData.doctorId}
          onChange={handleChange}
          style={{ display: "block", marginBottom: "10px", width: "100%" }}
        >
          <option value="">Select Doctor</option>
          {doctors.map((doctor) => (
            <option key={doctor._id} value={doctor._id}>
              {doctor.name} - {doctor.speciality}
            </option>
          ))}
        </select>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          style={{ display: "block", marginBottom: "10px", width: "100%" }}
        />
        <select
          name="timeSlot"
          value={formData.timeSlot}
          onChange={handleChange}
          style={{ display: "block", marginBottom: "10px", width: "100%" }}
        >
          <option value="">Select Time Slot</option>
          {availableSlots.map((slot, index) => (
            <option key={index} value={slot}>
              {slot}
            </option>
          ))}
        </select>
        <button onClick={bookAppointment} style={{ padding: "10px 20px" }}>
          Book Appointment
        </button>
      </div>

      <h3>Your Appointments</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        appointments.map((appointment) => (
          <div
            key={appointment._id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <p>
              <strong>Doctor:</strong> {appointment.doctorId.name} (
              {appointment.doctorId.speciality})
            </p>
            <p>
              <strong>Date:</strong> {appointment.date}
            </p>
            <p>
              <strong>Time Slot:</strong> {appointment.timeSlot}
            </p>
            <button
              onClick={() => cancelAppointment(appointment._id)}
              style={{
                padding: "5px 10px",
                backgroundColor: "red",
                color: "#fff",
              }}
            >
              Cancel Appointment
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default BookDoctor;
