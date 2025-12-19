import express from "express";
import {
    createCustomer,
    getCustomerById,
    updateCustomer,
    syncEmailFromClerk
} from "../controllers/customersController.js"
import multer from 'multer';
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only images allowed'), false);
    }
    cb(null, true);
  }
});

const router = express.Router();
router.get("/:id", getCustomerById)
router.post("/", upload.single('avatar'), createCustomer)
router.put("/:id",upload.single('avatar'), updateCustomer)
router.patch("/sync-email", syncEmailFromClerk)

export default router;