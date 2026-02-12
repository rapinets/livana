import express from 'express'
import AuthController from '../controllers/authController.js'

// readme.md зайдіть

const router = express.Router()

router.get('/login', AuthController.loginForm)
router.post('/login', AuthController.login)
router.get('/logout', AuthController.logout)

export default router
