import express from "express";
import {
    createCustomer,
    getCustomerById,
    updateCustomerFirstName
} from "../controllers/customersController.js"

const router = express.Router();
router.get("/:id", getCustomerById)
router.post("/", createCustomer)
router.put("/:id", updateCustomerFirstName)

export default router;