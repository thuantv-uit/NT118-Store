import express from "express";
import dotenv from "dotenv"
import { initDB } from "./config/database.js";
import router from "./routes/transactionsRoute.js";
import customerRoutes from "./routes/customersRoute.js";
import shipmentRoutes from "./routes/shipmentsRoute.js"
import paymentRoutes from "./routes/paymentsRoute.js"
import orderRoutes from "./routes/ordersRoute.js"
import categoryRoutes from "./routes/categoriesRoutes.js"
import productRoutes from "./routes/productsRoutes.js"
import cartRoutes from "./routes/cartsRoutes.js"
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();

// Middleware
app.use(rateLimiter)
app.use(express.json());

const PORT = process.env.PORT;

app.get("/", (req, res) => {
    res.send("It's working")
})

app.use("/api/transactions", router);
app.use("/api/customers", customerRoutes);
app.use("/api/shipment", shipmentRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);

initDB().then(() => {
    app.listen(PORT, () => {
    console.log("Server is up and running on PORT:", PORT);
    });
});