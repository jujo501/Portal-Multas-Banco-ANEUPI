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
  const { accionistaId, monto, referencia, mes, descripcion } = req.body;
  
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
        },
        
        montoAbonado: 0 
      }
    });

    // Auditoría
    try {
      await prisma.auditoria.create({
        data: {
          accion: 'PAGO_CREADO',
          detalle: `Multa registrada: $${monto} - ${referencia}`,
          accionistaId: Number(accionistaId)
        }
      });
    } catch (e) { console.log("Auditoría no crítica saltada"); }

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
  
  const { montoAbonado } = req.body; 

  if (!req.file) {
    return res.status(400).json({ error: "No se ha subido ningún archivo" });
  }

  try {
    const rutaArchivo = `uploads/comprobantes/${req.file.filename}`;

    const pagoActualizado = await prisma.pago.update({
      where: { id: Number(id) },
      data: { 
        comprobante: rutaArchivo,
        estado: 'En_proceso',
       
        ...(montoAbonado && { montoAbonado: Number(montoAbonado) })
      }
    });

    res.json({ mensaje: "Comprobante subido", pago: pagoActualizado });
  } catch (error) {
    console.error("Error uploadComprobante:", error);
    res.status(500).json({ error: "Error al guardar el comprobante" });
  }
};

// 5. APROBAR ABONO (NUEVA FUNCIÓN INTELIGENTE)
export const aprobarAbono = async (req, res) => {
  const { id } = req.params;
  const { montoAprobado } = req.body; 

  if (!montoAprobado || Number(montoAprobado) <= 0) {
      return res.status(400).json({ error: "Monto aprobado inválido" });
  }

  try {
    // A. Buscar el pago actual para saber la deuda
    const pagoOriginal = await prisma.pago.findUnique({ where: { id: Number(id) } });
    if (!pagoOriginal) return res.status(404).json({ error: "Pago no encontrado" });

    const deudaActual = Number(pagoOriginal.monto);
    const abono = Number(montoAprobado);

    // B. Calcular Matemáticas
    let nuevoSaldo = deudaActual - abono;
    let nuevoEstado = "Pendiente"; 

    // Si el saldo es 0 o negativo (pagó todo), se cierra
    if (nuevoSaldo <= 0.01) {
       nuevoSaldo = 0;
       nuevoEstado = "Completado";
    }

    // C. Actualizar Base de Datos
    const pagoActualizado = await prisma.pago.update({
      where: { id: Number(id) },
      data: {
        monto: nuevoSaldo,       
        estado: nuevoEstado,     
        montoAbonado: 0          
      }
    });

    res.json({ mensaje: "Abono procesado con éxito", pago: pagoActualizado });

  } catch (error) {
    console.error("Error aprobarAbono:", error);
    res.status(500).json({ error: "Error al procesar el abono en el servidor" });
  }
};