import { sql } from "../config/database.js";

// Create order_status mới
export async function createOrderStatus(req, res) {
  try {
    const { seller_id, buyer_id, product_id, order_id, status } = req.body;

    if (!seller_id || !buyer_id || !product_id || !order_id || !status) {
      return res.status(400).json({ message: "seller_id, buyer_id, product_id, order_id, and status are required" });
    }

    // Validate status
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    // Check nếu đã tồn tại cho combo order_id + product_id
    const existingStatus = await sql`
      SELECT id FROM "order_status" 
      WHERE order_id = ${order_id} AND product_id = ${product_id}
    `;

    if (existingStatus.length > 0) {
      return res.status(400).json({ message: "Order status already exists for this order and product" });
    }

    // Tạo mới
    const newOrderStatus = await sql`
      INSERT INTO "order_status" (seller_id, buyer_id, product_id, order_id, status)
      VALUES (${seller_id}, ${buyer_id}, ${product_id}, ${order_id}, ${status})
      RETURNING id, seller_id, buyer_id, product_id, order_id, status, created_at, updated_at
    `;

    res.status(201).json(newOrderStatus[0]);
  } catch (error) {
    console.error("Error creating order status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get order_status by ID
export async function getOrderStatusById(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }

    const orderStatus = await sql`
      SELECT id, seller_id, buyer_id, product_id, order_id, status, created_at, updated_at
      FROM "order_status"
      WHERE id = ${id}
    `;

    if (orderStatus.length === 0) {
      return res.status(404).json({ message: "Order status not found" });
    }

    res.status(200).json(orderStatus[0]);
  } catch (error) {
    console.error("Error getting order status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get order_status by order_id (lấy lịch sử status cho một order)
export async function getOrderStatusByOrderId(req, res) {
  try {
    const { order_id } = req.params;

    if (!order_id) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    const orderStatuses = await sql`
      SELECT id, seller_id, buyer_id, product_id, order_id, status, created_at, updated_at
      FROM "order_status"
      WHERE order_id = ${order_id}
      ORDER BY created_at ASC
    `;

    if (orderStatuses.length === 0) {
      return res.status(404).json({ message: "No order status found for this order" });
    }

    res.status(200).json(orderStatuses);
  } catch (error) {
    console.error("Error getting order status by order_id:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Update order_status (chủ yếu update status)
// export async function updateOrderStatus(req, res) {
//   try {
//     const { id } = req.params;
//     const { status, seller_id, buyer_id } = req.body;  // Chỉ update status, cần seller_id hoặc buyer_id để check ownership

//     if (!id || (!status && !seller_id && !buyer_id)) {
//       return res.status(400).json({ message: "ID and at least one of status, seller_id, or buyer_id are required" });
//     }

//     // Validate status nếu có
//     if (status) {
//       const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
//       if (!validStatuses.includes(status)) {
//         return res.status(400).json({ message: `Status must be one of: ${validStatuses.join(', ')}` });
//       }
//     }

//     // Check ownership (phải là seller hoặc buyer)
//     const existingStatus = await sql`
//       SELECT id, seller_id, buyer_id FROM "order_status" 
//       WHERE id = ${id} AND (seller_id = ${seller_id} OR buyer_id = ${buyer_id})
//     `;

//     if (existingStatus.length === 0) {
//       return res.status(404).json({ message: "Order status not found or access denied" });
//     }

//     // Update (chỉ status và updated_at)
//     const updateFields = {};
//     if (status) updateFields.status = status;
//     if (seller_id) updateFields.seller_id = seller_id;
//     if (buyer_id) updateFields.buyer_id = buyer_id;

//     const updatedOrderStatus = await sql`
//       UPDATE "order_status"
//       SET ${sql(updateFields)}, updated_at = CURRENT_TIMESTAMP
//       WHERE id = ${id}
//       RETURNING id, seller_id, buyer_id, product_id, order_id, status, created_at, updated_at
//     `;

//     res.status(200).json(updatedOrderStatus[0]);
//   } catch (error) {
//     console.error("Error updating order status:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// }
// Update order_status (chỉ update status)
export async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, seller_id, buyer_id } = req.body;  // Cần status để update, và ít nhất một seller_id/buyer_id để check ownership

    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }

    // Validate status nếu có
    if (status) {
      const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: `Status must be one of: ${validStatuses.join(', ')}` });
      }
    } else {
      return res.status(400).json({ message: "Status is required for update" });
    }

    // Check ownership: Phải cung cấp ít nhất một seller_id hoặc buyer_id
    if (!seller_id && !buyer_id) {
      return res.status(400).json({ message: "At least one of seller_id or buyer_id is required for ownership check" });
    }

    const existingStatus = await sql`
      SELECT id, seller_id, buyer_id FROM "order_status" 
      WHERE id = ${id} AND (seller_id = ${seller_id} OR buyer_id = ${buyer_id})
    `;

    if (existingStatus.length === 0) {
      return res.status(404).json({ message: "Order status not found or access denied" });
    }

    // Sử dụng COALESCE chỉ cho status (luôn update updated_at)
    const updatedOrderStatus = await sql`
      UPDATE "order_status"
      SET 
        status = COALESCE(${status}, status),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING id, seller_id, buyer_id, product_id, order_id, status, created_at, updated_at
    `;

    if (updatedOrderStatus.length === 0) {
      return res.status(404).json({ message: "Order status not found" });
    }

    res.status(200).json(updatedOrderStatus[0]);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


// Delete order_status by ID (check ownership)
export async function deleteOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { seller_id, buyer_id } = req.body;  // Cần ít nhất một để check ownership

    if (!id || (!seller_id && !buyer_id)) {
      return res.status(400).json({ message: "ID and at least one of seller_id or buyer_id are required" });
    }

    const deletedOrderStatus = await sql`
      DELETE FROM "order_status"
      WHERE id = ${id} AND (seller_id = ${seller_id} OR buyer_id = ${buyer_id})
      RETURNING id, seller_id, buyer_id, product_id, order_id, status
    `;

    if (deletedOrderStatus.length === 0) {
      return res.status(404).json({ message: "Order status not found or access denied" });
    }

    res.status(200).json({
      message: "Order status deleted successfully",
      orderStatus: deletedOrderStatus[0]
    });
  } catch (error) {
    console.error("Error deleting order status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}