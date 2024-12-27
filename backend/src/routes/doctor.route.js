import { Router } from "express";
import {
    getCurrentUser,
    logoutUser
} from '../controllers/hospital.controller.js'
import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleaware.js'

import {
    loginDoctor,
    getDoctorAppointments,
    fetchPatientData,
} from '../controllers/doctor.controller.js'


import { addcomment, getAllPosts, getPostById, getUserPosts, getNotifications, deletePost } from "../controllers/community.controller/postController.js"
const router = Router()

router.post('/login', loginDoctor);
router.post('/gfetchPatientData',fetchPatientData);

router.post('/getDoctorAppointments/:doctorId', getDoctorAppointments);

//community
router.post("/addcomment", roleMiddleware("user"), addcomment);
router.get("/getAllPosts", roleMiddleware("user"), getAllPosts);
router.get("/getUserPosts", roleMiddleware("user"), getUserPosts);
router.get("/getPostById/:postId", roleMiddleware("user"), getPostById);
router.get("/getNotifications", roleMiddleware("user"), getNotifications);



export default router