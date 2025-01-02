import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OnlineDoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const navigateToPage = (page) => {
    navigate(`/${page}`);
  };

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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Welcome to your Online Doctor Dashboard
        </h1>

        {/* Online Appointment Queue */}
        <section className="appointment-queue mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Online Appointment Queue
          </h2>
          {appointments.length > 0 ? (
            <ul className="space-y-4">
              {appointments.map((appointment) => (
                <li
                  key={appointment.id}
                  className="border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <h3 className="text-xl font-medium text-gray-800">
                    {appointment.patientName}
                  </h3>
                  <p className="text-gray-600">{appointment.timeSlot}</p>
                  <button
                    onClick={() => startConsultation(appointment.id)}
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all duration-300"
                  >
                    Start Consultation
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No upcoming online appointments.</p>
          )}
        </section>

        {/* Notifications */}
        <section className="notifications mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Notifications
          </h2>
          {notifications.length > 0 ? (
            <ul className="space-y-4">
              {notifications.map((notification, index) => (
                <li
                  key={index}
                  className="border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <p className="text-gray-600">{notification.message}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No new notifications.</p>
          )}
        </section>

        <button
          onClick={() => navigateToPage("lobby")}
          className="bg-green-500 text-white p-5 rounded-lg shadow-lg hover:bg-green-600 transition-all duration-300"
        >
          <h3 className="text-xl font-medium">Go to Lobby</h3>
        </button>
      </div>
    </div>
  );

  function startConsultation(appointmentId) {
    // Logic to start a consultation (video/audio/chat)
    window.location.href = `/online-doctor/consultation/${appointmentId}`;
  }
};

export default OnlineDoctorDashboard;
