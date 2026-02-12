import Product from "./Product.js";
import MongooseCRUDManager from "../MongooseCRUDManager.js";

class ProductsDBService extends MongooseCRUDManager {
  async getList(filters = {}, sort = {}) {
    try {
      const res = await super.getList(filters, null, [], sort)
      return res
    } catch (error) {
      return []
    }
  }
}

export default new ProductsDBService(Product)