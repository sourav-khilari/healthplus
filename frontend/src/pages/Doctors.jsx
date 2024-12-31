import { useState, useEffect } from "react";

// Mock data for doctors (you can replace this with an API call)
const mockDoctors = [
  {
    id: 1,
    name: "Dr. John Doe",
    specialty: "Cardiologist",
    availableTimes: "Mon-Fri, 9:00 AM - 5:00 PM",
    photo: "https://via.placeholder.com/150",
  },
  {
    id: 2,
    name: "Dr. Jane Smith",
    specialty: "Pediatrician",
    availableTimes: "Mon-Fri, 10:00 AM - 6:00 PM",
    photo: "https://via.placeholder.com/150",
  },
  {
    id: 3,
    name: "Dr. Emily Clark",
    specialty: "Neurologist",
    availableTimes: "Mon-Wed, 8:00 AM - 4:00 PM",
    photo: "https://via.placeholder.com/150",
  },
];

const Doctor = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    // Here, you can replace the mockDoctors with an actual API call
    setDoctors(mockDoctors);
  }, []);

  return (
    <div className="doctor-container">
      <h1>Available Doctors</h1>
      <div className="doctor-list">
        {doctors.length === 0 ? (
          <p>Loading doctors...</p>
        ) : (
          doctors.map((doctor) => (
            <div key={doctor.id} className="doctor-card">
              <img
                src={doctor.photo}
                alt={doctor.name}
                className="doctor-photo"
              />
              <div className="doctor-info">
                <h2>{doctor.name}</h2>
                <p>
                  <strong>Specialty:</strong> {doctor.specialty}
                </p>
                <p>
                  <strong>Availability:</strong> {doctor.availableTimes}
                </p>
                <button className="book-btn">Book Appointment</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Doctor;
