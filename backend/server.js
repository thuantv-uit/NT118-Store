import express from "express";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import { initDB } from "./config/database.js";
import customerRoutes from "./routes/customersRoute.js";
import shipmentRoutes from "./routes/shipmentsRoute.js";
import paymentRoutes from "./routes/paymentsRoute.js";
import orderRoutes from "./routes/ordersRoute.js";
import categoryRoutes from "./routes/categoriesRoutes.js";
import productRoutes from "./routes/productsRoutes.js";
import cartRoutes from "./routes/cartsRoutes.js";
import orderItemsRoutes from "./routes/orderItemsRoutes.js";
import wishListRoutes from "./routes/wishListRoutes.js";
import shippingAddressRouter from "./routes/shippingAddressRoute.js";
import walletRoutes from "./routes/walletRoutes.js";
import bankAccountRoutes from "./routes/bankAccountRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import cors from "cors";
import os from "os";
import fs from "fs";
import path from "path";
import { initChatSocket } from "./config/chatSocket.js";
// import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const parseOrigins = (value) =>
  value
    ?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const allowedOrigins = parseOrigins(process.env.CLIENT_ORIGINS) || ["*"];

// Enable CORS
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Middleware
// app.use(rateLimiter)
app.use(express.json());

const PORT = process.env.PORT;

// Get local IP address
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const localIP = getLocalIP();
const API_BASE_URL = `http://${localIP}:${PORT}`;

// Write API URL to mobile config
const mobileConfigPath = path.join(process.cwd(), '..', 'mobile', 'constants', 'api.js');
const configContent = `export const API_URL = "${API_BASE_URL}/api";\n`;
fs.writeFileSync(mobileConfigPath, configContent);
console.log(`API URL updated: ${API_BASE_URL}/api`);

const socketOrigins =
  parseOrigins(process.env.SOCKET_ORIGINS) || allowedOrigins || ["*"];

const io = new Server(server, {
  cors: {
    origin: socketOrigins.includes("*") ? "*" : socketOrigins,
    credentials: true,
  },
});

app.set("io", io);
initChatSocket(io);

app.get("/", (req, res) => {
    res.send("It's working")
})

app.use("/api/customers", customerRoutes);
app.use("/api/shipment", shipmentRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order_item", orderItemsRoutes);
app.use("/api/wish_list", wishListRoutes);
app.use("/api/shipping_addresses", shippingAddressRouter);
app.use('/api/wallets', walletRoutes);
app.use('/api/bank_accounts', bankAccountRoutes);
app.use("/api", chatRoutes);

initDB().then(() => {
    server.listen(PORT, () => {
    console.log("Server is up and running on PORT:", PORT);
    });
});
