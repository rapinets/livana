import express from 'express'
import main from './main.js'
import products from './products.js'
import users from './users.js'
import auth from './auth.js'

const router = express.Router()

router.use('/auth', auth)
router.use('/users', users)
router.use('/products', products)
router.use('/', main)

export default router