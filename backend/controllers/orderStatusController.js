import { sql } from "../config/database.js";

// Create order_status
export async function createOrderStatus(req, res) {
  try {
    const { seller_id, buyer_id, product_id, order_id, status, quantity, variant_id } = req.body;  // THÊM: variant_id từ req.body

    // THÊM: Validate variant_id required (để unique theo variant)
    if (!seller_id || !buyer_id || !product_id || !order_id || !status || !quantity || !variant_id) {
      return res.status(400).json({ message: "seller_id, buyer_id, product_id, order_id, status, quantity and variant_id are required" });
    }

    // Validate status (giữ nguyên)
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    // CẬP NHẬT: Check nếu đã tồn tại cho combo order_id + product_id + variant_id (tránh duplicate variant)
    const existingStatus = await sql`
      SELECT id FROM "order_status" 
      WHERE order_id = ${order_id} AND product_id = ${product_id} AND variant_id = ${variant_id}
    `;

    if (existingStatus.length > 0) {
      return res.status(400).json({ message: "Order status already exists for this order, product and variant" });
    }

    // Tìm shipper ngẫu nhiên từ bảng customer (role = 'shipper') - giữ nguyên
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

    // CẬP NHẬT: Tạo mới với thêm variant_id vào INSERT (current_location mặc định NULL)
    const newOrderStatus = await sql`
      INSERT INTO "order_status" (seller_id, buyer_id, product_id, order_id, status, shipper_id, quantity, variant_id)
      VALUES (${seller_id}, ${buyer_id}, ${product_id}, ${order_id}, ${status}, ${shipper_id}, ${quantity}, ${variant_id})
      RETURNING id, seller_id, buyer_id, product_id, order_id, status, shipper_id, quantity, variant_id, current_location, created_at, updated_at
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
      SELECT id, seller_id, buyer_id, shipper_id, product_id, order_id, variant_id, quantity, status, current_location, created_at, updated_at
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
      SELECT id, seller_id, buyer_id, product_id, order_id, quantity, status, current_location, created_at, updated_at
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
      SELECT id, seller_id, buyer_id, product_id, order_id, quantity, status, current_location, created_at, updated_at
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
      SELECT id, seller_id, buyer_id, product_id, order_id, quantity, status, current_location, created_at, updated_at
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
      SELECT id, seller_id, buyer_id, product_id, order_id, variant_id, quantity, status, shipper_id, current_location, created_at, updated_at
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

// MỚI THÊM: Get order summary for buyer (total orders and total amount)
export async function getOrderSummaryByBuyerId(req, res) {
  try {
    const { buyer_id } = req.params;

    if (!buyer_id) {
      return res.status(400).json({ message: "Buyer ID is required" });
    }

    const summary = await sql`
      SELECT 
        COUNT(*)::INTEGER as totalOrders,
        COALESCE(SUM(pv.price * os.quantity), 0)::DECIMAL(10, 2) as totalAmount
      FROM "order_status" os
      LEFT JOIN product_variant pv ON os.variant_id = pv.id
      WHERE buyer_id = ${buyer_id}
    `;

    if (summary.length === 0) {
      return res.status(404).json({ message: "No order summary found for this buyer" });
    }

    res.status(200).json({
      totalOrders: summary[0].totalorders,
      totalAmount: summary[0].totalamount
    });
  } catch (error) {
    console.error("Error getting order summary by buyer_id:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// MỚI THÊM: Get order summary for seller (total orders and total amount)
export async function getOrderSummaryBySellerId(req, res) {
  try {
    const { seller_id } = req.params;

    if (!seller_id) {
      return res.status(400).json({ message: "Seller ID is required" });
    }

    const summary = await sql`
      SELECT 
        COUNT(*)::INTEGER as totalOrders,
        COALESCE(SUM(pv.price * os.quantity), 0)::DECIMAL(10, 2) as totalAmount
      FROM "order_status" os
      LEFT JOIN product_variant pv ON os.variant_id = pv.id
      WHERE seller_id = ${seller_id}
    `;

    if (summary.length === 0) {
      return res.status(404).json({ message: "No order summary found for this seller" });
    }

    res.status(200).json({
      totalOrders: summary[0].totalorders,
      totalAmount: summary[0].totalamount
    });
  } catch (error) {
    console.error("Error getting order summary by seller_id:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// MỚI THÊM: Get order summary for shipper (total orders only)
export async function getOrderSummaryByShipperId(req, res) {
  try {
    const { shipper_id } = req.params;

    if (!shipper_id) {
      return res.status(400).json({ message: "Shipper ID is required" });
    }

    const summary = await sql`
      SELECT 
        COUNT(*)::INTEGER as totalOrders
      FROM "order_status"
      WHERE shipper_id = ${shipper_id}
    `;

    if (summary.length === 0) {
      return res.status(404).json({ message: "No order summary found for this shipper" });
    }

    res.status(200).json({
      totalOrders: summary[0].totalorders
    });
  } catch (error) {
    console.error("Error getting order summary by shipper_id:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// MỚI THÊM: Get order statuses grouped by status for seller (phân loại theo status)
export async function getOrderStatusGroupedByStatusForSeller(req, res) {
  try {
    const { seller_id } = req.params;

    if (!seller_id) {
      return res.status(400).json({ message: "Seller ID is required" });
    }

    const groupedStatuses = await sql`
      SELECT 
        status,
        COUNT(*)::INTEGER as count
      FROM "order_status"
      WHERE seller_id = ${seller_id}
      GROUP BY status
      ORDER BY count DESC
    `;

    if (groupedStatuses.length === 0) {
      return res.status(404).json({ message: "No order status found for this seller" });
    }

    // Chuyển đổi thành object dễ dùng (key: status, value: count)
    const statusSummary = {};
    groupedStatuses.forEach(row => {
      statusSummary[row.status] = row.count;
    });

    res.status(200).json(statusSummary);
  } catch (error) {
    console.error("Error getting order status grouped by status for seller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// MỚI THÊM: Get order statuses grouped by status for buyer (phân loại theo status)
export async function getOrderStatusGroupedByStatusForBuyer(req, res) {
  try {
    const { buyer_id } = req.params;

    if (!buyer_id) {
      return res.status(400).json({ message: "Buyer ID is required" });
    }

    const groupedStatuses = await sql`
      SELECT 
        status,
        COUNT(*)::INTEGER as count
      FROM "order_status"
      WHERE buyer_id = ${buyer_id}
      GROUP BY status
      ORDER BY count DESC
    `;

    if (groupedStatuses.length === 0) {
      return res.status(404).json({ message: "No order status found for this buyer" });
    }

    // Chuyển đổi thành object dễ dùng (key: status, value: count)
    const statusSummary = {};
    groupedStatuses.forEach(row => {
      statusSummary[row.status] = row.count;
    });

    res.status(200).json(statusSummary);
  } catch (error) {
    console.error("Error getting order status grouped by status for buyer:", error);
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

    if (!shipper_id && !seller_id) {
      return res.status(400).json({ message: "At least one of shipper_id or seller_id is required to update" });
    }

    // Lấy trạng thái hiện tại
    const existing = await sql`
      SELECT order_id, product_id, seller_id, shipper_id, status
      FROM "order_status" 
      WHERE id = ${id}
    `;

    if (existing.length === 0) {
      return res.status(403).json({ message: "Order not found" });
    }

    const oldStatus = existing[0].status;
    const order_id = existing[0].order_id;
    const product_id = existing[0].product_id;

    // Nếu seller đổi trạng thái từ "pending" sang "processing"
    if (seller_id && status === 'processing' && oldStatus === 'pending') {
      
      // Lấy variant + quantity từ order_item
      const orderItem = await sql`
        SELECT variant_id, quantity 
        FROM "order_item"
        WHERE order_id = ${order_id} AND product_id = ${product_id}
      `;

      if (orderItem.length === 0) {
        return res.status(400).json({ message: "Order item not found while updating stock" });
      }

      const variant_id = orderItem[0].variant_id;
      const quantity = orderItem[0].quantity;

      // Lấy stock hiện tại
      const stockQuery = await sql`
        SELECT stock FROM product_variant
        WHERE id = ${variant_id}
      `;

      if (stockQuery.length === 0) {
        return res.status(400).json({ message: "Variant not found when updating stock" });
      }

      const currentStock = stockQuery[0].stock;
      const newStock = currentStock - quantity;

      if (newStock < 0) {
        return res.status(400).json({ message: "Not enough stock to process this order!" });
      }

      // Update stock
      await sql`
        UPDATE product_variant
        SET stock = ${newStock}
        WHERE id = ${variant_id}
      `;
    }

    // Validate status nếu có
    if (status) {
      const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: `Status must be one of: ${validStatuses.join(', ')}` });
      }
    }

    if (current_location && current_location.length > 500) {
      return res.status(400).json({ message: "Current location must be under 500 characters" });
    }

    // Check quyền sửa
    const existingStatus = await sql`
      SELECT id FROM "order_status" 
      WHERE id = ${id} AND (seller_id = ${seller_id} OR shipper_id = ${shipper_id})
    `;

    if (existingStatus.length === 0) {
      return res.status(403).json({ message: "Access denied: You are not allowed to update this order" });
    }

    // Update trạng thái đơn hàng
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
      RETURNING id, seller_id, buyer_id, product_id, order_id, quantity, status, current_location
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