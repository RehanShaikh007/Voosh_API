import express from 'express';
import { login, logout, signup } from '../controller/userController.js';
import { verifyToken } from '../utils/verifyViewer.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', verifyToken, logout);

export default router;