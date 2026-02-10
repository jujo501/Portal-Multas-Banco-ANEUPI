import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🗑️  Limpiando base de datos...');
  try {
    await prisma.abono.deleteMany({});
    await prisma.pago.deleteMany({});
    await prisma.notificacion.deleteMany({});
    await prisma.auditoria.deleteMany({});
    await prisma.accionista.deleteMany({});
  } catch (e) {
    console.log("Nota: Tablas ya estaban vacías.");
  }

  console.log('🌱 Creando usuarios...');

  // 1. Crear ADMIN
  await prisma.accionista.create({
    data: {
      nombre: 'Administrador Principal',
      email: 'admin@aneupi.com',
      codigo: 'ADM-001',
      password: 'admin', 
      rol: 'ADMIN',
      tipoAccionista: 'Fundador',
      telefono: '0999999999',
      multaBase: 0,
      estado: 'Activo'
    }
  });

  // 2. Crear ACCIONISTAS 
  const accionistasData = [
    { nombre: 'Juan José', email: 'juan@aneupi.com', codigo: 'SOC-001', rol: 'USER' },
    { nombre: 'María González', email: 'maria@aneupi.com', codigo: 'SOC-002', rol: 'USER' },
    { nombre: 'Pedro Alcívar', email: 'pedro@aneupi.com', codigo: 'SOC-003', rol: 'USER' },
    { nombre: 'Ana Quijije', email: 'ana@aneupi.com', codigo: 'SOC-004', rol: 'USER' }
  ];

  const accionistasCreados = [];

  for (const u of accionistasData) {
    const acc = await prisma.accionista.create({
      data: {
        nombre: u.nombre,
        email: u.email,
        codigo: u.codigo,
        password: '123', 
        rol: u.rol,
        tipoAccionista: 'Inversionista',
        telefono: '0988888888',
        multaBase: 20.00,
        estado: 'Activo'
      }
    });
    accionistasCreados.push(acc);
    console.log(`👤 Creado: ${u.nombre}`);
  }

  console.log('💰 Generando multas y pagos...');

  // 3. Crear PAGOS/MULTAS para cada usuario

  const situaciones = [
    { estado: 'Pendiente', desc: 'Multa Atraso Asamblea Enero', monto: 20.00, mes: 'Enero' },
    { estado: 'Completado', desc: 'Aporte Mensual Febrero', monto: 20.00, mes: 'Febrero' },
    { estado: 'Pendiente', desc: 'Multa Falta Injustificada', monto: 50.00, mes: 'Marzo' },
    { estado: 'En_proceso', desc: 'Aporte Mensual Abril', monto: 20.00, mes: 'Abril' },
  ];

  for (const acc of accionistasCreados) {
    
    for (const sit of situaciones) {
      await prisma.pago.create({
        data: {
          referencia: `REF-${acc.codigo}-${Date.now()}-${Math.floor(Math.random()*1000)}`,
          accionistaId: acc.id,
          monto: sit.monto,
          mes: sit.mes,
          dia: 15,
          estado: sit.estado, 
          descripcion: sit.desc,
          metodo: 'Transferencia',
          fechaIngresoMulta: new Date(),
          
          fechaPago: sit.estado === 'Completado' ? new Date() : null 
        }
      });
    }
  }

  console.log('✨ ¡Base de datos sembrada con éxito!');
  console.log('🔑 Admin: admin@aneupi.com / admin');
  console.log('🔑 User: juan@aneupi.com / 123');
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });