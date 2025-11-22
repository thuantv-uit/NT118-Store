import { sql } from "../config/database.js";

// Tạo một transaction mới (thường gọi nội bộ từ updateWalletBalance)
export async function createWalletTransaction(walletId, customerId, type, amount, description = '') {
  try {
    const newTransaction = await sql`
      INSERT INTO wallet_transaction (wallet_id, customer_id, type, amount, description)
      VALUES (${walletId}, ${customerId}, ${type}, ${amount}, ${description})
      RETURNING id, wallet_id, customer_id, type, amount, description, status, transaction_date, created_at
    `;
    return newTransaction[0];
  } catch (error) {
    console.error("Error creating wallet transaction:", error);
    throw error; // Re-throw để caller xử lý
  }
}

// Lấy lịch sử transactions theo customer_id (hiển thị cho user)
export async function getWalletTransactionsByCustomerId(req, res) {
  try {
    const { customer_id } = req.params;
    const { limit = 20, offset = 0 } = req.query; // Pagination optional

    if (!customer_id) {
      return res.status(400).json({ message: "Customer ID is required" });
    }

    const transactions = await sql`
      SELECT id, wallet_id, type, amount, description, status, transaction_date, created_at
      FROM wallet_transaction
      WHERE customer_id = ${customer_id}
      ORDER BY transaction_date DESC
      LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}
    `;

    // Optional: Tính tổng balance change (sum amount) cho period, nhưng giữ đơn giản

    res.status(200).json({
      transactions,
      count: transactions.length,
      // Có thể thêm total_pages nếu cần full pagination
    });
  } catch (error) {
    console.error("Error getting wallet transactions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Optional: Update status của transaction (ví dụ nếu pending -> completed)
export async function updateWalletTransactionStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, description } = req.body;
    const { customer_id } = req.body; // Để verify ownership

    if (!id || !status || !customer_id) {
      return res.status(400).json({ message: "ID, status, and customer_id are required" });
    }

    // Check ownership (transaction thuộc customer)
    const existingTransaction = await sql`
      SELECT id FROM wallet_transaction WHERE id = ${id} AND customer_id = ${customer_id}
    `;

    if (existingTransaction.length === 0) {
      return res.status(404).json({ message: "Transaction not found or not owned by customer" });
    }

    const updatedTransaction = await sql`
      UPDATE wallet_transaction
      SET status = ${status}, description = COALESCE(${description}, description)
      WHERE id = ${id} AND customer_id = ${customer_id}
      RETURNING id, type, amount, status, description, transaction_date
    `;

    res.status(200).json(updatedTransaction[0]);
  } catch (error) {
    console.error("Error updating transaction status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}