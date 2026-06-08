import express from 'express'
import products from './products.js'
import users from './users.js'
import auth from './auth.js'
import cart from './cart.js'

const router = express.Router()

router.use('/auth', auth)
router.use('/users', users)
router.use('/products', products)
router.use('/cart', cart)

export default router