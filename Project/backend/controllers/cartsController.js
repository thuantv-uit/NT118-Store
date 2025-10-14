import { sql } from "../config/database.js";

// Get for Cart
export async function getCartById(req, res) {
  try {
    const cartId = req.params;
    // cartId sẽ trả về dữ liệu dạng mảng { id: '54321' }
    // console.log("cartId:",cartId);
    const id = cartId.id
    // vậy nên phải lấy id từ mảng đó ra chứ không được sử dụng trực tiếp
    // console.log("cartId:",id);

    // Kiểm tra xem cartId có được cung cấp không
    if (!id) {
      return res.status(400).json({ message: "cart ID is required" });
    }

    // Thực hiện truy vấn
    const carts = await sql`
      SELECT * FROM cart WHERE id = ${id}
    `;

    // Kiểm tra xem có bản ghi nào được tìm thấy không
    if (carts.length === 0) {
      return res.status(404).json({ message: "cart not found" });
    }

    // Trả về bản ghi đầu tiên (vì id thường là duy nhất)
    res.status(200).json(carts[0]);
  } catch (error) {
    console.error("Error getting the cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get all Cart by UserId
export async function getCartsByCustomerId(req, res) {
  try {
    const params = req.params;
    // console.log("params:", params);
    const customerId = params.id; // Lấy customerId từ params
    // log to debug
    // console.log('customerId:', customerId)
    // console.log('params:', params)
    // check customerId
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
    const { quantity, customer_id, product_id } = req.body;

    if (!quantity) {
    return res.status(400).json({ message: "All fields are required" });
    }

    const cart = await sql`
    INSERT INTO cart(quantity, customer_id, product_id)
    VALUES (${quantity},${customer_id},${product_id})
    RETURNING *
    `;

    // To use debug
    // console.log(cart);
    res.status(201).json(cart[0]);
} catch (error) {
    console.log("Error creating the cart", error);
    res.status(500).json({ message: "Internal server error" });
    }
}

// Update for cart
export async function updateCart(req, res) {
  try {
    const { id } = req.params; // lấy id từ URL
    const { quantity } = req.body; // lấy data từ body

    // Kiểm tra input
    if (!id) {
      return res.status(400).json({ message: "Cart ID is required" });
    }

    // Thực hiện update
    const updatedCart = await sql`
      UPDATE cart
      SET 
        quantity = ${quantity}
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