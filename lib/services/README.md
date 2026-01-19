# 📚 Servicios Frontend - Innova Intranet

Todos los servicios para consumir las APIs desde el frontend.

## 🚀 Uso Rápido

```typescript
import { 
  AuthService, 
  CourseService, 
  StudentService,
  TeacherService,
  TareaService,
  ExamenService 
} from '@/lib/services';
```

## 🔐 Autenticación

### Login
```typescript
const response = await AuthService.login({
  email: 'usuario@innova.com',
  password: 'password123'
});

console.log(response.token); // Token JWT
console.log(response.user); // Datos del usuario
```

### Verificar autenticación
```typescript
if (AuthService.isAuthenticated()) {
  const user = AuthService.getStoredUser();
  
  if (AuthService.isTeacher()) {
    // Vista de profesor
  } else if (AuthService.isStudent()) {
    // Vista de estudiante
  }
}
```

### Logout
```typescript
const token = AuthService.getToken();
await AuthService.logout(token);
```

## 👨‍🏫 Servicios para Profesores

### Obtener cursos del profesor
```typescript
const teacherId = 1;
const courses = await CourseService.getByTeacher(teacherId);

console.log(courses); // Array de cursos
```

### Crear tarea
```typescript
const tarea = await TareaService.create({
  courseId: 1,
  titulo: 'Tarea de React',
  descripcion: 'Crear un componente',
  fechaEntrega: '2026-02-01T23:59:59.000Z',
  puntos: 20
});
```

### Calificar tarea
```typescript
await TareaService.grade(tareaId, {
  studentId: 3,
  calificacion: 18
});
```

### Crear examen
```typescript
const examen = await ExamenService.create({
  courseId: 1,
  titulo: 'Examen Parcial',
  descripcion: 'Evaluación de React',
  fechaInicio: '2026-02-20T09:00:00.000Z',
  fechaFin: '2026-02-20T11:00:00.000Z',
  duracion: 120, // minutos
  puntos: 100
});
```

### Ver estudiantes del curso
```typescript
const students = await CourseService.getStudents(courseId);

students.forEach(student => {
  console.log(student.user.nombre, student.user.apellido);
});
```

### Ver entregas de una tarea
```typescript
const tarea = await TareaService.getById(tareaId);

tarea.entregas?.forEach(entrega => {
  console.log(entrega.student?.user.nombre);
  console.log('Entregado:', entrega.entregadoAt);
  console.log('Calificación:', entrega.calificacion);
});
```

## 👨‍🎓 Servicios para Estudiantes

### Ver cursos disponibles
```typescript
const activeCourses = await CourseService.getActive();
```

### Ver curso completo (con todo el contenido)
```typescript
const course = await CourseService.getById(courseId);

console.log(course.ciclos); // Módulos del curso
console.log(course.tareas); // Tareas
console.log(course.examenes); // Exámenes
console.log(course.recursos); // Recursos (PDFs, videos, etc)
console.log(course.teacher); // Profesor asignado
```

### Entregar tarea
```typescript
await TareaService.submit(tareaId, {
  studentId: 3,
  archivo: 'https://github.com/usuario/proyecto',
  comentario: 'Tarea completada'
});
```

### Realizar examen
```typescript
await ExamenService.submit(examenId, {
  studentId: 3,
  respuestas: {
    pregunta1: 'A',
    pregunta2: 'C',
    pregunta3: 'B'
  }
});
```

### Ver mis tareas pendientes
```typescript
const courseId = 1;
const pending = await TareaService.getPendingByStudent(courseId);

pending.forEach(tarea => {
  console.log(tarea.titulo);
  console.log('Fecha límite:', tarea.fechaEntrega);
  console.log('Vencida:', TareaService.isOverdue(tarea));
});
```

### Ver recursos del curso
```typescript
// Todos los recursos
const recursos = await RecursoService.getByCourse(courseId);

// Solo PDFs
const pdfs = await RecursoService.getPDFs(courseId);

// Solo videos
const videos = await RecursoService.getVideos(courseId);

// Solo links
const links = await RecursoService.getLinks(courseId);
```

### Ver ciclos/módulos del curso
```typescript
const ciclos = await CicloService.getByCourse(courseId);

ciclos.forEach(ciclo => {
  console.log(`${ciclo.orden}. ${ciclo.titulo}`);
  console.log(ciclo.descripcion);
});
```

## 📊 Estadísticas y Utilidades

### Calcular tasa de entregas
```typescript
const tarea = await TareaService.getById(tareaId);
const students = await CourseService.getStudents(courseId);

const rate = TareaService.calculateSubmissionRate(
  tarea, 
  students.length
);

console.log(`${rate}% de estudiantes entregaron la tarea`);
```

### Verificar disponibilidad de examen
```typescript
const examen = await ExamenService.getById(examenId);

if (ExamenService.isAvailable(examen)) {
  console.log('El examen está disponible');
} else if (ExamenService.hasEnded(examen)) {
  console.log('El examen ha finalizado');
} else {
  console.log('El examen aún no ha comenzado');
}
```

### Promedio de calificaciones en examen
```typescript
const examen = await ExamenService.getById(examenId);
const average = ExamenService.calculateAverageGrade(examen.realizados || []);

console.log(`Promedio: ${average}`);
```

## 🎯 Gestión de Usuarios

### Crear estudiante
```typescript
const student = await StudentService.create({
  nombre: 'Carlos',
  apellido: 'López',
  email: 'carlos@innova.com',
  password: 'password123',
  courseId: 1,
  telefono: '+51 987654321'
});
```

### Crear profesor
```typescript
const teacher = await TeacherService.create({
  nombre: 'Juan',
  apellido: 'Pérez',
  email: 'juan@innova.com',
  password: 'password123',
  especialidad: 'Desarrollo Web'
});
```

### Cambiar estudiante de curso
```typescript
await StudentService.changeCourse(studentId, newCourseId);
```

### Activar/Desactivar cuenta
```typescript
// Desactivar estudiante
await StudentService.toggleActive(studentId, false);

// Activar profesor
await TeacherService.toggleActive(teacherId, true);
```

## ⚙️ Configuración

Los servicios usan automáticamente:
- **Token JWT** desde localStorage
- **Base URL**: `/api` (configurable en `.env`)

Para cambiar la URL base:
```env
NEXT_PUBLIC_API_URL=https://tu-api.com/api
```

## 🔄 Manejo de Errores

Todos los servicios lanzan excepciones en caso de error:

```typescript
try {
  const courses = await CourseService.getAll();
} catch (error) {
  console.error('Error al obtener cursos:', error.message);
  // Mostrar mensaje al usuario
}
```

## 📝 TypeScript

Todos los servicios están completamente tipados:

```typescript
import type { 
  Tarea, 
  CreateTareaDto,
  TareaEntregada 
} from '@/lib/services';

const tarea: Tarea = await TareaService.getById(1);
```
