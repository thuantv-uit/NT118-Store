import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import pkg from "pg";

const { Pool } = pkg;

const USE_LOCAL_DB = process.env.USE_LOCAL_DB === "true";
const IS_DOCKER = process.env.IS_DOCKER === "true";

let sql;
let pool;

if (USE_LOCAL_DB) {
  let connectionString = process.env.DATABASE_URL_LOCAL;

  if (!connectionString) {
    connectionString =
      "postgresql://shopuser:shoppass123@localhost:5432/shopdb";
    console.warn("⚠️ DATABASE_URL_LOCAL not set, fallback to localhost");
  }

  // ⭐ FIX QUAN TRỌNG ⭐
  if (!IS_DOCKER) {
    connectionString = connectionString.replace("@db:", "@localhost:");
  }

  pool = new Pool({ connectionString });

  sql = async (strings, ...values) => {
    const text = strings.reduce(
      (acc, str, i) => acc + str + (values[i] ?? ""),
      ""
    );
    return pool.query(text);
  };

  console.log(
    `🗄️ Using LOCAL PostgreSQL (${IS_DOCKER ? "docker" : "localhost"})`
  );
} else {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("❌ DATABASE_URL not found for Neon Cloud");
  }

  sql = neon(connectionString);
  console.log("☁️ Using NEON PostgreSQL (Cloud)");
}

export { sql };

