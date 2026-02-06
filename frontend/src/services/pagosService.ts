import api from './api';
import { ApiResponse } from '../models/ApiResponse';
import { env } from '../config/env';
import { MESSAGES } from '../constants';
import { Pago } from '../types';
import {
  generarAccionistas,
  generarPagosDiarios,
} from '../utils/dataGenerators';

const accionistas = generarAccionistas();
const pagos: Pago[] = generarPagosDiarios(accionistas);

const mockService = {
  getAll: async (): Promise<ApiResponse> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return ApiResponse.success(pagos, MESSAGES.PAGOS_LOADED);
  },

  getById: async (id: number | string): Promise<ApiResponse> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const pago = pagos.find(p => p.id === parseInt(id.toString()));
    if (!pago) {
      return ApiResponse.error(MESSAGES.PAGO_NOT_FOUND);
    }
    return ApiResponse.success(pago, MESSAGES.PAGO_FOUND);
  },

  getByAccionista: async (accionistaId: number | string): Promise<ApiResponse> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const pagosFiltrados = pagos.filter(p => p.accionistaId === parseInt(accionistaId.toString()));
    return ApiResponse.success(pagosFiltrados, MESSAGES.PAGOS_ACCIONISTA_LOADED);
  },

  create: async (data: Partial<Pago>): Promise<ApiResponse> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newPago = { id: pagos.length + 1, ...data } as Pago;
    pagos.push(newPago);
    return ApiResponse.success(newPago, MESSAGES.PAGO_CREATED);
  },

  update: async (id: number | string, data: Partial<Pago>): Promise<ApiResponse> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = pagos.findIndex(p => p.id === parseInt(id.toString()));
    if (index === -1) {
      return ApiResponse.error(MESSAGES.PAGO_NOT_FOUND);
    }
    pagos[index] = { ...pagos[index], ...data };
    return ApiResponse.success(pagos[index], MESSAGES.PAGO_UPDATED);
  },

  delete: async (id: number | string): Promise<ApiResponse> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = pagos.findIndex(p => p.id === parseInt(id.toString()));
    if (index === -1) {
      return ApiResponse.error(MESSAGES.PAGO_NOT_FOUND);
    }
    pagos.splice(index, 1);
    return ApiResponse.success(null, MESSAGES.PAGO_DELETED);
  },
};

const apiService = {
  getAll: async (): Promise<ApiResponse> => {
    try {
      const response = await api.get('/pagos');
      return new ApiResponse(response.data);
    } catch (error: any) {
      return ApiResponse.error(error.response?.data?.message || MESSAGES.ERROR_LOADING_DATA);
    }
  },

  getById: async (id: number | string): Promise<ApiResponse> => {
    try {
      const response = await api.get(`/pagos/${id}`);
      return new ApiResponse(response.data);
    } catch (error: any) {
      return ApiResponse.error(error.response?.data?.message || MESSAGES.PAGO_NOT_FOUND);
    }
  },

  getByAccionista: async (accionistaId: number | string): Promise<ApiResponse> => {
    try {
      const response = await api.get(`/pagos/accionista/${accionistaId}`);
      return new ApiResponse(response.data);
    } catch (error: any) {
      return ApiResponse.error(error.response?.data?.message || MESSAGES.ERROR_LOADING_DATA);
    }
  },

  create: async (data: Partial<Pago>): Promise<ApiResponse> => {
    try {
      const response = await api.post('/pagos', data);
      return new ApiResponse(response.data);
    } catch (error: any) {
      return ApiResponse.error(error.response?.data?.message || MESSAGES.ERROR_GENERIC);
    }
  },

  update: async (id: number | string, data: Partial<Pago>): Promise<ApiResponse> => {
    try {
      const response = await api.put(`/pagos/${id}`, data);
      return new ApiResponse(response.data);
    } catch (error: any) {
      return ApiResponse.error(error.response?.data?.message || MESSAGES.ERROR_GENERIC);
    }
  },

  delete: async (id: number | string): Promise<ApiResponse> => {
    try {
      const response = await api.delete(`/pagos/${id}`);
      return new ApiResponse(response.data);
    } catch (error: any) {
      return ApiResponse.error(error.response?.data?.message || MESSAGES.ERROR_GENERIC);
    }
  },
};

export const pagosService = env.USE_MOCK_DATA ? mockService : apiService;
