import { Router } from "express";
import { registerHospital,loginHospital,} from '../controllers/hospital.controller.js'
import {authMiddleware,roleMiddleware} from '../middlewares/auth.middleaware.js'



const router = Router()

router.post('/register', registerHospital);
router.post('/login', loginHospital);



export default router