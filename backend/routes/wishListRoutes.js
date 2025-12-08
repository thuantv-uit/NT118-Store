import express from "express";
import { 
    createwishList,
    getwishListById,
    getWishListByCustomer,
    deleteWishList
} from "../controllers/wishListController.js"; 

const router = express.Router();
router.post("/", createwishList);
router.get("/customer/:customerId", getWishListByCustomer);
router.get("/:id", getwishListById);
router.delete("/:id", deleteWishList);

export default router;