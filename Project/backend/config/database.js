import { neon } from "@neondatabase/serverless";
// import pkg from "pg";
// const { Pool } = pkg;
import "dotenv/config";

// Creates a SQL connection using our DB URL
export const sql = neon(process.env.DATABASE_URL);
// export const pool = new Pool({
//   user: "postgres",
//   host: "ep-abc123.ap-southeast-1.aws.neon.tech", // hoặc localhost
//   database: "your_database",
//   password: "your_password",
//   port: 5432,
//   ssl: true,
// });
export async function initDB() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS transactions(
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      title  VARCHAR(255) NOT NULL,
      amount  DECIMAL(10,2) NOT NULL,
      category VARCHAR(255) NOT NULL,
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;
    console.log("Database initialized successfully");

    await sql`CREATE TABLE IF NOT EXISTS customer(
      id VARCHAR(255) PRIMARY KEY,
      first_name VARCHAR(255) NOT NULL,
      last_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      address VARCHAR(255) NOT NULL,
      phone_number VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL DEFAULT 'buyer' CHECK (role IN ('seller', 'buyer', 'shiper')),
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;
    console.log("Database customer initialized successfully");

    await sql`CREATE TABLE IF NOT EXISTS shipment(
      id SERIAL PRIMARY KEY,
      shipment_date TIMESTAMP NOT NULL,
      address VARCHAR(255) NOT NULL,
      city VARCHAR(255) NOT NULL,
      state VARCHAR(255) NOT NULL,
      country VARCHAR(255) NOT NULL,
      zipcode VARCHAR(255) NOT NULL,
      customer_id VARCHAR(255) NULL REFERENCES customer(id),
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;
    console.log("Database shipment initialized successfully");


    await sql`CREATE TABLE IF NOT EXISTS payment(
      id SERIAL PRIMARY KEY,
      payment_date TIMESTAMP NOT NULL,
      payment_method VARCHAR(255) NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      customer_id VARCHAR(255) NULL REFERENCES customer(id),
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;
    console.log("Database payment initialized successfully");

    // await sql`CREATE TABLE IF NOT EXISTS "order"(
    //   id SERIAL PRIMARY KEY,
    //   order_date TIMESTAMP NOT NULL,
    //   total_price DECIMAL(10,2) NOT NULL,
    //   customer_id VARCHAR(255) NULL REFERENCES customer(id),
    //   payment_id INT NULL REFERENCES payment(id),
    //   shipment_id INT NULL REFERENCES shipment(id),
    //   created_at DATE NOT NULL DEFAULT CURRENT_DATE
    // )`;
    // console.log("Database order initialized successfully");

    await sql`CREATE TABLE IF NOT EXISTS "category"(
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      parent_id INT NULL REFERENCES category(id) ON DELETE SET NULL,
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;
    console.log("Database category initialized successfully");

    await sql`CREATE TABLE IF NOT EXISTS "product"(
      id SERIAL PRIMARY KEY,
      SKU VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      description VARCHAR(255) NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      stock INT NOT NULL,
      category_id INT NULL REFERENCES category(id),
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;
    console.log("Database product initialized successfully");
     /** ---------- PRODUCT DETAIL ATTRIBUTE (Kho, chất liệu ...) ---------- **/
    await sql`CREATE TABLE IF NOT EXISTS product_attribute (
      id SERIAL PRIMARY KEY,
      product_id INT REFERENCES product(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,   -- Kho / Chất liệu / Dịp / ...
      value VARCHAR(255) NOT NULL
    )`;
    console.log("Database product_attribute initialized successfully");

    await sql`CREATE TABLE IF NOT EXISTS product_media (
      id SERIAL PRIMARY KEY,
      product_id INT REFERENCES product(id) ON DELETE CASCADE,
      url VARCHAR(1000) NOT NULL,
      public_id VARCHAR(500),
      type VARCHAR(50),
      is_cover BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`;
    console.log("Database product_media initialized successfully");

    /** ---------- PRODUCT VARIATION (Màu / Size) ---------- **/
    await sql`CREATE TABLE IF NOT EXISTS product_variation(
      id SERIAL PRIMARY KEY,
      product_id INT REFERENCES product(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL   -- "Màu sắc" hoặc "Kích cỡ"
    )`;
    console.log("Database product_variation initialized successfully");

    /** ---------- PRODUCT VARIATION OPTION (Đen, Trắng, M, L ...) ---------- **/
    await sql`CREATE TABLE IF NOT EXISTS product_variation_option(
      id SERIAL PRIMARY KEY,
      variation_id INT REFERENCES product_variation(id) ON DELETE CASCADE,
      value VARCHAR(255) NOT NULL,
      image VARCHAR(500)           -- ảnh ứng với màu (nếu có)
    )`;
    console.log("Database product_variation_option initialized successfully");

    /** ---------- PRODUCT SHIPPING ---------- **/
    await sql`CREATE TABLE IF NOT EXISTS product_shipping (
      id SERIAL PRIMARY KEY,
      product_id INT REFERENCES product(id) ON DELETE CASCADE,
      method VARCHAR(255) NOT NULL,
      fee DECIMAL(10,2) NOT NULL,
      handling_time VARCHAR(255) NOT NULL
    )`;
    console.log("Database product_shipping initialized successfully");

    await sql`CREATE TABLE IF NOT EXISTS "cart"(
      id SERIAL PRIMARY KEY,
      quantity INT NOT NULL,
      customer_id VARCHAR(255) NULL REFERENCES customer(id),
      product_id INT NULL REFERENCES product(id),
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;
    console.log("Database cart initialized successfully");

    await sql`CREATE TABLE IF NOT EXISTS "wish_list"(
      id VARCHAR(255) PRIMARY KEY,
      customer_id VARCHAR(255) NULL REFERENCES customer(id),
      product_id INT NULL REFERENCES product(id),
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;
    console.log("Database wishlist initialized successfully");

    await sql`CREATE TABLE IF NOT EXISTS "order"(
      id SERIAL PRIMARY KEY,
      order_date TIMESTAMP NOT NULL,
      customer_id VARCHAR(255) NULL REFERENCES customer(id),
      cart_id INT NULL REFERENCES cart(id),
      payment_id INT NULL REFERENCES payment(id),
      shipment_id INT NULL REFERENCES shipment(id),
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;
    console.log("Database order initialized successfully");

    await sql`CREATE TABLE IF NOT EXISTS "order_item"(
      id SERIAL PRIMARY KEY,
      quantity INT NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      product_id INT NULL REFERENCES product(id),
      order_id INT NULL REFERENCES "order"(id),
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;
    console.log("Database order_item initialized successfully");

  } catch (error) {
    console.log("Error initializing DB", error);
    process.exit(1); // status code 1 means failure, 0 success
  }
}