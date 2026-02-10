import api from './api';

export const pagosService = {
  // 1. Obtener todos los pagos
  getAll: async () => {
    try {
      const response = await api.get('/pagos');
      return response.data; 
    } catch (error) {
      console.error("Error al obtener pagos:", error);
      return []; 
    }
  },

  // 2. Obtener un pago por ID
  getById: async (id: number | string) => {
    const response = await api.get(`/pagos/${id}`);
    return response.data;
  },

  // 3. Crear un nuevo pago (si se usa formulario manual)
  create: async (data: any) => {
    const response = await api.post('/pagos', data);
    return response.data;
  },

  // 4. Actualizar datos generales (opcional)
  update: async (id: number | string, data: any) => {
    const response = await api.put(`/pagos/${id}`, data);
    return response.data;
  },

  // 5. Eliminar un pago
  delete: async (id: number | string) => {
    const response = await api.delete(`/pagos/${id}`);
    return response.data;
  },

  // 6. Subir Comprobante (USUARIO: Para pagar total o parcial)
  subirComprobante: async (id: number | string, archivo: File, montoAbonado: number) => {
    const formData = new FormData();
    formData.append('comprobante', archivo); 
    
    
    formData.append('montoAbonado', montoAbonado.toString());

    const response = await api.post(`/pagos/${id}/comprobante`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // 7. Actualizar Estado (ADMIN: Aprobar/Rechazar Genérico)
  updateEstado: async (id: number | string, estado: string) => {
    const response = await api.put(`/pagos/${id}/estado`, { estado });
    return response.data;
  },

  // 8. Aprobar Abono 
  aprobarAbono: async (id: number | string, montoAprobado: number) => {
    const response = await api.put(`/pagos/${id}/aprobar-abono`, { montoAprobado });
    return response.data;
  }
};