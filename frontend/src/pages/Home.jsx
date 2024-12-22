import ServiceCard from "../components/ServiceCard";
import "../styles/Home.css";

const Home = () => {
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
    {
      title: "Find Hospital Near You",
      description: "Get the posiible near hospital.",
      link: "/findHospital",
    },
    {
      title: "Find Pharmacy Near You",
      description: "Get the posiible near hospital. ",
      link: "/findPharmacy",
    },
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero ">
        <h1>Welcome to Health+</h1>
        <p>Comprehensive care, personalized for you.</p>
        <img
          src="./src/assets/images/h2.jpeg"
          alt="HealthPlus banner showing healthcare excellence"
          className="hero-image "
          style={{ width: "40%" }}
        />
      </section>

      {/* Services Section */}
      <section className="services">
        <h2>Our Services</h2>
        <div className="service-cards">
          {services.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
