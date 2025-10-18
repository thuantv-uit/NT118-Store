import express from "express";
import { 
    createCart,
    getCartById,
    updateCart,
    deleteCart,
    getCartsByCustomerId
} from "../controllers/cartsController.js";

const router = express.Router();
router.post("/", createCart);
router.get("/detail/:id", getCartById);
router.put("/:id", updateCart);
router.delete("/:id", deleteCart);
router.get("/:id", getCartsByCustomerId);

export default router;