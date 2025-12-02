import { sql } from "../config/database.js";

// Get for Cart
export async function getCartById(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "cart ID is required" });
    }

    const carts = await sql`
      SELECT 
        c.*,
        pv.price as variant_price,
        pv.stock as variant_stock,
        p.name as product_name,
        p.description
      FROM cart c
      LEFT JOIN product_variant pv ON c.product_variant_id = pv.id
      LEFT JOIN product p ON pv.product_id = p.id
      WHERE c.id = ${id}
    `;

    if (carts.length === 0) {
      return res.status(404).json({ message: "cart not found" });
    }

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

    if (!customerId) {
      return res.status(400).json({ message: "customer ID is required" });
    }

    const carts = await sql`
      SELECT 
        c.*,
        pv.price as variant_price,
        pv.stock as variant_stock,
        p.name as product_name,
        p.description
      FROM cart c
      LEFT JOIN product_variant pv ON c.product_variant_id = pv.id
      LEFT JOIN product p ON pv.product_id = p.id
      WHERE c.customer_id = ${customerId}
    `;

    if (carts.length === 0) {
      return res.status(200).json([]);
    }

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

    // Validation: Bắt buộc tất cả vì cần validate variant
    if (!quantity || !customer_id || !product_id || !size || !color) {
      return res.status(400).json({ 
        message: "quantity, customer_id, product_id, size, and color are required" 
      });
    }

    // Bước 1: Tìm product_variant_id dựa trên product_id, size, color
    const variants = await sql`
      SELECT id, price, stock
      FROM product_variant 
      WHERE product_id = ${product_id} AND size = ${size} AND color = ${color}
    `;

    if (variants.length === 0) {
      return res.status(404).json({ 
        message: `Product variant not found for product_id: ${product_id}, size: ${size}, color: ${color}` 
      });
    }

    const { id: product_variant_id, price, stock } = variants[0];

    // Kiểm tra stock
    if (quantity > stock) {
      return res.status(400).json({ 
        message: `Insufficient stock. Available: ${stock}, Requested: ${quantity}` 
      });
    }

    // Bước 2: Tạo cart với product_variant_id VÀ size/color (để UI dùng)
    const cart = await sql`
      INSERT INTO cart(quantity, customer_id, product_id, product_variant_id, size, color)
      VALUES (${quantity}, ${customer_id}, ${product_id}, ${product_variant_id}, ${size}, ${color})
      RETURNING *
    `;

    // Trả về full info (UI có thể dùng c.size, c.color trực tiếp)
    const fullCart = await sql`
      SELECT 
        c.*,
        pv.price as variant_price,
        p.name as product_name
      FROM cart c
      JOIN product_variant pv ON c.product_variant_id = pv.id
      JOIN product p ON pv.product_id = p.id
      WHERE c.id = ${cart[0].id}
    `;

    res.status(201).json(fullCart[0]);
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