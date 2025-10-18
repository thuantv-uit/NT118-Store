import express from "express";
import {
    createShipment,
    getShipmentById,
    updateShipment,
    deleteShipment
} from "../controllers/shipmentController.js"

const router = express.Router();
router.post("/", createShipment)
router.get("/:id", getShipmentById)
router.put("/:id", updateShipment)
router.delete("/:id", deleteShipment)

export default router;