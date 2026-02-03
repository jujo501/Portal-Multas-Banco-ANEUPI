/**
 * Modelo de Abono
 * Representa un abono parcial realizado a una multa pendiente
 */
export class Abono {
  constructor({
    fecha,
    monto,
    referencia
  }) {
    this.fecha = fecha;
    this.monto = monto;
    this.referencia = referencia;
  }
}

export default Abono;
