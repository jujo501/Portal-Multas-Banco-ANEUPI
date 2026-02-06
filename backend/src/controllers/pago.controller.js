import { prisma } from "../db.js"; // Asegúrate de que la ruta a db.js sea correcta


export const getPagos = async (req, res) => {
  try {
    const pagos = await prisma.pago.findMany({
      include: {
        accionista: true 
      },
      orderBy: {
        id: 'desc' 
      }
    });
    res.json(pagos);
  } catch (error) {
    console.error("Error al obtener pagos:", error);
    res.status(500).json({ error: "Error al obtener los pagos" });
  }
};


// 2. Crear un nuevo pago (POST)
export const createPago = async (req, res) => {
  try {
    // 1. Recibimos también la 'fecha'
    const { accionistaId, monto, descripcion, estado, metodo, referencia, fecha } = req.body;

    if (!accionistaId || !monto) {
      return res.status(400).json({ 
        message: "Faltan datos: accionistaId y monto son obligatorios." 
      });
    }

    const referenciaFinal = referencia || `REF-${Date.now()}`;
    
    // 2. Si nos mandan fecha, la usamos. Si no, usamos la de hoy.
    // Le agregamos la hora actual para que no quede a medianoche (00:00:00)
    const fechaRegistro = fecha ? new Date(`${fecha}T12:00:00`) : new Date();

    const nuevoPago = await prisma.pago.create({
      data: {
        accionistaId: Number(accionistaId),
        monto: Number(monto),
        descripcion: descripcion || "Pago de multa",
        estado: estado || "Pendiente",
        metodo: metodo || "Efectivo",
        // Usamos la fecha calculada
        fechaIngresoMulta: fechaRegistro,
        // Si está completado, la fecha de pago es la misma que la de registro
        fechaPago: estado === "Completado" ? fechaRegistro : null,
        referencia: referenciaFinal
      },
      include: {
        accionista: true
      }
    });

    res.status(201).json(nuevoPago);
  } catch (error) {
    console.error("Error al crear pago:", error);
    res.status(500).json({ message: "Error interno al crear el pago", error: error.message });
  }
};