import { sql } from "../config/database.js";
import { streamUpload } from "../config/cloudinaryProvider.js";

// ========== CONFIG ==========
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const VALID_IMAGE_MIMES = ["image/jpeg", "image/png", "image/gif"];

// Validate core required fields
function validateProductInputs(data, isUpdate = false) {
  const { SKU, name, description, price, category_id, stock } = data;

  if (!isUpdate) {
    if (!SKU || !name || !description || price === undefined || !category_id || stock === undefined) {
      throw new Error("Missing required fields");
    }
  }

  if (price !== undefined && (isNaN(price) || price <= 0)) {
    throw new Error("Price must be a positive number");
  }

  if (stock !== undefined && (isNaN(stock) || stock < 0)) {
    throw new Error("Stock must be a non-negative integer");
  }

  if (category_id !== undefined && (isNaN(category_id) || category_id <= 0)) {
    throw new Error("category_id must be a valid positive integer");
  }
}

// ========== IMAGE UPLOAD ==========
async function handleImageUpload(req) {
  if (!req.file) return null;

  if (req.file.size > MAX_FILE_SIZE) throw new Error("File too large (>5MB)");
  if (!VALID_IMAGE_MIMES.includes(req.file.mimetype)) throw new Error("Invalid image type");

  const result = await streamUpload(req.file.buffer, "product_images");
  delete req.file.buffer;
  return result.secure_url;
}

// ======================================================================
//  🔵 GET ONE PRODUCT — FULL INFORMATION (IMAGE + CATEGORY + ATTRIBUTES)
// ======================================================================
export async function getProductById(req, res) {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid Product ID" });
    }

    const rows = await sql`
      SELECT 
        p.*,
        c.name AS category_name,

        COALESCE(
          json_agg(
            json_build_object(
              'url', pm.url,
              'public_id', pm.public_id,
              'type', pm.type,
              'is_cover', pm.is_cover
            )
          ) FILTER (WHERE pm.id IS NOT NULL),
          '[]'
        ) AS images,

        COALESCE(
          json_agg(
            json_build_object(
              'name', pa.name,
              'value', pa.value
            )
          ) FILTER (WHERE pa.id IS NOT NULL),
          '[]'
        ) AS attributes

      FROM product p
      LEFT JOIN category c ON p.category_id = c.id
      LEFT JOIN product_media pm ON pm.product_id = p.id
      LEFT JOIN product_attribute pa ON pa.product_id = p.id
      WHERE p.id = ${id}
      GROUP BY p.id, c.name
    `;

    if (rows.length === 0) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({
      success: true,
      product: rows[0]
    });

  } catch (error) {
    console.error("getProductById error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// ======================================================================
//  🔵 GET ALL PRODUCTS — FULL INFORMATION (IMAGE + CATEGORY + ATTRIBUTES)
// ======================================================================
export async function getAllProducts(req, res) {
  try {
    const rows = await sql`
      SELECT 
        p.*,
        c.name AS category_name,

        COALESCE(
          json_agg(
            json_build_object(
              'url', pm.url,
              'public_id', pm.public_id,
              'type', pm.type,
              'is_cover', pm.is_cover
            )
          ) FILTER (WHERE pm.id IS NOT NULL),
          '[]'
        ) AS images,

        COALESCE(
          json_agg(
            json_build_object(
              'name', pa.name,
              'value', pa.value
            )
          ) FILTER (WHERE pa.id IS NOT NULL),
          '[]'
        ) AS attributes

      FROM product p
      LEFT JOIN category c ON p.category_id = c.id
      LEFT JOIN product_media pm ON pm.product_id = p.id
      LEFT JOIN product_attribute pa ON pa.product_id = p.id
      GROUP BY p.id, c.name
      ORDER BY p.id DESC
    `;

    res.status(200).json({
      success: true,
      products: rows
    });

  } catch (error) {
    console.error("getAllProducts error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// ======================================================================
//  🔵 CREATE PRODUCT — supports images + attributes
// ======================================================================
export async function createProduct(req, res) {
  try {
    const { SKU, name, description, price, category_id, stock, attributes, images } = req.body;

    validateProductInputs({ SKU, name, description, price, category_id, stock });

    // ensure category exists
    const cat = await sql`SELECT id FROM category WHERE id = ${category_id}`;
    if (cat.length === 0) return res.status(404).json({ message: "Category not found" });

    // ensure SKU unique
    const existing = await sql`SELECT id FROM product WHERE SKU = ${SKU}`;
    if (existing.length > 0) return res.status(409).json({ message: "SKU already exists" });

    // image upload or body fallback
    let uploadedImage = images?.[0] || null;
    const uploadFromFile = await handleImageUpload(req);
    if (uploadFromFile) uploadedImage = uploadFromFile;

    const inserted = await sql`
      INSERT INTO product (SKU, name, description, price, category_id, stock, image)
      VALUES (${SKU}, ${name}, ${description}, ${price}, ${category_id}, ${stock}, ${uploadedImage})
      RETURNING *
    `;

    const product = inserted[0];

    // Save attributes
    if (Array.isArray(attributes)) {
      for (const att of attributes) {
        await sql`
          INSERT INTO product_attribute(product_id, name, value)
          VALUES (${product.id}, ${att.name}, ${att.value});
        `;
      }
    }

    // Save image URLs if provided
    if (Array.isArray(images)) {
      for (const img of images) {
        await sql`
          INSERT INTO product_media (product_id, url, public_id, type, is_cover)
          VALUES (
            ${product.id},
            ${img.url},
            ${img.public_id || null},
            ${img.type || null},
            ${img.is_cover || false}
          );
        `;
      }
    }

    res.status(201).json({ success: true, product });

  } catch (error) {
    console.error("createProduct error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// ======================================================================
//  🔵 UPDATE PRODUCT
// ======================================================================
export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const { SKU, name, description, price, category_id, stock } = req.body;

    validateProductInputs(req.body, true);

    const updated = await sql`
      UPDATE product SET
        SKU = COALESCE(${SKU}, SKU),
        name = COALESCE(${name}, name),
        description = COALESCE(${description}, description),
        price = COALESCE(${price}, price),
        category_id = COALESCE(${category_id}, category_id),
        stock = COALESCE(${stock}, stock)
      WHERE id = ${id}
      RETURNING *
    `;

    if (updated.length === 0) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ success: true, product: updated[0] });

  } catch (error) {
    console.error("updateProduct error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// ======================================================================
//  🔵 DELETE
// ======================================================================
export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;

    const deleted = await sql`
      DELETE FROM product WHERE id = ${id}
      RETURNING *
    `;

    if (deleted.length === 0) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ success: true, deleted: deleted[0] });

  } catch (error) {
    console.error("deleteProduct error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
