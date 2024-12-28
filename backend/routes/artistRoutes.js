import express from 'express';
import { verifyEditor } from '../utils/verifyEditor.js';
import { verifyToken } from '../utils/verifyViewer.js';
import { addArtist, deleteArtist, getAllArtists, getArtistById, updateArtist } from '../controller/artistController.js';
import { verifyAdmin } from '../utils/verifyAdmin.js';

const router = express.Router();

router.post('/add-artist', verifyToken, verifyAdmin, addArtist);
router.get('/', verifyToken, getAllArtists);
router.get('/:id', verifyToken, getArtistById);
router.put('/:id', verifyToken, verifyEditor, updateArtist);
router.delete('/:id', verifyToken, verifyEditor, deleteArtist);

export default router;