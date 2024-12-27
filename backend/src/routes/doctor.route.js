import { Router } from "express";
import { registerHospital,
    loginHospital,
    addDoctor,
    getDoctorAppointments,
    getHospitalAllAppointments,
    getCurrentUser,
    logoutUser
} from '../controllers/hospital.controller.js'
import {authMiddleware,roleMiddleware} from '../middlewares/auth.middleaware.js'



const router = Router()



export default router