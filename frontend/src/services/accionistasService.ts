import api from './api';
import { ApiResponse } from '../models/ApiResponse';
import { env } from '../config/env';
import { MESSAGES } from '../constants';
import { Accionista } from '../types';
import {
  generarAccionistas,
} from '../utils/dataGenerators';

const accionistas: Accionista[] = generarAccionistas();

const mockService = {
  getAll: async (): Promise<ApiResponse> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return ApiResponse.success(accionistas, MESSAGES.ACCIONISTAS_LOADED);
  },

  getById: async (id: number | string): Promise<ApiResponse> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const accionista = accionistas.find(a => a.id === parseInt(id.toString()));
    if (!accionista) {
      return ApiResponse.error(MESSAGES.ACCIONISTA_NOT_FOUND);
    }
    return ApiResponse.success(accionista, MESSAGES.ACCIONISTA_FOUND);
  },

  create: async (data: Partial<Accionista>): Promise<ApiResponse> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newAccionista = { id: accionistas.length + 1, ...data } as Accionista;
    accionistas.push(newAccionista);
    return ApiResponse.success(newAccionista, MESSAGES.ACCIONISTA_CREATED);
  },

  update: async (id: number | string, data: Partial<Accionista>): Promise<ApiResponse> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = accionistas.findIndex(a => a.id === parseInt(id.toString()));
    if (index === -1) {
      return ApiResponse.error(MESSAGES.ACCIONISTA_NOT_FOUND);
    }
    accionistas[index] = { ...accionistas[index], ...data };
    return ApiResponse.success(accionistas[index], MESSAGES.ACCIONISTA_UPDATED);
  },

  delete: async (id: number | string): Promise<ApiResponse> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = accionistas.findIndex(a => a.id === parseInt(id.toString()));
    if (index === -1) {
      return ApiResponse.error(MESSAGES.ACCIONISTA_NOT_FOUND);
    }
    accionistas.splice(index, 1);
    return ApiResponse.success(null, MESSAGES.ACCIONISTA_DELETED);
  },
};

const apiService = {
  getAll: async (): Promise<ApiResponse> => {
    try {
      const response = await api.get('/accionistas');
      return new ApiResponse(response.data);
    } catch (error: any) {
      return ApiResponse.error(error.response?.data?.message || MESSAGES.ERROR_LOADING_DATA);
    }
  },

  getById: async (id: number | string): Promise<ApiResponse> => {
    try {
      const response = await api.get(`/accionistas/${id}`);
      return new ApiResponse(response.data);
    } catch (error: any) {
      return ApiResponse.error(error.response?.data?.message || MESSAGES.ACCIONISTA_NOT_FOUND);
    }
  },

  create: async (data: Partial<Accionista>): Promise<ApiResponse> => {
    try {
      const response = await api.post('/accionistas', data);
      return new ApiResponse(response.data);
    } catch (error: any) {
      return ApiResponse.error(error.response?.data?.message || MESSAGES.ERROR_GENERIC);
    }
  },

  update: async (id: number | string, data: Partial<Accionista>): Promise<ApiResponse> => {
    try {
      const response = await api.put(`/accionistas/${id}`, data);
      return new ApiResponse(response.data);
    } catch (error: any) {
      return ApiResponse.error(error.response?.data?.message || MESSAGES.ERROR_GENERIC);
    }
  },

  delete: async (id: number | string): Promise<ApiResponse> => {
    try {
      const response = await api.delete(`/accionistas/${id}`);
      return new ApiResponse(response.data);
    } catch (error: any) {
      return ApiResponse.error(error.response?.data?.message || MESSAGES.ERROR_GENERIC);
    }
  },
};

export const accionistasService = env.USE_MOCK_DATA ? mockService : apiService;
