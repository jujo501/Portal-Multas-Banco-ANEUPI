import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const login = async (req, res) => {
  const { email, password } = req.body;

  console.log(` Intentando login con: ${email} y pass: ${password}`);

  try {
    // 1. Buscar al usuario
    const usuario = await prisma.accionista.findUnique({
      where: { email: email }
    });

    if (!usuario) {
      console.log(" Usuario no encontrado en la Base de Datos");
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // 2. Verificar contraseña 
    if (usuario.password !== password) {
      console.log(` Contraseña incorrecta. Se esperaba: ${usuario.password}, se recibió: ${password}`);
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    console.log(" Login exitoso para:", usuario.nombre);

    // 3. Responder éxito
    res.json({
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol
    });

  } catch (error) {
    console.error(" Error en el servidor:", error);
    res.status(500).json({ error: "Error interno" });
  }
};

export const register = async (req, res) => {
    res.json({ message: "Registro no implementado" });
}