export async function initDB() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS customer(
      id VARCHAR(255) PRIMARY KEY,
      first_name VARCHAR(255) NOT NULL,
      last_name VARCHAR(255) NOT NULL,
      phone_number VARCHAR(255) NOT NULL,
      avatar VARCHAR(255) NOT NULL DEFAULT '',
      role VARCHAR(50) NOT NULL DEFAULT 'buyer' CHECK (role IN ('seller', 'buyer', 'shipper')),
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;
    console.log("Database customer initialized successfully");

    await sql`CREATE TABLE IF NOT EXISTS shipping_address(
      id SERIAL PRIMARY KEY,
      customer_id VARCHAR(255) NOT NULL REFERENCES customer(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL DEFAULT 'Địa chỉ mặc định',
      address VARCHAR(255) NOT NULL,
      city VARCHAR(255) NOT NULL,
      state VARCHAR(255) NOT NULL,
      country VARCHAR(255) NOT NULL,
      zipcode VARCHAR(255) NOT NULL,
      is_default BOOLEAN NOT NULL DEFAULT FALSE,
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;
    console.log("Database shipping_address initialized successfully");

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

    await sql`CREATE TABLE IF NOT EXISTS "category"(
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      gender_type VARCHAR(255) NOT NULL,
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;
    console.log("Database category initialized successfully");

    await sql`CREATE TABLE IF NOT EXISTS "product"(
    id SERIAL PRIMARY KEY,
    SKU VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NULL DEFAULT NULL,
    stock INT NULL DEFAULT 0,
    images JSONB NOT NULL DEFAULT '[]',
    customer_id VARCHAR(255) NULL REFERENCES customer(id),
    category_id INT NULL REFERENCES category(id),
    created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;
    console.log("Database product initialized successfully");

    await sql`CREATE TABLE IF NOT EXISTS "product_variant"(
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL REFERENCES "product"(id) ON DELETE CASCADE,
    size VARCHAR(50) NOT NULL,
    color VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    weight DECIMAL(8,2) NOT NULL DEFAULT 0.00,
    dimensions VARCHAR(100) NOT NULL DEFAULT '',
    created_at DATE NOT NULL DEFAULT CURRENT_DATE,
    UNIQUE(product_id, size, color)
    )`;
    console.log("Database product variant initialized successfully");

    await sql`CREATE TABLE IF NOT EXISTS "cart"(
      id SERIAL PRIMARY KEY,
      quantity INT NOT NULL,
      size VARCHAR(10) NULL,
      color VARCHAR(50) NULL,
      customer_id VARCHAR(255) NULL REFERENCES customer(id),
      product_variant_id INT NULL REFERENCES "product_variant"(id) ON DELETE SET NULL,
      product_id INT NULL REFERENCES product(id),
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;
    console.log("Database cart initialized successfully");

    await sql`CREATE TABLE IF NOT EXISTS "wish_list"(
      id SERIAL PRIMARY KEY,
      customer_id VARCHAR(255) NULL REFERENCES customer(id),
      product_id INT NULL REFERENCES product(id),
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;
    console.log("Database wishlist initialized successfully");

    await sql`CREATE TABLE IF NOT EXISTS "order"(
      id SERIAL PRIMARY KEY,
      order_date TIMESTAMP NOT NULL,
      customer_id VARCHAR(255) NULL REFERENCES customer(id),
      cart_id INT[] NULL,
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
      variant_id INT NULL REFERENCES "product_variant"(id),
      order_id INT NULL REFERENCES "order"(id),
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;
    console.log("Database order_item initialized successfully");

    await sql`CREATE TABLE IF NOT EXISTS "order_status"(
      id SERIAL PRIMARY KEY,
      seller_id VARCHAR(255) NOT NULL REFERENCES customer(id),
      buyer_id VARCHAR(255) NOT NULL REFERENCES customer(id),
      shipper_id VARCHAR(255) NOT NULL REFERENCES customer(id),
      product_id INT NOT NULL REFERENCES "product"(id),
      variant_id INT NULL REFERENCES "product_variant"(id),
      quantity INT NOT NULL DEFAULT NULL,
      order_id INT NOT NULL REFERENCES "order"(id),
      current_location VARCHAR(500) DEFAULT NULL,
      status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
      created_at DATE NOT NULL DEFAULT CURRENT_DATE,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`;
    console.log("Database order_status initialized successfully");

    await sql`CREATE TABLE IF NOT EXISTS wallet(
      id SERIAL PRIMARY KEY,
      balance DECIMAL(10,2) NOT NULL DEFAULT 0,
      customer_id VARCHAR(255) NULL REFERENCES customer(id),
      created_at DATE NOT NULL DEFAULT CURRENT_DATE,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`;
    console.log("Database wallet initialized successfully");

    await sql`CREATE TABLE IF NOT EXISTS bank_account(
      id SERIAL PRIMARY KEY,
      customer_id VARCHAR(255) NOT NULL REFERENCES customer(id),
      bank_name VARCHAR(255) NOT NULL,
      card_number VARCHAR(255) NOT NULL,
      is_default BOOLEAN NOT NULL DEFAULT FALSE,
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;
    console.log("Database bank_account initialized successfully");

    await sql`CREATE TABLE IF NOT EXISTS wallet_transaction(
      id SERIAL PRIMARY KEY,
      wallet_id INT NOT NULL REFERENCES wallet(id) ON DELETE CASCADE,
      customer_id VARCHAR(255) NOT NULL REFERENCES customer(id) ON DELETE CASCADE,
      type VARCHAR(50) NOT NULL CHECK (type IN ('deposit', 'withdraw', 'purchase', 'refund', 'adjustment')),
      amount DECIMAL(10,2) NOT NULL,
      description TEXT,
      status VARCHAR(50) NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
      transaction_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;
    console.log("Database wallet_transaction initialized successfully");

    await sql`CREATE TABLE IF NOT EXISTS conversations(
      id SERIAL PRIMARY KEY,
      buyer_id VARCHAR(255) NOT NULL REFERENCES customer(id) ON DELETE CASCADE,
      seller_id VARCHAR(255) NOT NULL REFERENCES customer(id) ON DELETE CASCADE,
      title VARCHAR(255) NULL,  -- Tiêu đề cuộc trò chuyện (ví dụ: "Chat về đơn hàng #123")
      created_at DATE NOT NULL DEFAULT CURRENT_DATE,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`;
    console.log("Database conversations initialized successfully");

    await sql`CREATE TABLE IF NOT EXISTS messages(
      id SERIAL PRIMARY KEY,
      conversation_id INT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
      sender_id VARCHAR(255) NOT NULL REFERENCES customer(id) ON DELETE CASCADE,
      message_text TEXT NOT NULL,
      is_read BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`;
    console.log("Database messages initialized successfully");

  } catch (error) {
    console.log("Error initializing DB", error);
    process.exit(1); // status code 1 means failure, 0 success
  }
}
