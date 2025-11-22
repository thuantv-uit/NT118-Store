// New file: routes/walletTransactionRoutes.js
import express from "express";
import {
  getWalletTransactionsByCustomerId,
  updateWalletTransactionStatus
} from "../controllers/walletTransactionController.js";

const router = express.Router();

// GET /wallet-transactions/:customer_id - Lấy lịch sử transactions theo customer_id (với pagination optional)
router.get("/:customer_id", getWalletTransactionsByCustomerId);

// PUT /wallet-transactions/:id/status - Cập nhật status của transaction (optional, ví dụ cho pending)
router.put("/:id/status", updateWalletTransactionStatus);

export default router;