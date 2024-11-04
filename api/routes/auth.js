import express from 'express';
import { login, register,verifyUser,checkUser } from '../controllers/auth.js';
const router = express.Router();
router.post("/register", register)
router.get('/verify-user', verifyUser);
router.get('/verify/:id', checkUser);

router.post("/login",login)

export default router;