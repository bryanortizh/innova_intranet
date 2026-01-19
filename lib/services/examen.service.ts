import { ApiClient } from './apiClient';
import { AuthService } from './auth.service';

export interface Examen {
  id: number;
  courseId: number;
  titulo: string;
  descripcion?: string;
  fechaInicio?: string;
  fechaFin?: string;
  duracion?: number;
  puntos?: number;
  createdAt: string;
  updatedAt: string;
  course?: {
    id: number;
    nombre: string;
  };
  realizados?: ExamenRealizado[];
  _count?: {
    realizados: number;
  };
}

export interface ExamenRealizado {
  id: number;
  examenId: number;
  studentId: number;
  respuestas?: Record<string, unknown>;
  calificacion?: number;
  iniciadoAt: string;
  finalizadoAt?: string;
  examen?: {
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

export interface CreateExamenDto {
  courseId: number;
  titulo: string;
  descripcion?: string;
  fechaInicio?: string;
  fechaFin?: string;
  duracion?: number;
  puntos?: number;
}

export interface UpdateExamenDto {
  titulo?: string;
  descripcion?: string;
  fechaInicio?: string;
  fechaFin?: string;
  duracion?: number;
  puntos?: number;
}

export interface IniciarExamenDto {
  studentId: number;
}

export interface FinalizarExamenDto {
  respuestas: Record<string, unknown>;
}

export interface CalificarExamenDto {
  studentId: number;
  calificacion: number;
}

export class ExamenService {
  /**
   * Obtener todos los exámenes
   */
  static async getAll(): Promise<Examen[]> {
    const token = AuthService.getToken();
    return ApiClient.get<Examen[]>('/examenes-intra', token || undefined);
  }

  /**
   * Obtener todos los exámenes de un curso
   */
  static async getByCourse(courseId: number): Promise<Examen[]> {
    const token = AuthService.getToken();
    return ApiClient.get<Examen[]>(
      `/examenes-intra?courseId=${courseId}`,
      token || undefined
    );
  }

  /**
   * Obtener un examen por ID
   */
  static async getById(id: number): Promise<Examen> {
    const token = AuthService.getToken();
    return ApiClient.get<Examen>(`/examenes-intra/${id}`, token || undefined);
  }

  /**
   * Obtener los exámenes realizados de un examen específico
   */
  static async getRealizados(examenId: number): Promise<ExamenRealizado[]> {
    const token = AuthService.getToken();
    return ApiClient.get<ExamenRealizado[]>(
      `/examenes-intra/${examenId}/realizados`,
      token || undefined
    );
  }

  /**
   * Crear un nuevo examen
   */
  static async create(data: CreateExamenDto): Promise<Examen> {
    const token = AuthService.getToken();
    return ApiClient.post<Examen>('/examenes-intra', data, token || undefined);
  }

  /**
   * Actualizar un examen
   */
  static async update(id: number, data: UpdateExamenDto): Promise<Examen> {
    const token = AuthService.getToken();
    return ApiClient.put<Examen>(
      `/examenes-intra/${id}`,
      data,
      token || undefined
    );
  }

  /**
   * Eliminar un examen
   */
  static async delete(id: number): Promise<{ message: string }> {
    const token = AuthService.getToken();
    return ApiClient.delete<{ message: string }>(
      `/examenes-intra/${id}`,
      token || undefined
    );
  }

  /**
   * Iniciar un examen (Estudiante)
   */
  static async iniciar(
    examenId: number,
    data: IniciarExamenDto
  ): Promise<ExamenRealizado> {
    const token = AuthService.getToken();
    return ApiClient.post<ExamenRealizado>(
      `/examenes-intra/${examenId}/realizados`,
      data,
      token || undefined
    );
  }

  /**
   * Finalizar un examen (Estudiante)
   */
  static async finalizar(
    examenId: number,
    realizadoId: number,
    data: FinalizarExamenDto
  ): Promise<ExamenRealizado> {
    const token = AuthService.getToken();
    return ApiClient.put<ExamenRealizado>(
      `/examenes-intra/${examenId}/realizados/${realizadoId}`,
      data,
      token || undefined
    );
  }

  /**
   * Calificar un examen realizado (Profesor)
   */
  static async calificar(
    examenId: number,
    data: CalificarExamenDto
  ): Promise<ExamenRealizado> {
    const token = AuthService.getToken();
    return ApiClient.put<ExamenRealizado>(
      `/examenes-intra/${examenId}/realizados`,
      data,
      token || undefined
    );
  }

  /**
   * Obtener exámenes disponibles para un estudiante
   */
  static async getAvailable(courseId: number): Promise<Examen[]> {
    const examenes = await this.getByCourse(courseId);
    const now = new Date();

    return examenes.filter((examen) => {
      if (!examen.fechaInicio || !examen.fechaFin) return false;
      const inicio = new Date(examen.fechaInicio);
      const fin = new Date(examen.fechaFin);
      return inicio <= now && now <= fin;
    });
  }

  /**
   * Verificar si un examen está disponible
   */
  static isAvailable(examen: Examen): boolean {
    if (!examen.fechaInicio || !examen.fechaFin) return false;
    const now = new Date();
    const inicio = new Date(examen.fechaInicio);
    const fin = new Date(examen.fechaFin);
    return inicio <= now && now <= fin;
  }

  /**
   * Calcular porcentaje de exámenes realizados
   */
  static calculateCompletionRate(examen: Examen, totalStudents: number): number {
    if (totalStudents === 0) return 0;
    const realizados = examen._count?.realizados || 0;
    return Math.round((realizados / totalStudents) * 100);
  }

  /**
   * Obtener promedio de calificaciones de un examen
   */
  static calculateAverageGrade(realizados: ExamenRealizado[]): number {
    const calificados = realizados.filter((r) => r.calificacion !== null);
    if (calificados.length === 0) return 0;

    const sum = calificados.reduce((acc, r) => acc + (r.calificacion || 0), 0);
    return Math.round((sum / calificados.length) * 100) / 100;
  }
}