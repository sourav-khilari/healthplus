import { Router } from "express";
import { registerHospital,loginHospital,addDoctor,getDoctorAppointments,getHospitalAllAppointments} from '../controllers/hospital.controller.js'
import {authMiddleware,roleMiddleware} from '../middlewares/auth.middleaware.js'



const router = Router()

router.post('/register', registerHospital);
router.post('/login', loginHospital);

router.post('/addDoctor',roleMiddleware("hospital"), addDoctor);

router.get('/getDoctorAppointments',roleMiddleware("hospital"), getDoctorAppointments);
router.get('/getHospitalAllAppointments',roleMiddleware("hospital"), getHospitalAllAppointments);

export default router