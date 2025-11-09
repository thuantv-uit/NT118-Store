// import express from "express";
// import dotenv from "dotenv"
// import { initDB } from "./config/database.js";
// import router from "./routes/transactionsRoute.js";
// import customerRoutes from "./routes/customersRoute.js";
// import shipmentRoutes from "./routes/shipmentsRoute.js"
// import paymentRoutes from "./routes/paymentsRoute.js"
// import orderRoutes from "./routes/ordersRoute.js"
// import categoryRoutes from "./routes/categoriesRoutes.js"
// import productRoutes from "./routes/productsRoutes.js"
// import cartRoutes from "./routes/cartsRoutes.js"
// import orderItemsRoutes from "./routes/orderItemsRoutes.js"
// import wishListRoutes from "./routes/wishListRoutes.js"
// import rateLimiter from "./middleware/rateLimiter.js";

// //them c

// dotenv.config();

// const app = express();

// // Middleware
// app.use(rateLimiter)
// app.use(express.json());

// const PORT = process.env.PORT;

// app.get("/", (req, res) => {
//     res.send("It's working")
// })

// app.use("/api/transactions", router);
// app.use("/api/customers", customerRoutes);
// app.use("/api/shipment", shipmentRoutes);
// app.use("/api/payment", paymentRoutes);
// app.use("/api/order", orderRoutes);
// app.use("/api/category", categoryRoutes);
// app.use("/api/product", productRoutes);
// app.use("/api/cart", cartRoutes);
// app.use("/api/order_item", orderItemsRoutes);
// app.use("/api/wish_list", wishListRoutes);

// initDB().then(() => {
//     app.listen(PORT, () => {
//     console.log("Server is up and running on PORT:", PORT);
//     });
// });

// -------------------------------
// IMPORT CẦN THIẾT
// -------------------------------
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import rateLimiter from "./middleware/rateLimiter.js";

// ROUTES
import transactionRoutes from "./routes/transactionsRoute.js";
import customerRoutes from "./routes/customersRoute.js";
import shipmentRoutes from "./routes/shipmentsRoute.js";
import paymentRoutes from "./routes/paymentsRoute.js";
import orderRoutes from "./routes/ordersRoute.js";
import categoryRoutes from "./routes/categoriesRoutes.js";
import productRoutes from "./routes/productsRoutes.js";
import uploadsRouter from "./routes/uploads.js";
import cartRoutes from "./routes/cartsRoutes.js";
import orderItemsRoutes from "./routes/orderItemsRoutes.js";
import wishListRoutes from "./routes/wishListRoutes.js";
import pingRoutes from "./routes/pingRoutes.js";


// DATABASE
import { initDB } from "./config/database.js";

// -------------------------------
// CẤU HÌNH CƠ BẢN
// -------------------------------
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// 🔍 Kiểm tra biến môi trường
if (!process.env.DATABASE_URL) {
  console.error("Missing DATABASE_URL in .env file");
  process.exit(1);
}

// -------------------------------
// MIDDLEWARE CẤU HÌNH
// -------------------------------

// Health check (nên để trên cùng, không giới hạn rate)
app.get("/", (req, res) => res.send("Siny API server is running successfully!"));

// CORS
app.use(
  cors({
    origin: "*", // ⚠️ bạn có thể giới hạn origin nếu deploy thật
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// JSON body parser
app.use(express.json({ limit: "1mb" }));

// Security & performance
app.use(helmet());
app.use(compression());

// Logging
app.use(morgan("dev"));

// Rate limiter (sau health check)
app.use(rateLimiter);

// -------------------------------
// API ROUTES
// -------------------------------
app.use("/api/transactions", transactionRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/shipments", shipmentRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/uploads", uploadsRouter);
app.use("/api/carts", cartRoutes);
app.use("/api/order-items", orderItemsRoutes);
app.use("/api/wish-lists", wishListRoutes);
app.use("/api/ping", pingRoutes);

// -------------------------------
//404 & ERROR HANDLING
// -------------------------------
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});

app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ message: "Internal server error" });
});

// -------------------------------
// KHỞI TẠO DATABASE + CHẠY SERVER
// -------------------------------
initDB()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Server is up and running on PORT ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("Database initialization failed:", err);
    process.exit(1);
  });
