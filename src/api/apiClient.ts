const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export interface ApiErrorShape {
  error?: string;
  errors?: Record<string, string> | Array<[string, string]>;
}

export class ApiError extends Error {
  constructor(message: string, public status: number, public details?: ApiErrorShape) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const csrfToken = document.cookie
    .split('; ')
    .find(cookie => cookie.startsWith('XSRF-TOKEN='))
    ?.split('=')
    .slice(1)
    .join('=');

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(csrfToken ? { 'X-XSRF-TOKEN': decodeURIComponent(csrfToken) } : {}),
      ...(init.headers || {}),
    },
    credentials: 'include',
    ...init,
  });

  const contentType = response.headers.get('content-type') || '';
  const body = contentType.includes('application/json') ? await response.json().catch(() => null) : await response.text().catch(() => null);

  if (!response.ok) {
    const errorMessage =
      typeof body === 'object' && body && 'error' in body
        ? String((body as ApiErrorShape).error)
        : 'Request failed';
    throw new ApiError(errorMessage, response.status, body as ApiErrorShape | undefined);
  }

  return body as T;
}

export async function get<T>(path: string): Promise<T> {
  return request<T>(path, { method: 'GET' });
}

export async function post<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined });
}

export async function put<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, { method: 'PUT', body: body ? JSON.stringify(body) : undefined });
}

export async function patch<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined });
}
