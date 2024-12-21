import { Router } from "express";
import { registerHospital,loginHospital,} from '../controllers/hospital.controller.js'
import {authMiddleware,roleMiddleware} from '../middlewares/auth.middleaware.js'



const router = Router()

router.post('/register', registerHospital);
router.post('/login', loginHospital);

//router.get("/hospitals",nearestHospital);
//router.get("/pharmacy",nearestPharmacy)

export default router