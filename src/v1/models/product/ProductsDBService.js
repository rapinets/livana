import Product from "./Product.js";
import MongooseCRUDManager from "../MongooseCRUDManager.js";

class ProductsDBService extends MongooseCRUDManager {
  async getList(filters = {}) {
    try {
      const res = await super.getList(filters, null, [])
      return res
    } catch (error) {
      return []
    }
  }
}

export default new ProductsDBService(Product)