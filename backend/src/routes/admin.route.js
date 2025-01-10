import { Router } from "express";
import {
    addUser,
    deleteUser,
    getAllUsers,
    updateUserStatus,
    approveOrDeclineHospital,
    getPendingHospitals,
    getRejectedHospitals,
    getApprovedHospitals,
} from '../controllers/admin.controller.js'
import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleaware.js'
import { upload } from "../middlewares/multer.middleware.js";


const router = Router();

router.get('/getUser', roleMiddleware("superadmin"), getAllUsers);
router.post('/updateUserStatus', roleMiddleware("superadmin"), updateUserStatus);

router.post('/add-user', roleMiddleware("superadmin"), addUser);
router.delete('/delete-user', roleMiddleware("superadmin"), deleteUser);

router.post('/approveOrDeclineHospital', roleMiddleware("superadmin"), approveOrDeclineHospital);

router.get('/getPendingHospitals', roleMiddleware("superadmin"), getPendingHospitals);
router.get('/getRejectedHospitals', roleMiddleware("superadmin"), getRejectedHospitals);
router.get('/getApprovedHospitals', roleMiddleware("superadmin"), getApprovedHospitals);

//


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
    addcomment,
     createPost,
     getAllPosts, 
     getPostById, 
     getUserPosts, 
     getNotifications, 
     deletePost 
    } from "../controllers/community.controller/postController.js"
  
  
  
  

  
  //healthplus medstore
  
  router.post("/createCategory", roleMiddleware("superadmin"), createCategory);
  //router.post("/createCategory", createCategory);
  router.put("/:categoryId", roleMiddleware("superadmin"), updateCategory);
  router.delete("/:categoryId", roleMiddleware("superadmin"), removeCategory);
  
  router.get("/categories", listCategory);
  router.get("/readCategory/:id", readCategory);
  
  router.get("/getAllOrders", roleMiddleware("superadmin"), getAllOrders);
  
  router.get("/total-sales", roleMiddleware("superadmin"), calculateTotalSales);
  router.get(
    "/total-sales-by-date",
    roleMiddleware("superadmin"),
    calcualteTotalSalesByDate,
  );
  
  router.put("/:id/deliver", roleMiddleware("superadmin"), markOrderAsDelivered);
  
  router.get("/fetchProducts", fetchProducts);
  //router.post("/addProduct", roleMiddleware("admin"), addProduct);
  
  router.post(
    "/addProduct",
    roleMiddleware("admin"),
    upload.fields([
      { name: "image1", maxCount: 1 },
      { name: "image2", maxCount: 1 },
      { name: "image3", maxCount: 1 },
      { name: "image4", maxCount: 1 },
    ]),
    addProduct,
  );
  
   router.get("/allproducts", roleMiddleware("superadmin"),fetchAllProducts);
  //router.get("/allproducts",fetchAllProducts);
  router.get("/top", roleMiddleware("superadmin"),fetchTopProducts);
  router.get("/new", roleMiddleware("superadmin"),fetchNewProducts);
  
  router.get("/fetchProductById/:id", fetchProductById);
  router.put(
    "/updateProductDetails/:id",
    roleMiddleware("admin"),
    upload.fields([
      { name: "image1", maxCount: 1 },
      { name: "image2", maxCount: 1 },
      { name: "image3", maxCount: 1 },
      { name: "image4", maxCount: 1 },
    ]),
    updateProductDetails,
  ); //
  router.delete("/removeProduct/:id", roleMiddleware("superadmin"), removeProduct);
  
  router.post("/filtered-products",roleMiddleware("superadmin"),filterProducts);
  
  
  
  
  
  
  
  
  router.get('/getUser', roleMiddleware("superadmin"), getAllUsers);
  router.post('/updateUserStatus', roleMiddleware("superadmin"), updateUserStatus);
  
  router.post('/add-user', roleMiddleware("superadmin"), addUser);
  router.delete('/delete-user', roleMiddleware("superadmin"), deleteUser);
  
  //comunity
  
  router.get("/getAllPosts", roleMiddleware("superadmin"), getAllPosts);
  router.get("/getUserPosts", roleMiddleware("superadmin"), getUserPosts);
  router.get("/getPostById/:postId", roleMiddleware("superadmin"), getPostById);
  router.delete("/posts/:postId", roleMiddleware("superadmin"), deletePost);
  
  
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
  
  router.get("/onlinegetUnapprovedDoctors", roleMiddleware("superadmin"), onlinegetUnapprovedDoctors);
  router.put("/onlineapproveDoctor/", roleMiddleware("superadmin"), onlineapproveDoctor);



export default router
