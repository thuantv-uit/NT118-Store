import express from "express";
import {
  createOrderStatus,
  getOrderStatusById,
  getOrderStatusByOrderId,
  getOrderStatusBySellerId,
  getOrderStatusByBuyerId,
  updateOrderStatus,
  deleteOrderStatus
} from "../controllers/orderStatusController.js";

const router = express.Router();

// POST /order-status - Tạo order_status mới
router.post("/", createOrderStatus);

// GET /order-status/:id - Lấy theo ID
router.get("/:id", getOrderStatusById);

// GET /order-status/order/:order_id - Lấy theo order_id
router.get("/order/:order_id", getOrderStatusByOrderId);

// GET /order-status/seller/:seller_id - Lấy theo seller_id (mới thêm)
router.get("/seller/:seller_id", getOrderStatusBySellerId);

// GET /order-status/buyer/:buyer_id - Lấy theo buyer_id (mới thêm)
router.get("/buyer/:buyer_id", getOrderStatusByBuyerId);

// PUT /order-status/:id - Cập nhật status
router.put("/:id", updateOrderStatus);

// DELETE /order-status/:id - Xóa
router.delete("/:id", deleteOrderStatus);

export default router;