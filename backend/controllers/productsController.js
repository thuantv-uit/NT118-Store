import { sql } from "../config/database.js";
import { streamUpload } from '../config/cloudinaryProvider.js';

// Constants
const REQUIRED_FIELDS = ['SKU', 'name', 'description', 'price', 'category_id', 'stock'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const VALID_IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/gif'];

// Helper validation (use passed object)
function validateProductInputs(data, isUpdate = false) {
  const { SKU, name, description, price, category_id, stock, seller_id } = data;

  if (!isUpdate) {
    // Check all required for create
    if (!SKU || !name || !description || price === undefined || !category_id || stock === undefined) {
      throw new Error('All fields (SKU, name, description, price, category_id, stock) are required');
    }
  } else {
    // For update: Only check types if provided
    if (price !== undefined && (isNaN(price) || price <= 0)) {
      throw new Error('Price must be a positive number (greater than 0)');
    }
    if (stock !== undefined && (isNaN(stock) || stock < 0)) {
      throw new Error('Stock must be a non-negative integer');
    }
    if (category_id !== undefined && (isNaN(category_id) || category_id <= 0)) {
      throw new Error('category_id must be a positive integer');
    }
    if (seller_id !== undefined && seller_id.trim && seller_id.trim() === "") {
      throw new Error('seller_id must be a valid string');
    }
    // SKU check unique outside alone
  }
}

// Separate function cho image upload (reusable)
async function handleImageUpload(req) {
  if (!req.file) return null;

  // Validate file (Multer filter basic, but double-check)
  if (req.file.size > MAX_FILE_SIZE) {
    throw new Error('File too large (max 5MB)');
  }
  if (!VALID_IMAGE_MIMES.includes(req.file.mimetype)) {
    throw new Error('Invalid file type. Only images allowed.');
  }

  try {
    const result = await streamUpload(req.file.buffer, 'product_images');
    // Cleanup buffer to save memory
    delete req.file.buffer;
    return result.secure_url;
  } catch (uploadError) {
    console.error('Cloudinary upload failed:', uploadError);
    throw new Error('Failed to upload image');
  }
}

async function ensureSellerExists(sellerId) {
  if (!sellerId) {
    throw new Error("Seller ID is required");
  }

  const existingSeller = await sql`
    SELECT id
    FROM users
    WHERE id = ${sellerId}
    LIMIT 1
  `;

  if (existingSeller.length === 0) {
    const error = new Error("Seller not found");
    error.status = 404;
    throw error;
  }
}

// Get Product by ID
export async function getProductById(req, res) {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Product ID is required and must be a valid number" });
    }

    const products = await sql`
      SELECT 
        p.*,
        u.first_name AS seller_first_name,
        u.last_name AS seller_last_name,
        COALESCE(u.avatar, u.avatar_url) AS seller_avatar
      FROM product p
      LEFT JOIN users u ON u.id = COALESCE(p.seller_id, p.customer_id)
      WHERE p.id = ${id}
    `;

    if (products.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(products[0]);
  } catch (error) {
    console.error("Error getting the product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get all Products
export async function getAllProducts(req, res) {
  try {
    const products = await sql`
      SELECT 
        p.*,
        c.name as category_name,
        s.first_name AS seller_first_name,
        s.last_name AS seller_last_name,
        COALESCE(s.avatar, s.avatar_url) AS seller_avatar
      FROM product p
      LEFT JOIN category c ON p.category_id = c.id
      LEFT JOIN users s ON s.id = COALESCE(p.seller_id, p.customer_id)
      ORDER BY p.id DESC
    `;

    res.status(200).json(products);
  } catch (error) {
    console.error("Error getting all products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Create Product
export async function createProduct(req, res) {
  try {
    const {
      SKU,
      name,
      description,
      price,
      category_id,
      stock,
      image: imageFromBody,
      seller_id,
      customer_id,
    } = req.body;

    // Validation
    validateProductInputs({ SKU, name, description, price, category_id, stock, seller_id });

    const resolvedSellerId = seller_id || customer_id;
    if (!resolvedSellerId) {
      return res.status(400).json({ message: "seller_id (or customer_id) is required" });
    }
    await ensureSellerExists(resolvedSellerId);

    // Check category exists
    const existingCategory = await sql`SELECT id FROM category WHERE id = ${category_id}`;
    if (existingCategory.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Check SKU unique
    const existingProduct = await sql`SELECT id FROM product WHERE SKU = ${SKU}`;
    if (existingProduct.length > 0) {
      return res.status(409).json({ message: "SKU already exists" });
    }

    // Handle image: priority upload > body
    let imageUrl = imageFromBody || null;
    try {
      const uploadedImage = await handleImageUpload(req);
      if (uploadedImage) imageUrl = uploadedImage;
    } catch (uploadError) {
      return res.status(400).json({ message: uploadError.message });
    }

    // Insert
    const product = await sql`
      INSERT INTO product (SKU, name, price, description, category_id, stock, image, customer_id, seller_id)
      VALUES (${SKU}, ${name}, ${price}, ${description}, ${category_id}, ${stock}, ${imageUrl}, ${resolvedSellerId}, ${resolvedSellerId})
      RETURNING *
    `;

    res.status(201).json({
      success: true,
      data: product[0]
    });
  } catch (error) {
    console.error("Error creating the product:", error);
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    if (error.message && error.message.includes('required')) {
      return res.status(400).json({ message: error.message });
    }
    if (error.code === '23505') {  // Postgres unique violation
      return res.status(409).json({ message: "SKU already exists" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
}

// Update Product
export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const {
      SKU,
      name,
      description,
      price,
      category_id,
      stock,
      image: imageFromBody,
      seller_id,
      customer_id,
    } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Product ID is required and must be a valid number" });
    }

    // Validation for fields provided
    validateProductInputs({ SKU, name, description, price, category_id, stock, seller_id }, true);

    // Check category if provided
    if (category_id !== undefined) {
      const existingCategory = await sql`SELECT id FROM category WHERE id = ${category_id}`;
      if (existingCategory.length === 0) {
        return res.status(404).json({ message: "Category not found" });
      }
    }

    const nextSellerId = seller_id ?? customer_id;
    if (nextSellerId !== undefined && nextSellerId !== null && nextSellerId !== "") {
      await ensureSellerExists(nextSellerId);
    }

    // Check SKU unique if provided (exclude self)
    if (SKU !== undefined) {
      const existingProduct = await sql`SELECT id FROM product WHERE SKU = ${SKU} AND id != ${id}`;
      if (existingProduct.length > 0) {
        return res.status(409).json({ message: "SKU already exists" });
      }
    }

    // Handle image: priority upload > body (set to null if explicit null/empty)
    let imageUrl = imageFromBody;
    try {
      const uploadedImage = await handleImageUpload(req);
      if (uploadedImage) {
        imageUrl = uploadedImage;
      } else if (imageFromBody !== undefined) {
        imageUrl = imageFromBody || null;
      }
      // Otherwise upload and imageFromBody undefined, imageUrl undefined -> COALESCE will ola data
    } catch (uploadError) {
      return res.status(400).json({ message: uploadError.message });
    }

    // Check at least field need update
    const hasUpdates = SKU !== undefined || name !== undefined || description !== undefined || 
                       price !== undefined || category_id !== undefined || stock !== undefined || 
                       nextSellerId !== undefined ||
                       imageUrl !== undefined;
    if (!hasUpdates) {
      return res.status(400).json({ message: "At least one field must be provided for update" });
    }

    // Hanlde update with COALESCE to only update if value is provided (no undefined)
    const normalizedSellerId = nextSellerId ?? null;
    const updatedProduct = await sql`
      UPDATE product
      SET 
        SKU = COALESCE(${SKU}, SKU),
        name = COALESCE(${name}, name),
        description = COALESCE(${description}, description),
        price = COALESCE(${price}, price),
        category_id = COALESCE(${category_id}, category_id),
        stock = COALESCE(${stock}, stock),
        image = COALESCE(${imageUrl}, image),
        seller_id = COALESCE(${normalizedSellerId}, seller_id),
        customer_id = COALESCE(${normalizedSellerId}, customer_id)
      WHERE id = ${id}
      RETURNING *;
    `;

    // Otherwise which field is updated
    if (updatedProduct.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      data: updatedProduct[0]
    });
  } catch (error) {
    console.error("Error updating the product:", error);
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    if (error.message && error.message.includes('required')) {
      return res.status(400).json({ message: error.message });
    }
    if (error.code === '23505') {
      return res.status(409).json({ message: "SKU already exists" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Product by ID
export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Product ID is required and must be a valid number" });
    }

    const deletedProduct = await sql`
      DELETE FROM product WHERE id = ${id}
      RETURNING *
    `;

    if (deletedProduct.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: deletedProduct[0]
    });
  } catch (error) {
    console.error("Error deleting the product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
