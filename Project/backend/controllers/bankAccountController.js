import { sql } from "../config/database.js";

// Create bank account
export async function createBankAccount(req, res) {
  try {
    const { customer_id, bank_name, card_number, is_default = false } = req.body;

    if (!customer_id || !bank_name || !card_number) {
      return res.status(400).json({ message: "customer_id, bank_name, and card_number are required" });
    }

    // Nếu set is_default = true, unset các default khác của customer
    if (is_default) {
      await sql`
        UPDATE bank_account SET is_default = FALSE WHERE customer_id = ${customer_id}
      `;
    }

    const newBankAccount = await sql`
      INSERT INTO bank_account (customer_id, bank_name, card_number, is_default)
      VALUES (${customer_id}, ${bank_name}, ${card_number}, ${is_default})
      RETURNING id, customer_id, bank_name, card_number, is_default, created_at
    `;

    res.status(201).json(newBankAccount[0]);
  } catch (error) {
    console.error("Error creating bank account:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get bank accounts by customer_id
export async function getBankAccountsByCustomerId(req, res) {
  try {
    const { customer_id } = req.params;

    if (!customer_id) {
      return res.status(400).json({ message: "Customer ID is required" });
    }

    const bankAccounts = await sql`
      SELECT id, customer_id, bank_name, card_number, is_default, created_at
      FROM bank_account
      WHERE customer_id = ${customer_id}
      ORDER BY is_default DESC, created_at DESC
    `;

    res.status(200).json(bankAccounts);
  } catch (error) {
    console.error("Error getting bank accounts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete bank account by ID (check ownership)
export async function deleteBankAccount(req, res) {
  try {
    const { id } = req.params;
    const { customer_id } = req.body;  // Cần customer_id để check ownership

    if (!id || !customer_id) {
      return res.status(400).json({ message: "ID and customer_id are required" });
    }

    const deletedBankAccount = await sql`
      DELETE FROM bank_account
      WHERE id = ${id} AND customer_id = ${customer_id}
      RETURNING id, bank_name, card_number
    `;

    if (deletedBankAccount.length === 0) {
      return res.status(404).json({ message: "Bank account not found or not owned by customer" });
    }

    res.status(200).json({
      message: "Bank account deleted successfully",
      bank_account: deletedBankAccount[0]
    });
  } catch (error) {
    console.error("Error deleting bank account:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}