import api from './api';

import { Accionista } from '../types'; 

export const accionistasService = {
  
  getAll: async (): Promise<Accionista[]> => {
    try {
      const response = await api.get('/accionistas');
      
      return response.data;
    } catch (error) {
      console.error("Error al cargar accionistas:", error);
      
      return [];
    }
  },

  
  getById: async (id: number | string): Promise<Accionista | null> => {
    try {
      const response = await api.get(`/accionistas/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al cargar accionista ${id}:`, error);
      return null;
    }
  },

  
  create: async (data: Partial<Accionista>): Promise<Accionista | null> => {
    try {
      const response = await api.post('/accionistas', data);
      return response.data;
    } catch (error) {
      console.error("Error al crear accionista:", error);
      throw error;
    }
  },

  
  update: async (id: number | string, data: Partial<Accionista>): Promise<Accionista | null> => {
    try {
      const response = await api.put(`/accionistas/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar accionista ${id}:`, error);
      throw error;
    }
  },

  
  delete: async (id: number | string): Promise<boolean> => {
    try {
      await api.delete(`/accionistas/${id}`);
      return true;
    } catch (error) {
      console.error(`Error al eliminar accionista ${id}:`, error);
      return false;
    }
  },
};