/*
  Warnings:

  - You are about to drop the `Usuario` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TipoAccionista" AS ENUM ('Fundador', 'Inversionista', 'Accionista Mayoritario', 'Accionista Minoritario');

-- CreateEnum
CREATE TYPE "EstadoAccionista" AS ENUM ('Activo', 'Suspendido', 'Inactivo');

-- CreateEnum
CREATE TYPE "EstadoPago" AS ENUM ('Completado', 'Pendiente', 'Rechazado', 'En proceso');

-- CreateEnum
CREATE TYPE "PrioridadNotificacion" AS ENUM ('alta', 'media', 'baja');

-- CreateEnum
CREATE TYPE "TipoNotificacion" AS ENUM ('pago_pendiente', 'recordatorio', 'alerta', 'informacion');

-- DropTable
DROP TABLE "Usuario";

-- CreateTable
CREATE TABLE "accionistas" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT,
    "email" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "fechaIngreso" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "direccion" TEXT,
    "tipoAccionista" "TipoAccionista" NOT NULL,
    "estado" "EstadoAccionista" NOT NULL DEFAULT 'Activo',
    "notificacionesActivas" BOOLEAN NOT NULL DEFAULT true,
    "ultimoAcceso" TIMESTAMP(3),
    "multaBase" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "accionistas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pagos" (
    "id" SERIAL NOT NULL,
    "referencia" TEXT NOT NULL,
    "accionistaId" INTEGER NOT NULL,
    "mes" TEXT,
    "dia" INTEGER,
    "monto" DECIMAL(10,2) NOT NULL,
    "fechaIngresoMulta" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaPago" TIMESTAMP(3),
    "horaPago" TEXT,
    "estado" "EstadoPago" NOT NULL DEFAULT 'Pendiente',
    "metodo" TEXT,
    "descripcion" TEXT,
    "observacion" TEXT,
    "comprobante" TEXT,
    "canal" TEXT,
    "email" TEXT,
    "telefono" TEXT,
    "fechaRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioRegistro" TEXT,

    CONSTRAINT "pagos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "abonos" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "monto" DECIMAL(10,2) NOT NULL,
    "referencia" TEXT,
    "pagoId" INTEGER NOT NULL,

    CONSTRAINT "abonos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notificaciones" (
    "id" SERIAL NOT NULL,
    "accionistaId" INTEGER NOT NULL,
    "tipo" "TipoNotificacion" NOT NULL,
    "titulo" TEXT NOT NULL,
    "mensaje" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leida" BOOLEAN NOT NULL DEFAULT false,
    "accion" TEXT,
    "prioridad" "PrioridadNotificacion" NOT NULL DEFAULT 'media',

    CONSTRAINT "notificaciones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accionistas_email_key" ON "accionistas"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accionistas_codigo_key" ON "accionistas"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "pagos_referencia_key" ON "pagos"("referencia");

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_accionistaId_fkey" FOREIGN KEY ("accionistaId") REFERENCES "accionistas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "abonos" ADD CONSTRAINT "abonos_pagoId_fkey" FOREIGN KEY ("pagoId") REFERENCES "pagos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_accionistaId_fkey" FOREIGN KEY ("accionistaId") REFERENCES "accionistas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
