import express from 'express';
import { verifyToken } from '../utils/verifyViewer.js';
import { verifyAdmin } from '../utils/verifyAdmin.js';
import { verifyEditor } from '../utils/verifyEditor.js';
import { addTrack, allTracks, deleteTrack, getTrackById, updateTrack } from '../controller/trackController.js';

const router = express.Router();

router.post('/add-track', verifyToken, verifyAdmin, addTrack);
router.get('/', verifyToken, allTracks);
router.get('/:id', verifyToken, getTrackById);
router.put('/:id', verifyToken, verifyEditor, updateTrack);
router.delete('/:id', verifyToken, verifyEditor, deleteTrack);

export default router;