
import { Router } from 'express'
import { getAccionistas, getAccionistaById, createPago, getPagos } from '../controllers/accionista.controller.js'

const router = Router()

router.get('/accionistas', getAccionistas)
router.get('/accionistas/:id', getAccionistaById)

router.get('/pagos', getPagos)
router.post('/pagos', createPago)

export default router