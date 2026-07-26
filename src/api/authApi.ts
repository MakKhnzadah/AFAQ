import { get, post } from './apiClient';

export interface AuthenticatedUser {
  email: string;
  roles: string[];
}

export function login(email: string, password: string): Promise<AuthenticatedUser> {
  return post<AuthenticatedUser>('/api/auth/login', { email, password });
}

export function getCurrentUser(): Promise<AuthenticatedUser> {
  return get<AuthenticatedUser>('/api/auth/me');
}

export function initializeCsrf(): Promise<{ token: string }> {
  return get<{ token: string }>('/api/auth/csrf');
}

export function logout(): Promise<void> {
  return post<void>('/api/auth/logout');
}
