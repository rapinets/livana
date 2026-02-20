import { Router } from 'express'
import ProductsController from '../controllers/productsController.js'
import { productSchema, validateProduct } from '../validators/product/productValidator.js'
import UploadManager from '../../../middleware/UploadManager.js'

const router = Router()

router.get('/', ProductsController.getAllProducts);
router.get('/create', ProductsController.getForm)
router.get('/update/:id', ProductsController.getForm)

router.post('/create', UploadManager.single('photo'), validateProduct(productSchema), ProductsController.create)

export default router
