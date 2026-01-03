import { pool } from "./db.js";

console.log("🔥 Jest setup running");

async function waitForDB(retries = 15) {
  while (retries--) {
    try {
      await pool.query("SELECT 1");
      return;
    } catch {
      await new Promise(res => setTimeout(res, 1000));
    }
  }
  throw new Error("❌ PostgreSQL not ready");
}

beforeAll(async () => {
  await waitForDB();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS wallet (
      id SERIAL PRIMARY KEY,
      balance DECIMAL(10,2) NOT NULL DEFAULT 0,
      customer_id VARCHAR(255) UNIQUE NOT NULL,
      created_at DATE DEFAULT CURRENT_DATE,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS wallet_transaction (
      id SERIAL PRIMARY KEY,
      wallet_id INT REFERENCES wallet(id) ON DELETE CASCADE,
      customer_id VARCHAR(255),
      type VARCHAR(50),
      amount DECIMAL(10,2),
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
});

afterEach(async () => {
  await pool.query(
    "TRUNCATE wallet_transaction, wallet RESTART IDENTITY CASCADE"
  );
});

afterAll(async () => {
  await pool.end();
});
