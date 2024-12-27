import { Router } from "express";
import {
    registerHospital,
    loginHospital,
    addDoctor,
    getHospitalAllAppointments,
    getCurrentUser,
    logoutUser
} from '../controllers/hospital.controller.js'
import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleaware.js'

import {
    loginDoctor,
    getDoctorAppointments,
    fetchPatientData,
} from '../controllers/doctor.controller.js'

import {} from "../controllers/community.controller.js/postController.js"

const router = Router()

router.post('/login', loginDoctor);
router.post('/gfetchPatientData',fetchPatientData);

router.post('/getDoctorAppointments/:doctorId', getDoctorAppointments);

//community




export default router