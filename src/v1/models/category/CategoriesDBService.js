import MongooseCRUDManager from "../MongooseCRUDManager";
import Category from "./Category.js";

class CategoriesDBService extends MongooseCRUDManager {
  async getList() {
    try {
      const categories = await Category.find({}).lean()
      return {
        documents: categories,
        count: categories.length,
      }
    } catch (error) {
      console.error("DB ERROR:", error)
      throw error
    }
  }
}

export default CategoriesDBService;