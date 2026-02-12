import { Router } from 'express'
import MainController from '../controllers/mainController.js';
const router = Router()

/* GET home page. */
router.get('/', MainController.getList);

router.get('/test-session', (req, res) => {
  req.session.test = 'working'
  res.send('session set')
})

export default router
