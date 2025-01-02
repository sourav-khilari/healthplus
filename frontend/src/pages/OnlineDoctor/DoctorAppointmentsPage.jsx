import  { useEffect, useState } from 'react';
import axios from 'axios';

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
                alert('Failed to fetch appointments');
            }
        };

        fetchAppointments();
    }, []);

    return (
        <div>
            <h2>Your Appointments</h2>
            <ul>
                {appointments.map((appointment) => (
                    <li key={appointment._id}>
                        <h3>{appointment.patientName}</h3>
                        <p>{appointment.timeSlot.start} - {appointment.timeSlot.end}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DoctorAppointmentsPage;
