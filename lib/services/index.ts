// Exportar todos los servicios desde un solo archivo
export { ApiClient } from "./apiClient";
export { AuthService } from "./auth.service";
export { TeacherService } from "./teacher.service";
export { StudentService } from "./student.service";
export { CourseService } from "./course.service";
export { CicloService } from "./ciclo.service";
export { TareaService } from "./tarea.service";
export { ExamenService } from "./examen.service";
export { RecursoService } from "./recurso.service";
export { HorarioService } from "./horario.service";

// Exportar funciones del servicio antiguo para compatibilidad
export {
  getToken,
  getUser,
  isAuthenticated,
  login,
  logout,
  verifySession,
} from "./authService";

// Exportar tipos
export type { LoginCredentials, LoginResponse, User } from "./auth.service";
export type {
  Teacher,
  CreateTeacherDto,
  UpdateTeacherDto,
} from "./teacher.service";
export type {
  Student,
  CreateStudentDto,
  UpdateStudentDto,
} from "./student.service";
export type {
  CourseIntra,
  CreateCourseDto,
  UpdateCourseDto,
} from "./course.service";
export type { Ciclo, CreateCicloDto, UpdateCicloDto } from "./ciclo.service";
export type {
  Tarea,
  TareaEntregada,
  CreateTareaDto,
  UpdateTareaDto,
  EntregarTareaDto,
  CalificarTareaDto,
} from "./tarea.service";
export type {
  Examen,
  ExamenRealizado,
  CreateExamenDto,
  UpdateExamenDto,
  FinalizarExamenDto,
  CalificarExamenDto,
} from "./examen.service";
export type {
  Recurso,
  TipoRecurso,
  CreateRecursoDto,
  UpdateRecursoDto,
} from "./recurso.service";
export type {
  Horario,
  CreateHorarioDto,
  UpdateHorarioDto,
} from "./horario.service";
