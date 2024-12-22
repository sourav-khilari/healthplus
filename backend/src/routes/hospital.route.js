import { Router } from "express";
import { registerHospital,loginHospital,addDoctor} from '../controllers/hospital.controller.js'
import {authMiddleware,roleMiddleware} from '../middlewares/auth.middleaware.js'



const router = Router()

router.post('/register', registerHospital);
router.post('/login', loginHospital);

router.post('/addDoctor', addDoctor);


export default router