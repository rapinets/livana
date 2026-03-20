import Product from "./Product.js";
import MongooseCRUDManager from "../MongooseCRUDManager.js";

class ProductsDBService extends MongooseCRUDManager {
  static fieldsConfigurations = [
    {
      fieldName: 'title',
      filterCategory: 'search',
    },
    {
      fieldName: 'price',
      filterCategory: 'range',
    },
  ]

 async getList(reqQuery) {
    try {
      const res = await this.findManyWithSearchOptions(
        reqQuery,
        ProductsDBService.fieldsConfigurations,
        null,
        [
          {
            fieldForPopulation: {},
          },
        ]
      )

      return res
    } catch (error) {
      return []
    }
  }

}

export default new ProductsDBService(Product)