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


import {
    addcomment,
    getAllPosts,
    getPostById,
    getUserPosts,
    getNotifications,
    deletePost
} from "../controllers/community.controller/postController.js"


import { upload } from "../middlewares/multer.middleware.js"
const router = Router()

router.post('/login', loginDoctor);
router.post('/fetchPatientData/', fetchPatientData);

router.post('/getDoctorAppointments/:doctorId', getDoctorAppointments);

//community
router.post("/addcomment", roleMiddleware("doctor"), addcomment);
router.get("/getAllPosts", roleMiddleware("doctor"), getAllPosts);
router.get("/getUserPosts", roleMiddleware("doctor"), getUserPosts);
router.get("/getPostById/:postId", roleMiddleware("doctor"), getPostById);
router.get("/getNotifications", roleMiddleware("doctor"), getNotifications);



export default router