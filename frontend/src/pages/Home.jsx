import { useState, useEffect } from "react";
import ServiceCard from "../components/ServiceCard";
import "../styles/Home.css"; // Ensure this file includes styles for the home page

const Home = () => {
  const [role, setRole] = useState(null); // Track the user's role
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
      link: "/medstore",
    },
    {
      title: "Report Guidance",
      description: "Get insights and guidance on your health reports.",
      link: "/services/report-guidance",
    },
    {
      title: "Find Hospital Near You",
      description: "Get the possible hospitals near you.",
      link: "/findHospital",
    },
    {
      title: "Find Pharmacy Near You",
      description: "Get the possible pharmacies near you.",
      link: "/findPharmacy",
    },
    {
      title: "Community",
      description: "Join a community of health-conscious individuals.",
      link: "/Community/user",
    },
    {
      title: "Blood Bank",
      description: "Donate or request blood at nearby centers.",
      link: "/Bloodbank/dashboard", // Conditional link
    },
  ];

  // Simulate fetching the role (e.g., from Firebase, Redux, or context)
  useEffect(() => {
    const fetchUserRole = async () => {
      // Example: Fetch the user's role (this can be from Firebase, Redux, or localStorage)
      // In a real scenario, replace this with actual logic to get the user's role
      const fetchedRole = "admin"; // Example, should come from auth context or similar
      setRole(fetchedRole);
    };

    fetchUserRole();
  }, []);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Health+</h1>
          <p>Comprehensive care, personalized for you.</p>
        </div>
        <img
          src="./src/assets/images/h11.jpg"
          alt="HealthPlus banner showing healthcare excellence"
          className="hero-image"
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
