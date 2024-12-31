import "../styles/Learn.css";

const Learn = () => {
  return (
    <div className="learn-container">
      {/* Hero Section */}
      <section className="hero-section">
        <h1>Welcome to HealthPlus Learn</h1>
        <p>
          Explore our resources on health, wellness, and Ayurveda. Enhance your
          well-being with our curated content.
        </p>
      </section>

      {/* Learning Resources Section */}
      <section className="resources-section">
        <h2 className="section-title">Our Learning Resources</h2>
        <div className="resource-cards">
          <div className="resource-card">
            <h3>Health Articles</h3>
            <p>
              Read insightful articles on various health topics to stay informed
              and make better health choices.
            </p>
            <a href="/health-articles" className="btn-link">
              Explore Articles
            </a>
          </div>
          <div className="resource-card">
            <h3>Wellness Tips</h3>
            <p>
              Discover tips and tricks for a balanced life, from mental health
              to physical fitness.
            </p>
            <a href="/wellness-tips" className="btn-link">
              Explore Tips
            </a>
          </div>
          <div className="resource-card">
            <h3>Ayurveda Knowledge</h3>
            <p>
              Learn about Ayurvedic practices, herbs, and remedies to enhance
              your well-being naturally.
            </p>
            <a href="/ayurveda-knowledge" className="btn-link">
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Featured Video Section */}
    </div>
  );
};

export default Learn;
