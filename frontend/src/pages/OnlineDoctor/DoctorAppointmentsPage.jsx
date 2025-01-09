import { useEffect, useState } from "react";
import axiosInstance from "../../axios/axios_interceptor.js";
import "../../styles/DoctorAppointmentsPage.css"; // Import custom styles

const DoctorAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axiosInstance.get(
          "/online doctor/onlinegetDoctorAppointments"
        );
        setAppointments(response.data.appointments);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
        alert("Failed to fetch appointments");
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="appointments-page-container">
      <div className="appointments-page-content">
        <h2 className="appointments-page-title">Your Appointments</h2>
        <ul className="appointments-list">
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <li key={appointment._id} className="appointment-card">
                <h3 className="appointment-card-title">
                  {appointment.patientName}
                </h3>
                <p className="appointment-card-timeslot">
                  {appointment.timeSlot.start} - {appointment.timeSlot.end}
                </p>
              </li>
            ))
          ) : (
            <p className="appointments-empty-message">No appointments found</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DoctorAppointmentsPage;
