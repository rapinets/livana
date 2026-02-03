import { Router } from 'express'
import UserController from '../controllers/userController.js';
const router = Router()

/* GET users listing. */
router.post('/login', (req, res) => {
  req.session.user = { name: 'Jhon Deer', email: req.body.email }
  res.redirect('/products')
});

export default router
