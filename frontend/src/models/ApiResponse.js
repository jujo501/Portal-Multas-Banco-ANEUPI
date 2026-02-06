export class ApiResponse {
  constructor(data) {
    this.success = data.success ?? true;
    this.data = data.data ?? null;
    this.message = data.message ?? '';
    this.errors = data.errors ?? null;
  }

  static success(data, message = 'Operación exitosa') {
    return new ApiResponse({
      success: true,
      data,
      message,
    });
  }

  static error(message = 'Error en la operación', errors = null) {
    return new ApiResponse({
      success: false,
      data: null,
      message,
      errors,
    });
  }
}
