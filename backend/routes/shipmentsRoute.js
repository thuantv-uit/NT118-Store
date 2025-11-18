import express from "express";
import {
    createShipment,
    getShipmentById,
    updateShipment,
    deleteShipment,
    getShippingAddressesByCustomer
} from "../controllers/shipmentController.js"

const router = express.Router();
router.post("/", createShipment)
router.get("/:id", getShipmentById)
router.put("/:id", updateShipment)
router.delete("/:id", deleteShipment)
router.get("/:customer_id/addresses", getShippingAddressesByCustomer);

export default router;