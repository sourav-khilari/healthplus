import { useState, useEffect } from "react";
import axiosInstance from "../axios/axios_interceptor.js";
import "../styles/UserDashboard.css";
import { useNavigate } from "react-router-dom"; // For redirection

const UserDashboard = () => {
  const navigate = useNavigate(); // For navigation to room
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [error, setError] = useState("");

  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState({ start: "", end: "" });
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [appointmentError, setAppointmentError] = useState("");
  const [roomNo, setRoomNo] = useState(""); // New state for room number

  // Fetch doctors on mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axiosInstance.get("/getAllDoctors");
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
      const response = await axiosInstance.post("/appointments", {
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
      await axiosInstance.delete(`/appointments/${appointmentId}`);
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

  // Redirect to room
  const handleJoinRoom = () => {
    if (roomNo) {
      navigate(`/room/${roomNo}`);
    } else {
      alert("Please enter a valid room number.");
    }
  };

  return (
    <div className="user-dashboard">
      <h1 className="text-center font-bold text-3xl mb-6">User Dashboard</h1>

      <div className="section-box shadow-md p-4 rounded-md mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Check Doctor Availability
        </h2>
        {loadingDoctors ? (
          <p>Loading doctors...</p>
        ) : Array.isArray(doctors) && doctors.length > 0 ? (
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="p-2 border rounded-md w-full mb-4"
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
          className="p-2 border rounded-md w-full mb-4"
        />
        <input
          type="time"
          placeholder="Start Time"
          onChange={(e) =>
            setTimeSlot({ ...timeSlot, start: `${date}T${e.target.value}:00Z` })
          }
          className="p-2 border rounded-md w-full mb-4"
        />
        <input
          type="time"
          placeholder="End Time"
          onChange={(e) =>
            setTimeSlot({ ...timeSlot, end: `${date}T${e.target.value}:00Z` })
          }
          className="p-2 border rounded-md w-full mb-4"
        />
        <button
          onClick={bookAppointment}
          disabled={loading}
          className=" userbtn w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
        >
          {loading ? "Booking..." : "Book Appointment"}
        </button>
        {appointmentError && (
          <p className="error mt-2 text-red-500">{appointmentError}</p>
        )}
      </div>

      <div className="section-box shadow-md p-4 rounded-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Your Appointments</h2>
        {appointments.length === 0 ? (
          <p>No appointments booked yet.</p>
        ) : (
          <ul>
            {appointments.map((appointment) => (
              <li key={appointment._id} className="border-b py-2">
                <p>
                  <strong>Doctor:</strong> {appointment.doctorId} <br />
                  <strong>Date:</strong> {appointment.date} <br />
                  <strong>Time:</strong> {appointment.timeSlot.start} -{" "}
                  {appointment.timeSlot.end}
                </p>
                <button
                  onClick={() => cancelAppointment(appointment._id)}
                  disabled={loading}
                  className="userbtn mt-2 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                >
                  Cancel Appointment
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="section-box shadow-md p-4 rounded-md">
        <h2 className="text-xl font-semibold mb-4">
          Join a Room for Consultation
        </h2>
        <input
          type="text"
          value={roomNo}
          onChange={(e) => setRoomNo(e.target.value)}
          placeholder="Enter Room Number"
          className="p-2 border rounded-md w-full mb-4"
        />
        <button
          onClick={handleJoinRoom}
          className=" userbtn w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600"
        >
          Join Room
        </button>
      </div>

      {error && <p className="error text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default UserDashboard;
