
import "../styles/ServiceCard.css";

const ServiceCard = ({ title, description, link }) => {
  return (
    <div className="service-card">
      <h3>{title}</h3>
      <p>{description}</p>
      <a href={link} className="learn-more">
        Learn More
      </a>
    </div>
  );
};

export default ServiceCard;
