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

// Get all Products
export async function getAllProducts(req, res) {
  try {
    // Thực hiện truy vấn lấy tất cả products, join với category để lấy tên
    const products = await sql`
      SELECT p.*, c.name as category_name
      FROM product p
      JOIN category c ON p.category_id = c.id
      ORDER BY p.id DESC  -- Sắp xếp theo ID mới nhất trước (tùy chọn)
    `;

    // Trả về mảng products
    res.status(200).json(products);
  } catch (error) {
    console.error("Error getting all products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createProduct(req, res) {
  try {
    const { SKU, name, description, price, category_id, stock } = req.body;

    // Validation
    if (!SKU || !name || !description || !price || !category_id || !stock) {
      return res.status(400).json({ message: "All fields (SKU, name, description, price, category_id, stock) are required" });
    }
    if (typeof price !== 'number' || price <= 0) {
      return res.status(400).json({ message: "Price must be a positive number" });
    }
    if (typeof stock !== 'number' || stock < 0) {
      return res.status(400).json({ message: "Stock must be a non-negative integer" });
    }
    if (typeof category_id !== 'number' || category_id <= 0) {
      return res.status(400).json({ message: "category_id must be a positive integer" });
    }

    // Check category_id exist
    const existingCategory = await sql`SELECT id FROM category WHERE id = ${category_id}`;
    if (existingCategory.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Check SKU unique
    const existingProduct = await sql`SELECT SKU FROM product WHERE SKU = ${SKU}`;
    if (existingProduct.length > 0) {
      return res.status(409).json({ message: "SKU already exists" });
    }

    const product = await sql`
      INSERT INTO product(SKU, name, price, description, category_id, stock)
      VALUES (${SKU}, ${name}, ${price}, ${description}, ${category_id}, ${stock})
      RETURNING *
    `;

    const created = product[0];
    //luu attributes nếu có

    // If attributes provided, save them into product_attribute table
    // Accept either: attributes = { key: value, ... } or attributes = [{ key, value }, ...]
    const attrs = req.body.attributes;
    if (attrs) {
      try {
        if (Array.isArray(attrs)) {
          for (const item of attrs) {
            const key = item.key ?? item.name ?? null;
            const value = item.value ?? item.val ?? '';
            if (key) {
              await sql`
                INSERT INTO product_attribute(product_id, name, value)
                VALUES (${created.id}, ${key}, ${value})
              `;
            }
          }
        } else if (typeof attrs === 'object') {
          for (const [k, v] of Object.entries(attrs)) {
            // store label/key and value
            await sql`
              INSERT INTO product_attribute(product_id, name, value)
              VALUES (${created.id}, ${k}, ${v})
            `;
          }
        }
      } catch (attrErr) {
        console.error('Error saving product attributes:', attrErr);
        // continue without failing product creation
      }
    }

    // If imageUrls provided (array of urls or {url, public_id, resource_type}), save into product_media
    const imageUrls = req.body.imageUrls;
    if (imageUrls && Array.isArray(imageUrls)) {
      try {
        for (const u of imageUrls) {
          if (!u) continue;
          if (typeof u === 'string') {
            await sql`
              INSERT INTO product_media (product_id, url)
              VALUES (${created.id}, ${u})
            `;
          } else if (typeof u === 'object' && u.url) {
            await sql`
              INSERT INTO product_media (product_id, url, public_id, type)
              VALUES (${created.id}, ${u.url}, ${u.public_id || null}, ${u.resource_type || u.type || null})
            `;
          }
        }
      } catch (mediaErr) {
        console.error('Error saving product media:', mediaErr);
      }
    }

    // Return created product (attributes saved separately)
    res.status(201).json(created);
  } catch (error) {
    console.error("Error creating the product:", error.message || error);
    // Handle specific errors if need (example: unique violation)
    if (error.code === '23505') {  // Postgres unique violation
      return res.status(409).json({ message: "SKU already exists" });
    }
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