import { sql } from "../config/database.js";
import { createWalletTransaction } from "./walletTransactionController.js";

// Create wallet (tự động init nếu chưa tồn tại cho customer)
export async function createWallet(req, res) {
  try {
    const { customer_id } = req.body;

    if (!customer_id) {
      return res.status(400).json({ message: "Customer ID is required" });
    }

    // Check nếu wallet đã tồn tại
    const existingWallet = await sql`
      SELECT id FROM wallet WHERE customer_id = ${customer_id}
    `;

    if (existingWallet.length > 0) {
      return res.status(400).json({ message: "Wallet already exists for this customer" });
    }

    // Tạo wallet mới với balance = 0
    const newWallet = await sql`
      INSERT INTO wallet (customer_id)
      VALUES (${customer_id})
      RETURNING id, customer_id, balance, created_at, updated_at
    `;

    res.status(201).json(newWallet[0]);
  } catch (error) {
    console.error("Error creating wallet:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get wallet by customer_id
export async function getWalletByCustomerId(req, res) {
  try {
    const { customer_id } = req.params;

    if (!customer_id) {
      return res.status(400).json({ message: "Customer ID is required" });
    }

    const wallet = await sql`
      SELECT id, customer_id, balance, created_at, updated_at
      FROM wallet
      WHERE customer_id = ${customer_id}
    `;

    // ✅ Không có wallet → trả null
    return res.status(200).json(wallet[0] ?? null);
  } catch (error) {
    console.error("Error getting wallet:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Update wallet balance (cộng/trừ amount)
export async function updateWalletBalance(req, res) {
  try {
    const { id } = req.params;
    const { customer_id, amount, description } = req.body;  // amount >0 cộng, <0 trừ; description optional

    if (!id || !customer_id || amount === undefined) {
      return res.status(400).json({ message: "ID, customer_id, and amount are required" });
    }

    // Check ownership
    const existingWallet = await sql`
      SELECT id, balance FROM wallet WHERE id = ${id} AND customer_id = ${customer_id}
    `;

    if (existingWallet.length === 0) {
      return res.status(404).json({ message: "Wallet not found or not owned by customer" });
    }

    // Update balance
    const currentBalance = parseFloat(existingWallet[0].balance);
    const newBalance = currentBalance + parseFloat(amount);
    if (newBalance < 0) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const updatedWallet = await sql`
      UPDATE wallet
      SET balance = ${newBalance}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id} AND customer_id = ${customer_id}
      RETURNING id, customer_id, balance, created_at, updated_at
    `;

    // Tạo transaction record sau khi update thành công
    const transactionType = amount > 0 ? 'deposit' : 'withdraw';
    const transactionDescription = description || (amount > 0 ? 'Nạp tiền vào ví' : 'Rút tiền từ ví');
    await createWalletTransaction(
      existingWallet[0].id, // wallet_id
      customer_id,
      transactionType,
      parseFloat(amount), // Giữ sign để phân biệt
      transactionDescription
    );

    res.status(200).json(updatedWallet[0]);
  } catch (error) {
    console.error("Error updating wallet:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


// Delete wallet by ID (check ownership)
export async function deleteWallet(req, res) {
  try {
    const { id } = req.params;
    const { customer_id } = req.body;  // Cần customer_id để check ownership

    if (!id || !customer_id) {
      return res.status(400).json({ message: "ID and customer_id are required" });
    }

    const deletedWallet = await sql`
      DELETE FROM wallet
      WHERE id = ${id} AND customer_id = ${customer_id}
      RETURNING id, customer_id, balance
    `;

    if (deletedWallet.length === 0) {
      return res.status(404).json({ message: "Wallet not found or not owned by customer" });
    }

    res.status(200).json({
      message: "Wallet deleted successfully",
      wallet: deletedWallet[0]
    });
  } catch (error) {
    console.error("Error deleting wallet:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}