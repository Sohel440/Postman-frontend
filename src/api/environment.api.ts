import { apiClient } from './client';
import type { Environment } from '../types';

export const environmentApi = {
  getAll: async (): Promise<{ success: boolean; data: Environment[] }> => {
    return apiClient('/api/v1/environments', { method: 'GET' });
  },

  getById: async (id: string): Promise<{ success: boolean; data: Environment }> => {
    return apiClient(`/api/v1/environments/${id}`, { method: 'GET' });
  },

  create: async (data: {
    name: string;
    variables: Record<string, string>;
  }): Promise<{ success: boolean; message: string; data?: Environment }> => {
    return apiClient('/api/v1/environments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (
    id: string,
    data: { name?: string; variables?: Record<string, string> }
  ): Promise<{ success: boolean; message: string; data: Environment }> => {
    return apiClient(`/api/v1/environments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    return apiClient(`/api/v1/environments/${id}`, { method: 'DELETE' });
  },
};
