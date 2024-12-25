import { Router } from "express";
import {
  createCategory,
  updateCategory,
  removeCategory,
  listCategory,
  readCategory,
} from "../controllers/medicalstore.controller/categoryController.js";

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
} from "../controllers/medicalstore.controller/productController.js";

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
} from "../controllers/medicalstore.controller/orderController.js";



import { roleMiddleware } from "../middlewares/auth.middleaware.js";

const router = Router()

router.post("createCategory",roleMiddleware("admin"), createCategory);
router.put("/:categoryId",roleMiddleware("admin"), updateCategory);
router.delete("/:categoryId",roleMiddleware("admin"), removeCategory);

router.get("/categories",listCategory);
router.get("/:id",readCategory);



route.get("getAllOrders",roleMiddleware("admin"), getAllOrders);

router.get("/total-sales",roleMiddleware("admin"),calculateTotalSales);
router.get("/total-sales-by-date",roleMiddleware("admin"),calcualteTotalSalesByDate);

router.put("/:id/deliver",roleMiddleware("admin"), markOrderAsDelivered);



export default router;
