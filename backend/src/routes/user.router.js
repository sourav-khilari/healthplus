import { Router } from "express";
import {
    registerUser,
    login,
    nearestHospital,
    nearestPharmacy,
    getAllHospitals,
    bookAppointment, 
    getAvailableSlots,
    deleteAppointment,
    updateAppointment,
    getAllDoctors
    } from '../controllers/user.controller.js'
import {authMiddleware,roleMiddleware} from '../middlewares/auth.middleaware.js'



const router = Router()

router.post('/register', registerUser);
router.post('/login', login);
router.get("/hospitals",roleMiddleware("user"),nearestHospital);
router.get("/pharmacy",roleMiddleware("user"),nearestPharmacy);
router.get("/pharmacy",roleMiddleware("user"),getAllHospitals);
//router.get("/hospitals",nearestHospital);
//router.get("/pharmacy",nearestPharmacy)

router.get("/getAllDoctors",getAllDoctors);


//router.get("/getAvailableSlots",getAvailableSlots);
router.get('/getAvailableSlots/:doctorId/:date',roleMiddleware("user"), getAvailableSlots);


router.post('/bookAppointment',roleMiddleware("user"), bookAppointment);
router.put('/updateAppointment/:appointmentId',roleMiddleware("user"), updateAppointment);
router.delete('/deleteAppointment/:appointmentId',roleMiddleware("user"), deleteAppointment);



export default router