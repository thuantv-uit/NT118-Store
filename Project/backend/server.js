import express from "express";
import dotenv from "dotenv"
import { initDB } from "./config/database.js";
import router from "./routes/transactionsRoute.js";
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

app.use("/api/transactions", router)

initDB().then(() => {
    app.listen(PORT, () => {
    console.log("Server is up and running on PORT:", PORT);
    });
});