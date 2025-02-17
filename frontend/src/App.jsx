import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Learn from "./pages/Learn";
import Ayurveda from "./pages/ServiceDetails/Ayurveda";
//import DoctorConsultation from "./pages/ServiceDetails/DoctorConsultation";
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
import DoctorDashboard from "./pages/DoctorDashboard";
import HospitalDashboard from "./pages/HospitalDashboard";
import FindPharmacy from "./pages/FindPharmacy";
import FindHospital from "./pages/FindHospital";
import MedStore from "./pages/MedicalStore/MedStore.jsx";

// Medical store related imports
import AdminMenu from "./pages/MedicalStore/Admin/AdminMenu.jsx";
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
import DoctorLogin from "./pages/DoctorLogin.jsx";
// import DoctorRegister from "./pages/DoctorRegister.jsx";
import AllPost from "./pages/Community/AllPost.jsx";
import CommentCard from "./pages/Community/CommentCard.jsx";
import CommentForm from "./pages/Community/CommentForm.jsx";
import CreatePost from "./pages/Community/CreatePost.jsx";
import DeletePost from "./pages/Community/DeletePost.jsx";
import NotificationsPage from "./pages/Community/NotificationPage.jsx";
import PostCard from "./pages/Community/PostCard.jsx";
import PostDetail from "./pages/Community/PostDetail.jsx";
import UserPost from "./pages/Community/UserPost.jsx";
//bloodbank
import SubmitDonationRequest from "./pages/BloodBank/SubmitDonationRequest.jsx";
import CancelDonationRequest from "./pages/BloodBank/CancelDonation.jsx";
import UserDonationRequests from "./pages/BloodBank/UserDonationRequests.jsx";
import BloodBankDashboard from "./pages/BloodBank/BloodBankDashboard.jsx";
import HospitalBloodDashboard from "./pages/BloodBank/HospitalBloodDashboard.jsx";
import LoadingPage from "./components/LoadingPage.jsx";
import { useState, useEffect } from "react";
//admin pages
import HospitalManagement from "./pages/AdminDashboard/HospitalManagement.jsx";
import UserManagement from "./pages/AdminDashboard/UserManagement.jsx";
import ApprovedHospitals from "./pages/AdminDashboard/ApprovedHospitals.jsx";
import RejectedHospitals from "./pages/AdminDashboard/RejectedHospitals.jsx";
import PendingHospitals from "./pages/AdminDashboard/PendingHospitals.jsx";
//video call with patient
import RoomPage from "./pages/Room.jsx";
import LobbyScreen from "./pages/Lobby.jsx";
// import PatientConsultationEntry from "./pages/ServiceDetails/PatientConsultancy.jsx";
// import DoctorConsultationEntry from "./pages/ServiceDetails/DoctorConsultation.jsx";

//online doc
import DoctorConsultencyPage from "./pages/OnlineDoctor/DoctorConsultencyPage.jsx";
import BookDoctor from "./pages/OnlineDoctor/BookDoctor.jsx";

