import { sql } from "../config/database.js";

// Create order_status
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

    // Tìm shipper ngẫu nhiên từ bảng customer (role = 'shipper')
    const shippers = await sql`
      SELECT id FROM "customer" 
      WHERE role = 'shipper' 
      ORDER BY RANDOM() 
      LIMIT 1
    `;

    if (shippers.length === 0) {
      return res.status(400).json({ message: "No available shippers found" });
    }

    const shipper_id = shippers[0].id;

    // Tạo mới (current_location mặc định NULL, shipper_id từ query)
    const newOrderStatus = await sql`
      INSERT INTO "order_status" (seller_id, buyer_id, product_id, order_id, status, shipper_id)
      VALUES (${seller_id}, ${buyer_id}, ${product_id}, ${order_id}, ${status}, ${shipper_id})
      RETURNING id, seller_id, buyer_id, product_id, order_id, status, shipper_id, current_location, created_at, updated_at
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
      SELECT id, seller_id, buyer_id, product_id, order_id, status, current_location, created_at, updated_at
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
      SELECT id, seller_id, buyer_id, product_id, order_id, status, current_location, created_at, updated_at
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

// Get order_status by seller_id (mới thêm: lấy tất cả statuses của một seller)
export async function getOrderStatusBySellerId(req, res) {
  try {
    const { seller_id } = req.params;

    if (!seller_id) {
      return res.status(400).json({ message: "Seller ID is required" });
    }

    const orderStatuses = await sql`
      SELECT id, seller_id, buyer_id, product_id, order_id, status, current_location, created_at, updated_at
      FROM "order_status"
      WHERE seller_id = ${seller_id}
      ORDER BY created_at DESC
    `;

    if (orderStatuses.length === 0) {
      return res.status(404).json({ message: "No order status found for this seller" });
    }

    res.status(200).json(orderStatuses);
  } catch (error) {
    console.error("Error getting order status by seller_id:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get order_status by buyer_id (mới thêm: lấy tất cả statuses của một buyer)
export async function getOrderStatusByBuyerId(req, res) {
  try {
    const { buyer_id } = req.params;

    if (!buyer_id) {
      return res.status(400).json({ message: "Buyer ID is required" });
    }

    const orderStatuses = await sql`
      SELECT id, seller_id, buyer_id, product_id, order_id, status, current_location, created_at, updated_at
      FROM "order_status"
      WHERE buyer_id = ${buyer_id}
      ORDER BY created_at DESC
    `;

    if (orderStatuses.length === 0) {
      return res.status(404).json({ message: "No order status found for this buyer" });
    }

    res.status(200).json(orderStatuses);
  } catch (error) {
    console.error("Error getting order status by buyer_id:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get order_status by shipper_id (mới thêm: lấy tất cả statuses của một shipper)
export async function getOrderStatusByShipperId(req, res) {
  try {
    const { shipper_id } = req.params;

    if (!shipper_id) {
      return res.status(400).json({ message: "Shipper ID is required" });
    }

    const orderStatuses = await sql`
      SELECT id, seller_id, buyer_id, product_id, order_id, status, shipper_id, current_location, created_at, updated_at
      FROM "order_status"
      WHERE shipper_id = ${shipper_id}
      ORDER BY created_at DESC
    `;

    if (orderStatuses.length === 0) {
      return res.status(404).json({ message: "No order status found for this shipper" });
    }

    res.status(200).json(orderStatuses);
  } catch (error) {
    console.error("Error getting order status by shipper_id:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Update order_status (shipper_id hoặc seller_id mới được cập nhật)
export async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, current_location, shipper_id, seller_id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }

    // Phải có shipper hoặc seller ID
    if (!shipper_id && !seller_id) {
      return res.status(400).json({ message: "At least one of shipper_id or seller_id is required to update" });
    }

    // Validate status nếu có
    if (status) {
      const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: `Status must be one of: ${validStatuses.join(', ')}` });
      }
    }

    // Validate current_location nếu có
    if (current_location && current_location.length > 500) {
      return res.status(400).json({ message: "Current location must be under 500 characters" });
    }

    // Check ownership: shipper hoặc seller phải match
    const existingStatus = await sql`
      SELECT id, seller_id, shipper_id FROM "order_status" 
      WHERE id = ${id} AND (seller_id = ${seller_id} OR shipper_id = ${shipper_id})
    `;

    if (existingStatus.length === 0) {
      return res.status(403).json({ message: "Access denied: You are not allowed to update this order" });
    }

    const updatedOrderStatus = await sql`
      UPDATE "order_status"
      SET 
        status = COALESCE(${status}, status),
        current_location = COALESCE(${current_location}, current_location),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING id, seller_id, shipper_id, product_id, order_id, status, current_location, created_at, updated_at
    `;

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
      RETURNING id, seller_id, buyer_id, product_id, order_id, status, current_location
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