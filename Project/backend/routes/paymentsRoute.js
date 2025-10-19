import express from "express";
import { 
    createPayment,
    getPaymentById,
    updatePayment,
    deletePayment
} from "../controllers/paymentController.js";

const router = express.Router();
router.post("/", createPayment);
router.get("/:id", getPaymentById);
router.put("/:id", updatePayment);
router.delete("/:id", deletePayment);

export default router;