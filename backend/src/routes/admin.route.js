import { Router } from "express";
import {addUser,deleteUser } from '../controllers/admin.controller.js'
import {authMiddleware} from '../middlewares/auth.middleaware.js'

const router =Router();

router.post('/add-user', addUser); 
router.delete('/delete-user', deleteUser);

export default router
