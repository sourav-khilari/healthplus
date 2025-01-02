import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import axios from "axios"; // Import axios
import "../styles/Common.css"; // Import common CSS (you can still use this if you want extra custom styles)

const DoctorDashboard = () => {
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate(); // Use React Router for navigation

  // Axios Instance
  const axiosInstance = axios.create({
    baseURL: "http://localhost:5000", // Adjust the base URL for your backend
    withCredentials: true, // For handling cookies if needed
  });

  // Fetch doctor data and today's appointments
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch doctor's profile data and today's appointments
      const [doctorRes, appointmentsRes] = await Promise.all([
        axiosInstance.get("/api/v1/doctor/dashboard"), // Replace with correct route
        axiosInstance.post("/api/v1/doctor/getDoctorAppointments", {
          doctorId: "doctorId",
        }), // Replace with dynamic doctorId
      ]);

      setDoctor(doctorRes.data.data.doctor || {});
      setAppointments(appointmentsRes.data.data.appointments || []);
    } catch (err) {
      setError("Failed to load data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Navigate to different pages for more actions (e.g., manage patients)
  const navigateToPage = (page) => {
    navigate(`/doctor/${page}`); // Use navigate for navigation
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  return (
    <div className="doctor-dashboard container mx-auto p-5">
      <h1 className="text-3xl font-semibold text-center mb-6">
        Welcome, Dr. {doctor.name}
      </h1>

      {/* Doctor's Info Section */}
      <section className="doctor-info bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Doctor Info
        </h2>
        <p className="text-gray-600">Email: {doctor.email}</p>
        <p className="text-gray-600">Specialty: {doctor.speciality}</p>
      </section>

      {/* Today's Appointments Section */}
      <section className="appointments bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Today's Appointments
        </h2>
        {appointments.length === 0 ? (
          <p>No appointments for today.</p>
        ) : (
          <ul className="space-y-4">
            {appointments.map((appointment) => (
              <li key={appointment._id} className="space-y-2">
                <p className="text-gray-600">
                  Patient: {appointment.patientId.name} <br />
                  Time: {new Date(
                    appointment.timeSlot.start
                  ).toLocaleString()}{" "}
                  - {new Date(appointment.timeSlot.end).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Dashboard Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <button
          className="bg-blue-500 text-white p-5 rounded-lg shadow-lg hover:bg-blue-600 transition-all duration-300"
          onClick={() => navigateToPage("patients")}
        >
          <h3 className="text-xl font-medium">Manage Patients</h3>
        </button>

        {/* Navigate to Community */}
        <button
          className="bg-purple-500 text-white p-5 rounded-lg shadow-lg hover:bg-purple-600 transition-all duration-300"
          onClick={() => navigate("/Community")}
        >
          <h3 className="text-xl font-medium">Community</h3>
        </button>

        {/* Navigate to Fetch Patient Data */}
        <button
          className="bg-yellow-500 text-white p-5 rounded-lg shadow-lg hover:bg-yellow-600 transition-all duration-300"
          onClick={() => navigateToPage("fetchPatientData")}
        >
          <h3 className="text-xl font-medium">Fetch Patient Data</h3>
        </button>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 text-center">{error}</p>}
    </div>
  );
};

export default DoctorDashboard;
