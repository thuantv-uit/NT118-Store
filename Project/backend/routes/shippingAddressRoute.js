import express from "express";
import {
    getShippingAddressesByCustomer,
    createShippingAddress,
    deleteShippingAddress
} from "../controllers/shippingAddressController.js";

const router = express.Router();

// GET: Lấy danh sách địa chỉ theo customer_id
router.get("/:customer_id", getShippingAddressesByCustomer);

// POST: Tạo địa chỉ mới
router.post("/", createShippingAddress);

// DELETE: Xóa địa chỉ theo id
router.delete("/:id", deleteShippingAddress);

export default router;