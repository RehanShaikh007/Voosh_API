import express from 'express';
import { verifyToken } from '../utils/verifyViewer.js';
import { verifyAdmin } from '../utils/verifyAdmin.js';
import { addUser } from '../controller/adminController.js';

const router = express.Router();

router.post('/add-user', verifyToken, verifyAdmin, addUser);

export default router;