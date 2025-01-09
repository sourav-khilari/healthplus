import { Link } from "react-router-dom";
import "../../styles/DoctorConsultencyPage.css"; // Import custom styles

const DoctorConsultencyPage = () => {
  return (
    <div className="consultancy-page-container">
      <div className="consultancy-hero-section">
        <h1 className="consultancy-hero-title">
          Welcome to Doctor Consultancy
        </h1>
        <p className="consultancy-hero-description">
          Book a doctor in just a few clicks and start your consultation today!
        </p>
        <Link to="/book-doctor">
          <button className="consultancy-cta-btn">Book a Doctor</button>
        </Link>
      </div>
      <div className="consultancy-card-container">
        <div className="consultancy-card">
          <h3 className="consultancy-card-title">Book an Appointment</h3>
          <p className="consultancy-card-description">
            Choose a doctor and schedule an appointment online
          </p>
          <Link to="/online-doctor/book-doctor">
            <button className="consultancy-card-btn">Book Now</button>
          </Link>
        </div>
        <div className="consultancy-card">
          <h3 className="consultancy-card-title">Start Consultation</h3>
          <p className="consultancy-card-description">
            Already booked? Start your appointment now
          </p>
          <Link to="/online-doctor/start-appointment">
            <button className="consultancy-card-btn">Start Now</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorConsultencyPage;
