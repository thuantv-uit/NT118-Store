import express from "express";
import { 
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct
} from "../controllers/productsController.js";

const router = express.Router();
router.post("/", createProduct);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;