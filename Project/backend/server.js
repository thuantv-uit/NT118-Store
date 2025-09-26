import express from "express";
import dotenv from "dotenv"
import { initDB } from "./config/database.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT;

app.get("/", (req, res) => {
    res.send("It's working")
})

initDB().then(() => {
    app.listen(PORT, () => {
    console.log("Server is up and running on PORT:", PORT);
    });
});