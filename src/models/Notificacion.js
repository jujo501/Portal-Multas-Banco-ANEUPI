/**
 * Modelo de Notificación
 * Representa una notificación del sistema
 */
export class Notificacion {
  constructor({
    id,
    tipo,
    titulo,
    mensaje,
    fecha,
    leida,
    accion,
    prioridad
  }) {
    this.id = id;
    this.tipo = tipo; // "pago_pendiente", "recordatorio", "alerta", "informacion"
    this.titulo = titulo;
    this.mensaje = mensaje;
    this.fecha = fecha;
    this.leida = leida;
    this.accion = accion;
    this.prioridad = prioridad; // "alta", "media", "baja"
  }
}

export default Notificacion;
