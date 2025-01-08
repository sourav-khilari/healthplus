import { useState } from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import "./styles.css";

const DoctorConsultencyPage = () => {
  return (
    <div className="container">
      <div className="hero">
        <h1>Welcome to Doctor Consultancy</h1>
        <p>
          Book a doctor in just a few clicks and start your consultation today!
        </p>
        <Link to="/book-doctor">
          <button className="cta-btn">Book a Doctor</button>
        </Link>
      </div>
      <div className="card-container">
        <div className="card">
          <h3>Book an Appointment</h3>
          <p>Choose a doctor and schedule an appointment online</p>
          <Link to="/online-doctor/book-doctor">
            <button className="cta-btn">Book Now</button>
          </Link>
        </div>
        <div className="card">
          <h3>Start Consultation</h3>
          <p>Already booked? Start your appointment now</p>
          <Link to="/online-doctor/start-appointment">
            <button className="cta-btn">Start Now</button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default DoctorConsultencyPage;
