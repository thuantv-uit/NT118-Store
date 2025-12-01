import express from "express";
import multer from 'multer';
import { 
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  getAllProducts,
  updateVariantStock
} from "../controllers/productsController.js";

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

router.post("/", upload.array('images', 5), createProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.put("/:id", upload.array('images', 5), updateProduct);
router.delete("/:id", deleteProduct);
router.put('/products/:product_id/variants/:variant_id/stock', updateVariantStock);

export default router;