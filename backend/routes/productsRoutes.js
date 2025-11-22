import express from "express";
import { 
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct,
    getAllProducts
} from "../controllers/productsController.js";
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
router.post("/", upload.single('image'), createProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.put("/:id", upload.single('image'), updateProduct);
router.delete("/:id", deleteProduct);

export default router;