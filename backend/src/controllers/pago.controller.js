import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 1. OBTENER TODOS LOS PAGOS
export const getPagos = async (req, res) => {
  try {
    const pagos = await prisma.pago.findMany({
      include: {
        accionista: true 
      },
      orderBy: {
        id: 'asc' 
      }
    });
    res.json(pagos);
  } catch (error) {
    console.error("Error getPagos:", error);
    res.status(500).json({ error: 'Error al obtener historial de pagos' });
  }
};

// 2. CREAR UN PAGO MANUALMENTE 
export const createPago = async (req, res) => {
  const { accionistaId, monto, referencia, mes, metodo, descripcion } = req.body;
  
  try {
    const nuevoPago = await prisma.pago.create({
      data: {
        monto: Number(monto),
        referencia,
        mes, 
        descripcion,
        estado: 'Pendiente', 
        fechaRegistro: new Date(),
        accionista: {
          connect: { id: Number(accionistaId) }
        }
      }
    });

    // Auditoría opcional
    try {
      await prisma.auditoria.create({
        data: {
          accion: 'PAGO_CREADO',
          detalle: `Pago registrado: $${monto} - ${referencia}`,
          accionistaId: Number(accionistaId)
        }
      });
    } catch (e) { console.log("No se pudo crear auditoría, continuando..."); }

    res.status(201).json({ mensaje: 'Pago registrado', pago: nuevoPago });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar el pago' });
  }
};

// 3. ACTUALIZAR ESTADO 

export const updateEstadoPago = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body; 

  try {
    const pagoActualizado = await prisma.pago.update({
      where: { id: Number(id) },
      data: { estado }
    });
    res.json(pagoActualizado);
  } catch (error) {
    console.error("Error updateEstadoPago:", error);
    res.status(500).json({ error: "Error al actualizar el estado del pago" });
  }
};

// 4. SUBIR COMPROBANTE 

export const uploadComprobante = async (req, res) => {
  const { id } = req.params;

  
  if (!req.file) {
    return res.status(400).json({ error: "No se ha subido ningún archivo" });
  }

  try {
    
    
    const rutaArchivo = `uploads/comprobantes/${req.file.filename}`;

    const pagoActualizado = await prisma.pago.update({
      where: { id: Number(id) },
      data: { 
        comprobante: rutaArchivo,
        estado: 'En_proceso' 
      }
    });

    res.json({ mensaje: "Comprobante subido", pago: pagoActualizado });
  } catch (error) {
    console.error("Error uploadComprobante:", error);
    res.status(500).json({ error: "Error al guardar la referencia del comprobante" });
  }
};