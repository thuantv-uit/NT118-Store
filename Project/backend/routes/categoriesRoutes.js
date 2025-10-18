import express from "express";
import { 
    createCategory,
    getCategoryById,
    updateCategory,
    deleteCategory
} from "../controllers/categoriesController.js";

const router = express.Router();
router.post("/", createCategory);
router.get("/:id", getCategoryById);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;