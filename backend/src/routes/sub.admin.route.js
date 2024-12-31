import { Router } from "express";
import {
  createCategory,
  updateCategory,
  removeCategory,
  listCategory,
  readCategory,
} from "../controllers/medicalstore.controller/category.controller.js";

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


import { upload } from "../middlewares/multer.middleware.js";

import { roleMiddleware } from "../middlewares/auth.middleaware.js";

const router = Router();

//healthplus medstore

router.post("/createCategory", roleMiddleware("admin"), createCategory);
//router.post("/createCategory", createCategory);
router.put("/:categoryId", roleMiddleware("admin"), updateCategory);
router.delete("/:categoryId", roleMiddleware("admin"), removeCategory);

router.get("/categories", listCategory);
router.get("/readCategory/:id", readCategory);

router.get("/getAllOrders", roleMiddleware("admin"), getAllOrders);

router.get("/total-sales", roleMiddleware("admin"), calculateTotalSales);
router.get(
  "/total-sales-by-date",
  roleMiddleware("admin"),
  calcualteTotalSalesByDate,
);

router.put("/:id/deliver", roleMiddleware("admin"), markOrderAsDelivered);

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

 router.get("/allproducts", roleMiddleware("admin"),fetchAllProducts);
//router.get("/allproducts",fetchAllProducts);
router.get("/top", roleMiddleware("admin"),fetchTopProducts);
router.get("/new", roleMiddleware("admin"),fetchNewProducts);

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
router.delete("/removeProduct/:id", roleMiddleware("admin"), removeProduct);

router.post("/filtered-products",roleMiddleware("admin"),filterProducts);








router.get('/getUser', roleMiddleware("admin"), getAllUsers);
router.post('/updateUserStatus', roleMiddleware("admin"), updateUserStatus);

router.post('/add-user', roleMiddleware("admin"), addUser);
router.delete('/delete-user', roleMiddleware("admin"), deleteUser);

//comunity

router.get("/getAllPosts", roleMiddleware("admin"), getAllPosts);
router.get("/getUserPosts", roleMiddleware("admin"), getUserPosts);
router.get("/getPostById/:postId", roleMiddleware("admin"), getPostById);
router.delete("/posts/:postId", roleMiddleware("admin"), deletePost);

export default router;
