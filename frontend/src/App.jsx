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
import Login from "./pages/Login"; // Import UserLogin
import Register from "./pages/Register"; // Import UserRegister
import HospitalLogin from "./pages/HospitalLogin"; // Import HospitalLogin
import HospitalRegister from "./pages/HospitalRegister"; // Import HospitalRegister
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import HospitalDashboard from "./pages/HospitalDashboard";
import FindPharmacy from "./pages/FindPharmacy";
import FindHospital from "./pages/FindHospital";
import MedStore from "./pages/MedicalStore/MedStore.jsx";

//med store
import AdminRoute from "./pages/MedicalStore/Admin/AdminRoute.jsx";
import Profile from "./pages/MedicalStore/User/Profile.jsx";
import UserList from "./pages/MedicalStore/Admin/UserList.jsx";

import CategoryList from "./pages/MedicalStore/Admin/CategoryList.jsx";

import ProductList from "./pages/MedicalStore/Admin/ProductList.jsx";
import AllProducts from "./pages/MedicalStore/Admin/AllProducts.jsx";
import ProductUpdate from "./pages/MedicalStore/Admin/ProductUpdate.jsx";

import Favorites from "./pages/MedicalStore/Products/Favorites.jsx";
import ProductDetails from "./pages/MedicalStore/Products/ProductDetails.jsx";

import Cart from "./pages/MedicalStore/Cart.jsx";
import Shop from "./pages/MedicalStore/Shop.jsx";

import Shipping from "./pages/MedicalStore/Orders/Shipping.jsx";
import PlaceOrder from "./pages/MedicalStore/Orders/PlaceOrder.jsx";
import Order from "./pages/MedicalStore/Orders/Order.jsx";
import OrderList from "./pages/MedicalStore/Admin/OrderList.jsx";
import MedAdminDashboard from "./pages/MedicalStore/Admin/MedAdminDashboard.jsx";
import PrivateRoute from "./pages/MedicalStore/Components/PrivateRoute.jsx";

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        {/* Landing Page for Role Selection */}
        <Route path="/login" element={<LandingPage />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />

        {/* User Routes */}
        <Route path="/user/login" element={<Login />} />
        <Route path="/user/register" element={<Register />} />
        <Route path="/userdashboard" element={<UserDashboard />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/userdashboard" element={<UserDashboard />} />
        <Route path="/hospitaldashboard" element={<HospitalDashboard />} />

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
        {/* MedicalStore */}

        <Route path="/medstore" element={<MedStore />} />
        <Route path="/medstore/favorite" element={<Favorites />} />
        <Route path="/medstore/product/:id" element={<ProductDetails />} />
        <Route path="/medstore/cart" element={<Cart />} />
        <Route path="/medstore/shop" element={<Shop />} />

        {/* Registered users */}
        <Route path="/medstore" element={<PrivateRoute />}>
          <Route path="/medstore/profile" element={<Profile />} />
          <Route path="/medstore/shipping" element={<Shipping />} />
          <Route path="/medstore/placeorder" element={<PlaceOrder />} />
          <Route path="/medstore/order/:id" element={<Order />} />
        </Route>

        <Route path="/medstore/admin" element={<AdminRoute />}>
          <Route path="userlist" element={<UserList />} /> {/* Relative path */}
          <Route path="categorylist" element={<CategoryList />} />
          <Route path="productlist" element={<ProductList />} />
          <Route path="allproductslist" element={<AllProducts />} />
          <Route path="productlist/:pageNumber" element={<ProductList />} />
          <Route path="productupdate/:_id" element={<ProductUpdate />} />
          <Route path="orderlist" element={<OrderList />} />
          <Route path="dashboard" element={<MedAdminDashboard />} />
        </Route>
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
