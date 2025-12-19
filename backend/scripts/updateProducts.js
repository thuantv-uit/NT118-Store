import { neon } from "@neondatabase/serverless";
import "dotenv/config";

const sql = neon(process.env.DATABASE_URL);

// ID của seller mặc định (thay bằng ID seller thật trong database của bạn)
const DEFAULT_SELLER_ID = "user_36uOaryCbu3BtDEJl1uyXbyW7k2";

// Danh sách ảnh thật cho từng category
const categoryImages = {
  1: [ // Thời trang nữ
    "https://res.cloudinary.com/dprqatuel/image/upload/v1765853361/product_images/ym8uonk8h5yvpejrexgg.jpg",
    "https://res.cloudinary.com/dprqatuel/image/upload/v1765968529/product_images/%C3%81o_thun_basic_cotton_n%E1%BB%AF_1765968526690.jpg",
    "https://res.cloudinary.com/dprqatuel/image/upload/v1765968564/product_images/V%C3%A1y_maxi_hoa_nh%C3%AD_1765968561378.jpg",
  ],
  2: [ // Thời trang nam
    "https://res.cloudinary.com/dprqatuel/image/upload/v1765964059/product_images/cdun4g7tdcmkk1qzt6es.jpg",
    "https://res.cloudinary.com/dprqatuel/image/upload/v1765968542/product_images/%C3%81o_kho%C3%A1c_blazer_n%E1%BB%AF_c%C3%B4ng_s%E1%BB%9F_1765968538957.jpg",
    "https://res.cloudinary.com/dprqatuel/image/upload/v1765968658/product_images/%C3%81o_polo_nam_cao_c%E1%BA%A5p_1765968658003.jpg",
  ],
  3: [ // Giày dép
    "https://res.cloudinary.com/dprqatuel/image/upload/v1765964399/product_images/mff5ezwys3gynvvkdrye.jpg",
    "https://res.cloudinary.com/dprqatuel/image/upload/v1765968577/product_images/Qu%E1%BA%A7n_jean_n%E1%BB%AF_%E1%BB%91ng_r%E1%BB%99ng_1765968573530.jpg",
    "https://res.cloudinary.com/dprqatuel/image/upload/v1765968667/product_images/Qu%E1%BA%A7n_kaki_nam_1765968667788.jpg",
  ],
  4: [ // Phụ kiện
    "https://res.cloudinary.com/dprqatuel/image/upload/v1765964573/product_images/r4fruuko9pplbtdudipd.jpg",
    "https://res.cloudinary.com/dprqatuel/image/upload/v1765968612/product_images/Balo_n%E1%BB%AF_mini_da_PU_1765968606587.jpg",
    "https://res.cloudinary.com/dprqatuel/image/upload/v1765968621/product_images/T%C3%BAi_x%C3%A1ch_tote_canvas_1765968619091.jpg",
  ],
  5: [ // Làm đẹp
    "https://res.cloudinary.com/dprqatuel/image/upload/v1765968635/product_images/Gi%C3%A0y_sneaker_n%E1%BB%AF_tr%E1%BA%AFng_1765968635750.jpg",
    "https://res.cloudinary.com/dprqatuel/image/upload/v1765968639/product_images/Gi%C3%A0y_cao_g%C3%B3t_b%C3%ADt_m%C5%A9i_1765968639880.jpg",
    "https://res.cloudinary.com/dprqatuel/image/upload/v1765964722/product_images/n2ybhihwhbebeljl8ph5.jpg",
  ],
  6: [ // Đồng hồ
    "https://res.cloudinary.com/dprqatuel/image/upload/v1765968630/product_images/M%C5%A9_bucket_th%C3%AAu_ch%E1%BB%AF_1765968629325.jpg",
  ],
  7: [ // Điện tử
    "https://res.cloudinary.com/dprqatuel/image/upload/v1765968202/product_images/V%C3%A1y_maxi_hoa_nh%C3%AD_1765968195147.jpg",
  ],
  8: [ // Gia dụng
    "https://res.cloudinary.com/dprqatuel/image/upload/v1765968553/product_images/%C3%81o_s%C6%A1_mi_tr%E1%BA%AFng_c%C6%A1_b%E1%BA%A3n_1765968550423.jpg",
  ],
};

async function updateProducts() {
  try {
    console.log("🔄 Starting product update...\n");

    // Lấy tất cả sản phẩm có customer_id NULL hoặc ảnh placeholder
    const productsToUpdate = await sql`
      SELECT id, name, category_id, images, customer_id
      FROM product 
      WHERE customer_id IS NULL 
         OR images::text LIKE '%/v1/products/%'
      ORDER BY id
    `;

    console.log(`📦 Found ${productsToUpdate.length} products to update\n`);

    let updatedCount = 0;

    for (const product of productsToUpdate) {
      const categoryId = product.category_id;
      const images = categoryImages[categoryId] || categoryImages[1]; // Fallback to category 1
      
      // Lấy random image từ category
      const randomImage = images[Math.floor(Math.random() * images.length)];
      const newImages = [randomImage];

      // Update product
      await sql`
        UPDATE product 
        SET 
          customer_id = ${DEFAULT_SELLER_ID},
          images = ${JSON.stringify(newImages)}
        WHERE id = ${product.id}
      `;

      updatedCount++;
      console.log(`✅ Updated product #${product.id}: ${product.name}`);
      console.log(`   Category: ${categoryId}, New image: ${randomImage.substring(0, 60)}...`);
    }

    console.log(`\n✨ Update completed! ${updatedCount} products updated.`);

    // Hiển thị thống kê
    const stats = await sql`
      SELECT 
        category_id,
        COUNT(*) as total
      FROM product
      GROUP BY category_id
      ORDER BY category_id
    `;

    console.log("\n📊 Product distribution by category:");
    stats.forEach(stat => {
      console.log(`   Category ${stat.category_id}: ${stat.total} products`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error updating products:", error);
    process.exit(1);
  }
}

updateProducts();
