import ProductsDBService from "../models/product/ProductsDBService.js"

class MainController {
  static async getList(req, res) {
    try {
      const products = await ProductsDBService.getList()
      res.render('index', {
        title: 'Livana',
        products
      })

    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }
}

export default MainController