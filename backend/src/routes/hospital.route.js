import { Router } from "express";
import { registerHospital,
    loginHospital,
    addDoctor,
    getDoctorAppointments,
    getHospitalAllAppointments,
    getCurrentUser,
    logoutUser,
    updateHospitalAvatar,
    updateHospitalCoverImage,
} from '../controllers/hospital.controller.js'
import {authMiddleware,roleMiddleware} from '../middlewares/auth.middleaware.js'



const router = Router()

router.post('/register', registerHospital);
router.post('/login', loginHospital);

router.get("/getCurrentUser",roleMiddleware("hospital"),getCurrentUser);
router.get("/logoutUser",roleMiddleware("hospital"),logoutUser)

router.post('/addDoctor',roleMiddleware("hospital"), addDoctor);

router.get('/getDoctorAppointments/:doctorId',roleMiddleware("hospital"), getDoctorAppointments);
router.get('/getHospitalAllAppointments/:hospitalId',roleMiddleware("hospital"), getHospitalAllAppointments);

router.post("/updateHospitalAvatar", roleMiddleware("hospital"),updateHospitalAvatar);
router.post("/updateHospitalCoverImage", roleMiddleware("hospital"),updateHospitalCoverImage);


export default router