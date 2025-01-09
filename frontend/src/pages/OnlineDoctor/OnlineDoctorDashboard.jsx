import { useState, useEffect } from "react";
import axiosInstance from "../../axios/axios_interceptor.js";
import { useNavigate } from "react-router-dom";
import "../../styles/OnlineDoctorDashboard.css"; // Import custom styles

const OnlineDoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const navigateToPage = (page) => {
    navigate(`/${page}`);
  };

  useEffect(() => {
    // Fetch upcoming online appointments and notifications
    axiosInstance
      .get("/online doctor/appointments")
      .then((response) => {
        setAppointments(response.data.appointments);
      })
      .catch((error) => console.log(error));

    axiosInstance
      .get("/online doctor/notifications")
      .then((response) => {
        setNotifications(response.data.notifications);
      })
      .catch((error) => console.log(error));
  }, []);

  const startConsultation = (appointmentId) => {
    window.location.href = `/online-doctor/consultation/${appointmentId}`;
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <h1 className="dashboard-title">
          Welcome to your Online Doctor Dashboard
        </h1>

        {/* Online Appointment Queue */}
        <section className="dashboard-section">
          <h2 className="section-title">Online Appointment Queue</h2>
          {appointments.length > 0 ? (
            <ul className="appointment-list">
              {appointments.map((appointment) => (
                <li key={appointment.id} className="appointment-item">
                  <h3 className="appointment-patient">
                    {appointment.patientName}
                  </h3>
                  <p className="appointment-time">{appointment.timeSlot}</p>
                  <button
                    onClick={() => startConsultation(appointment.id)}
                    className="btn-primary"
                  >
                    Start Consultation
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-data">No upcoming online appointments.</p>
          )}
        </section>

        {/* Notifications */}
        <section className="dashboard-section">
          <h2 className="section-title">Notifications</h2>
          {notifications.length > 0 ? (
            <ul className="notification-list">
              {notifications.map((notification, index) => (
                <li key={index} className="notification-item">
                  <p className="notification-text">{notification.message}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-data">No new notifications.</p>
          )}
        </section>

        <button
          onClick={() => navigateToPage("lobby")}
          className="btn-secondary"
        >
          Go to Lobby
        </button>
      </div>
    </div>
  );
};

export default OnlineDoctorDashboard;
