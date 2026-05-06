import CategoriesDBService from "../models/category/CategoriesDBService";

class CategoryController {
  static async getAllCategories(req, res) {
    try {
      const categories = await CategoriesDBService.getList()
      res.status(200).json({
        categories,
        user: req.user,
      })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }

}

export default CategoryController;