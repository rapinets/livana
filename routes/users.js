import { Router } from 'express'
import UserController from '../controllers/userController.js';
import UploadsManager from '../utils/UploadManager.js'
import { UserValidationSchema } from '../validation/user.schema.js';
import { UserValidationMiddleware } from '../middleware/userValidationMiddleware.js'
const router = Router()

router.get('/register', UserController.registerForm)
router.post('/register', UploadsManager.single('img'), UserValidationMiddleware(UserValidationSchema), UserController.addUser)

export default router
