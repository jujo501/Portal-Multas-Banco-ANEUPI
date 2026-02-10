import api from './api';

export const pagosService = {
  // 1. Obtener todos los pagos
  getAll: async () => {
    try {
      const response = await api.get('/pagos');
      
      return response.data; 
    } catch (error) {
      console.error("Error al obtener pagos:", error);
      throw error;
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

  // 4. Actualizar datos de un pago
  update: async (id: number | string, data: any) => {
    const response = await api.put(`/pagos/${id}`, data);
    return response.data;
  },

  // 5. Eliminar un pago
  delete: async (id: number | string) => {
    const response = await api.delete(`/pagos/${id}`);
    return response.data;
  },


  subirComprobante: async (id: number | string, archivo: File) => {
    const formData = new FormData();
    
    formData.append('comprobante', archivo); 
    
    
    const response = await api.put(`/pagos/${id}`, formData);
    return response.data;
  },

  
  updateEstado: async (id: number | string, estado: string) => {
    
    const response = await api.put(`/pagos/${id}`, { estado });
    return response.data;
  }
};