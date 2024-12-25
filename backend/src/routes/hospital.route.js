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

router.post('/register', registerHospital);
router.post('/login', loginHospital);

router.get("/getCurrentUser",roleMiddleware("hospital"),getCurrentUser);
router.get("/logoutUser",roleMiddleware("hospital"),logoutUser)

router.post('/addDoctor',roleMiddleware("hospital"), addDoctor);

router.get('/getDoctorAppointments',roleMiddleware("hospital"), getDoctorAppointments);
router.get('/getHospitalAllAppointments',roleMiddleware("hospital"), getHospitalAllAppointments);

export default router