import { sql } from "../config/database.js";

// Get Profile for User
export async function getPaymentById(req, res) {
  try {
    const paymentId = req.params;
    // paymentId sẽ trả về dữ liệu dạng mảng { id: '54321' }
    // console.log("paymentId:",paymentId);
    const id = paymentId.id
    // vậy nên phải lấy id từ mảng đó ra chứ không được sử dụng trực tiếp
    // console.log("paymentId:",id);

    // Kiểm tra xem paymentId có được cung cấp không
    if (!id) {
      return res.status(400).json({ message: "payment ID is required" });
    }

    // Thực hiện truy vấn
    const payment = await sql`
      SELECT * FROM payment WHERE id = ${id}
    `;

    // Kiểm tra xem có bản ghi nào được tìm thấy không
    if (payment.length === 0) {
      return res.status(404).json({ message: "payment not found" });
    }

    // Trả về bản ghi đầu tiên (vì id thường là duy nhất)
    res.status(200).json(payment[0]);
  } catch (error) {
    console.error("Error getting the payment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createPayment(req, res) {
try {
    const { payment_date, payment_method, amount, customer_id } = req.body;

    if (!payment_date || !amount || !payment_method) {
    return res.status(400).json({ message: "All fields are required" });
    }

    const transaction = await sql`
    INSERT INTO payment(payment_date, amount, payment_method, customer_id)
    VALUES (${payment_date},${amount},${payment_method},${customer_id})
    RETURNING *
    `;

    // To use debug
    // console.log(payment);
    res.status(201).json(transaction[0]);
} catch (error) {
    console.log("Error creating the transaction", error);
    res.status(500).json({ message: "Internal server error" });
    }
}

// Update profile for user
export async function updatePayment(req, res) {
  try {
    const { id } = req.params; // lấy id từ URL
    const { payment_date, payment_method, amount } = req.body; // lấy data từ body

    // Kiểm tra input
    if (!id) {
      return res.status(400).json({ message: "Payment ID is required" });
    }

    // Thực hiện update
    const updatedCustomer = await sql`
      UPDATE payment
      SET 
        payment_date = ${payment_date},
        payment_method = ${payment_method},
        amount = ${amount}
      WHERE id = ${id}
      RETURNING *;
    `;

    // Nếu không có bản ghi nào được cập nhật
    if (updatedCustomer.length === 0) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // Trả về dữ liệu sau khi update
    res.status(200).json(updatedCustomer[0]);
  } catch (error) {
    console.error("Error updating the payment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete payment by ID
export async function deletePayment(req, res) {
  try {
    const { id } = req.params; // Lấy id từ URL

    // Kiểm tra input
    if (!id) {
      return res.status(400).json({ message: "Payment ID is required" });
    }

    // Xóa payment
    const deletedPayment = await sql`
      DELETE FROM payment WHERE id = ${id}
      RETURNING *;
    `;

    // Nếu không có bản ghi nào bị xóa
    if (deletedPayment.length === 0) {
      return res.status(404).json({ message: "payment not found" });
    }

    // Trả về payment đã bị xóa
    res.status(200).json({
      message: "payment deleted successfully",
      payment: deletedPayment[0]
    });
  } catch (error) {
    console.error("Error deleting the payment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}