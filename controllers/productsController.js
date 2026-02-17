import ProductsDBService from "../models/product/ProductsDBService.js"

class ProductsController {
  static async getAllProducts(req, res) {
    try {
      const products = await ProductsDBService.getList({}, sort)
      res.status(200).json(products)

    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }

  static async getForm(req, res) {
    try {
      const { id } = req.params
      let product = {}

      if (id) {
        product = await ProductsDBService.getById(id)
      }
      res.render('products/form', {
        title: 'Product Form',
        product,
        errors: {}
      })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }

  static async create(req, res) {
    try {

      const data = req.validationData

      await ProductsDBService.create(data)
      res.redirect('/products')
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }
}

export default ProductsController