import { Router } from 'express'
import ProductsController from '../controllers/productsController.js'
import { ProductValidationMiddleware } from '../middleware/productValidationMiddleware.js';
import UploadManager from '../utils/UploadManager.js'
import { ProductValidationSchema } from '../validation/product.schema.js';
const router = Router()

router.get('/', ProductsController.getAllProducts);
router.get('/create', ProductsController.getForm)
router.get('/update/:id', ProductsController.getForm)

router.post('/create', UploadManager.single('photo'), ProductValidationMiddleware(ProductValidationSchema), ProductsController.create)

export default router
