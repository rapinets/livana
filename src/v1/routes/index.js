import express from 'express'
import products from './products.js'
import users from './users.js'
import auth from './auth.js'

const router = express.Router()

router.use('/auth', auth)
router.use('/users', users)
router.use('/products', products)

export default router