/**
 * Modelo de Accionista
 * Representa un accionista de ANEUPI
 */
export class Accionista {
  constructor({
    id,
    nombre,
    telefono,
    email,
    codigo,
    fechaIngreso,
    direccion,
    tipoAccionista,
    estado,
    notificacionesActivas,
    ultimoAcceso,
    multaBase
  }) {
    this.id = id;
    this.nombre = nombre;
    this.telefono = telefono;
    this.email = email;
    this.codigo = codigo;
    this.fechaIngreso = fechaIngreso;
    this.direccion = direccion;
    this.tipoAccionista = tipoAccionista; // "Fundador", "Inversionista", "Accionista Mayoritario", "Accionista Minoritario"
    this.estado = estado; // "Activo", "Suspendido", "Inactivo"
    this.notificacionesActivas = notificacionesActivas;
    this.ultimoAcceso = ultimoAcceso;
    this.multaBase = multaBase;
  }
}

export default Accionista;
