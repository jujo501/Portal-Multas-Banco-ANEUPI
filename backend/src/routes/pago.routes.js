import { Router } from "express";
import { getPagos, createPago } from "../controllers/pago.controller.js";

const router = Router();

// Ruta para obtener todos los pagos
router.get("/", getPagos);

// Ruta para crear un pago nuevo
router.post("/", createPago);

export default router;