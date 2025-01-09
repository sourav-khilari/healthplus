import "../styles/Contact.css";
import { useState } from "react";
import axiosInstance from "../axios/axios_interceptor.js";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submissionStatus, setSubmissionStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response =axiosInstance.post("/users/contactUs", formData);
      if (response.ok) {
        setSubmissionStatus("Message sent successfully!");
        setFormData({ fullName: "", email: "", message: "" }); // Reset form
      } else {
        setSubmissionStatus("Failed to send the message. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setSubmissionStatus("An error occurred. Please try again.");
    }
  };

  return (
    <div className="contact-container">
      <section className="hero-section">
        <h1>Contact Us</h1>
        <p>
          We are here to help! Whether you have a question or need support, feel
          free to reach out to us.
        </p>
      </section>

      <section className="form-section">
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <button type="submit" className="submit-btn">
            Send Message
          </button>
        </form>
        {submissionStatus && <p className="status-message">{submissionStatus}</p>}
      </section>

      <section className="additional-contact-info">
        <p>
          You can also reach us at{" "}
          <a href="mailto:contact@healthplus.com" className="contact-link">
            contact@healthplus.com
          </a>{" "}
          or call us at{" "}
          <a href="tel:+123456789" className="contact-link">
            (123) 456-7890
          </a>
          .
        </p>
      </section>
    </div>
  );
};

export default Contact;
