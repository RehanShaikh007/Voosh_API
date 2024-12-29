import express from 'express';
import { verifyToken } from '../utils/verifyViewer.js';
import { addFavorite, getFavorite, removeFavorite } from '../controller/favoriteController.js';


const router = express.Router();

router.post('/add-favorite', verifyToken, addFavorite);
router.get('/:category', verifyToken, getFavorite);
router.delete('/remove-favorite/:favorite_id', verifyToken, removeFavorite);

export default router;