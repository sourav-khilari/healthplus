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
  updateUserAvatar,
  updateUserCoverImage,
  contactUs,
  getUserAppointments,
} from "../controllers/user.controller.js";
import {
  authMiddleware,
  roleMiddleware,
} from "../middlewares/auth.middleaware.js";
import { upload } from "../middlewares/multer.middleware.js";

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

import {
  addcomment,
  createPost,
  getAllPosts,
  getPostById,
  getUserPosts,
  getNotifications,
  deletePost,
} from "../controllers/community.controller/postController.js";

import { admin } from "../config/firebase.js";
const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/hospitals", roleMiddleware("user"), nearestHospital);
router.get("/pharmacy", roleMiddleware("user"), nearestPharmacy);
router.get("/pharmacy", roleMiddleware("user"), getAllHospitals);
router.get("/getCurrentUser", roleMiddleware("user"), getCurrentUser);
router.get("/logoutUser", roleMiddleware("user"), logoutUser);
router.post(
  "/updateUserAvatar",
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  roleMiddleware("user"),
  updateUserAvatar,
);
router.post(
  "/updateUserCoverImage",
  upload.fields([
    {
      name: "coverimage",
      maxCount: 1,
    },
  ]),
  roleMiddleware("user"),
  updateUserCoverImage,
);

router.get("/getAllDoctors", getAllDoctors);

//router.get("/getAvailableSlots",getAvailableSlots);
router.get(
  "/getAvailableSlots/:doctorId/:date",
  roleMiddleware("user"),
  getAvailableSlots,
);

router.get("./getUserAppointments",roleMiddleware("user"),getUserAppointments);

router.post("/bookAppointment", roleMiddleware("user"), bookAppointment);
router.put(
  "/updateAppointment/:appointmentId",
  roleMiddleware("user"),
  updateAppointment,
);
router.delete(
  "/deleteAppointment/:appointmentId",
  roleMiddleware("user"),
  deleteAppointment,
);

router.post("/send-otp", roleMiddleware("user"), sendOtpForPatientId); // Send OTP when patient ID is entered
router.post("/verify-otp", roleMiddleware("user"), verifyOtpAndFetchData); // Verify OTP and fetch patient data
router.post("/create-patient-id", roleMiddleware("user"), createPatientId);

//router.post('/create-patient-id',roleMiddleware("user"), createPatientId);
router.post(
  "/uploadMedicalDetails",
  roleMiddleware("user"),
  upload.single("medical-history"),
  uploadMedicalDetails,
);
router.get(
  "/ getPatientDetailsId/:id",
  roleMiddleware("user"),
  getPatientDetailsId,
);

router.post("/contactUs", contactUs);

//health medstore

router.get("/mine", roleMiddleware("user"), getUserOrders);
router.get("/readCategory/:id", readCategory);
router.get("/findOrderById/:id", roleMiddleware("user"), findOrderById);
router.put("/:id/pay", roleMiddleware("user"), markOrderAsPaid);

router.post("/createOrder", roleMiddleware("user"), createOrder);

router.get("/top", fetchTopProducts);
router.get("/new", fetchNewProducts);

router.get("/allproducts", fetchAllProducts);
router.post("/filtered-products", filterProducts);
router.get("/fetchProductById/:id", fetchProductById);
router.post("/:id/reviews", roleMiddleware("user"), addProductReview);

//community

router.post("/addcomment", roleMiddleware("user"), addcomment);
router.get("/getAllPosts", roleMiddleware("user"), getAllPosts);
router.get("/getUserPosts", roleMiddleware("user"), getUserPosts);
router.get("/getPostById/:postId", roleMiddleware("user"), getPostById);
router.get("/getNotifications", roleMiddleware("user"), getNotifications);
router.post(
  "/createPost",
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  roleMiddleware("user"),
  createPost,
);

router.delete("/posts/:postId", roleMiddleware("user"), deletePost);

router.post("/auth/refreshToken", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.log("\n\n" + "header" + "\n\n");
    return res.status(401).json({ error: "Authorization header missing" });
  }
  console.log("\n\n" + "header2" + "\n\n");
  const idToken = authHeader.split(" ")[1];

  try {
    // Verify the new token
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Set the token as a cookie
    res.cookie("authToken", idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      //sameSite: "Strict",
    });

    return res.status(200).json({ message: "Token refreshed successfully" });
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
});

//blood donation

import {
  submitBloodDonationRequest,
  cancelDonationRequest,
  getUserDonationRequests,
} from "../controllers/blood.donation.controllers/donation.request.controller.js";

router.post(
  "/submitBloodDonationRequest",
  roleMiddleware("user"),
  submitBloodDonationRequest,
);
router.post(
  "/cancelDonationRequest",
  roleMiddleware("user"),
  cancelDonationRequest,
);
router.get(
  "/getUserDonationRequests",
  roleMiddleware("user"),
  getUserDonationRequests,
);

//online doctor consultation
import {
  onlineregisterDoctor,
  onlinegetUnapprovedDoctors,
  onlineapproveDoctor,
  onlinegetAvailableSlots,
  onlinebookAppointment,
  onlineupdateAppointment,
  onlinedeleteAppointment,
  onlinegetDoctorAppointments,
  onlinegetUserAppointments,
  onlinegetVideoId,
} from "../controllers/online.doctor.controller/video.server.controller.js";

router.get(
  "/onlinegetAvailableSlots/:doctorId/:date",
  roleMiddleware("user"),
  onlinegetAvailableSlots,
);
router.post(
  "/onlinebookAppointment",
  roleMiddleware("user"),
  onlinebookAppointment,
);
router.put(
  "/onlineupdateAppointment/:appointmentId",
  roleMiddleware("user"),
  onlineupdateAppointment,
);
router.delete(
  "/onlinedeleteAppointment/:appointmentId",
  roleMiddleware("user"),
  onlinedeleteAppointment,
);
router.get(
  "/onlinegetUserAppointments",
  roleMiddleware("user"),
  onlinegetUserAppointments,
);
router.get("/onlinegetVideoId", roleMiddleware("user"), onlinegetVideoId);

export default router;
