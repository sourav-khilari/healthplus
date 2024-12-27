import "../styles/Contact.css";

const Contact = () => {
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
        <form className="contact-form">
          <div className="form-group">
            <input type="text" placeholder="Full Name" required />
          </div>
          <div className="form-group">
            <input type="email" placeholder="Email Address" required />
          </div>
          <div className="form-group">
            <textarea placeholder="Your Message" required></textarea>
          </div>
          <button type="submit" className="submit-btn">
            Send Message
          </button>
        </form>
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
