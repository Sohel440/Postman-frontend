import { apiClient } from './client';
import type { User } from '../types';

export interface RegisterPayload {
  name: string;
  email: string;
  password?: string;
}

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface AuthResponseData {
  token: string;
  user: User;
}

export const authApi = {
  register: async (payload: RegisterPayload): Promise<{ success: boolean; data: User }> => {
    return apiClient('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  login: async (payload: LoginPayload): Promise<{ success: boolean; data: AuthResponseData }> => {
    return apiClient('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getProfile: async (): Promise<{ success: boolean; data: User }> => {
    return apiClient('/api/auth/profile', {
      method: 'GET',
    });
  },
};
