import { sql } from "../config/database.js";

// Get for OrderItem
export async function getOrderItemById(req, res) {
  try {
    const orderItemId = req.params;
    // orderItemId sẽ trả về dữ liệu dạng mảng { id: '54321' }
    // console.log("orderItemId:",orderItemId);
    const id = orderItemId.id
    // vậy nên phải lấy id từ mảng đó ra chứ không được sử dụng trực tiếp
    // console.log("orderItemId:",id);

    // Kiểm tra xem orderItemId có được cung cấp không
    if (!id) {
      return res.status(400).json({ message: "orderItem ID is required" });
    }

    // Thực hiện truy vấn
    const orderItems = await sql`
      SELECT * FROM order_item WHERE id = ${id}
    `;

    // Kiểm tra xem có bản ghi nào được tìm thấy không
    if (orderItems.length === 0) {
      return res.status(404).json({ message: "orderItem not found" });
    }

    // Trả về bản ghi đầu tiên (vì id thường là duy nhất)
    res.status(200).json(orderItems[0]);
  } catch (error) {
    console.error("Error getting the orderItem:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createOrderItem(req, res) {
try {
    const { id, quantity, price, order_id, product_id } = req.body;

    if (!quantity || !id ) {
    return res.status(400).json({ message: "All fields are required" });
    }

    const order_item = await sql`
    INSERT INTO "order_item"(id, quantity, price, order_id, product_id)
    VALUES (${id},${quantity},${price},${order_id},${product_id})
    RETURNING *
    `;

    // To use debug
    // console.log(order_item);
    res.status(201).json(order_item[0]);
} catch (error) {
    console.log("Error creating the order_item", error);
    res.status(500).json({ message: "Internal server error" });
    }
}

// Update for OrderItem
export async function updateOrderItem(req, res) {
  try {
    const { id } = req.params; // lấy id từ URL
    const { quantity, price } = req.body; // lấy data từ body

    // Kiểm tra input
    if (!id) {
      return res.status(400).json({ message: "OrderItem ID is required" });
    }

    // Thực hiện update
    const updatedOrderItem = await sql`
      UPDATE order_item
      SET 
        quantity = ${quantity},
        price = ${price}
      WHERE id = ${id}
      RETURNING *;
    `;

    // Nếu không có bản ghi nào được cập nhật
    if (updatedOrderItem.length === 0) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Trả về dữ liệu sau khi OrderItem
    res.status(200).json(updatedOrderItem[0]);
  } catch (error) {
    console.error("Error updating the OrderItem:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete OrderItem by ID
export async function deleteOrderItem(req, res) {
  try {
    const { id } = req.params; // Lấy id từ URL

    // Kiểm tra input
    if (!id) {
      return res.status(400).json({ message: "OrderItem ID is required" });
    }

    // Xóa OrderItem
    const deletedOrderItem = await sql`
      DELETE FROM order_item WHERE id = ${id}
      RETURNING *;
    `;

    // Nếu không có bản ghi nào bị xóa
    if (deletedOrderItem.length === 0) {
      return res.status(404).json({ message: "OrderItem not found" });
    }

    // Trả về cart đã bị xóa
    res.status(200).json({
      message: "OrderItem deleted successfully",
      product: deletedOrderItem[0]
    });
  } catch (error) {
    console.error("Error deleting the OrderItem:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}