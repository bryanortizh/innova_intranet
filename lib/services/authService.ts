// Este archivo es un wrapper para mantener compatibilidad con código existente
// Usa el nuevo AuthService internamente

import { AuthService, type User, type LoginResponse } from './auth.service';

// Obtener token almacenado
export function getToken(): string | null {
  return AuthService.getToken();
}

// Obtener usuario almacenado
export function getUser(): User | null {
  return AuthService.getStoredUser();
}

// Verificar si está autenticado
export function isAuthenticated(): boolean {
  return AuthService.isAuthenticated();
}

// Guardar sesión
export function saveSession(token: string, user: User): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }
}

// Limpiar sesión local
export function clearSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}

// Login
export async function login(email: string, password: string): Promise<{
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    user: User;
    token: string;
  };
}> {
  try {
    const response = await AuthService.login({ email, password });
    return {
      success: true,
      data: {
        user: response.user,
        token: response.token,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Error al iniciar sesión',
    };
  }
}

// Logout
export async function logout(): Promise<{ success: boolean; message?: string; error?: string }> {
  const token = getToken();

  if (!token) {
    clearSession();
    return { success: true, message: 'Sesión cerrada' };
  }

  try {
    await AuthService.logout(token);
    return { success: true, message: 'Sesión cerrada correctamente' };
  } catch (error) {
    clearSession();
    console.error('Error en logout:', error);
    return { success: true, message: 'Sesión cerrada localmente' };
  }
}

// Verificar sesión actual
export async function verifySession(): Promise<{ success: boolean; user?: User }> {
  const token = getToken();

  if (!token) {
    return { success: false };
  }

  try {
    const user = await AuthService.getCurrentUser(token);
    return { success: true, user };
  } catch (error) {
    clearSession();
    return { success: false };
  }
}

// Exportar tipos
export type { User };

