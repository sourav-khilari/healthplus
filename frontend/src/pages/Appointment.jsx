// page for doc where doc's appointment will be booked
import  { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// Mock data for doctors (you can replace this with an API call)
const mockDoctors = [
  {
    id: 1,
    name: "Dr. John Doe",
    specialty: "Cardiologist",
    availableTimes: ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"],
    photo: "https://via.placeholder.com/150",
  },
  {
    id: 2,
    name: "Dr. Jane Smith",
    specialty: "Pediatrician",
    availableTimes: ["10:00 AM", "12:00 PM", "3:00 PM", "5:00 PM"],
    photo: "https://via.placeholder.com/150",
  },
  {
    id: 3,
    name: "Dr. Emily Clark",
    specialty: "Neurologist",
    availableTimes: ["8:00 AM", "10:00 AM", "1:00 PM", "3:00 PM"],
    photo: "https://via.placeholder.com/150",
  },
];

const Appointment = () => {
  const { doctorId } = useParams(); // Get the doctor ID from URL params
  const [doctor, setDoctor] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const selectedDoctor = mockDoctors.find(
      (doc) => doc.id === parseInt(doctorId)
    );
    setDoctor(selectedDoctor);
  }, [doctorId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here, you would send the data to an API or backend to book the appointment
    setMessage("Appointment booked successfully!");
  };

  if (!doctor) {
    return <p>Loading doctor details...</p>;
  }

  return (
    <div className="appointment-container">
      <h1>Book an Appointment with {doctor.name}</h1>
      <div className="doctor-info">
        <img src={doctor.photo} alt={doctor.name} className="doctor-photo" />
        <div className="doctor-details">
          <p>
            <strong>Specialty:</strong> {doctor.specialty}
          </p>
          <p>
            <strong>Available Times:</strong>
          </p>
          <ul>
            {doctor.availableTimes.map((time, index) => (
              <li key={index}>{time}</li>
            ))}
          </ul>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="appointment-form">
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="time">Select Appointment Time</label>
          <select
            id="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            required
          >
            <option value="">--Select a time--</option>
            {doctor.availableTimes.map((time, index) => (
              <option key={index} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="book-btn">
          Book Appointment
        </button>

        {message && <p className="success-message">{message}</p>}
      </form>
    </div>
  );
};

export default Appointment;
