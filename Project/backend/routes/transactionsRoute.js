import express from "express";
import { 
    createTransaction,
    getTransactionsByUserId,
    deleteTransaction,
} from "../controllers/transactionsController.js";

const router = express.Router();

router.post("/", createTransaction);
router.get("/:userId", getTransactionsByUserId);
router.delete("/:id", deleteTransaction);

export default router;