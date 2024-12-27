import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <h1>Welcome to HealthPlus</h1>
      <p>Select your role to continue</p>

      <div className="landing-buttons">
        <div className="user-section">
          <h2>For Users</h2>
          <button
            className="landing-button"
            onClick={() => navigate("/user/login")}
          >
            User Login
          </button>
          <button
            className="landing-button"
            onClick={() => navigate("/user/register")}
          >
            User Register
          </button>
        </div>

        <div className="hospital-section">
          <h2>For Hospitals</h2>
          <button
            className="landing-button"
            onClick={() => navigate("/hospital/login")}
          >
            Hospital Login
          </button>
          <button
            className="landing-button"
            onClick={() => navigate("/hospital/register")}
          >
            Hospital Register
          </button>
        </div>

        {/* Added Doctor Section */}
        <div className="doctor-section">
          <h2>For Doctors</h2>
          <button
            className="landing-button"
            onClick={() => navigate("/doctor/login")}
          >
            Doctor Login
          </button>
          {/* <button
            className="landing-button"
            onClick={() => navigate("/doctor/register")}
          >
            Doctor Register
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
