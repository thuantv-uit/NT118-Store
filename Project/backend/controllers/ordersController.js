import { sql } from "../config/database.js";

// Get Profile for User
export async function getOrderById(req, res) {
  try {
    const orderId = req.params;
    // orderId sẽ trả về dữ liệu dạng mảng { id: '54321' }
    // console.log("orderId:",orderId);
    const id = orderId.id
    // vậy nên phải lấy id từ mảng đó ra chứ không được sử dụng trực tiếp
    // console.log("orderId:",id);

    // Kiểm tra xem orderId có được cung cấp không
    if (!id) {
      return res.status(400).json({ message: "order ID is required" });
    }

    // Thực hiện truy vấn
    const orders = await sql`
      SELECT * FROM "order" WHERE id = ${id}
    `;

    // Kiểm tra xem có bản ghi nào được tìm thấy không
    if (orders.length === 0) {
      return res.status(404).json({ message: "order not found" });
    }

    // Trả về bản ghi đầu tiên (vì id thường là duy nhất)
    res.status(200).json(orders[0]);
  } catch (error) {
    console.error("Error getting the order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createOrder(req, res) {
try {
    const { order_date, payment_id, customer_id, shipment_id, cart_id } = req.body;

    if (!order_date) {
    return res.status(400).json({ message: "All fields are required" });
    }

    const transaction = await sql`
    INSERT INTO "order"(order_date, payment_id, customer_id, shipment_id, cart_id)
    VALUES (${order_date},${payment_id},${customer_id},${shipment_id},${cart_id})
    RETURNING *
    `;

    // To use debug
    // console.log(order);
    res.status(201).json(transaction[0]);
} catch (error) {
    console.log("Error creating the order", error);
    res.status(500).json({ message: "Internal server error" });
    }
}

// Update for order
export async function updateOrder(req, res) {
  try {
    const { id } = req.params; // lấy id từ URL
    const { order_date, total_price } = req.body; // lấy data từ body

    // Kiểm tra input
    if (!id) {
      return res.status(400).json({ message: "Payment ID is required" });
    }

    // Thực hiện update
    const updatedOrder = await sql`
      UPDATE "order"
      SET 
        order_date = ${order_date},
        total_price = ${total_price}
      WHERE id = ${id}
      RETURNING *;
    `;

    // Nếu không có bản ghi nào được cập nhật
    if (updatedOrder.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Trả về dữ liệu sau khi update
    res.status(200).json(updatedOrder[0]);
  } catch (error) {
    console.error("Error updating the order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete order by ID
export async function deleteOrder(req, res) {
  try {
    const { id } = req.params; // Lấy id từ URL

    // Kiểm tra input
    if (!id) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    // Xóa order
    const deletedOrderd = await sql`
      DELETE FROM "order" WHERE id = ${id}
      RETURNING *;
    `;

    // Nếu không có bản ghi nào bị xóa
    if (deletedOrderd.length === 0) {
      return res.status(404).json({ message: "order not found" });
    }

    // Trả về payment đã bị xóa
    res.status(200).json({
      message: "order deleted successfully",
      order: deletedOrderd[0]
    });
  } catch (error) {
    console.error("Error deleting the order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}