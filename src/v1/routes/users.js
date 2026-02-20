import { Router } from 'express'
import UserController from '../controllers/userController.js';
import UploadManager from '../../../middleware/UploadManager.js'
import { signupSchema, validationUser } from '../validators/user/userValidator.js'
const router = Router()

router.get('/register', UserController.registerForm)
router.post('/register', UploadManager.single('img'), validationUser(signupSchema), UserController.addUser)

export default router
