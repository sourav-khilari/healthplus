
import "../styles/Contact.css";

const Contact = () => {
  return (
    <div className="contact-page">
      <h1>Contact Us</h1>
      <form className="contact-form">
        <input type="text" placeholder="Name" required />
        <input type="email" placeholder="Email" required />
        <textarea placeholder="Your Message" required></textarea>
        <button type="submit">Send Message</button>
      </form>
      <p>
        You can also reach us at <strong>contact@healthplus.com</strong> or call
        us at <strong>(123) 456-7890</strong>.
      </p>
    </div>
  );
};

export default Contact;
