import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Learn from "./pages/Learn";
import Ayurveda from "./pages/ServiceDetails/Ayurveda";
import DoctorConsultation from "./pages/ServiceDetails/DoctorConsultation";
import MedicineStore from "./pages/ServiceDetails/MedicineStore";
import ReportGuidance from "./pages/ServiceDetails/ReportGuidance";
import MyProfile from "./pages/Myprofile";
import MyAppointment from "./pages/Myappointment";
import Doctor from "./pages/Doctors";
import Appointment from "./pages/Appointment";
import LandingPage from "./pages/LandingPage"; // Import the LandingPage component
import UserLogin from "./pages/UserLogin"; // Import UserLogin
import UserRegister from "./pages/UserRegister"; // Import UserRegister
import HospitalLogin from "./pages/HospitalLogin"; // Import HospitalLogin
import HospitalRegister from "./pages/HospitalRegister"; // Import HospitalRegister
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import FindPharmacy from "./pages/FindPharmacy";
import FindHospital from "./pages/FindHospital";
const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        {/* Landing Page for Role Selection */}
        <Route path="/login" element={<LandingPage />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />

        {/* User Routes */}
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/register" element={<UserRegister />} />

        {/* Hospital Routes */}
        <Route path="/hospital/login" element={<HospitalLogin />} />
        <Route path="/hospital/register" element={<HospitalRegister />} />

        {/* Existing Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/findPharmacy" element={<FindPharmacy />} />
        <Route path="/findHospital" element={<FindHospital />} />
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<Doctor />} />
        <Route path="/doctors/:speciality" element={<Doctor />} />
        <Route path="/myappointment" element={<MyAppointment />} />
        <Route path="/myprofile" element={<MyProfile />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/appointment/:docId" element={<Appointment />} />
        <Route path="/services/ayurveda" element={<Ayurveda />} />
        <Route
          path="/services/doctor-consultation"
          element={<DoctorConsultation />}
        />
        <Route path="/services/medicine-store" element={<MedicineStore />} />
        <Route path="/services/report-guidance" element={<ReportGuidance />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
