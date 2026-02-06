import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getAccionistas = async (req, res) => {
  try {
    const accionistas = await prisma.accionista.findMany({
      include: { pagos: true }, 
      orderBy: { id: 'asc' }
    })
    res.json(accionistas)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener accionistas' })
  }
}

export const getAccionistaById = async (req, res) => {
  const { id } = req.params
  try {
    const accionista = await prisma.accionista.findUnique({
      where: { id: Number(id) },
      include: {
        pagos: true,
        notificaciones: true,
        auditorias: true
      }
    })

    if (!accionista) {
      return res.status(404).json({ error: 'Accionista no encontrado' })
    }
    res.json(accionista)
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar accionista' })
  }
}

export const createPago = async (req, res) => {
  const { accionistaId, monto, referencia, mes, metodo, descripcion } = req.body
  
  try {
    const nuevoPago = await prisma.pago.create({
      data: {
        monto: Number(monto),
        referencia,
        mes,
        metodo,
        descripcion,
        accionista: {
          connect: { id: Number(accionistaId) }
        }
      }
    })
    

    // También registramos esto en la Auditoría automáticamente
    await prisma.auditoria.create({
      data: {
        accion: 'PAGO_CREADO',
        detalle: `Se registró un pago de $${monto} (Ref: ${referencia})`,
        accionistaId: Number(accionistaId)
      }
    })

    res.status(201).json({ mensaje: 'Pago registrado con éxito', pago: nuevoPago })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'No se pudo registrar el pago. Revisa si la referencia ya existe.' })
  }
}

// Obtener todos los pagos registrados
export const getPagos = async (req, res) => {
  try {
    const pagos = await prisma.pago.findMany({
      include: {
        accionista: true // Para saber a quién pertenece el pago
      },
      orderBy: {
        fechaRegistro: 'asc' 
      }
    })
    res.json(pagos)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener historial de pagos' })
  }
}