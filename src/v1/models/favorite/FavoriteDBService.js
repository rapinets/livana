import Favorite from "./Favorite.js";
import MongooseCRUDManager from "../MongooseCRUDManager.js";
import mongoose from "mongoose";

class FavoriteDBService extends MongooseCRUDManager {
  async getFavoriteDetails(userId) {
    try {
      const favoriteDetails = await Favorite.findOne({ customer: userId })
        .populate({ 
          path: 'customer',
          populate: { path: 'type'}
        })
        .populate({ 
          path: 'products.product',
          populate: {
            path: 'category'
          }
        })

      return favoriteDetails
    } catch (err) {
      throw new Error("Error fetching favorite details: " + err.message);
    }
  }

  async addProduct({ userId, productId }) {
    try {
      return await Favorite.findOneAndUpdate(
        { customer: userId },
        { $addToSet: { products: [{ product: productId }] } },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
    } catch (err) {
      throw new Error("Error adding product to favorites: " + err.message);
    }
  }

  async removeProduct({ userId, productId }) {
    try {
      return await Favorite.findOneAndUpdate(
        { customer: userId },
        { $pull: { products: { product: productId } } },
        { new: true }
      );
    } catch (err) {
      throw new Error("Error removing product from favorites");
    }
  }
}

export default new FavoriteDBService(Favorite);