import { Router } from "express";

import { 
    getPagos, 
    createPago, 
    updateEstadoPago, 
    uploadComprobante, 
    aprobarAbono 
} from "../controllers/pagos.controller.js"; 
import { upload } from "../middleware/upload.js"; 

const router = Router();

// Rutas existentes
router.get("/", getPagos);
router.post("/", createPago);
router.put("/:id/estado", updateEstadoPago);
router.post("/:id/comprobante", upload.single("comprobante"), uploadComprobante);


router.put("/:id/aprobar-abono", aprobarAbono);

export default router;