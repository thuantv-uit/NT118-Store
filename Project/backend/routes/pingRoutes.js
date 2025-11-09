// file: routes/pingRoutes.js
import express from "express";
import { sql } from "../config/database.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // gọi query rất nhẹ để giữ kết nối
    await sql`SELECT 1`;
    res.json({ status: "ok", message: "Neon awake" });
  } catch (err) {
    console.error("Ping Neon failed:", err);
    res.status(500).json({ error: "Cannot reach Neon" });
  }
});

export default router;
