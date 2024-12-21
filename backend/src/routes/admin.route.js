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

router.get('/getUser', roleMiddleware("admin"), getAllUsers);
router.post('/updateUserStatus', roleMiddleware("admin"), updateUserStatus);

router.post('/add-user', roleMiddleware("admin"), addUser);
router.delete('/delete-user', roleMiddleware("admin"), deleteUser);

router.post('/approveOrDeclineHospital', roleMiddleware("admin"), approveOrDeclineHospital);

router.get('/getPendingHospitals', roleMiddleware("admin"), getPendingHospitals);
router.get('/getRejectedHospitals', roleMiddleware("admin"), getRejectedHospitals);
router.get('/getApprovedHospitals', roleMiddleware("admin"), getApprovedHospitals);

export default router
