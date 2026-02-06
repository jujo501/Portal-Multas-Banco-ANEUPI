import api from './api';
import { ApiResponse } from '../models/ApiResponse';
import { env } from '../config/env';
import { MESSAGES } from '../constants';
import { Abono, Pago } from '../types';
import {
  generarAccionistas,
  generarPagosDiarios,
  generarAbonosParaMulta,
} from '../utils/dataGenerators';

const accionistas = generarAccionistas();
const pagos: Pago[] = generarPagosDiarios(accionistas);

const mockService = {
  getByPago: async (pagoId: number | string): Promise<ApiResponse> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const pago = pagos.find(p => p.id === parseInt(pagoId.toString()));
    if (!pago) {
      return ApiResponse.error(MESSAGES.PAGO_NOT_FOUND);
    }
    const abonos = generarAbonosParaMulta(pago);
    return ApiResponse.success(abonos, MESSAGES.ABONOS_LOADED);
  },

  create: async (data: Partial<Abono>): Promise<ApiResponse> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return ApiResponse.success(data, MESSAGES.ABONO_CREATED);
  },

  delete: async (_id: number | string): Promise<ApiResponse> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return ApiResponse.success(null, MESSAGES.ABONO_DELETED);
  },
};

const apiService = {
  getByPago: async (pagoId: number | string): Promise<ApiResponse> => {
    try {
      const response = await api.get(`/abonos/pago/${pagoId}`);
      return new ApiResponse(response.data);
    } catch (error: any) {
      return ApiResponse.error(error.response?.data?.message || MESSAGES.ERROR_LOADING_DATA);
    }
  },

  create: async (data: Partial<Abono>): Promise<ApiResponse> => {
    try {
      const response = await api.post('/abonos', data);
      return new ApiResponse(response.data);
    } catch (error: any) {
      return ApiResponse.error(error.response?.data?.message || MESSAGES.ERROR_GENERIC);
    }
  },

  delete: async (id: number | string): Promise<ApiResponse> => {
    try {
      const response = await api.delete(`/abonos/${id}`);
      return new ApiResponse(response.data);
    } catch (error: any) {
      return ApiResponse.error(error.response?.data?.message || MESSAGES.ERROR_GENERIC);
    }
  },
};

export const abonosService = env.USE_MOCK_DATA ? mockService : apiService;
