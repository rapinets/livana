import FavoriteDbService from "../models/favorite/FavoriteDbService";
import ProductDbService from "../models/product/ProductDbService";

class FavoriteController {
  static async getFavoriteDetails(req, res) {
    try {
      if (!req.user) {
        return res.status(403).json({ error: "Access denied" });
      }
      const userId = req.user.id; // Отримання id користувача
      const favoriteDetails = await FavoriteDbService.getFavoriteDetails(userId);
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
      const product = await ProductDbService.getById(productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      const favorite = await FavoriteDbService.addProduct({ userId, productId });
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
      const favorite = await FavoriteDbService.removeProduct({ userId, productId: id });
      return res.status(200).json({ message: 'Product removed successfully' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
}