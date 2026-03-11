import express from 'express'
import AuthController from '../controllers/authController.js'
import { signupSchema, loginSchema, validationUser } from '../validators/user/userValidator.js'
const router = express.Router()

router.post('/signup', validationUser(signupSchema, { addType: true }), AuthController.signup)
router.post('/login', validationUser(loginSchema, { addType: false }), AuthController.login)
router.post('/refresh', AuthController.refreshToken)
router.post('/logout', AuthController.logout)

export default router


