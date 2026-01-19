import { ApiClient } from './apiClient';
import { AuthService } from './auth.service';

export interface Student {
  id: number;
  userId: number;
  courseId: number;
  telefono?: string;
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
  course: {
    id: number;
    nombre: string;
    teacher?: {
      user: {
        nombre: string;
        apellido: string;
      };
    };
  };
  tareasEntregadas?: TareaEntregada[];
  examenesRealizados?: ExamenRealizado[];
}

export interface TareaEntregada {
  id: number;
  calificacion?: number;
  entregadoAt: string;
  tarea: {
    titulo: string;
    puntos?: number;
  };
}

export interface ExamenRealizado {
  id: number;
  calificacion?: number;
  finalizadoAt?: string;
  examen: {
    titulo: string;
    puntos?: number;
  };
}

export interface CreateStudentDto {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  courseId: number;
  telefono?: string;
  fotoPerfil?: string;
}

export interface UpdateStudentDto {
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  fotoPerfil?: string;
  courseId?: number;
  isActive?: boolean;
}

export class StudentService {
  /**
   * Obtener todos los estudiantes
   */
  static async getAll(courseId?: number): Promise<Student[]> {
    const token = AuthService.getToken();
    const query = courseId ? `?courseId=${courseId}` : '';
    return ApiClient.get<Student[]>(
      `/students-intra${query}`,
      token || undefined
    );
  }

  /**
   * Obtener un estudiante por ID
   */
  static async getById(id: number): Promise<Student> {
    const token = AuthService.getToken();
    return ApiClient.get<Student>(
      `/students-intra/${id}`,
      token || undefined
    );
  }

  /**
   * Crear un nuevo estudiante
   */
  static async create(data: CreateStudentDto): Promise<Student> {
    const token = AuthService.getToken();
    return ApiClient.post<Student>(
      '/students-intra',
      data,
      token || undefined
    );
  }

  /**
   * Actualizar un estudiante
   */
  static async update(id: number, data: UpdateStudentDto): Promise<Student> {
    const token = AuthService.getToken();
    return ApiClient.put<Student>(
      `/students-intra/${id}`,
      data,
      token || undefined
    );
  }

  /**
   * Eliminar un estudiante
   */
  static async delete(id: number): Promise<{ message: string }> {
    const token = AuthService.getToken();
    return ApiClient.delete<{ message: string }>(
      `/students-intra/${id}`,
      token || undefined
    );
  }

  /**
   * Activar/Desactivar cuenta de estudiante
   */
  static async toggleActive(id: number, isActive: boolean): Promise<Student> {
    return this.update(id, { isActive });
  }

  /**
   * Cambiar estudiante de curso
   */
  static async changeCourse(id: number, courseId: number): Promise<Student> {
    return this.update(id, { courseId });
  }
}
