import express from "express";
import { 
    createCategory,
    getCategoryById,
    
    getChildrenCategories, 
    updateCategory,
    getAllCategories,
    deleteCategory
} from "../controllers/categoriesController.js";

const router = express.Router();
router.post("/", createCategory);
router.get("/", getAllCategories);
router.get("/children/:id", getChildrenCategories);
router.get("/:id", getCategoryById);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;