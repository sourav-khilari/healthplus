import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import for navigation
import axiosInstance from "../axios/axios_interceptor.js";

import "../styles/HospitalDashboard.css";

const HospitalDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [hospitalId, setHospitalId] = useState("YOUR_HOSPITAL_ID"); // Replace with actual ID
  const [newDoctor, setNewDoctor] = useState({
    name: "",
    department: "",
    speciality: "",
    email: "",
    phone: "",
    availability: [],
    slotDuration: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate(); // Navigation hook

  // Fetch doctors and appointments on mount
  useEffect(() => {
    fetchDoctors();
    fetchAppointments();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoadingDoctors(true);
      const response = await axiosInstance.get(
        `/hospital/getDoctorAppointments`
      );
      setDoctors(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load doctors.");
    } finally {
      setLoadingDoctors(false);
    }
  };

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleAvailabilityChange = (index, field, value) => {
    const updatedAvailability = [...newDoctor.availability];
    updatedAvailability[index][field] = value;
    setNewDoctor({ ...newDoctor, availability: updatedAvailability });
  };

  const handleAddAvailability = () => {
    setNewDoctor({
      ...newDoctor,
      availability: [
        ...newDoctor.availability,
        { day: "", startTime: "", endTime: "" },
      ],
    });
  };

  const handleRemoveAvailability = (index) => {
    const updatedAvailability = newDoctor.availability.filter(
      (_, i) => i !== index
    );
    setNewDoctor({ ...newDoctor, availability: updatedAvailability });
  };
  const fetchAppointments = async () => {
    try {
      setLoadingAppointments(true);
      const response = await axiosInstance.get(
        `hospital/getHospitalAllAppointments:{user._id}`
      );
      setAppointments(response.data.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load appointments.");
    } finally {
      setLoadingAppointments(false);
    }
  };

  const addDoctor = async () => {
    try {
      const response = await axiosInstance.post("/hospital/addDoctor", {
        ...newDoctor,
        hospitalId,
      });
      setSuccess("Doctor added successfully!");
      setDoctors((prev) => [...prev, response.data.doctor]);
      setNewDoctor({
        name: "",
        department: "",
        speciality: "",
        email: "",
        phone: "",
        availability: [],
        slotDuration: "",
      });
    } catch (err) {
      console.error(err);
      setError("Failed to add doctor.");
    }
  };

  return (
    <div className="hospital-dashboard">
      <h1>Hospital Dashboard</h1>

      {/* Navigation Button */}
      <button
        className="btn btn-primary mb-4"
        onClick={() => navigate("/Bloodbank/hospitaldashboard")}
      >
        Go to Blood Bank Dashboard
      </button>

      {/* Add Doctor Section */}
      <section className="add-doctor">
        <h2>Add Doctor</h2>
        <input
          type="text"
          placeholder="Name"
          value={newDoctor.name}
          onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Department"
          value={newDoctor.department}
          onChange={(e) =>
            setNewDoctor({ ...newDoctor, department: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Speciality"
          value={newDoctor.speciality}
          onChange={(e) =>
            setNewDoctor({ ...newDoctor, speciality: e.target.value })
          }
        />
        <input
          type="email"
          placeholder="Email"
          value={newDoctor.email}
          onChange={(e) =>
            setNewDoctor({ ...newDoctor, email: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Phone"
          value={newDoctor.phone}
          onChange={(e) =>
            setNewDoctor({ ...newDoctor, phone: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Slot Duration (minutes)"
          value={newDoctor.slotDuration}
          onChange={(e) =>
            setNewDoctor({ ...newDoctor, slotDuration: e.target.value })
          }
        />
        {/* Availability Input */}
        <h3>Availability</h3>
        {newDoctor.availability.map((slot, index) => (
          <div key={index} className="availability-slot">
            <select
              value={slot.day}
              onChange={(e) =>
                handleAvailabilityChange(index, "day", e.target.value)
              }
            >
              <option value="">Select Day</option>
              {daysOfWeek.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
            <input
              type="time"
              placeholder="Start Time"
              value={slot.startTime}
              onChange={(e) =>
                handleAvailabilityChange(index, "startTime", e.target.value)
              }
            />
            <input
              type="time"
              placeholder="End Time"
              value={slot.endTime}
              onChange={(e) =>
                handleAvailabilityChange(index, "endTime", e.target.value)
              }
            />
            <button
              type="button"
              onClick={() => handleRemoveAvailability(index)}
            >
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAddAvailability}>
          Add Availability
        </button>

        <button onClick={addDoctor}>Add Doctor</button>
        {success && <p className="success">{success}</p>}
        {error && <p className="error">{error}</p>}
      </section>

      {/* Doctors Section */}
      <section className="doctors">
        <h2>Doctors</h2>
        {loadingDoctors ? (
          <p>Loading doctors...</p>
        ) : Array.isArray(doctors) && doctors.length > 0 ? (
          <ul>
            {doctors.map((doctor) => (
              <li key={doctor._id}>
                {doctor.name} - {doctor.department} ({doctor.speciality})
              </li>
            ))}
          </ul>
        ) : (
          <p>No doctors available</p>
        )}
      </section>

      {/* Appointments Section */}
      <section className="appointments">
        <h2>Appointments</h2>
        {loadingAppointments ? (
          <p>Loading appointments...</p>
        ) : Array.isArray(appointments) && appointments.length > 0 ? (
          <ul>
            {appointments.map((appointment) => (
              <li key={appointment._id}>
                Patient: {appointment.patientId.name} (
                {appointment.patientId.email})
                <br />
                Doctor: {appointment.doctorId.name} -{" "}
                {appointment.doctorId.speciality}
                <br />
                Date: {appointment.date}
                <br />
                Time: {appointment.timeSlot.start} - {appointment.timeSlot.end}
              </li>
            ))}
          </ul>
        ) : (
          <p>No appointments available</p>
        )}
      </section>
    </div>
  );
};

export default HospitalDashboard;
