import { Router } from "express";
import { getPagos, createPago, updateEstadoPago, uploadComprobante } from "../controllers/pago.controller.js";
import { upload } from "../middleware/upload.js"; 

const router = Router();

router.get("/", getPagos);
router.post("/", createPago);
router.put("/:id/estado", updateEstadoPago);
router.post("/:id/comprobante", upload.single("comprobante"), uploadComprobante);

export default router;