import { Link } from "react-router-dom";
import "../styles/Header.css";

const Header = () => {
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
          <li className="nav-item">
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <hr className="nav-underline" />
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
