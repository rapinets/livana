import express from 'express';
import FavoriteController from '../controllers/favoriteController.js';

const router = express.Router();

router.get('/', FavoriteController.getFavoriteDetails);
router.post('/products', FavoriteController.addProduct);
router.delete('/products', FavoriteController.removeProduct);

export default router;