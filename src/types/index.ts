export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Collection {
  id: string;
  name: string;
  description?: string | null;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
  folders?: Folder[];
  requests?: ApiRequest[];
}

export interface Folder {
  id: string;
  collectionId: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  requests?: ApiRequest[];
}

export interface RequestAuth {
  type?: 'Bearer' | 'none';
  token?: string;
}

export interface ApiRequest {
  id: string;
  collectionId: string;
  folderId?: string | null;
  name: string;
  method: string;
  url: string;
  queryParams?: Record<string, string> | null;
  headers?: Record<string, string> | null;
  authorization?: RequestAuth | null;
  body?: any;
  createdAt?: string;
  updatedAt?: string;
}

export interface Environment {
  id: string;
  userId: string;
  name: string;
  variables?: Record<string, string> | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExecuteRequestPayload {
  method: string;
  url: string;
  queryParams?: Record<string, string>;
  headers?: Record<string, string>;
  authorization?: RequestAuth;
  body?: any;
}

export interface ExecutionResponse {
  status: number;
  statusText?: string;
  responseTime: number;
  responseSize: number;
  headers: Record<string, string>;
  body: any;
}

export interface KeyValuePair {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
  description?: string;
}
