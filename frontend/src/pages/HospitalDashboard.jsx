import { useState, useEffect } from "react";
import axios from "axios";
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

  // Fetch doctors and appointments on mount
  useEffect(() => {
    fetchDoctors();
    fetchAppointments();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoadingDoctors(true);
      const response = await axios.get(
        `/api/v1/doctors?hospitalId=${hospitalId}`
      );
      setDoctors(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load doctors.");
    } finally {
      setLoadingDoctors(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      setLoadingAppointments(true);
      const response = await axios.get(
        `/api/hospitals/${hospitalId}/appointments`
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
      const response = await axios.post("/api/v1/doctors", {
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
