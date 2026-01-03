import pg from "pg";
const { Pool } = pg;

export const pool = new Pool({
  host: "127.0.0.1",
  port: 5432,
  user: "test",
  password: "test",
  database: "app_test",
});

export const query = (text, params) => pool.query(text, params);
