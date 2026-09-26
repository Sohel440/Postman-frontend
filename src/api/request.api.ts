import { apiClient } from './client';
import type { ApiRequest, ExecuteRequestPayload, ExecutionResponse } from '../types';

export const requestApi = {
  getRequests: async (filters?: {
    collectionId?: string;
    folderId?: string;
  }): Promise<{ success: boolean; data: ApiRequest[] }> => {
    const params = new URLSearchParams();
    if (filters?.collectionId) params.append('collectionId', filters.collectionId);
    if (filters?.folderId) params.append('folderId', filters.folderId);
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return apiClient(`/api/requests${queryString}`, { method: 'GET' });
  },

  getById: async (id: string): Promise<{ success: boolean; data: ApiRequest }> => {
    return apiClient(`/api/requests/${id}`, { method: 'GET' });
  },

  create: async (data: Partial<ApiRequest>): Promise<{ success: boolean; data: ApiRequest }> => {
    return apiClient('/api/requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<ApiRequest>): Promise<{ success: boolean; data: ApiRequest }> => {
    return apiClient(`/api/requests/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    return apiClient(`/api/requests/${id}`, { method: 'DELETE' });
  },

  executeSaved: async (id: string): Promise<{ success: boolean; data: { data: ExecutionResponse } }> => {
    return apiClient(`/api/requests/${id}/execute`, {
      method: 'POST',
    });
  },

  executeUnsaved: async (
    payload: ExecuteRequestPayload
  ): Promise<{ success: boolean; data: { data: ExecutionResponse } }> => {
    return apiClient('/api/requests/execute', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
