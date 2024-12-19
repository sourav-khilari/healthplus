
import ServiceCard from "../components/ServiceCard";
import "../styles/Services.css";

const Services = () => {
  const services = [
    {
      title: "Ayurveda Cure",
      description: "Personalized Ayurvedic treatments and wellness plans.",
      link: "/services/ayurveda",
    },
    {
      title: "Doctor Consultation",
      description: "Book virtual or in-person consultations with top doctors.",
      link: "/services/doctor-consultation",
    },
    {
      title: "Medicine Store",
      description: "Order your prescription and over-the-counter medicines.",
      link: "/services/medicine-store",
    },
    {
      title: "Report Guidance",
      description: "Get insights and guidance on your health reports.",
      link: "/services/report-guidance",
    },
  ];

  return (
    <div className="services-page">
      <h1>Our Services</h1>
      <div className="service-cards">
        {services.map((service) => (
          <ServiceCard key={service.title} {...service} />
        ))}
      </div>
    </div>
  );
};

export default Services;
