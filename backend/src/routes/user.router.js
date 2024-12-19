import { Router } from "express";
import {registerUser,login,nearestHospital,nearestPharmacy } from '../controllers/user.controller.js'
import {authMiddleware} from '../middlewares/auth.middleaware.js'



const router = Router()

router.post('/register', registerUser);
router.post('/login', login);
// router.get("/hospital",authMiddleware,nearestHospital);
// router.get("/pharmacy",authMiddleware,nearestPharmacy)
router.get("/hospitals",nearestHospital);
router.get("/pharmacy",nearestPharmacy)

export default router