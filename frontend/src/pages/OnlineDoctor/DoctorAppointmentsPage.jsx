import { useEffect, useState } from "react";
import axios from "axios";

const DoctorAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          "/api/v1/online doctor/onlinegetDoctorAppointments"
        );
        setAppointments(response.data.appointments);
      } catch (error) {
        alert("Failed to fetch appointments");
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Your Appointments
        </h2>
        <ul className="space-y-4">
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <li
                key={appointment._id}
                className="p-4 border border-gray-300 rounded-md shadow-sm hover:shadow-lg"
              >
                <h3 className="text-xl font-medium text-gray-800">
                  {appointment.patientName}
                </h3>
                <p className="text-gray-600">
                  {appointment.timeSlot.start} - {appointment.timeSlot.end}
                </p>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-500">No appointments found</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DoctorAppointmentsPage;
