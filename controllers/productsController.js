import ProductsDBService from "../models/product/ProductsDBService.js"

class ProductsController {
  static async getList(req, res) {
    try {
      const sort = {}
      if (req.session.user) {
        sort.price = 1
        req.session = null
      }
      if (req.cookies.sort) {
        sort.price = Number(req.cookies.sort)
      }

      const products = await ProductsDBService.getList({}, sort)
      res.render('products/list', {
        title: 'Products List',
        products
      })

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