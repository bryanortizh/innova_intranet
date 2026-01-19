import { ApiClient } from './apiClient';
import { AuthService } from './auth.service';

export interface Teacher {
  id: number;
  userId: number;
  telefono?: string;
  especialidad?: string;
  fotoPerfil?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    isActive: boolean;
    rol: string;
  };
  courses?: Course[];
}

export interface Course {
  id: number;
  nombre: string;
  estado: boolean;
}

export interface CreateTeacherDto {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  telefono?: string;
  especialidad?: string;
  fotoPerfil?: string;
}

export interface UpdateTeacherDto {
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  especialidad?: string;
  fotoPerfil?: string;
  isActive?: boolean;
}

export class TeacherService {
  /**
   * Obtener todos los profesores
   */
  static async getAll(): Promise<Teacher[]> {
    const token = AuthService.getToken();
    return ApiClient.get<Teacher[]>('/teachers-intra', token || undefined);
  }

  /**
   * Obtener un profesor por ID
   */
  static async getById(id: number): Promise<Teacher> {
    const token = AuthService.getToken();
    return ApiClient.get<Teacher>(`/teachers-intra/${id}`, token || undefined);
  }

  /**
   * Crear un nuevo profesor
   */
  static async create(data: CreateTeacherDto): Promise<Teacher> {
    const token = AuthService.getToken();
    return ApiClient.post<Teacher>('/teachers-intra', data, token || undefined);
  }

  /**
   * Actualizar un profesor
   */
  static async update(id: number, data: UpdateTeacherDto): Promise<Teacher> {
    const token = AuthService.getToken();
    return ApiClient.put<Teacher>(
      `/teachers-intra/${id}`,
      data,
      token || undefined
    );
  }

  /**
   * Eliminar un profesor
   */
  static async delete(id: number): Promise<{ message: string }> {
    const token = AuthService.getToken();
    return ApiClient.delete<{ message: string }>(
      `/teachers-intra/${id}`,
      token || undefined
    );
  }

  /**
   * Activar/Desactivar cuenta de profesor
   */
  static async toggleActive(id: number, isActive: boolean): Promise<Teacher> {
    return this.update(id, { isActive });
  }
}
