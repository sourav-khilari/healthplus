import { Router } from "express";
import {
    registerHospital,
    loginHospital,
    addDoctor,
    getDoctorAppointments,
    getHospitalAllAppointments,
    getCurrentUser,
    logoutUser,
    updateHospitalAvatar,
    updateHospitalCoverImage,
} from '../controllers/hospital.controller.js'
import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleaware.js'
import { upload } from "../middlewares/multer.middleware.js"


const router = Router()

router.post('/register', registerHospital);
router.post('/login', loginHospital);

router.get("/getCurrentUser", roleMiddleware("hospital"), getCurrentUser);
router.get("/logoutUser", roleMiddleware("hospital"), logoutUser)

router.post('/addDoctor', roleMiddleware("hospital"), addDoctor);

router.get('/getDoctorAppointments/:doctorId', roleMiddleware("hospital"), getDoctorAppointments);
router.get('/getHospitalAllAppointments/:hospitalId', roleMiddleware("hospital"), getHospitalAllAppointments);

router.post("/updateHospitalAvatar", upload.fields([
    {
        name: "avatar",
        maxCount: 1,
    },
]), roleMiddleware("hospital"), updateHospitalAvatar);
router.post("/updateHospitalCoverImage", upload.fields([
    {
        name: "cover",
        maxCount: 1,
    },
]), roleMiddleware("hospital"), updateHospitalCoverImage);


//blood donation

import {
    getDonationRequestsForHospital,
    markRequestAsRead,
} from "../controllers/blood.donation.controllers/donation.request.controller.js"

router.get("/getDonationRequestsForHospital", roleMiddleware("user"), getDonationRequestsForHospital);
router.post("/markRequestAsRead", roleMiddleware("user"), markRequestAsRead);



export default router