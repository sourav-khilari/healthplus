import { Router } from "express";
import {
    registerUser,
    loginUser,
    nearestHospital,
    nearestPharmacy,
    getAllHospitals,
    bookAppointment, 
    getAvailableSlots,
    deleteAppointment,
    updateAppointment,
    getAllDoctors,
    sendOtpForPatientId,
    verifyOtpAndFetchData,
    createPatientId,
    getCurrentUser,
    logoutUser,
    } from '../controllers/user.controller.js'
import {authMiddleware,roleMiddleware} from '../middlewares/auth.middleaware.js'



const router = Router()

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get("/hospitals",roleMiddleware("user"),nearestHospital);
router.get("/pharmacy",roleMiddleware("user"),nearestPharmacy);
router.get("/pharmacy",roleMiddleware("user"),getAllHospitals);
router.get("/getCurrentUser",roleMiddleware("user"),getCurrentUser);
router.get("/logoutUser",roleMiddleware("user"),logoutUser)

router.get("/getAllDoctors",getAllDoctors);


//router.get("/getAvailableSlots",getAvailableSlots);
router.get('/getAvailableSlots/:doctorId/:date',roleMiddleware("user"), getAvailableSlots);


router.post('/bookAppointment',roleMiddleware("user"), bookAppointment);
router.put('/updateAppointment/:appointmentId',roleMiddleware("user"), updateAppointment);
router.delete('/deleteAppointment/:appointmentId',roleMiddleware("user"), deleteAppointment);

router.post('/send-otp',roleMiddleware("user"), sendOtpForPatientId); // Send OTP when patient ID is entered
router.post('/verify-otp',roleMiddleware("user"), verifyOtpAndFetchData); // Verify OTP and fetch patient data
router.post('/create-patient-id',roleMiddleware("user"), createPatientId); 

export default router