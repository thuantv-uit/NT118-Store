import express from "express";
import { 
    createwishList,
    getwishListById,
    deleteWishList
} from "../controllers/wishListController.js"; 

const router = express.Router();
router.post("/", createwishList);
router.get("/:id", getwishListById);
router.delete("/:id", deleteWishList);


export default router;