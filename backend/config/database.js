import { neon } from "@neondatabase/serverless";

import "dotenv/config";

// Creates a SQL connection using our DB URL
export const sql = neon(process.env.DATABASE_URL);

export async function initDB() {
  try {
    await sql`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`;

    await sql`CREATE TABLE IF NOT EXISTS users(
      id TEXT PRIMARY KEY,
      email TEXT,
      name TEXT,
      avatar_url TEXT,
      first_name VARCHAR(255),
      last_name VARCHAR(255),
      phone_number VARCHAR(255),
      avatar VARCHAR(255) NOT NULL DEFAULT '',
      role VARCHAR(50) NOT NULL DEFAULT 'buyer' CHECK (role IN ('seller', 'buyer', 'shipper')),
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;
    console.log("Database users initialized successfully");

    await sql`CREATE TABLE IF NOT EXISTS shipping_address(
      id SERIAL PRIMARY KEY,
      customer_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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
      customer_id VARCHAR(255) NULL REFERENCES users(id),
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;
    console.log("Database shipment initialized successfully");


    await sql`CREATE TABLE IF NOT EXISTS payment(
      id SERIAL PRIMARY KEY,
      payment_date TIMESTAMP NOT NULL,
      payment_method VARCHAR(255) NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      customer_id VARCHAR(255) NULL REFERENCES users(id),
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;
    console.log("Database payment initialized successfully");

    await sql`CREATE TABLE IF NOT EXISTS "category"(
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
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
      image VARCHAR(255) NOT NULL DEFAULT '',
      category_id INT NULL REFERENCES category(id),
      seller_id VARCHAR(255) NULL REFERENCES users(id),
      customer_id VARCHAR(255) NULL REFERENCES users(id),
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;
    console.log("Database product initialized successfully");
    await sql`ALTER TABLE product
      ADD COLUMN IF NOT EXISTS seller_id VARCHAR(255) REFERENCES users(id)`;
    await sql`ALTER TABLE product
      ADD COLUMN IF NOT EXISTS customer_id VARCHAR(255) REFERENCES users(id)`;

    await sql`CREATE TABLE IF NOT EXISTS "cart"(
      id SERIAL PRIMARY KEY,
      quantity INT NOT NULL,
      size VARCHAR(10) NULL,
      color VARCHAR(50) NULL,
      customer_id VARCHAR(255) NULL REFERENCES users(id),
      product_id INT NULL REFERENCES product(id),
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;
    console.log("Database cart initialized successfully");

    await sql`CREATE TABLE IF NOT EXISTS "wish_list"(
      id VARCHAR(255) PRIMARY KEY,
      customer_id VARCHAR(255) NULL REFERENCES users(id),
      product_id INT NULL REFERENCES product(id),
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;
    console.log("Database wishlist initialized successfully");

    await sql`CREATE TABLE IF NOT EXISTS "order"(
      id SERIAL PRIMARY KEY,
      order_date TIMESTAMP NOT NULL,
      customer_id VARCHAR(255) NULL REFERENCES users(id),
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

    await sql`CREATE TABLE IF NOT EXISTS wallet(
      id SERIAL PRIMARY KEY,
      balance DECIMAL(10,2) NOT NULL DEFAULT 0,
      customer_id VARCHAR(255) NULL REFERENCES users(id),
      created_at DATE NOT NULL DEFAULT CURRENT_DATE,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`;
    console.log("Database wallet initialized successfully");

    await sql`CREATE TABLE IF NOT EXISTS bank_account(
      id SERIAL PRIMARY KEY,
      customer_id VARCHAR(255) NOT NULL REFERENCES users(id),
      bank_name VARCHAR(255) NOT NULL,
      card_number VARCHAR(255) NOT NULL,
      is_default BOOLEAN NOT NULL DEFAULT FALSE,
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;
    console.log("Database bank_account initialized successfully");

    await sql`CREATE TABLE IF NOT EXISTS conversations(
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user1_id TEXT REFERENCES users(id),
      user2_id TEXT REFERENCES users(id),
      created_at TIMESTAMP DEFAULT NOW()
    )`;
    await sql`CREATE UNIQUE INDEX IF NOT EXISTS idx_conversations_unique_pair
      ON conversations ((LEAST(user1_id, user2_id)), (GREATEST(user1_id, user2_id)))`;
    console.log("Database conversations initialized successfully");

    await sql`CREATE TABLE IF NOT EXISTS messages(
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      conversation_id UUID REFERENCES conversations(id),
      sender_id TEXT REFERENCES users(id),
      content TEXT,
      image_url TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      is_read BOOLEAN DEFAULT FALSE
    )`;
    console.log("Database messages initialized successfully");

  } catch (error) {
    console.log("Error initializing DB", error);
    process.exit(1); // status code 1 means failure, 0 success
  }
}

