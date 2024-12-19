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
import Register from "./pages/Register";
import Login from "./pages/Login";
import MyProfile from "./pages/Myprofile";
import MyAppointment from "./pages/Myappointment";
import Doctor from "./pages/Doctors";
import Appointment from "./pages/Appointment";

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<Doctor />} />
        <Route path="/doctors/:speciality" element={<Doctor />} />
        <Route path="/myappointment" element={<MyAppointment />} />
        <Route path="/myprofile" element={<MyProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/learn" element={<Learn />} />
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