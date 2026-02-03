import { Router } from 'express'
import MainController from '../controllers/mainController.js';
const router = Router()

/* GET home page. */
router.get('/', MainController.getList);

export default router
