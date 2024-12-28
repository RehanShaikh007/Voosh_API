import express from 'express';
import { verifyEditor } from '../utils/verifyEditor.js';
import { verifyToken } from '../utils/verifyViewer.js';
import { addArtist, getAllArtists, getArtistById } from '../controller/artistController.js';
import { verifyAdmin } from '../utils/verifyAdmin.js';

const router = express.Router();

router.post('/add-artist', verifyToken, verifyAdmin, addArtist);
router.get('/', verifyToken, getAllArtists);
router.get('/:id', verifyToken, getArtistById);

export default router;