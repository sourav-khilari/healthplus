import "../styles/AboutUs.css";

const AboutUs = () => {
  return (
    <div className="about-us-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-text">
          <div className="hero-image">
            <img src="../assets/images/aboutus.jpg" alt="HealthPlus Team" />
          </div>
          <h1>About Us</h1>
          <p className="intro-text ">
            At HealthPlus, we are committed to providing personalized, holistic
            healthcare services, blending the best of modern medicine and
            traditional healing practices.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <h2>Our Mission</h2>
        <p>
          Our mission is to deliver high-quality healthcare that combines the
          power of modern science with the wisdom of traditional Ayurvedic
          practices, helping you achieve overall wellness.
        </p>
      </section>

      {/* Core Values Section */}
      <section className="values-section">
        <h2>Our Core Values</h2>
        <div className="values-cards">
          <div className="value-card">
            <h3>Compassion</h3>
            <p>
              We treat every patient with empathy, understanding, and respect,
              ensuring their comfort throughout their healthcare journey.
            </p>
          </div>
          <div className="value-card">
            <h3>Integrity</h3>
            <p>
              We uphold the highest standards of honesty and transparency,
              ensuring that our patients always receive ethical care.
            </p>
          </div>
          <div className="value-card">
            <h3>Innovation</h3>
            <p>
              We embrace the latest medical technologies while integrating
              traditional healing practices to offer the best of both worlds.
            </p>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="team-section">
        <h2>Meet Our Team</h2>
        <p>
          Our team consists of experienced healthcare professionals, including
          doctors, Ayurvedic practitioners, and wellness experts, who
          collaborate to provide personalized care for every patient.
        </p>
        <div className="team-images">
          <img
            src="https://via.placeholder.com/150"
            alt="Doctor"
            className="team-member"
          />
          <img
            src="https://via.placeholder.com/150"
            alt="Ayurvedic Practitioner"
            className="team-member"
          />
          <img
            src="https://via.placeholder.com/150"
            alt="Wellness Expert"
            className="team-member"
          />
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <h2>Contact Us</h2>
        <p>
          Have any questions? Feel free to reach out to us. We are here to help!
        </p>
        <p>
          Email:{" "}
          <a href="mailto:contact@healthplus.com">contact@healthplus.com</a>
        </p>
        <p>
          Phone: <a href="tel:+123456789">+918013549988</a>
        </p>
      </section>
    </div>
  );
};

export default AboutUs;
