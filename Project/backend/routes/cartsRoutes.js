import express from "express";
import { 
    createCart,
    getCartById,
    updateCart,
    deleteCart
} from "../controllers/cartsController.js";

const router = express.Router();
router.post("/", createCart);
router.get("/:id", getCartById);
router.put("/:id", updateCart);
router.delete("/:id", deleteCart);

export default router;