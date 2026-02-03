// prisma/seed.js
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Iniciando el proceso de Seed (Semilla)')

  // 1. Limpiar la base de datos antes de insertar datos
  await prisma.abono.deleteMany()
  await prisma.auditoria.deleteMany()
  await prisma.notificacion.deleteMany()
  await prisma.pago.deleteMany()
  await prisma.accionista.deleteMany()
  
  console.log('🧹 Base de datos limpia.')

  // ----------------------------------------------
  // CASO 1: Accionista FUNDADOR (Sin deudas)
  // ----------------------------------------------
  const admin = await prisma.accionista.create({
    data: {
      nombre: 'Carlos Ramírez',
      email: 'admin@aneupi.com',
      codigo: 'F-001',
      telefono: '0991112222',
      tipoAccionista: 'Fundador',
      estado: 'Activo',
      multaBase: 0.00,
      direccion: 'Av. Principal 123',
      auditorias: {
        create: [
          { accion: 'LOGIN', detalle: 'Ingreso al sistema desde Admin Panel' }
        ]
      }
    }
  })

  // ----------------------------------------------
  // CASO 2: Accionista DEUDOR (Con pagos pendientes)
  // ----------------------------------------------
  const deudor = await prisma.accionista.create({
    data: {
      nombre: 'Luis "El Lucho" Torres',
      email: 'luis.torres@gmail.com',
      codigo: 'INV-025',
      telefono: '0987654321',
      tipoAccionista: 'Inversionista',
      estado: 'Activo',
      multaBase: 100.00, // Tiene una multa base
      pagos: {
        create: [
          {
            referencia: 'PAG-2026-001',
            monto: 50.00,
            mes: 'Enero',
            estado: 'Pendiente', // <--- Debe plata
            descripcion: 'Cuota ordinaria Enero',
            fechaIngresoMulta: new Date('2026-01-15')
          }
        ]
      },
      notificaciones: {
        create: [
          {
            tipo: 'pago_pendiente',
            titulo: 'Recordatorio de Pago',
            mensaje: 'Estimado Luis, su cuota de Enero vence pronto.',
            prioridad: 'alta'
          }
        ]
      }
    }
  })

  // ----------------------------------------------
  // CASO 3: Accionista CUMPLIDO (Pagó con Abonos)
  // ----------------------------------------------
  const cumplido = await prisma.accionista.create({
    data: {
      nombre: 'Maria Fernanda Yagual',
      email: 'mafer.y@hotmail.com',
      codigo: 'MAY-010',
      tipoAccionista: 'Accionista_Mayoritario',
      estado: 'Activo',
      multaBase: 200.00,
      pagos: {
        create: [
          {
            referencia: 'PAG-2026-002',
            monto: 200.00,
            mes: 'Febrero',
            estado: 'Completado', // <--- Ya pagó
            metodo: 'Transferencia',
            fechaPago: new Date(),
            abonos: {
              create: [
                { monto: 100.00, fecha: new Date('2026-02-01'), referencia: 'ABO-001' },
                { monto: 100.00, fecha: new Date('2026-02-05'), referencia: 'ABO-002' }
              ]
            }
          }
        ]
      }
    }
  })

  // ----------------------------------------------
  // CASO 4: Accionista SUSPENDIDO (Moroso)
  // ----------------------------------------------
  const suspendido = await prisma.accionista.create({
    data: {
      nombre: 'Jorge "El Fantasma" Pérez',
      email: 'jorge.perez@yahoo.com',
      codigo: 'MIN-099',
      tipoAccionista: 'Accionista_Minoritario',
      estado: 'Suspendido', // <--- Acceso bloqueado
      multaBase: 500.00,
      notificacionesActivas: false,
      auditorias: {
        create: [
          { accion: 'BLOQUEO', usuario: 'Sistema', detalle: 'Bloqueado por falta de pago > 3 meses' }
        ]
      }
    }
  })

  // ----------------------------------------------
  // CASO 5: Accionista CON PAGO EN PROCESO (Para validar)
  // ----------------------------------------------
  const enProceso = await prisma.accionista.create({
    data: {
      nombre: 'Ana Pinargote',
      email: 'ana.pina@outlook.com',
      codigo: 'INV-040',
      tipoAccionista: 'Inversionista',
      estado: 'Activo',
      multaBase: 150.00,
      pagos: {
        create: [
          {
            referencia: 'PAG-2026-003',
            monto: 150.00,
            estado: 'En_proceso', // <--- Subió el comprobante, falta aprobar
            comprobante: 'https://ejemplo.com/comprobante-banco.jpg',
            canal: 'Web',
            usuarioRegistro: 'Ana Pinargote'
          }
        ]
      }
    }
  })

  console.log(' Seed completado exitosamente.')
  console.log(` Creados: Fundador (${admin.id}), Deudor (${deudor.id}), Cumplido (${cumplido.id}), Suspendido (${suspendido.id}), En Proceso (${enProceso.id})`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

  