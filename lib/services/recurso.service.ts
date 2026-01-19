import { ApiClient } from './apiClient';
import { AuthService } from './auth.service';

export type TipoRecurso = 'PDF' | 'VIDEO' | 'LINK' | 'DOCUMENTO';

export interface Recurso {
  id: number;
  courseId: number;
  titulo: string;
  descripcion?: string;
  tipo: TipoRecurso;
  url: string;
  orden?: number;
  createdAt: string;
  updatedAt: string;
  course?: {
    id: number;
    nombre: string;
  };
}

export interface CreateRecursoDto {
  courseId: number;
  titulo: string;
  descripcion?: string;
  tipo: TipoRecurso;
  url: string;
  orden?: number;
}

export interface UpdateRecursoDto {
  titulo?: string;
  descripcion?: string;
  tipo?: TipoRecurso;
  url?: string;
  orden?: number;
}

export class RecursoService {
  /**
   * Obtener todos los recursos de un curso
   */
  static async getByCourse(
    courseId: number,
    tipo?: TipoRecurso
  ): Promise<Recurso[]> {
    const token = AuthService.getToken();
    const params = new URLSearchParams({ courseId: courseId.toString() });
    if (tipo) params.append('tipo', tipo);
    const query = `?${params.toString()}`;
    return ApiClient.get<Recurso[]>(
      `/recursos-intra${query}`,
      token || undefined
    );
  }

  /**
   * Obtener un recurso por ID
   */
  static async getById(id: number): Promise<Recurso> {
    const token = AuthService.getToken();
    return ApiClient.get<Recurso>(`/recursos-intra/${id}`, token || undefined);
  }

  /**
   * Crear un nuevo recurso
   */
  static async create(data: CreateRecursoDto): Promise<Recurso> {
    const token = AuthService.getToken();
    return ApiClient.post<Recurso>('/recursos-intra', data, token || undefined);
  }

  /**
   * Actualizar un recurso
   */
  static async update(id: number, data: UpdateRecursoDto): Promise<Recurso> {
    const token = AuthService.getToken();
    return ApiClient.put<Recurso>(
      `/recursos-intra/${id}`,
      data,
      token || undefined
    );
  }

  /**
   * Eliminar un recurso
   */
  static async delete(id: number): Promise<{ message: string }> {
    const token = AuthService.getToken();
    return ApiClient.delete<{ message: string }>(
      `/recursos-intra/${id}`,
      token || undefined
    );
  }

  /**
   * Reordenar recursos de un curso
   */
  static async reorder(courseId: number, recursoIds: number[]): Promise<void> {
    const promises = recursoIds.map((id, index) =>
      this.update(id, { orden: index + 1 })
    );
    await Promise.all(promises);
  }

  /**
   * Obtener recursos por tipo
   */
  static async getByType(
    courseId: number,
    tipo: TipoRecurso
  ): Promise<Recurso[]> {
    return this.getByCourse(courseId, tipo);
  }

  /**
   * Obtener PDFs de un curso
   */
  static async getPDFs(courseId: number): Promise<Recurso[]> {
    return this.getByType(courseId, 'PDF');
  }

  /**
   * Obtener videos de un curso
   */
  static async getVideos(courseId: number): Promise<Recurso[]> {
    return this.getByType(courseId, 'VIDEO');
  }

  /**
   * Obtener links de un curso
   */
  static async getLinks(courseId: number): Promise<Recurso[]> {
    return this.getByType(courseId, 'LINK');
  }

  /**
   * Obtener documentos de un curso
   */
  static async getDocuments(courseId: number): Promise<Recurso[]> {
    return this.getByType(courseId, 'DOCUMENTO');
  }

  /**
   * Validar URL
   */
  static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Obtener icono según tipo de recurso
   */
  static getIcon(tipo: TipoRecurso): string {
    const icons: Record<TipoRecurso, string> = {
      PDF: '📄',
      VIDEO: '🎥',
      LINK: '🔗',
      DOCUMENTO: '📝',
    };
    return icons[tipo];
  }
}
