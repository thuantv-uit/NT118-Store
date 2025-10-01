import { sql } from "../config/database.js";

// Get Profile for User
export async function getCategoryById(req, res) {
  try {
    const categoryId = req.params;
    // categoryId sẽ trả về dữ liệu dạng mảng { id: '54321' }
    // console.log("categoryId:",categoryId);
    const id = categoryId.id
    // vậy nên phải lấy id từ mảng đó ra chứ không được sử dụng trực tiếp
    // console.log("categoryId:",id);

    // Kiểm tra xem categoryId có được cung cấp không
    if (!id) {
      return res.status(400).json({ message: "category ID is required" });
    }

    // Thực hiện truy vấn
    const categories = await sql`
      SELECT * FROM category WHERE id = ${id}
    `;

    // Kiểm tra xem có bản ghi nào được tìm thấy không
    if (categories.length === 0) {
      return res.status(404).json({ message: "category not found" });
    }

    // Trả về bản ghi đầu tiên (vì id thường là duy nhất)
    res.status(200).json(categories[0]);
  } catch (error) {
    console.error("Error getting the category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createCategory(req, res) {
try {
    const { id, name } = req.body;

    if (!name || !id ) {
    return res.status(400).json({ message: "All fields are required" });
    }

    const categorys = await sql`
    INSERT INTO category(id, name )
    VALUES (${id},${name})
    RETURNING *
    `;

    // To use debug
    // console.log(categorys);
    res.status(201).json(categorys[0]);
} catch (error) {
    console.log("Error creating the catrgory", error);
    res.status(500).json({ message: "Internal server error" });
    }
}

// Update for category
export async function updateCategory(req, res) {
  try {
    const { id } = req.params; // lấy id từ URL
    const { name } = req.body; // lấy data từ body

    // Kiểm tra input
    if (!id) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    // Thực hiện update
    const updatedCategory = await sql`
      UPDATE category
      SET 
        name = ${name}
      WHERE id = ${id}
      RETURNING *;
    `;

    // Nếu không có bản ghi nào được cập nhật
    if (updatedCategory.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Trả về dữ liệu sau khi update
    res.status(200).json(updatedCategory[0]);
  } catch (error) {
    console.error("Error updating the Category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete category by ID
export async function deleteCategory(req, res) {
  try {
    const { id } = req.params; // Lấy id từ URL

    // Kiểm tra input
    if (!id) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    // Xóa category
    const deletedCategored = await sql`
      DELETE FROM category WHERE id = ${id}
      RETURNING *;
    `;

    // Nếu không có bản ghi nào bị xóa
    if (deletedCategored.length === 0) {
      return res.status(404).json({ message: "order not found" });
    }

    // Trả về category đã bị xóa
    res.status(200).json({
      message: "category deleted successfully",
      order: deletedCategored[0]
    });
  } catch (error) {
    console.error("Error deleting the category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}