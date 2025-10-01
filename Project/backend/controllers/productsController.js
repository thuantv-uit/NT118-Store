import { sql } from "../config/database.js";

// Get for Product
export async function getProductById(req, res) {
  try {
    const productId = req.params;
    // productId sẽ trả về dữ liệu dạng mảng { id: '54321' }
    // console.log("productId:",productId);
    const id = productId.id
    // vậy nên phải lấy id từ mảng đó ra chứ không được sử dụng trực tiếp
    // console.log("productId:",id);

    // Kiểm tra xem productId có được cung cấp không
    if (!id) {
      return res.status(400).json({ message: "product ID is required" });
    }

    // Thực hiện truy vấn
    const products = await sql`
      SELECT * FROM product WHERE id = ${id}
    `;

    // Kiểm tra xem có bản ghi nào được tìm thấy không
    if (products.length === 0) {
      return res.status(404).json({ message: "product not found" });
    }

    // Trả về bản ghi đầu tiên (vì id thường là duy nhất)
    res.status(200).json(products[0]);
  } catch (error) {
    console.error("Error getting the product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createProduct(req, res) {
try {
    const { id, SKU, description, price, category_id, stock } = req.body;

    if (!SKU || !id || !description || !stock ) {
    return res.status(400).json({ message: "All fields are required" });
    }

    const product = await sql`
    INSERT INTO product(id, SKU, price, description, category_id, stock)
    VALUES (${id},${SKU},${price},${description},${category_id},${stock})
    RETURNING *
    `;

    // To use debug
    // console.log(product);
    res.status(201).json(product[0]);
} catch (error) {
    console.log("Error creating the product", error);
    res.status(500).json({ message: "Internal server error" });
    }
}

// Update for prodduct
export async function updateProduct(req, res) {
  try {
    const { id } = req.params; // lấy id từ URL
    const { SKU, description, price, stock } = req.body; // lấy data từ body

    // Kiểm tra input
    if (!id) {
      return res.status(400).json({ message: "Payment ID is required" });
    }

    // Thực hiện update
    const updatedProduct = await sql`
      UPDATE product
      SET 
        SKU = ${SKU},
        description = ${description},
        price = ${price},
        stock = ${stock}
      WHERE id = ${id}
      RETURNING *;
    `;

    // Nếu không có bản ghi nào được cập nhật
    if (updatedProduct.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Trả về dữ liệu sau khi update
    res.status(200).json(updatedProduct[0]);
  } catch (error) {
    console.error("Error updating the product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete product by ID
export async function deleteProduct(req, res) {
  try {
    const { id } = req.params; // Lấy id từ URL

    // Kiểm tra input
    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // Xóa order
    const deletedProduct = await sql`
      DELETE FROM product WHERE id = ${id}
      RETURNING *;
    `;

    // Nếu không có bản ghi nào bị xóa
    if (deletedProduct.length === 0) {
      return res.status(404).json({ message: "product not found" });
    }

    // Trả về payment đã bị xóa
    res.status(200).json({
      message: "product deleted successfully",
      product: deletedProduct[0]
    });
  } catch (error) {
    console.error("Error deleting the product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}