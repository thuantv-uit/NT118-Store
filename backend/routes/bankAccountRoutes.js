import express from "express";
import {
  createBankAccount,
  getBankAccountsByCustomerId,
  deleteBankAccount
} from "../controllers/bankAccountController.js";

const router = express.Router();

// POST /bank-accounts - Tạo bank account
router.post("/", createBankAccount);

// GET /bank-accounts/:customer_id - Xem list bank accounts theo customer_id
router.get("/:customer_id", getBankAccountsByCustomerId);

// DELETE /bank-accounts/:id - Xóa bank account
router.delete("/:id", deleteBankAccount);

export default router;