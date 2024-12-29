import express from 'express';
import { verifyToken } from '../utils/verifyViewer.js';
import { verifyAdmin } from '../utils/verifyAdmin.js';
import { addTrack, allTracks, getTrackById } from '../controller/trackController.js';

const router = express.Router();

router.post('/add-track', verifyToken, verifyAdmin, addTrack);
router.get('/', verifyToken, allTracks);
router.get('/:id', verifyToken, getTrackById);

export default router;