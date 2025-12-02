import express from "express";
import { 
    createOrderItem,
    getOrderItemById,
    updateOrderItem,
    deleteOrderItem,
    getOrderItemsByOrderId
} from "../controllers/oderItemsController.js";

const router = express.Router();
router.post("/", createOrderItem);
router.get("/:id", getOrderItemById);
router.put("/:id", updateOrderItem);
router.delete("/:id", deleteOrderItem);
router.get("/order/:order_id", getOrderItemsByOrderId);

export default router;