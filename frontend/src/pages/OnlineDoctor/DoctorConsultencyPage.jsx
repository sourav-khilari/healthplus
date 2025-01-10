import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../axios/axios_interceptor.js";
import "../../styles/DoctorConsultencyPage.css"; // Import custom styles

const DoctorConsultencyPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Fetch all online doctors
  const fetchDoctors = async () => {
    try {
      const response = await axiosInstance.get("/users/getAllOnlineDoctors");
      setDoctors(response.data.data); // Assuming data contains the list of doctors
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  return (
    <div className="consultancy-page-container">
      <div className="consultancy-hero-section">
        <h1 className="consultancy-hero-title">
          Welcome to Doctor Consultancy
        </h1>
        <p className="consultancy-hero-description">
          Book a doctor in just a few clicks and start your consultation today!
        </p>
        <Link to="/online-doctor/book-doctor">
          <button className="consultancy-cta-btn">Book a Doctor</button>
        </Link>
      </div>

      {/* List of Doctors */}
      <div className="doctor-list-container">
        <h2>Available Online Doctors</h2>
        {loading ? (
          <p>Loading doctors...</p>
        ) : (
          <div className="doctor-card-container">
            {doctors.map((doctor) => (
              <div
                key={doctor._id}
                className="doctor-card"
                onClick={() => setSelectedDoctor(doctor)}
              >
                <h3 className="doctor-card-title">{doctor.name}</h3>
                <p className="doctor-card-speciality">{doctor.speciality}</p>
                <p className="doctor-card-hospital">
                  {doctor.hospitalId ? doctor.hospitalId.name : "Not Available"}
                </p>
                <Link to={`/online-doctor/book-doctor/${doctor._id}`}>
                  <button className="doctor-card-btn">Book Appointment</button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorConsultencyPage;
