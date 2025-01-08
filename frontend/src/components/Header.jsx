import { Link } from "react-router-dom";
import "../styles/Header.css";

const Header = () => {
  // Simulate retrieving the authentication status and user role (could be from localStorage or global state)
  const isAuthenticated = localStorage.getItem("authToken"); // Replace with real auth check
  const userRole = localStorage.getItem("userRole"); // 'doctor', 'admin', 'hospital', etc.

  return (
    <header className="header">
      <div className="logo">
        <Link to="/" className="logo-link">
          Health+
        </Link>
      </div>
      <nav>
        <ul className="nav-list">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <hr className="nav-underline" />
          </li>
          <li className="nav-item">
            <Link to="/about-us" className="nav-link">
              About Us
            </Link>
            <hr className="nav-underline" />
          </li>
          <li className="nav-item">
            <Link to="/contact" className="nav-link">
              Contact
            </Link>
            <hr className="nav-underline" />
          </li>
          <li className="nav-item">
            <Link to="/learn" className="nav-link">
              Learn
            </Link>
            <hr className="nav-underline" />
          </li>

          {!isAuthenticated ? (
            <li className="nav-item">
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <hr className="nav-underline" />
            </li>
          ) : (
            <li className="nav-item">
              <Link to="/profile" className="nav-link">
                {userRole === "doctor" && "Doctor Profile"}
                {userRole === "admin" && "Admin Dashboard"}
                {userRole === "hospital" && "Hospital Profile"}
                {!["doctor", "admin", "hospital"].includes(userRole) &&
                  "Profile"}
              </Link>
              <hr className="nav-underline" />
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
