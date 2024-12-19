import  { useState, useEffect } from "react";
// import "./MyProfile.css";

const MyProfile = () => {
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    age: "",
    gender: "",
    contact: "",
  });

  useEffect(() => {
    // Simulate fetching user data from an API
    const fetchUserData = async () => {
      // Replace with your API call
      const userData = {
        name: "John Doe",
        email: "johndoe@example.com",
        age: 30,
        gender: "Male",
        contact: "123-456-7890",
      };
      setProfileData(userData);
    };

    fetchUserData();
  }, []);

  return (
    <div className="my-profile-container">
      <h1>My Profile</h1>
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
    </div>
  );
};

export default MyProfile;
