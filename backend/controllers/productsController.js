import { sql } from "../config/database.js";
import { uploadMultiple } from "../config/cloudinaryProvider.js";

// Constants
const MAX_IMAGES = 5;
const VALID_IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB per file

// Validate product inputs
function validateProductInputs(data, isUpdate = false) {
  const { SKU, name, description, category_id } = data;

  if (!isUpdate) {
    if (!SKU || !name || !description || !category_id) {
      throw new Error('Required fields: SKU, name, description, category_id');
    }
  }

  if (category_id !== undefined && (isNaN(category_id) || category_id <= 0)) {
    throw new Error('category_id must be a positive integer');
  }
}

// Validate variants array (size, color required; unique size+color)
function validateVariants(variants) {
  if (!variants || !Array.isArray(variants) || variants.length === 0) {
    throw new Error('variants must be a non-empty array');
  }

  variants.forEach((variant, index) => {
    const { size, color, price, stock, weight, dimensions } = variant;
    if (!size || !color) {
      throw new Error(`Variant ${index + 1}: size and color are required`);
    }
    if (price === undefined || isNaN(price) || price <= 0) {
      throw new Error(`Variant ${index + 1}: price must be a positive number`);
    }
    if (stock === undefined || isNaN(stock) || stock < 0) {
      throw new Error(`Variant ${index + 1}: stock must be a non-negative integer`);
    }
    if (weight === undefined || isNaN(weight) || weight < 0) {
      throw new Error(`Variant ${index + 1}: weight must be a non-negative number (grams)`);
    }
    if (!dimensions || typeof dimensions !== 'string') {
      throw new Error(`Variant ${index + 1}: dimensions must be a string (e.g., "10x20x30 cm")`);
    }
  });

  // Check unique size+color
  const uniqueVariants = variants.map(v => `${v.size}-${v.color}`);
  const duplicates = uniqueVariants.filter((v, i, a) => a.indexOf(v) !== i);
  if (duplicates.length > 0) {
    throw new Error(`Duplicate variants: ${duplicates.join(', ')}`);
  }
}

