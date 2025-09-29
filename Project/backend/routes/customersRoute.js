import express from "express";
import {
    createCustomer
} from "../controllers/customersController.js"

const router = express.Router();
router.post("/", createCustomer)

export default router;