import DoctorRegistrationPage from "./pages/OnlineDoctor/DoctorRegistrationPage";
import DoctorAppointmentsPage from "./pages/OnlineDoctor/DoctorAppointmentsPage";
import VideoIdPage from "./pages/OnlineDoctor/VideoIdPage";
import OnlineDoctorDashboard from "./pages/OnlineDoctor/OnlineDoctorDashboard.jsx";
import OnlineDoctorLogin from "./pages/OnlineDoctor/DoctorLogin.jsx";
const App = () => {
  const [isFirstVisit, setIsFirstVisit] = useState(true); // Track if it's the first visit

  useEffect(() => {
    const visitedBefore = localStorage.getItem("visited");
    if (visitedBefore) {
      setIsFirstVisit(false); // If the user has visited before, skip the loading screen
    } else {
      localStorage.setItem("visited", "true"); // Mark as visited on first load
    }
  }, []);

  if (isFirstVisit) {
    return <LoadingPage />; // Show loading page on the first visit
  }

  return (
    <Router>
      <Header />
      <Routes>
        {/* Landing Page for Role Selection */}
        <Route path="/user/lobby" element={<LobbyScreen />} />
        <Route path="/doctors/room/:roomId" element={<RoomPage />} />
        {/* <Route
          path="/PatientConsultationEntry"
          element={<PatientConsultationEntry />}
        />
        <Route
          path="/DoctorConsultationEntry"
          element={<DoctorConsultationEntry />}
        /> */}
        <Route path="/login" element={<LandingPage />} />
        {/* User Authentication Routes */}
        <Route path="/user/login" element={<Login />} />
        <Route path="/user/register" element={<Register />} />
        <Route path="/userdashboard" element={<UserDashboard />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/doctordashboard" element={<DoctorDashboard />} />
        <Route
          path="/admindashboard/hospitalManagement"
          element={<HospitalManagement />}
        />
        <Route path="/admindashboard/users" element={<UserManagement />} />
        <Route
          path="/admindashboard/pendingHospitals"
          element={<PendingHospitals />}
        />
        <Route
          path="/admindashboard/approvedHospitals"
          element={<ApprovedHospitals />}
        />
        <Route
          path="/admindashboard/rejectedHospitals"
          element={<RejectedHospitals />}
        />
        <Route path="/hospital/login" element={<HospitalLogin />} />
        <Route path="/hospital/register" element={<HospitalRegister />} />
        <Route path="/doctor/login" element={<DoctorLogin />} />
        {/* <Route path="/doctor/register" element={<DoctorRegister />} /> */}
        <Route path="/hospital/dashboard" element={<HospitalDashboard />} />
        {/* General Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/appointment/:docId" element={<Appointment />} />
        <Route path="/doctors" element={<Doctor />} />
        <Route path="/doctors/:speciality" element={<Doctor />} />
        <Route path="/myappointment" element={<MyAppointment />} />
        <Route path="/myprofile" element={<MyProfile />} />
        <Route path="/services/ayurveda" element={<Ayurveda />} />
        {/* <Route
          path="/services/doctor-consultation"
          element={<DoctorConsultation />}
        /> */}
        <Route path="/services/medicine-store" element={<MedicineStore />} />
        <Route path="/services/report-guidance" element={<ReportGuidance />} />
        {/* MedicalStore Routes */}
        <Route path="/medstore" element={<MedStore />} />
        <Route path="/medstore/user" element={<PrivateRoute />}>
          <Route path="favorite" element={<Favorites />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="cart" element={<Cart />} />
          <Route path="shop" element={<Shop />} />
          <Route path="profile" element={<Profile />} />
          <Route path="shipping" element={<Shipping />} />
          <Route path="placeorder" element={<PlaceOrder />} />
          <Route path="order/:id" element={<Order />} />
        </Route>
        <Route path="/medstore/admin" element={<AdminRoute />}>
          <Route path="menu" element={<AdminMenu />} />
          <Route path="userlist" element={<UserList />} />
          <Route path="categorylist" element={<CategoryList />} />
          <Route path="productlist" element={<ProductList />} />
          <Route path="allproductslist" element={<AllProducts />} />
          <Route path="productlist/:pageNumber" element={<ProductList />} />
          <Route path="productupdate/:_id" element={<ProductUpdate />} />
          <Route path="orderlist" element={<OrderList />} />
          <Route path="dashboard" element={<MedAdminDashboard />} />
        </Route>
        <Route path="/findPharmacy" element={<FindPharmacy />} />
        <Route path="/findHospital" element={<FindHospital />} />
        {/* Other routes */}
        <Route path="/Community/:role" element={<AllPost />} />
        <Route path="/Community/CommentCard" element={<CommentCard />} />
        <Route
          path="/Community/CommentForm/:postId/:role"
          element={<CommentForm />}
        />
        <Route path="/Community/CreatePost" element={<CreatePost />} />
        <Route path="/Community/DeletePost/:role" element={<DeletePost />} />
        <Route
          path="/Community/NotificationsPage"
          element={<NotificationsPage />}
        />
        <Route path="/Community/PostCard/:role" element={<PostCard />} />
        <Route
          path="/Community/PostDetail/:id/:role"
          element={<PostDetail />}
        />
        <Route path="/Community/UserPost/:role" element={<UserPost />} />
        <Route
          path="/Bloodbank/submit-request"
          element={<SubmitDonationRequest />}
        />   
        <Route
          path="/Bloodbank/cancel-request"
          element={<CancelDonationRequest />}
        />
        <Route
          path="/Bloodbank/my-requests"
          element={<UserDonationRequests />}
        />
        <Route path="/Bloodbank/dashboard" element={<BloodBankDashboard />} />
        <Route
          path="/Bloodbank/hospitaldashboard"
          element={<HospitalBloodDashboard />}
        />
        {/* online doctor*/}
        <Route path="/online-doctor/login" element={<OnlineDoctorLogin />} />
        <Route
          path="/online-doctor/doctor-consultation"
          element={<DoctorConsultencyPage />}
        />
        <Route path="/online-doctor/book-doctor" element={<BookDoctor />} />

        <Route
          path="/online-doctor/register"
          element={<DoctorRegistrationPage />}
        />
        <Route
          path="/online-doctor/doctor-appointments"
          element={<DoctorAppointmentsPage />}
        />
        <Route
          path="/online-doctor/video-id/:appointmentId"
          element={<VideoIdPage />}
        />
        <Route
          path="/online-doctor/dashboard"
          element={<OnlineDoctorDashboard />}
        />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
