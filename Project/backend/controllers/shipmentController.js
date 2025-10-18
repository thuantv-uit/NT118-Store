import { sql } from "../config/database.js";

// Get Profile for User
export async function getShipmentById(req, res) {
  try {
    const shipmentId = req.params;
    // shipmentId sẽ trả về dữ liệu dạng mảng { id: '54321' }
    // console.log("shipmentId:",shipmentId);
    const id = shipmentId.id
    // vậy nên phải lấy id từ mảng đó ra chứ không được sử dụng trực tiếp
    // console.log("shipmentId:",id);

    // Kiểm tra xem shipmentId có được cung cấp không
    if (!id) {
      return res.status(400).json({ message: "Shipment ID is required" });
    }

    // Thực hiện truy vấn
    const shipment = await sql`
      SELECT * FROM shipment WHERE id = ${id}
    `;

    // Kiểm tra xem có bản ghi nào được tìm thấy không
    if (shipment.length === 0) {
      return res.status(404).json({ message: "shipment not found" });
    }

    // Trả về bản ghi đầu tiên (vì id thường là duy nhất)
    res.status(200).json(shipment[0]);
  } catch (error) {
    console.error("Error getting the shipment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createShipment(req, res) {
try {
    const { shipment_date, address, city, state, country, zipcode, customer_id } = req.body;

    if (!shipment_date || !city || !state || !address || !country || !zipcode) {
    return res.status(400).json({ message: "All fields are required" });
    }

    const transaction = await sql`
    INSERT INTO shipment(shipment_date, city, state, country, address, zipcode, customer_id)
    VALUES (${shipment_date},${city},${state},${country},${address},${zipcode},${customer_id})
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
export async function updateShipment(req, res) {
  try {
    const { id } = req.params; // lấy id từ URL
    const { shipment_date, city, address, state, country, zipcode } = req.body; // lấy shipment_date từ body

    // Kiểm tra input
    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }
    if (!shipment_date) {
      return res.status(400).json({ message: "First name is required" });
    }

    // Thực hiện update
    const updatedCustomer = await sql`
      UPDATE shipment
      SET 
        shipment_date = ${shipment_date},
        city = ${city},
        address = ${address},
        state = ${state},
        country = ${country},
        zipcode = ${zipcode}
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

// Delete shipment by ID
export async function deleteShipment(req, res) {
  try {
    const { id } = req.params; // Lấy id từ URL

    // Kiểm tra input
    if (!id) {
      return res.status(400).json({ message: "Shipment ID is required" });
    }

    // Xóa shipment
    const deletedShipment = await sql`
      DELETE FROM shipment WHERE id = ${id}
      RETURNING *;
    `;

    // Nếu không có bản ghi nào bị xóa
    if (deletedShipment.length === 0) {
      return res.status(404).json({ message: "Shipment not found" });
    }

    // Trả về shipment đã bị xóa
    res.status(200).json({
      message: "Shipment deleted successfully",
      shipment: deletedShipment[0]
    });
  } catch (error) {
    console.error("Error deleting the shipment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}