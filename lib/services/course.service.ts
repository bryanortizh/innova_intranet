import { ApiClient } from './apiClient';
import { AuthService } from './auth.service';

export interface CourseIntra {
  id: number;
  nombre: string;
  descripcion?: string;
  cover?: string;
  duracion?: number;
  estado: boolean;
  teacherId?: number;
  createdAt: string;
  updatedAt: string;
  teacher?: {
    id: number;
    user: {
      nombre: string;
      apellido: string;
      email: string;
    };
  };
  students?: StudentInCourse[];
  ciclos?: Ciclo[];
  tareas?: Tarea[];
  examenes?: Examen[];
  recursos?: Recurso[];
  _count?: {
    students: number;
    ciclos: number;
    tareas: number;
    examenes: number;
    recursos: number;
  };
}

export interface StudentInCourse {
  id: number;
  user: {
    nombre: string;
    apellido: string;
    email: string;
  };
}

export interface Ciclo {
  id: number;
  titulo: string;
  orden: number;
}

export interface Tarea {
  id: number;
  titulo: string;
  fechaEntrega?: string;
  _count?: {
    entregas: number;
  };
}

export interface Examen {
  id: number;
  titulo: string;
  fechaInicio?: string;
  _count?: {
    realizados: number;
  };
}

export interface Recurso {
  id: number;
  titulo: string;
  tipo: string;
  orden?: number;
}

export interface CreateCourseDto {
  nombre: string;
  descripcion?: string;
  cover?: string;
  duracion?: number;
  teacherId?: number;
}

export interface UpdateCourseDto {
  nombre?: string;
  descripcion?: string;
  cover?: string;
  duracion?: number;
  teacherId?: number;
  estado?: boolean;
}

export class CourseService {
  /**
   * Obtener todos los cursos
   */
  static async getAll(
    teacherId?: number,
    estado?: boolean
  ): Promise<CourseIntra[]> {
    const token = AuthService.getToken();
    const params = new URLSearchParams();
    if (teacherId) params.append('teacherId', teacherId.toString());
    if (estado !== undefined) params.append('estado', estado.toString());
    const query = params.toString() ? `?${params.toString()}` : '';
    return ApiClient.get<CourseIntra[]>(
      `/courses-intra${query}`,
      token || undefined
    );
  }

  /**
   * Obtener un curso por ID con todos sus detalles
   */
  static async getById(id: number): Promise<CourseIntra> {
    const token = AuthService.getToken();
    return ApiClient.get<CourseIntra>(
      `/courses-intra/${id}`,
      token || undefined
    );
  }

  /**
   * Obtener estudiantes de un curso
   */
  static async getStudents(courseId: number): Promise<StudentInCourse[]> {
    const token = AuthService.getToken();
    return ApiClient.get<StudentInCourse[]>(
      `/courses-intra/${courseId}/students`,
      token || undefined
    );
  }

  /**
   * Crear un nuevo curso
   */
  static async create(data: CreateCourseDto): Promise<CourseIntra> {
    const token = AuthService.getToken();
    return ApiClient.post<CourseIntra>(
      '/courses-intra',
      data,
      token || undefined
    );
  }

  /**
   * Actualizar un curso
   */
  static async update(
    id: number,
    data: UpdateCourseDto
  ): Promise<CourseIntra> {
    const token = AuthService.getToken();
    return ApiClient.put<CourseIntra>(
      `/courses-intra/${id}`,
      data,
      token || undefined
    );
  }

  /**
   * Eliminar un curso
   */
  static async delete(id: number): Promise<{ message: string }> {
    const token = AuthService.getToken();
    return ApiClient.delete<{ message: string }>(
      `/courses-intra/${id}`,
      token || undefined
    );
  }

  /**
   * Activar/Desactivar un curso
   */
  static async toggleActive(id: number, estado: boolean): Promise<CourseIntra> {
    return this.update(id, { estado });
  }

  /**
   * Asignar profesor a un curso
   */
  static async assignTeacher(
    courseId: number,
    teacherId: number
  ): Promise<CourseIntra> {
    return this.update(courseId, { teacherId });
  }

  /**
   * Obtener cursos de un profesor
   */
  static async getByTeacher(teacherId: number): Promise<CourseIntra[]> {
    return this.getAll(teacherId);
  }

  /**
   * Obtener cursos activos
   */
  static async getActive(): Promise<CourseIntra[]> {
    return this.getAll(undefined, true);
  }
}
