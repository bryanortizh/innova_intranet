import { ApiClient } from './apiClient';
import { AuthService } from './auth.service';

export interface Horario {
  id: number;
  courseId: number;
  cicloId?: number | null;
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
  aula?: string | null;
  modalidad?: string | null;
  createdAt: string;
  updatedAt: string;
  course?: {
    id: number;
    nombre: string;
    teacher?: {
      user: {
        nombre: string;
        apellido: string;
        email: string;
      };
    };
  };
  ciclo?: {
    id: number;
    nombre: string;
    fechaInicio: string;
    fechaFin: string;
  };
}

export interface CreateHorarioDto {
  courseId: number;
  cicloId?: number;
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
  aula?: string;
  modalidad?: string;
}

export interface UpdateHorarioDto {
  diaSemana?: string;
  horaInicio?: string;
  horaFin?: string;
  aula?: string;
  modalidad?: string;
  cicloId?: number;
}

export class HorarioService {
  /**
   * Obtener todos los horarios con filtros opcionales
   */
  static async getAll(filters?: { courseId?: number; cicloId?: number }): Promise<Horario[]> {
    try {
      const token = AuthService.getToken();
      const params = new URLSearchParams();
      if (filters?.courseId) params.append('courseId', filters.courseId.toString());
      if (filters?.cicloId) params.append('cicloId', filters.cicloId.toString());
      
      const url = params.toString() ? `/horarios-intra?${params}` : '/horarios-intra';
      return ApiClient.get<Horario[]>(url, token || undefined);
    } catch (error) {
      console.error('Error obteniendo horarios:', error);
      throw error;
    }
  }

  /**
   * Obtener horarios por curso
   */
  static async getByCourse(courseId: number): Promise<Horario[]> {
    return this.getAll({ courseId });
  }

  /**
   * Obtener horarios por ciclo
   */
  static async getByCiclo(cicloId: number): Promise<Horario[]> {
    return this.getAll({ cicloId });
  }

  /**
   * Obtener un horario por ID
   */
  static async getById(id: number): Promise<Horario> {
    try {
      const token = AuthService.getToken();
      return ApiClient.get<Horario>(`/horarios-intra/${id}`, token || undefined);
    } catch (error) {
      console.error('Error obteniendo horario:', error);
      throw error;
    }
  }

  /**
   * Crear un nuevo horario
   */
  static async create(data: CreateHorarioDto): Promise<Horario> {
    try {
      const token = AuthService.getToken();
      return ApiClient.post<Horario>('/horarios-intra', data, token || undefined);
    } catch (error) {
      console.error('Error creando horario:', error);
      throw error;
    }
  }

  /**
   * Actualizar un horario existente
   */
  static async update(id: number, data: UpdateHorarioDto): Promise<Horario> {
    try {
      const token = AuthService.getToken();
      return ApiClient.put<Horario>(`/horarios-intra/${id}`, data, token || undefined);
    } catch (error) {
      console.error('Error actualizando horario:', error);
      throw error;
    }
  }

  /**
   * Eliminar un horario
   */
  static async delete(id: number): Promise<{ message: string }> {
    try {
      const token = AuthService.getToken();
      return ApiClient.delete<{ message: string }>(`/horarios-intra/${id}`, token || undefined);
    } catch (error) {
      console.error('Error eliminando horario:', error);
      throw error;
    }
  }

  /**
   * Organizar horarios por día de la semana
   */
  static organizarPorDia(horarios: Horario[]): Record<string, Horario[]> {
    const dias = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];
    const organizados: Record<string, Horario[]> = {};
    
    dias.forEach(dia => {
      organizados[dia] = horarios
        .filter(h => h.diaSemana === dia)
        .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));
    });
    
    return organizados;
  }

  /**
   * Verificar si hay conflictos de horario
   */
  static tieneConflicto(
    horario: CreateHorarioDto | UpdateHorarioDto,
    horariosExistentes: Horario[],
    excluirId?: number
  ): boolean {
    return horariosExistentes
      .filter(h => excluirId ? h.id !== excluirId : true)
      .filter(h => h.diaSemana === horario.diaSemana)
      .some(h => {
        const inicio1 = horario.horaInicio || '';
        const fin1 = horario.horaFin || '';
        const inicio2 = h.horaInicio;
        const fin2 = h.horaFin;
        
        return (
          (inicio1 >= inicio2 && inicio1 < fin2) ||
          (fin1 > inicio2 && fin1 <= fin2) ||
          (inicio1 <= inicio2 && fin1 >= fin2)
        );
      });
  }

  /**
   * Formatear hora para display
   */
  static formatearHora(hora: string): string {
    const [horas, minutos] = hora.split(':');
    const h = parseInt(horas);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutos} ${ampm}`;
  }

  /**
   * Obtener nombre corto del día
   */
  static getNombreCorto(dia: string): string {
    const nombres: Record<string, string> = {
      'LUNES': 'Lun',
      'MARTES': 'Mar',
      'MIERCOLES': 'Mié',
      'JUEVES': 'Jue',
      'VIERNES': 'Vie',
      'SABADO': 'Sáb',
      'DOMINGO': 'Dom'
    };
    return nombres[dia] || dia;
  }

  /**
   * Obtener color del día de la semana
   */
  static getColorDia(dia: string): string {
    const colores: Record<string, string> = {
      'LUNES': 'blue',
      'MARTES': 'green',
      'MIERCOLES': 'purple',
      'JUEVES': 'orange',
      'VIERNES': 'pink',
      'SABADO': 'cyan',
      'DOMINGO': 'red'
    };
    return colores[dia] || 'gray';
  }

  /**
   * Validar formato de hora (HH:MM)
   */
  static validarHora(hora: string): boolean {
    const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return regex.test(hora);
  }

  /**
   * Calcular duración en minutos
   */
  static calcularDuracion(horaInicio: string, horaFin: string): number {
    const [hi, mi] = horaInicio.split(':').map(Number);
    const [hf, mf] = horaFin.split(':').map(Number);
    
    const inicio = hi * 60 + mi;
    const fin = hf * 60 + mf;
    
    return fin - inicio;
  }

  /**
   * Obtener horarios del día actual
   */
  static getHorariosHoy(horarios: Horario[]): Horario[] {
    const dias = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];
    const hoy = dias[new Date().getDay()];
    
    return horarios
      .filter(h => h.diaSemana === hoy)
      .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));
  }
}