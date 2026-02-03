-- CreateTable
CREATE TABLE "auditorias" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accion" TEXT NOT NULL,
    "detalle" TEXT,
    "usuario" TEXT,
    "accionistaId" INTEGER,

    CONSTRAINT "auditorias_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "auditorias" ADD CONSTRAINT "auditorias_accionistaId_fkey" FOREIGN KEY ("accionistaId") REFERENCES "accionistas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
