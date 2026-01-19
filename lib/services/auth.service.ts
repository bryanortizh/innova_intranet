import { ApiClient } from './apiClient';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    rol: 'PROFESOR' | 'ALUMNO';
    isActive: boolean;
  };
}

export interface User {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: 'PROFESOR' | 'ALUMNO';
  isActive: boolean;
}

export class AuthService {
  /**
   * Iniciar sesión
   */
  static async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await ApiClient.post<LoginResponse>(
      '/auth/login',
      credentials
    );
    
    // Guardar token en localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  }

  /**
   * Obtener usuario actual
   */
  static async getCurrentUser(token: string): Promise<User> {
    return ApiClient.get<User>('/auth/me', token);
  }

  /**
   * Cerrar sesión
   */
  static async logout(token: string): Promise<void> {
    await ApiClient.post('/auth/logout', {}, token);
    
    // Limpiar localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  /**
   * Obtener token del localStorage
   */
  static getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  /**
   * Obtener usuario del localStorage
   */
  static getStoredUser(): User | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }

  /**
   * Verificar si el usuario está autenticado
   */
  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Verificar si el usuario es profesor
   */
  static isTeacher(): boolean {
    const user = this.getStoredUser();
    return user?.rol === 'PROFESOR';
  }

  /**
   * Verificar si el usuario es estudiante
   */
  static isStudent(): boolean {
    const user = this.getStoredUser();
    return user?.rol === 'ALUMNO';
  }
}
