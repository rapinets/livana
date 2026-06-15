import FavoriteDBService from "../models/favorite/FavoriteDBService.js";
import ProductsDBService from "../models/product/ProductsDBService.js";

class FavoriteController {
  static async getFavoriteDetails(req, res) {
    try {
      if (!req.user) {
        return res.status(403).json({ error: "Access denied" });
      }
      const userId = req.user.id; // Отримання id користувача
      const favoriteDetails = await FavoriteDBService.getFavoriteDetails(userId);
      return res.status(200).json({data: favoriteDetails, user: req.user});
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async addProduct(req, res) {
    try {
      if (!req.user) {
        return res.status(403).json({ error: "Access denied" });
      }
      const userId = req.user.id; // Отримання id користувача
      const { productId } = req.body; // Отримання id продукту
      const product = await ProductsDBService.getById(productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      const favorite = await FavoriteDBService.addProduct({ userId, productId });
      return res.status(200).json({ message: 'Product added successfully' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async removeProduct(req, res) {
    try {
      if (!req.user) {
        return res.status(403).json({ error: "Access denied" });
      }
      const userId = req.user.id; // Отримання id користувача
      const { id } = req.body; // Отримання id продукту
      const favorite = await FavoriteDBService.removeProduct({ userId, productId: id });
      return res.status(200).json({ message: 'Product removed successfully' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
}

export default FavoriteController;