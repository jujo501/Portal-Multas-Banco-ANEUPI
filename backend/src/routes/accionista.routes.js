import { Router } from "express";

import { getAccionistas, getAccionistaById } from "../controllers/accionista.controller.js";

const router = Router();


router.get("/", getAccionistas);
router.get("/:id", getAccionistaById);

export default router;