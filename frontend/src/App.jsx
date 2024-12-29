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

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        {/* Landing Page for Role Selection */}
        <Route path="/login" element={<LandingPage />} />

        {/* User Authentication Routes */}
        <Route path="/user/login" element={<Login />} />
        <Route path="/user/register" element={<Register />} />
        <Route path="/userdashboard" element={<UserDashboard />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
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
        <Route
          path="/services/doctor-consultation"
          element={<DoctorConsultation />}
        />
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
        <Route path="/Community" element={<AllPost />} />
        <Route path="/Community/CommentCard" element={<CommentCard />} />
        <Route path="/Community/CommentForm" element={<CommentForm />} />
        <Route path="/Community/CreatePost" element={<CreatePost />} />
        <Route path="/Community/DeletePost" element={<DeletePost />} />
        <Route
          path="/Community/NotificationsPage"
          element={<NotificationsPage />}
        />
        <Route path="/Community/PostCard" element={<PostCard />} />
        <Route path="/Community/PostDetail" element={<PostDetail />} />
        <Route path="/Community/UserPost" element={<UserPost />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
