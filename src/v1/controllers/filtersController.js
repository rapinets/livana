import Product from "../models/product/Product.js";

class FiltersController {
  static async getFirstItem(req, res) {
    try {
      const result = await Product.aggregate([
        { $sort: { createdAt: 1 } },
        { $limit: 1 }
      ])
      
      res.status(200).json({product: result[0], user: req.user})
    } catch (error) {
      res.status(500).json({ error: 'Error fetching products' })
    }
  }
}

export default FiltersController;