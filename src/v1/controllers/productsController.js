import ProductsDBService from "../models/product/ProductsDBService.js"
import {isValidObjectId} from '../validators/helpers.js'
import {sanitizeProductInput} from '../validators/product/productSanitize.js'
import {buildProductFilter} from '../validators/product/productFilter.js'

class ProductsController {
  // Метод для отримання всіх товарів
  static async getAllProducts(req, res) {
    try {
      // Санітизація і валідація фільтрів
      const filters = buildProductFilter(req.query)
      const productsList = await ProductsDBService.getList(filters)
      res.status(200).json({
        products: productsList,
        user: req.user,
      })
    } catch (error) {
      res.status(500).json({ error: 'Error fetching products' })
    }
  }

  static async getForm(req, res) {
     try {
      const id = req.params.id
      let product = null
      if (id) {
        if (!isValidObjectId(id)) {
          return res.status(400).json({ error: 'Invalid id' })
        }
        product = await ProductsDBService.getById(id)
      }

      res.status(200).json({
        product,
        user: req.user,
      })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }

  static async create(req, res) {
    const data = req.validated
    try {
      const sanitizedData = sanitizeProductInput(data)
      await ProductsDBService.create(sanitizedData)
      res.status(200).json({ message: 'Product created successfully' })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }

  static async update(req, res) {
    const id = req.params.id
    const data = req.validated
    try {
      const sanitizedData = sanitizeProductInput(data)
      await ProductsDBService.update(id, sanitizedData)
      res.status(200).json({ message: 'Product updated successfully' })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }

  static async delete(req, res) {
    const id = req.params.id
    try {
      await ProductsDBService.delete(id)
      res.status(200).json({ message: 'Product deleted successfully' })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }
}

export default ProductsController