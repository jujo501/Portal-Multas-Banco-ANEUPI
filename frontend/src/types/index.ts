export interface Accionista {
  id: number;
  nombre: string;
  telefono: string;
  email: string;
  codigo: string;
  fechaIngreso: string;
  direccion: string;
  tipoAccionista: string;
  estado: string;
  notificacionesActivas: boolean;
  ultimoAcceso: string;
  multaBase: number;
}

export interface Pago {
  id: number;
  referencia: string;
  accionista: string;
  accionistaId: number;
  mes: string;
  dia: number;
  monto: number;
  abonosRealizados: number;
  fechaIngresoMulta: string;
  fechaPago: string | null;
  horaPago: string;
  estado: string;
  metodo: string;
  descripcion: string;
  observacion: string;
  comprobante: string;
  canal: string;
  email: string;
  telefono: string;
  fechaRegistro: string;
  usuarioRegistro: string;
}

export interface Abono {
  fecha: string;
  monto: number;
  referencia: string;
}

export interface ApiResponseData {
  success: boolean;
  data: any;
  message: string;
  errors: any;
}

export interface Notificacion {
  id: number;
  tipo: string;
  titulo: string;
  mensaje: string;
  fecha: string;
  leida: boolean;
  accion: string;
  prioridad: string;
}
