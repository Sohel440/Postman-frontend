import { apiClient } from './client';
import type { Collection, Folder } from '../types';

export const collectionApi = {
  getAll: async (): Promise<{ success: boolean; data: Collection[] }> => {
    return apiClient('/api/collection', { method: 'GET' });
  },

  getById: async (id: string): Promise<{ success: boolean; data: Collection }> => {
    return apiClient(`/api/collection/${id}`, { method: 'GET' });
  },

  create: async (data: { name: string; description?: string }): Promise<{ success: boolean; data: Collection }> => {
    return apiClient('/api/collection', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: { name?: string; description?: string }): Promise<{ success: boolean; data: Collection }> => {
    return apiClient(`/api/collection/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    return apiClient(`/api/collection/${id}`, { method: 'DELETE' });
  },

  // Folders nested under collection
  getFolders: async (collectionId: string): Promise<{ success: boolean; data: Folder[] }> => {
    return apiClient(`/api/collection/${collectionId}/folders`, { method: 'GET' });
  },

  createFolder: async (collectionId: string, data: { name: string }): Promise<{ success: boolean; data: Folder }> => {
    return apiClient(`/api/collection/${collectionId}/folders`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateFolder: async (
    collectionId: string,
    folderId: string,
    data: { name: string }
  ): Promise<{ success: boolean; data: Folder }> => {
    return apiClient(`/api/collection/${collectionId}/folders/${folderId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  deleteFolder: async (
    collectionId: string,
    folderId: string
  ): Promise<{ success: boolean; message: string }> => {
    return apiClient(`/api/collection/${collectionId}/folders/${folderId}`, {
      method: 'DELETE',
    });
  },
};
