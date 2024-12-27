import { Router } from "express";
import {
    registerHospital,
    loginHospital,
    addDoctor,
    getDoctorAppointments,
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


const router = Router()

router.post('/login', loginDoctor);
router.post('/gfetchPatientData',fetchPatientData);

router.post('/getDoctorAppointments/:doctorId', getDoctorAppointments);




export default router