import express from "express";
import { 
    createTransaction,
    getTransactionsByUserId,
} from "../controllers/transactionsController.js";

const router = express.Router();

router.post("/", createTransaction);
router.get("/:userId", getTransactionsByUserId);

export default router;