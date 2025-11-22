import express from "express";
import {
  createWallet,
  getWalletByCustomerId,
  updateWalletBalance,
  deleteWallet
} from "../controllers/walletController.js";

const router = express.Router();

// POST /wallets - Tạo wallet
router.post("/", createWallet);

// PUT /wallets/:id - Cập nhật balance
router.put("/:id", updateWalletBalance);

// GET /wallets/:customer_id - Xem wallet theo customer_id
router.get("/:customer_id", getWalletByCustomerId);

// DELETE /wallets/:id - Xóa wallet
router.delete("/:id", deleteWallet);

export default router;