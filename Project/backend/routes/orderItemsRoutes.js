import express from "express";
import { 
    createOrderItem,
    getOrderItemById,
    updateOrderItem,
    deleteOrderItem
} from "../controllers/oderItemsController.js";

const router = express.Router();
router.post("/", createOrderItem);
router.get("/:id", getOrderItemById);
router.put("/:id", updateOrderItem);
router.delete("/:id", deleteOrderItem);

export default router;