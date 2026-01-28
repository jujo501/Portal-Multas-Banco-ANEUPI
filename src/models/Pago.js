/**
 * Modelo de Pago
 * Representa un pago de multa realizado por un accionista
 */
export class Pago {
  constructor({
    id,
    referencia,
    accionista,
    accionistaId,
    mes,
    dia,
    monto,
    abonosRealizados,
    fechaIngresoMulta,
    fechaPago,
    horaPago,
    estado,
    metodo,
    descripcion,
    observacion,
    comprobante,
    canal,
    email,
    telefono,
    fechaRegistro,
    usuarioRegistro
  }) {
    this.id = id;
    this.referencia = referencia;
    this.accionista = accionista;
    this.accionistaId = accionistaId;
    this.mes = mes;
    this.dia = dia;
    this.monto = monto;
    this.abonosRealizados = abonosRealizados;
    this.fechaIngresoMulta = fechaIngresoMulta;
    this.fechaPago = fechaPago;
    this.horaPago = horaPago;
    this.estado = estado; // "Completado", "Pendiente", "Rechazado", "En proceso"
    this.metodo = metodo;
    this.descripcion = descripcion;
    this.observacion = observacion;
    this.comprobante = comprobante;
    this.canal = canal;
    this.email = email;
    this.telefono = telefono;
    this.fechaRegistro = fechaRegistro;
    this.usuarioRegistro = usuarioRegistro;
  }
}

export default Pago;
