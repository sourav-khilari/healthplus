// src/components/LoadingPage.jsx
import  { useEffect, useState } from "react";
import "../styles/LoadingPage.css"; // You can style this page according to your preferences

const LoadingPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading delay (e.g., checking if it's the first time the app is loaded)
    setTimeout(() => {
      setLoading(false);
    }, 3000); // Adjust the timeout duration to your preference
  }, []);

  if (loading) {
    return (
      <div className="loading-page">
        <h1>Health+</h1>
        <p>Comprehensive care, personalized for you.</p>
      </div>
    );
  }

  // You can redirect to your main page or render your home page component here
  window.location.href = "/"; // For example, redirecting to the home page
  return null;
};

export default LoadingPage;
