import Favorite from "./Favorite.js";
import ProductDbService from "../product/ProductDbService.js";
import MongooseCRUDManager from "../MongooseCRUDManager.js";
import mongoose from "mongoose";
import {populate} from "dotenv";

class FavoriteDBService extends MongooseCRUDManager {
  async getFavoriteDetails(userId) {
    try {
      const favoriteDetails = await Favorite.findOne({ customer: userId })
        .populate({ 
          path: 'customer',
          populate: { path: 'type'}
        })
        .populate({ 
          path: 'productsList.product',
          populate: {
            path: 'category'
          }
        })

      return favoriteDetails
    } catch (err) {
      throw new Error("Error fetching favorite details");
    }
  }

  async addProduct({ userId, productId }) {
    try {
      const favorite = await Favorite.findOne({ customer: userId })
      if (!favorite) {
        throw new Error("Favorite not found");
      }
      // Add product to favorite
      favorite.products.push({ product: productId });
      await favorite.save();
      return favorite;
    } catch (err) {
      throw new Error("Error adding product to favorites");
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