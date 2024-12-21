import { Router } from "express";
import {registerUser,login,nearestHospital,nearestPharmacy,getAllHospitals } from '../controllers/user.controller.js'
import {authMiddleware,roleMiddleware} from '../middlewares/auth.middleaware.js'



const router = Router()

router.post('/register', registerUser);
router.post('/login', login);
router.get("/hospitals",roleMiddleware("user"),nearestHospital);
router.get("/pharmacy",roleMiddleware("user"),nearestPharmacy);
router.get("/pharmacy",roleMiddleware("user"),getAllHospitals);
//router.get("/hospitals",nearestHospital);
//router.get("/pharmacy",nearestPharmacy)

export default router