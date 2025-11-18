import { sql } from "../config/database.js";
import { streamUpload } from '../config/cloudinaryProvider.js';

// Constants for upload
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const VALID_IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/gif'];

// Helper function for upload avatar (reusable)
async function handleAvatarUpload(req) {
  if (!req.file) return null;

  // Validate file
  if (req.file.size > MAX_FILE_SIZE) {
    throw new Error('File too large (max 5MB)');
  }
  if (!VALID_IMAGE_MIMES.includes(req.file.mimetype)) {
    throw new Error('Invalid file type. Only images allowed.');
  }

  try {
    const result = await streamUpload(req.file.buffer, 'customer_avatars');
    // Cleanup buffer
    delete req.file.buffer;
    return result.secure_url;
  } catch (uploadError) {
    console.error('Cloudinary upload failed:', uploadError);
    throw new Error('Failed to upload avatar');
  }
}

// Get Profile for User
export async function getCustomerById(req, res) {
  try {
    const userId = req.params;
    // userId will return data array { id: '54321' }
    // console.log("userId:",userId);
    const id = userId.id
    // so we have to get id from that array
    // console.log("userId:",id);

    // Check userId is it provided
    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Execute the query
    const customer = await sql`
      SELECT * FROM users WHERE id = ${id}
    `;

    // Check if any records are found
    if (customer.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Returns the first record (since id is usually unique)
    res.status(200).json(customer[0]);
  } catch (error) {
    console.error("Error getting the customer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Create profile for user
export async function createCustomer(req, res) {
  try {
    const {
      first_name,
      last_name,
      phone_number,
      role,
      id,
      avatar: avatarFromBody,
      name,
    } = req.body;

    if (!first_name || !last_name || !id || !phone_number || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Handle upload avatar (priority upload > body)
    let avatarUrl = avatarFromBody || null;
    try {
      const uploadedAvatar = await handleAvatarUpload(req);
      if (uploadedAvatar) avatarUrl = uploadedAvatar;
    } catch (uploadError) {
      return res.status(400).json({ message: uploadError.message });
    }

    const displayName =
      name ||
      `${last_name || ""} ${first_name || ""}`.trim() ||
      null;

    const [profile] = await sql`
      INSERT INTO users(id, first_name, last_name, phone_number, role, avatar, avatar_url, name)
      VALUES (${id},${first_name},${last_name},${phone_number},${role}, ${avatarUrl}, ${avatarUrl}, ${displayName})
      ON CONFLICT (id) DO UPDATE SET
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        phone_number = EXCLUDED.phone_number,
        role = EXCLUDED.role,
        avatar = COALESCE(EXCLUDED.avatar, users.avatar),
        avatar_url = COALESCE(EXCLUDED.avatar_url, users.avatar_url),
        name = COALESCE(EXCLUDED.name, users.name)
      RETURNING *
    `;

    // To use debug
    // console.log(customer);
    res.status(201).json(profile);
  } catch (error) {
    console.log("Error creating the transaction", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Update profile for user
export async function updateCustomer(req, res) {
  try {
    const { id } = req.params; // get id from URL
    const { first_name, last_name, phone_number, role, avatar: avatarFromBody } = req.body;

    // Check input
    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    //Check if at least one field needs to be updated
    const hasUpdates = first_name !== undefined || last_name !== undefined || phone_number !== undefined || role !== undefined || avatarFromBody !== undefined;
    if (!hasUpdates) {
      return res.status(400).json({ message: "At least one field must be provided for update" });
    }

    let avatarUrl = null;
    try {
      const uploadedAvatar = await handleAvatarUpload(req);
      if (uploadedAvatar) {
        avatarUrl = uploadedAvatar;
      } else if (avatarFromBody !== undefined) {
        avatarUrl = avatarFromBody || null;
      }
    } catch (uploadError) {
      return res.status(400).json({ message: uploadError.message });
    }

    const recomputedName =
      first_name !== undefined || last_name !== undefined
        ? `${last_name ?? ""} ${first_name ?? ""}`.trim()
        : null;

    const updatedCustomer = await sql`
      UPDATE users
      SET 
        first_name = COALESCE(${first_name}, first_name),
        last_name = COALESCE(${last_name}, last_name),
        phone_number = COALESCE(${phone_number}, phone_number),
        role = COALESCE(${role}, role),
        avatar = COALESCE(${avatarUrl}, avatar),
        avatar_url = COALESCE(${avatarUrl}, avatar_url),
        name = COALESCE(${recomputedName}, name)
      WHERE id = ${id}
      RETURNING *;
    `;

    // If no records are updated
    if (updatedCustomer.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Return data after update
    res.status(200).json(updatedCustomer[0]);
  } catch (error) {
    console.error("Error updating the customer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
