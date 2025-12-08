import { sql } from "../config/database.js";

// Get for wishList
export async function getwishListById(req, res) {
  try {
    const wishListId = req.params;
    // wishListId sẽ trả về dữ liệu dạng mảng { id: '54321' }
    // console.log("wishListId:",wishListId);
    const id = wishListId.id
    // vậy nên phải lấy id từ mảng đó ra chứ không được sử dụng trực tiếp
    // console.log("wishListId:",id);

    // Kiểm tra xem wishListId có được cung cấp không
    if (!id) {
      return res.status(400).json({ message: "wishList ID is required" });
    }

    // Thực hiện truy vấn
    const wishLists = await sql`
      SELECT * FROM wish_list WHERE id = ${id}
    `;

    // Kiểm tra xem có bản ghi nào được tìm thấy không
    if (wishLists.length === 0) {
      return res.status(404).json({ message: "wishLists not found" });
    }

    // Trả về bản ghi đầu tiên (vì id thường là duy nhất)
    res.status(200).json(wishLists[0]);
  } catch (error) {
    console.error("Error getting the wishLists:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get all wishlist items for a customer
export async function getWishListByCustomer(req, res) {
  try {
    const { customerId } = req.params;

    if (!customerId) {
      return res.status(400).json({ message: "Customer ID is required" });
    }

    const wishLists = await sql`
      SELECT * FROM wish_list WHERE customer_id = ${customerId}
    `;

    // Không trả lỗi, chỉ trả danh sách rỗng nếu không có dữ liệu
    return res.status(200).json(wishLists);
  } catch (error) {
    console.error("Error getting wishlist of customer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Create wishlist
export async function createwishList(req, res) {
try {
    const { customer_id, product_id } = req.body;

    const wishList = await sql`
    INSERT INTO wish_list(customer_id, product_id)
    VALUES (${customer_id},${product_id})
    RETURNING *
    `;

    // To use debug
    // console.log(wishList);
    res.status(201).json(wishList[0]);
} catch (error) {
    console.log("Error creating the wishList", error);
    res.status(500).json({ message: "Internal server error" });
    }
}

// Delete WishList by ID
export async function deleteWishList(req, res) {
  try {
    const { id } = req.params; // Lấy id từ URL

    // Kiểm tra input
    if (!id) {
      return res.status(400).json({ message: "WishList ID is required" });
    }

    // Xóa order
    const deletedWishList = await sql`
      DELETE FROM wish_list WHERE id = ${id}
      RETURNING *;
    `;

    // Nếu không có bản ghi nào bị xóa
    if (deletedWishList.length === 0) {
      return res.status(404).json({ message: "WishList not found" });
    }

    // Trả về cart đã bị xóa
    res.status(200).json({
      message: "WishList deleted successfully",
      product: deletedWishList[0]
    });
  } catch (error) {
    console.error("Error deleting the WishList:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}