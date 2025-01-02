import React, { useState, useEffect } from "react";
import axios from "axios";

const OnlineDoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch upcoming online appointments and notifications
    axios
      .get("/api/online-doctor/appointments")
      .then((response) => {
        setAppointments(response.data.appointments);
      })
      .catch((error) => console.log(error));

    axios
      .get("/api/online-doctor/notifications")
      .then((response) => {
        setNotifications(response.data.notifications);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div className="online-doctor-dashboard">
      <h1>Welcome to your Online Doctor Dashboard</h1>

      {/* Online Appointment Queue */}
      <section className="appointment-queue">
        <h2>Online Appointment Queue</h2>
        {appointments.length > 0 ? (
          <ul>
            {appointments.map((appointment) => (
              <li key={appointment.id}>
                <h3>{appointment.patientName}</h3>
                <p>{appointment.timeSlot}</p>
                <button onClick={() => startConsultation(appointment.id)}>
                  Start Consultation
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No upcoming online appointments.</p>
        )}
      </section>

      {/* Notifications */}
      <section className="notifications">
        <h2>Notifications</h2>
        {notifications.length > 0 ? (
          <ul>
            {notifications.map((notification, index) => (
              <li key={index}>
                <p>{notification.message}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No new notifications.</p>
        )}
      </section>
    </div>
  );

  function startConsultation(appointmentId) {
    // Logic to start a consultation (video/audio/chat)
    window.location.href = `/online-doctor/consultation/${appointmentId}`;
  }
};

export default OnlineDoctorDashboard;
