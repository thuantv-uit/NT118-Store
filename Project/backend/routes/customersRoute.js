import express from "express";
import {
    createCustomer,
    getCustomerById,
    updateCustomer
} from "../controllers/customersController.js"

const router = express.Router();
router.get("/:id", getCustomerById)
router.post("/", createCustomer)
router.put("/:id", updateCustomer)

export default router;