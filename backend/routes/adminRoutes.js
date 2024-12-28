import express from 'express';
import { verifyToken } from '../utils/verifyViewer.js';
import { verifyAdmin } from '../utils/verifyAdmin.js';
import { addUser, deleteUser, getUsers, updatePassword } from '../controller/adminController.js';

const router = express.Router();

router.post('/add-user', verifyToken, verifyAdmin, addUser);
router.get('/', verifyToken, verifyAdmin, getUsers);
router.delete('/:id', verifyToken, verifyAdmin, deleteUser);
router.put('/update-password', verifyToken, updatePassword);

export default router;