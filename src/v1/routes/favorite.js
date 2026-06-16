import express from 'express';
import FavoriteController from '../controllers/favoriteController.js';

const router = express.Router();

router.get('/', FavoriteController.getFavoriteDetails);
router.post('/', FavoriteController.addProduct);
router.delete('/', FavoriteController.removeProduct);

export default router;