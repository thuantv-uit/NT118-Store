import { sql } from "../config/database.js";  // Import sql từ database config

// GET: Lấy danh sách địa chỉ theo customer_id (userID)
export async function getShippingAddressesByCustomer(req, res) {
  try {
    const { customer_id } = req.params;

    if (!customer_id) {
      return res.status(400).json({ message: "Customer ID is required" });
    }

    // Query danh sách địa chỉ, sắp xếp is_default trước, rồi theo created_at mới nhất
    const addresses = await sql`
      SELECT id, name, address, city, state, country, zipcode, is_default, created_at
      FROM shipping_address
      WHERE customer_id = ${customer_id}
      ORDER BY is_default DESC, created_at DESC
    `;

    res.status(200).json(addresses);
  } catch (error) {
    console.error("Error getting shipping addresses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// POST: Tạo địa chỉ mới
export async function createShippingAddress(req, res) {
  try {
    const { customer_id, name, address, city, state, country, zipcode, is_default = false } = req.body;

    // Validation: Các trường bắt buộc
    if (!customer_id || !address || !city || !state || !country || !zipcode) {
      return res.status(400).json({ message: "customer_id, address, city, state, country, and zipcode are required" });
    }

    // Kiểm tra customer tồn tại (tùy chọn, để tránh lỗi FK)
    const customerCheck = await sql`SELECT id FROM users WHERE id = ${customer_id}`;
    if (customerCheck.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Nếu is_default = true, update các địa chỉ khác của customer thành false
    if (is_default) {
      await sql`
        UPDATE shipping_address
        SET is_default = false
        WHERE customer_id = ${customer_id}
      `;
    }

    // Insert địa chỉ mới
    const newAddress = await sql`
      INSERT INTO shipping_address (customer_id, name, address, city, state, country, zipcode, is_default)
      VALUES (${customer_id}, ${name || 'Địa chỉ mặc định'}, ${address}, ${city}, ${state}, ${country}, ${zipcode}, ${is_default})
      RETURNING *
    `;

    res.status(201).json(newAddress[0]);
  } catch (error) {
    console.error("Error creating shipping address:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// DELETE: Xóa địa chỉ theo id
export async function deleteShippingAddress(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Address ID is required" });
    }

    // Kiểm tra địa chỉ tồn tại và lấy info (để trả response)
    const addressCheck = await sql`
      SELECT * FROM shipping_address WHERE id = ${id}
    `;

    if (addressCheck.length === 0) {
      return res.status(404).json({ message: "Shipping address not found" });
    }

    const address = addressCheck[0];

    // Xóa (ON DELETE CASCADE nếu có liên kết, nhưng hiện tại shipment chưa ref)
    const deletedAddress = await sql`
      DELETE FROM shipping_address WHERE id = ${id}
      RETURNING *
    `;

    // Nếu là địa chỉ mặc định, có thể cần logic set mặc định mới (tùy chọn, bỏ qua ở đây)

    res.status(200).json({
      message: "Shipping address deleted successfully",
      address: deletedAddress[0]
    });
  } catch (error) {
    console.error("Error deleting shipping address:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
