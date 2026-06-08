import express from "express";
import CartController from "../controllers/cartController.js";

const router = express.Router();

router.get("/", CartController.getCartDetails);
router.post("/", CartController.addProduct);
router.put("/", CartController.updateProductAmount);

export default router
