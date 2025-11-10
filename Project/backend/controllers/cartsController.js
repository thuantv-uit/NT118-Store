import { sql } from "../config/database.js";

// Get for Cart
export async function getCartById(req, res) {
  try {
    const { id } = req.params;

    // Check cartId is it provider
    if (!id) {
      return res.status(400).json({ message: "cart ID is required" });
    }

    // Handle query
    const carts = await sql`
      SELECT * FROM cart WHERE id = ${id}
    `;

    // Check if any records are found
    if (carts.length === 0) {
      return res.status(404).json({ message: "cart not found" });
    }

    // Returns the first record (since id is usually unique)
    res.status(200).json(carts[0]);
  } catch (error) {
    console.error("Error getting the cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get all Cart by UserId
export async function getCartsByCustomerId(req, res) {
  try {
    const { id: customerId } = req.params;

    // Check customerId
    if (!customerId) {
      return res.status(400).json({ message: "customer ID is required" });
    }

    // Handle query to get all cart of the customer
    const carts = await sql`
      SELECT * FROM cart WHERE customer_id = ${customerId}
    `;

    // check carts
    if (carts.length === 0) {
      return res.status(404).json({ message: "No carts found for this customer" });
    }

    // return entire array carts
    res.status(200).json(carts);
  } catch (error) {
    console.error("Error getting carts by customer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Create cart
export async function createCart(req, res) {
  try {
    const { quantity, customer_id, product_id, size, color } = req.body;

    // Validation: quantity is required, size and color optional (vì NULL allowed)
    if (!quantity || !customer_id || !product_id) {
      return res.status(400).json({ message: "quantity, customer_id, and product_id are required" });
    }

    const cart = await sql`
      INSERT INTO cart(quantity, customer_id, product_id, size, color)
      VALUES (${quantity}, ${customer_id}, ${product_id}, ${size || null}, ${color || null})
      RETURNING *
    `;

    res.status(201).json(cart[0]);
  } catch (error) {
    console.error("Error creating the cart", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Update for cart
export async function updateCart(req, res) {
  try {
    const { id } = req.params; // lấy id từ URL
    const { quantity, size, color } = req.body; // lấy data từ body (tất cả optional cho partial update)

    // Kiểm tra input
    if (!id) {
      return res.status(400).json({ message: "Cart ID is required" });
    }

    // Sử dụng COALESCE để chỉ update field nếu được cung cấp (không NULL), nếu không giữ nguyên giá trị cũ
    const updatedCart = await sql`
      UPDATE cart
      SET 
        quantity = COALESCE(${quantity}, quantity),
        size = COALESCE(${size}, size),
        color = COALESCE(${color}, color)
      WHERE id = ${id}
      RETURNING *;
    `;

    // Nếu không có bản ghi nào được cập nhật
    if (updatedCart.length === 0) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Trả về dữ liệu sau khi update
    res.status(200).json(updatedCart[0]);
  } catch (error) {
    console.error("Error updating the cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete cart by ID
export async function deleteCart(req, res) {
  try {
    const { id } = req.params; // Lấy id từ URL

    // Kiểm tra input
    if (!id) {
      return res.status(400).json({ message: "Cart ID is required" });
    }

    // Xóa order
    const deletedCart = await sql`
      DELETE FROM cart WHERE id = ${id}
      RETURNING *;
    `;

    // Nếu không có bản ghi nào bị xóa
    if (deletedCart.length === 0) {
      return res.status(404).json({ message: "cart not found" });
    }

    // Trả về cart đã bị xóa
    res.status(200).json({
      message: "cart deleted successfully",
      product: deletedCart[0]
    });
  } catch (error) {
    console.error("Error deleting the cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}