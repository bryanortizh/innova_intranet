import { ApiClient } from './apiClient';
import { AuthService } from './auth.service';

export interface Tarea {
  id: number;
  courseId: number;
  titulo: string;
  descripcion?: string;
  fechaEntrega?: string;
  puntos?: number;
  createdAt: string;
  updatedAt: string;
  course?: {
    id: number;
    nombre: string;
  };
  entregas?: TareaEntregada[];
  _count?: {
    entregas: number;
  };
}

export interface TareaEntregada {
  id: number;
  tareaId: number;
  studentId: number;
  archivo?: string;
  comentario?: string;
  calificacion?: number;
  entregadoAt: string;
  calificadoAt?: string;
  tarea?: {
    titulo: string;
    puntos?: number;
  };
  student?: {
    user: {
      nombre: string;
      apellido: string;
      email: string;
    };
  };
}

export interface CreateTareaDto {
  courseId: number;
  titulo: string;
  descripcion?: string;
  fechaEntrega?: string;
  puntos?: number;
}

export interface UpdateTareaDto {
  titulo?: string;
  descripcion?: string;
  fechaEntrega?: string;
  puntos?: number;
}

export interface EntregarTareaDto {
  studentId: number;
  archivo?: string;
  comentario?: string;
}

export interface CalificarTareaDto {
  studentId: number;
  calificacion: number;
}

export class TareaService {
  /**
   * Obtener todas las tareas
   */
  static async getAll(): Promise<Tarea[]> {
    const token = AuthService.getToken();
    return ApiClient.get<Tarea[]>('/tareas-intra', token || undefined);
  }

  /**
   * Obtener todas las tareas de un curso
   */
  static async getByCourse(courseId: number): Promise<Tarea[]> {
    const token = AuthService.getToken();
    return ApiClient.get<Tarea[]>(
      `/tareas-intra?courseId=${courseId}`,
      token || undefined
    );
  }

  /**
   * Obtener una tarea por ID con todas las entregas
   */
  static async getById(id: number): Promise<Tarea> {
    const token = AuthService.getToken();
    return ApiClient.get<Tarea>(`/tareas-intra/${id}`, token || undefined);
  }

  /**
   * Obtener las entregas de una tarea específica
   */
  static async getEntregas(tareaId: number): Promise<TareaEntregada[]> {
    const token = AuthService.getToken();
    return ApiClient.get<TareaEntregada[]>(
      `/tareas-intra/${tareaId}/entregas`,
      token || undefined
    );
  }

  /**
   * Crear una nueva tarea
   */
  static async create(data: CreateTareaDto): Promise<Tarea> {
    const token = AuthService.getToken();
    return ApiClient.post<Tarea>('/tareas-intra', data, token || undefined);
  }

  /**
   * Actualizar una tarea
   */
  static async update(id: number, data: UpdateTareaDto): Promise<Tarea> {
    const token = AuthService.getToken();
    return ApiClient.put<Tarea>(
      `/tareas-intra/${id}`,
      data,
      token || undefined
    );
  }

  /**
   * Eliminar una tarea
   */
  static async delete(id: number): Promise<{ message: string }> {
    const token = AuthService.getToken();
    return ApiClient.delete<{ message: string }>(
      `/tareas-intra/${id}`,
      token || undefined
    );
  }

  /**
   * Entregar una tarea (Estudiante)
   */
  static async submit(
    tareaId: number,
    data: EntregarTareaDto
  ): Promise<TareaEntregada> {
    const token = AuthService.getToken();
    return ApiClient.post<TareaEntregada>(
      `/tareas-intra/${tareaId}/entregas`,
      data,
      token || undefined
    );
  }

  /**
   * Calificar una entrega de tarea (Profesor)
   */
  static async grade(
    tareaId: number,
    data: CalificarTareaDto
  ): Promise<TareaEntregada> {
    const token = AuthService.getToken();
    return ApiClient.put<TareaEntregada>(
      `/tareas-intra/${tareaId}/entregas`,
      data,
      token || undefined
    );
  }

  /**
   * Obtener tareas pendientes de un estudiante
   */
  static async getPendingByStudent(courseId: number): Promise<Tarea[]> {
    const tareas = await this.getByCourse(courseId);
    const now = new Date();
    
    return tareas.filter((tarea) => {
      if (!tarea.fechaEntrega) return false;
      const fechaEntrega = new Date(tarea.fechaEntrega);
      return fechaEntrega > now;
    });
  }

  /**
   * Verificar si una tarea está vencida
   */
  static isOverdue(tarea: Tarea): boolean {
    if (!tarea.fechaEntrega) return false;
    return new Date(tarea.fechaEntrega) < new Date();
  }

  /**
   * Calcular porcentaje de entregas
   */
  static calculateSubmissionRate(tarea: Tarea, totalStudents: number): number {
    if (totalStudents === 0) return 0;
    const entregas = tarea._count?.entregas || 0;
    return Math.round((entregas / totalStudents) * 100);
  }
}