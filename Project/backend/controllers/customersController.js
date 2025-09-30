import { sql } from "../config/database.js";

// Get Profile for User
export async function getCustomerById(req, res) {
  try {
    const userId = req.params;
    // userId sẽ trả về dữ liệu dạng mảng { id: '54321' }
    // console.log("userId:",userId);
    const id = userId.id
    // vậy nên phải lấy id từ mảng đó ra chứ không được sử dụng trực tiếp
    // console.log("userId:",id);

    // Kiểm tra xem userId có được cung cấp không
    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Thực hiện truy vấn
    const customer = await sql`
      SELECT * FROM customer WHERE id = ${id}
    `;

    // Kiểm tra xem có bản ghi nào được tìm thấy không
    if (customer.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Trả về bản ghi đầu tiên (vì id thường là duy nhất)
    res.status(200).json(customer[0]);
  } catch (error) {
    console.error("Error getting the customer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

    // Create profile for user
export async function createCustomer(req, res) {
try {
    const { first_name, last_name, email, password, address, phone_number, role, id } = req.body;

    if (!first_name || !last_name || !email || !id || !address || !password || !phone_number || !role) {
    return res.status(400).json({ message: "All fields are required" });
    }

    const transaction = await sql`
    INSERT INTO customer(id, first_name, last_name, email, password, address, phone_number, role)
    VALUES (${id},${first_name},${last_name},${email},${password},${address},${phone_number},${role})
    RETURNING *
    `;

    // To use debug
    // console.log(customer);
    res.status(201).json(transaction[0]);
} catch (error) {
    console.log("Error creating the transaction", error);
    res.status(500).json({ message: "Internal server error" });
    }
}

// Update profile for user
export async function updateCustomerFirstName(req, res) {
  try {
    const { id } = req.params; // lấy id từ URL
    const { first_name, last_name, address, phone_number, role } = req.body; // lấy first_name từ body

    // Kiểm tra input
    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }
    if (!first_name) {
      return res.status(400).json({ message: "First name is required" });
    }

    // Thực hiện update
    const updatedCustomer = await sql`
      UPDATE customer
      SET 
        first_name = ${first_name},
        last_name = ${last_name},
        address = ${address},
        phone_number = ${phone_number},
        role = ${role}
      WHERE id = ${id}
      RETURNING *;
    `;

    // Nếu không có bản ghi nào được cập nhật
    if (updatedCustomer.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Trả về dữ liệu sau khi update
    res.status(200).json(updatedCustomer[0]);
  } catch (error) {
    console.error("Error updating the customer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}