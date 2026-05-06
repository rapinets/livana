import { Router } from 'express'
import ProductsController from '../controllers/productsController.js'
import { productSchema, validateProduct } from '../validators/product/productValidator.js'
import UploadManager from '../../../middleware/UploadManager.js'
import { authenticate, requireRole } from '../../../middleware/auth.js'


const router = Router()

router.get('/', ProductsController.getAllProducts);
router.get('/by-category', ProductsController.getProductsByCategory);
router.get('/by-category-id', ProductsController.getProductsByCategoryId);
router.get('/create', ProductsController.getForm)
router.get('/update/:id', ProductsController.getForm)
router.get('/:id', ProductsController.getById)

router.post('/create', authenticate, requireRole('admin'), UploadManager.single('photo'), validateProduct(productSchema), ProductsController.create)

export default router
