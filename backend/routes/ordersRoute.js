import express from "express";
import { 
    createOrder,
    getOrderById,
    updateOrder,
    deleteOrder,
    getOrdersByUserId
} from "../controllers/ordersController.js";

const router = express.Router();
router.post("/", createOrder);
router.get("/:id", getOrderById);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);
router.get("/user/:userId", getOrdersByUserId);

export default router;