import Product from "./Product.js";
import Category from "../category/Category.js";
import MongooseCRUDManager from "../MongooseCRUDManager.js";

class ProductsDBService extends MongooseCRUDManager {
  static fieldsConfigurations = [
    {
      fieldName: 'name',
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
          
        ]
      )

      return res
    } catch (error) {
      console.error("DB ERROR:", error)
      throw error
    }
  }

  async getProductsFromEachCategory(limit = 4) {
    try {
      // Запитуємо всі категорії
      const categories = await Category.find({});

      // Для кожної категорії отримуємо товари, сортовані за датою (новіші спочатку)
      const result = await Promise.all(
        categories.map(async (category) => {
          const products = await this.model
            .find({ category: category._id })
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();

          return {
            categoryId: category._id,
            categoryName: category.name,
            products,
            count: products.length
          };
        })
      );

      return { categories: result };
    } catch (error) {
      console.error("DB ERROR:", error)
      throw error
    }
  }
}

export default new ProductsDBService(Product)