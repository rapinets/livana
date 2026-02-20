import express from 'express'
import AuthController from '../controllers/authController.js'
import { signupSchema, loginSchema, validationUser } from '../validators/user/userValidator.js'
const router = express.Router()


router.post('/signup', validationUser(signupSchema), AuthController.signup)
router.post('/login', validationUser(loginSchema), AuthController.login)
router.post('/refresh-token', AuthController.refreshToken)
router.post('/logout', AuthController.logout)

export default router
