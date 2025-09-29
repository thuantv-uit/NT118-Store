import { neon } from "@neondatabase/serverless";

import "dotenv/config";

// Creates a SQL connection using our DB URL
export const sql = neon(process.env.DATABASE_URL);

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
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;
    console.log("Database customer initialized successfully");

    await sql`CREATE TABLE IF NOT EXISTS shipment(
      id VARCHAR(255) PRIMARY KEY,
      first_name TIMESTAMP NOT NULL,
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
      id VARCHAR(255) PRIMARY KEY,
      payment_date TIMESTAMP NOT NULL,
      payment_method VARCHAR(255) NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      customer_id VARCHAR(255) NULL REFERENCES customer(id),
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;
    console.log("Database payment initialized successfully");

    await sql`CREATE TABLE IF NOT EXISTS "order"(
      id VARCHAR(255) PRIMARY KEY,
      order_date TIMESTAMP NOT NULL,
      total_price DECIMAL(10,2) NOT NULL,
      customer_id VARCHAR(255) NULL REFERENCES customer(id),
      payment_id VARCHAR(255) NULL REFERENCES payment(id),
      shipment_id VARCHAR(255) NULL REFERENCES shipment(id),
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;
    console.log("Database order initialized successfully");

    await sql`CREATE TABLE IF NOT EXISTS "category"(
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;
    console.log("Database category initialized successfully");

    await sql`CREATE TABLE IF NOT EXISTS "product"(
      id VARCHAR(255) PRIMARY KEY,
      SKU VARCHAR(255) NOT NULL,
      description VARCHAR(255) NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      stock INT NOT NULL,
      category_id VARCHAR(255) NULL REFERENCES category(id),
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;
    console.log("Database product initialized successfully");

    await sql`CREATE TABLE IF NOT EXISTS "cart"(
      id VARCHAR(255) PRIMARY KEY,
      quantity INT NOT NULL,
      customer_id VARCHAR(255) NULL REFERENCES customer(id),
      product_id VARCHAR(255) NULL REFERENCES product(id),
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;
    console.log("Database cart initialized successfully");

    await sql`CREATE TABLE IF NOT EXISTS "wish_list"(
      id VARCHAR(255) PRIMARY KEY,
      customer_id VARCHAR(255) NULL REFERENCES customer(id),
      product_id VARCHAR(255) NULL REFERENCES product(id),
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;
    console.log("Database wishlist initialized successfully");

    await sql`CREATE TABLE IF NOT EXISTS "order_item"(
      id VARCHAR(255) PRIMARY KEY,
      quantity INT NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      shipment_id VARCHAR(255) NULL REFERENCES shipment(id),
      order_id VARCHAR(255) NULL REFERENCES "order"(id),
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;
    console.log("Database order_item initialized successfully");

  } catch (error) {
    console.log("Error initializing DB", error);
    process.exit(1); // status code 1 means failure, 0 success
  }
}