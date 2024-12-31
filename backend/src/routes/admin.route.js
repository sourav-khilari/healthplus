import { Router } from "express";
import {
    addUser,
    deleteUser,
    getAllUsers,
    updateUserStatus,
    approveOrDeclineHospital,
    getPendingHospitals,
    getRejectedHospitals,
    getApprovedHospitals,
} from '../controllers/admin.controller.js'
import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleaware.js'

const router = Router();

router.get('/getUser', roleMiddleware("superadmin"), getAllUsers);
router.post('/updateUserStatus', roleMiddleware("superadmin"), updateUserStatus);

router.post('/add-user', roleMiddleware("superadmin"), addUser);
router.delete('/delete-user', roleMiddleware("superadmin"), deleteUser);

router.post('/approveOrDeclineHospital', roleMiddleware("superadmin"), approveOrDeclineHospital);

router.get('/getPendingHospitals', roleMiddleware("superadmin"), getPendingHospitals);
router.get('/getRejectedHospitals', roleMiddleware("superadmin"), getRejectedHospitals);
router.get('/getApprovedHospitals', roleMiddleware("superadmin"), getApprovedHospitals);




export default router
