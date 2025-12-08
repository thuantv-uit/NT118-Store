import express from "express";
import {
  createOrderStatus,
  getOrderStatusById,
  getOrderStatusByOrderId,
  getOrderStatusBySellerId,
  getOrderStatusByBuyerId,
  getOrderStatusByShipperId,
  getOrderSummaryByBuyerId,
  getOrderSummaryBySellerId,
  getOrderSummaryByShipperId,
  getOrderStatusGroupedByStatusForSeller,
  getOrderStatusGroupedByStatusForBuyer,
  getPendingOrdersBySellerId,
  getOtherOrdersBySellerId,
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

// GET /order-status/seller/:seller_id - Lấy theo seller_id
router.get("/seller/:seller_id", getOrderStatusBySellerId);

// GET /order-status/buyer/:buyer_id - Lấy theo buyer_id
router.get("/buyer/:buyer_id", getOrderStatusByBuyerId);

// GET /order-status/shipper/:shipper_id - Lấy theo shipper_id
router.get("/shipper/:shipper_id", getOrderStatusByShipperId);

// MỚI THÊM: GET /order-status/summary/buyer/:buyer_id - Tóm tắt đơn hàng cho buyer (số lượng và tổng tiền)
router.get("/summary/buyer/:buyer_id", getOrderSummaryByBuyerId);

// MỚI THÊM: GET /order-status/summary/seller/:seller_id - Tóm tắt đơn hàng cho seller (số lượng và tổng tiền)
router.get("/summary/seller/:seller_id", getOrderSummaryBySellerId);

// MỚI THÊM: GET /order-status/summary/shipper/:shipper_id - Tóm tắt đơn hàng cho shipper (chỉ số lượng)
router.get("/summary/shipper/:shipper_id", getOrderSummaryByShipperId);

// MỚI THÊM: GET /order-status/summary/seller/:seller_id/status - Phân loại đơn hàng theo status cho seller
router.get("/summary/seller/:seller_id/status", getOrderStatusGroupedByStatusForSeller);

// MỚI THÊM: GET /order-status/summary/buyer/:buyer_id/status - Phân loại đơn hàng theo status cho buyer
router.get("/summary/buyer/:buyer_id/status", getOrderStatusGroupedByStatusForBuyer);

// MỚI THÊM: GET /order-status/seller/:seller_id/pending - Lấy chỉ pending orders của seller
router.get("/seller/:seller_id/pending", getPendingOrdersBySellerId);

// MỚI THÊM: GET /order-status/seller/:seller_id/other - Lấy các orders khác (không pending) của seller
router.get("/seller/:seller_id/other", getOtherOrdersBySellerId);

// PUT /order-status/:id - Cập nhật status (và location nếu gửi)
router.put("/:id", updateOrderStatus);

// PUT /order-status/:id/location - Route mới: Cập nhật vị trí hiện tại (dành cho người giao hàng)
router.put("/:id/location", updateOrderStatus);  // Reuse controller, chỉ cần gửi current_location trong body

// DELETE /order-status/:id - Xóa
router.delete("/:id", deleteOrderStatus);

export default router;