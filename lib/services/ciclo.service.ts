import { ApiClient } from './apiClient';
import { AuthService } from './auth.service';

export interface Ciclo {
  id: number;
  courseId: number;
  titulo: string;
  descripcion?: string;
  orden: number;
  createdAt: string;
  updatedAt: string;
  course?: {
    id: number;
    nombre: string;
  };
}

export interface CreateCicloDto {
  courseId: number;
  titulo: string;
  descripcion?: string;
  orden: number;
}

export interface UpdateCicloDto {
  titulo?: string;
  descripcion?: string;
  orden?: number;
}

export class CicloService {
  /**
   * Obtener todos los ciclos de un curso
   */
  static async getByCourse(courseId: number): Promise<Ciclo[]> {
    const token = AuthService.getToken();
    return ApiClient.get<Ciclo[]>(
      `/ciclos-intra?courseId=${courseId}`,
      token || undefined
    );
  }

  /**
   * Obtener un ciclo por ID
   */
  static async getById(id: number): Promise<Ciclo> {
    const token = AuthService.getToken();
    return ApiClient.get<Ciclo>(`/ciclos-intra/${id}`, token || undefined);
  }

  /**
   * Crear un nuevo ciclo
   */
  static async create(data: CreateCicloDto): Promise<Ciclo> {
    const token = AuthService.getToken();
    return ApiClient.post<Ciclo>('/ciclos-intra', data, token || undefined);
  }

  /**
   * Actualizar un ciclo
   */
  static async update(id: number, data: UpdateCicloDto): Promise<Ciclo> {
    const token = AuthService.getToken();
    return ApiClient.put<Ciclo>(
      `/ciclos-intra/${id}`,
      data,
      token || undefined
    );
  }

  /**
   * Eliminar un ciclo
   */
  static async delete(id: number): Promise<{ message: string }> {
    const token = AuthService.getToken();
    return ApiClient.delete<{ message: string }>(
      `/ciclos-intra/${id}`,
      token || undefined
    );
  }

  /**
   * Reordenar ciclos de un curso
   */
  static async reorder(courseId: number, cicloIds: number[]): Promise<void> {
    const promises = cicloIds.map((id, index) =>
      this.update(id, { orden: index + 1 })
    );
    await Promise.all(promises);
  }
}