// Handle multiple image uploads (validate & upload parallel)
async function handleImageUploads(req) {
  if (!req.files || req.files.length === 0) return [];

  // Validate files
  for (const file of req.files) {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File too large (max 5MB): ${file.originalname}`);
    }
    if (!VALID_IMAGE_MIMES.includes(file.mimetype)) {
      throw new Error(`Invalid file type for ${file.originalname}. Only images allowed.`);
    }
  }

  if (req.files.length > MAX_IMAGES) {
    throw new Error(`Maximum ${MAX_IMAGES} images allowed`);
  }

  // Upload parallel
  const buffers = req.files.map(f => f.buffer);
  const urls = await uploadMultiple(buffers, 'product_images');

  // Cleanup buffers to save memory
  req.files.forEach(f => delete f.buffer);

  return urls;
}

// Helper: Fetch full product with variants & category (reusable)
async function fetchFullProduct(productId) {
  const products = await sql`
    SELECT 
      p.*,
      c.name as category_name,
      COALESCE(jsonb_agg(
        jsonb_build_object(
          'id', pv.id,
          'size', pv.size,
          'color', pv.color,
          'price', pv.price,
          'stock', pv.stock,
          'weight', pv.weight,
          'dimensions', pv.dimensions,
          'created_at', pv.created_at
        )
      ) FILTER (WHERE pv.id IS NOT NULL), '[]'::jsonb) as variants
    FROM product p
    LEFT JOIN category c ON p.category_id = c.id
    LEFT JOIN product_variant pv ON p.id = pv.product_id
    WHERE p.id = ${productId}
    GROUP BY p.id, c.name
  `;

  if (products.length === 0) {
    throw new Error('Product not found after insert/update');
  }

  return products[0];
}

// Get Product by ID (with variants & category)
export async function getProductById(req, res) {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Product ID is required and must be a valid number" });
    }

    const product = await fetchFullProduct(id);

    res.status(200).json(product);
  } catch (error) {
    console.error("Error getting product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get all Products (with variants & category)
export async function getAllProducts(req, res) {
  try {
    const products = await sql`
      SELECT 
        p.*,
        c.name as category_name,
        COALESCE(jsonb_agg(
          jsonb_build_object(
            'id', pv.id,
            'size', pv.size,
            'color', pv.color,
            'price', pv.price,
            'stock', pv.stock,
            'weight', pv.weight,
            'dimensions', pv.dimensions,
            'created_at', pv.created_at
          )
        ) FILTER (WHERE pv.id IS NOT NULL), '[]'::jsonb) as variants
      FROM product p
      LEFT JOIN category c ON p.category_id = c.id
      LEFT JOIN product_variant pv ON p.id = pv.product_id
      GROUP BY p.id, c.name
      ORDER BY p.id DESC
    `;

    res.status(200).json(products);
  } catch (error) {
    console.error("Error getting all products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Create Product (with variants)
export async function createProduct(req, res) {
  try {
    let { SKU, name, description, category_id, customer_id, variants } = req.body;

    // Parse variants if is string JSON
    if (typeof variants === "string") {
      variants = JSON.parse(variants);
    }

    // Validate
    validateProductInputs({ SKU, name, description, category_id });
    if (variants) validateVariants(variants);

    // Check category
    const cat = await sql`SELECT id FROM category WHERE id = ${category_id}`;
    
    if (cat.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Check SKU unique
    const sk = await sql`SELECT id FROM product WHERE SKU = ${SKU}`;
    if (sk.length > 0) {
      return res.status(409).json({ message: "SKU already exists" });
    }

    // Handle images
    let images = [];
    let bodyImages = req.body.images;

    if (typeof bodyImages === "string") {
      bodyImages = JSON.parse(bodyImages);
    }

    try {
      const uploaded = await handleImageUploads(req);
      images = uploaded.length > 0 ? uploaded : (bodyImages || []);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }

    // INSERT product
    const insertProduct = await sql`
      INSERT INTO product (SKU, name, description, category_id, customer_id, images)
      VALUES (${SKU}, ${name}, ${description}, ${category_id}, ${customer_id}, ${JSON.stringify(images)}::jsonb)
      RETURNING id
    `;
    const productId = insertProduct[0].id;

    // Insert variants
    if (variants && variants.length > 0) {
      for (const v of variants) {
        await sql`
          INSERT INTO product_variant (product_id, size, color, price, stock, weight, dimensions)
          VALUES (${productId}, ${v.size}, ${v.color}, ${v.price}, ${v.stock}, ${v.weight}, ${v.dimensions})
        `;
      }
    }

    // Fetch full product
    const fullProduct = await fetchFullProduct(productId);

    return res.status(201).json({
      success: true,
      data: fullProduct
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


// Update Product (replace variants, COALESCE fields)
export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const { SKU, name, description, category_id, customer_id, variants, images: imagesFromBody } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Product ID is required and must be a valid number" });
    }

    // Parse
    let parsedVariants = variants ? (typeof variants === 'string' ? JSON.parse(variants) : variants) : null;
    let imagesFromBodyParsed = imagesFromBody ? (typeof imagesFromBody === 'string' ? JSON.parse(imagesFromBody) : imagesFromBody) : null;

    // Validation
    validateProductInputs({ SKU, name, description, category_id }, true);
    if (parsedVariants) validateVariants(parsedVariants);

    // Check product
    const existingProduct = await sql`SELECT id FROM product WHERE id = ${id}`;
    if (existingProduct.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check category if changed
    if (category_id !== undefined) {
      const existingCategory = await sql`SELECT id FROM category WHERE id = ${category_id}`;
      if (existingCategory.length === 0) {
        return res.status(404).json({ message: "Category not found" });
      }
    }

    // Check SKU if changed
    if (SKU !== undefined) {
      const skuCheck = await sql`SELECT id FROM product WHERE SKU = ${SKU} AND id != ${id}`;
      if (skuCheck.length > 0) {
        return res.status(409).json({ message: "SKU already exists" });
      }
    }

    // Handle images
    let newImages = null;
    try {
      const uploadedImages = await handleImageUploads(req);
      if (uploadedImages.length > 0) {
        newImages = uploadedImages;
      } else if (imagesFromBodyParsed !== undefined) {
        newImages = imagesFromBodyParsed;
      }
    } catch (uploadError) {
      return res.status(400).json({ message: uploadError.message });
    }

    // Check updates
    const hasProductUpdates = SKU !== undefined || name !== undefined || description !== undefined || 
                              category_id !== undefined || customer_id !== undefined || newImages !== null;
    const hasVariantUpdates = parsedVariants !== null;
    if (!hasProductUpdates && !hasVariantUpdates) {
      return res.status(400).json({ message: "At least one field must be provided for update" });
    }

    // Build dynamic UPDATE với COALESCE (parameterized, JSON.stringify cho images)
    if (hasProductUpdates) {
      let setClause = '';
      const params = [];
      let paramIndex = 1;

      if (SKU !== undefined) {
        setClause += (setClause ? ', ' : '') + `SKU = COALESCE($${paramIndex}, SKU)`;
        params.push(SKU);
        paramIndex++;
      }
      if (name !== undefined) {
        setClause += (setClause ? ', ' : '') + `name = COALESCE($${paramIndex}, name)`;
        params.push(name);
        paramIndex++;
      }
      if (description !== undefined) {
        setClause += (setClause ? ', ' : '') + `description = COALESCE($${paramIndex}, description)`;
        params.push(description);
        paramIndex++;
      }
      if (category_id !== undefined) {
        setClause += (setClause ? ', ' : '') + `category_id = COALESCE($${paramIndex}, category_id)`;
        params.push(category_id);
        paramIndex++;
      }
      if (customer_id !== undefined) {
        setClause += (setClause ? ', ' : '') + `customer_id = COALESCE($${paramIndex}, customer_id)`;
        params.push(customer_id);
        paramIndex++;
      }
      if (newImages !== null) {
        setClause += (setClause ? ', ' : '') + `images = COALESCE($${paramIndex}::jsonb, images)`;
        params.push(JSON.stringify(newImages));
        paramIndex++;
      }

      await sql.unsafe(`UPDATE product SET ${setClause} WHERE id = $${paramIndex}`, ...params);
    }

    // Update variants (replace all)
    if (hasVariantUpdates) {
      await sql`DELETE FROM product_variant WHERE product_id = ${id}`;
      if (parsedVariants.length > 0) {
        for (const v of parsedVariants) {
          await sql`
            INSERT INTO product_variant (product_id, size, color, price, stock, weight, dimensions)
            VALUES (${id}, ${v.size}, ${v.color}, ${v.price}, ${v.stock}, ${v.weight}, ${v.dimensions})
          `;
        }
      }
    }

    // Fetch updated full product
    const fullProduct = await fetchFullProduct(id);

    res.status(200).json({
      success: true,
      data: fullProduct
    });
  } catch (error) {
    console.error("Error updating product:", error);
    if (error.message.includes('required') || error.message.includes('must be')) {
      return res.status(400).json({ message: error.message });
    }
    if (error.code === '23505') {
      return res.status(409).json({ message: "SKU or variant already exists" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Product (cascade to variants)
export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Product ID is required and must be a valid number" });
    }

    const deleted = await sql`DELETE FROM product WHERE id = ${id} RETURNING id, SKU, name`;

    if (deleted.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ success: true, message: "Product deleted successfully", data: deleted[0] });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}