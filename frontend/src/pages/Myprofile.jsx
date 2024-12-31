import { useState, useEffect } from "react";
import "../styles/MyProfile.css"; // Ensure this file exists for custom styling

const MyProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch user data from API
    const fetchUserData = async () => {
      try {
        // Replace with actual API call
        const response = await fetch("http://localhost:8000/api/v1/profile");
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        setProfileData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="my-profile-container">
      <h1>My Profile</h1>
      {profileData && (
        <div className="profile-info">
          <p>
            <strong>Name:</strong> {profileData.name}
          </p>
          <p>
            <strong>Email:</strong> {profileData.email}
          </p>
          <p>
            <strong>Age:</strong> {profileData.age}
          </p>
          <p>
            <strong>Gender:</strong> {profileData.gender}
          </p>
          <p>
            <strong>Contact:</strong> {profileData.contact}
          </p>
        </div>
      )}
    </div>
  );
};

export default MyProfile;
