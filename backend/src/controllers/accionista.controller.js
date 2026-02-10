import { prisma } from "../db.js"; 

// 1. Obtener todos los accionistas 
export const getAccionistas = async (req, res) => {
  try {
    const accionistas = await prisma.accionista.findMany({
      include: { 
        pagos: true 
      }, 
      orderBy: { 
        id: 'asc' 
      }
    });
    res.json(accionistas);
  } catch (error) {
    console.error("Error al obtener accionistas:", error);
    res.status(500).json({ error: 'Error al obtener accionistas' });
  }
};

// 2. Obtener un accionista por ID 
export const getAccionistaById = async (req, res) => {
  const { id } = req.params;
  try {
    const accionista = await prisma.accionista.findUnique({
      where: { id: Number(id) },
      include: {
        pagos: {
            orderBy: { fechaIngresoMulta: 'desc' } 
        },
        notificaciones: true,
        auditorias: true
      }
    });

    if (!accionista) {
      return res.status(404).json({ error: 'Accionista no encontrado' });
    }
    res.json(accionista);
  } catch (error) {
    console.error("Error al buscar accionista:", error);
    res.status(500).json({ error: 'Error al buscar accionista' });
  }
};

