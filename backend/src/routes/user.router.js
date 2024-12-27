import { Router } from "express";
import {
    registerUser,
    loginUser,
    nearestHospital,
    nearestPharmacy,
    getAllHospitals,
    bookAppointment,
    getAvailableSlots,
    deleteAppointment,
    updateAppointment,
    getAllDoctors,
    sendOtpForPatientId,
    verifyOtpAndFetchData,
    createPatientId,
    getCurrentUser,
    logoutUser,
    uploadMedicalDetails,
    getPatientDetailsId,
} from '../controllers/user.controller.js'
import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleaware.js'
import { upload } from "../middlewares/multer.middleware.js"


import {
    createOrder,
    getAllOrders,
    getUserOrders,
    countTotalOrders,
    calculateTotalSales,
    calcualteTotalSalesByDate,
    findOrderById,
    markOrderAsPaid,
    markOrderAsDelivered,
  } from "../controllers/medicalstore.controller/order.controller.js";


  import {
    createCategory,
    updateCategory,
    removeCategory,
    listCategory,
    readCategory,
  } from "../controllers/medicalstore.controller/category.controller.js";


  import {
    addProduct,
    updateProductDetails,
    removeProduct,
    fetchProducts,
    fetchProductById,
    fetchAllProducts,
    addProductReview,
    fetchTopProducts,
    fetchNewProducts,
    filterProducts,
  } from "../controllers/medicalstore.controller/product.controller.js";


import {addcomment,createPost,getAllPosts,getPostById,getUserPosts,getNotifications} from "../controllers/community.controller/postController.js"

const router = Router()

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get("/hospitals", roleMiddleware("user"), nearestHospital);
router.get("/pharmacy", roleMiddleware("user"), nearestPharmacy);
router.get("/pharmacy", roleMiddleware("user"), getAllHospitals);
router.get("/getCurrentUser", roleMiddleware("user"), getCurrentUser);
router.get("/logoutUser", roleMiddleware("user"), logoutUser)

router.get("/getAllDoctors", getAllDoctors);


//router.get("/getAvailableSlots",getAvailableSlots);
router.get('/getAvailableSlots/:doctorId/:date', roleMiddleware("user"), getAvailableSlots);


router.post('/bookAppointment', roleMiddleware("user"), bookAppointment);
router.put('/updateAppointment/:appointmentId', roleMiddleware("user"), updateAppointment);
router.delete('/deleteAppointment/:appointmentId', roleMiddleware("user"), deleteAppointment);

router.post('/send-otp', roleMiddleware("user"), sendOtpForPatientId); // Send OTP when patient ID is entered
router.post('/verify-otp', roleMiddleware("user"), verifyOtpAndFetchData); // Verify OTP and fetch patient data
router.post('/create-patient-id', roleMiddleware("user"), createPatientId);

//router.post('/create-patient-id',roleMiddleware("user"), createPatientId);
router.post('/uploadMedicalDetails', roleMiddleware("user"), upload.single("medical-history"), uploadMedicalDetails);
router.get("/ getPatientDetailsId/:id",roleMiddleware("user"),  getPatientDetailsId);




//health medstore

router.get("/mine", roleMiddleware("user"), getUserOrders);
router.get("/readCategory/:id",readCategory);
router.get("/findOrderById/:id", roleMiddleware("user"), findOrderById);
router.put("/:id/pay", roleMiddleware("user"), markOrderAsPaid);

router.post("/createOrder",roleMiddleware("user"), createOrder)

router.get("/top", fetchTopProducts);
router.get("/new", fetchNewProducts);

router.get("/allproducts",fetchAllProducts);
router.post("/filtered-products",filterProducts);
router.get("/fetchProductById/:id",fetchProductById)
router.post("/:id/reviews",roleMiddleware("user"), addProductReview);



//community






export default router