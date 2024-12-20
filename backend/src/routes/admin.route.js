import { Router } from "express";
import {addUser,deleteUser } from '../controllers/admin.controller.js'
import {authMiddleware} from '../middlewares/auth.middleaware.js'

const router =Router();

router.post('/add-user', addUser); // Admin can add users
router.delete('/delete-user', deleteUser); // Admin can delete users

export default router
