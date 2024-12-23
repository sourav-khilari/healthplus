import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/UserDashboard.css";

const UserDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [error, setError] = useState("");

  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState({ start: "", end: "" });
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [appointmentError, setAppointmentError] = useState("");

  // Fetch doctors on mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("/api/v1/doctors");
        setDoctors(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load doctors.");
      } finally {
        setLoadingDoctors(false);
      }
    };
    fetchDoctors();
  }, []);

  // Book appointment
  const bookAppointment = async () => {
    if (!selectedDoctor || !date || !timeSlot.start || !timeSlot.end) {
      setAppointmentError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("/api/v1/appointments", {
        doctorId: selectedDoctor,
        date,
        timeSlot,
      });
      alert("Appointment booked successfully!");
      setAppointments((prev) => [...prev, response.data.appointment]);
    } catch (err) {
      console.error(err);
      setAppointmentError("Failed to book appointment.");
    } finally {
      setLoading(false);
    }
  };

  // Cancel appointment
  const cancelAppointment = async (appointmentId) => {
    try {
      setLoading(true);
      await axios.delete(`/api/v1/appointments/${appointmentId}`);
      alert("Appointment canceled successfully!");
      setAppointments((prev) =>
        prev.filter((appointment) => appointment._id !== appointmentId)
      );
    } catch (err) {
      console.error(err);
      setAppointmentError("Failed to cancel appointment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-dashboard">
      <h1>User Dashboard</h1>
      <section className="check-availability">
        <h2>Check Doctor Availability</h2>
        {loadingDoctors ? (
          <p>Loading doctors...</p>
        ) : Array.isArray(doctors) && doctors.length > 0 ? (
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
          >
            <option value="">Select a Doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor._id} value={doctor._id}>
                {doctor.name}
              </option>
            ))}
          </select>
        ) : (
          <p>No doctors available</p>
        )}
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          type="time"
          placeholder="Start Time"
          onChange={(e) =>
            setTimeSlot({ ...timeSlot, start: `${date}T${e.target.value}:00Z` })
          }
        />
        <input
          type="time"
          placeholder="End Time"
          onChange={(e) =>
            setTimeSlot({ ...timeSlot, end: `${date}T${e.target.value}:00Z` })
          }
        />
        <button onClick={bookAppointment} disabled={loading}>
          {loading ? "Booking..." : "Book Appointment"}
        </button>
        {appointmentError && <p className="error">{appointmentError}</p>}
      </section>

      <section className="appointments">
        <h2>Your Appointments</h2>
        {appointments.length === 0 ? (
          <p>No appointments booked yet.</p>
        ) : (
          <ul>
            {appointments.map((appointment) => (
              <li key={appointment._id}>
                <p>
                  Doctor: {appointment.doctorId} <br />
                  Date: {appointment.date} <br />
                  Time: {appointment.timeSlot.start} -{" "}
                  {appointment.timeSlot.end}
                </p>
                <button
                  onClick={() => cancelAppointment(appointment._id)}
                  disabled={loading}
                >
                  Cancel Appointment
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default UserDashboard;
