import { useState, useEffect } from "react";
// import "./MyAppointment.css";

const MyAppointment = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    // Simulate fetching appointments data from an API
    const fetchAppointments = async () => {
      // Replace with your API call
      const appointmentData = [
        {
          id: 1,
          doctor: "Dr. Smith",
          date: "2024-12-20",
          time: "10:00 AM",
          status: "Confirmed",
        },
        {
          id: 2,
          doctor: "Dr. Brown",
          date: "2024-12-22",
          time: "2:00 PM",
          status: "Pending",
        },
      ];
      setAppointments(appointmentData);
    };

    fetchAppointments();
  }, []);

  return (
    <div className="my-appointment-container">
      <h1>My Appointments</h1>
      <div className="appointment-list">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="appointment-item">
            <p>
              <strong>Doctor:</strong> {appointment.doctor}
            </p>
            <p>
              <strong>Date:</strong> {appointment.date}
            </p>
            <p>
              <strong>Time:</strong> {appointment.time}
            </p>
            <p>
              <strong>Status:</strong> {appointment.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointment;
