# API de Enrollments (Inscripciones)

Esta API gestiona las inscripciones de estudiantes en cursos. Permite que un estudiante pueda estar inscrito en múltiples cursos.

## Base URL
```
/api/enrollments
```

## Endpoints

### 1. Listar todas las inscripciones
```
GET /api/enrollments
```

**Query Parameters:**
- `studentId` (opcional): Filtrar por ID de estudiante
- `courseId` (opcional): Filtrar por ID de curso
- `estado` (opcional): Filtrar por estado (ACTIVO, RETIRADO, COMPLETADO)

**Ejemplo:**
```bash
# Todas las inscripciones
GET /api/enrollments

# Inscripciones de un estudiante específico
GET /api/enrollments?studentId=1

# Inscripciones de un curso específico
GET /api/enrollments?courseId=5

# Inscripciones activas de un estudiante
GET /api/enrollments?studentId=1&estado=ACTIVO
```

**Respuesta exitosa (200):**
```json
[
  {
    "id": 1,
    "studentId": 1,
    "courseId": 5,
    "estado": "ACTIVO",
    "createdAt": "2026-01-19T12:00:00.000Z",
    "updatedAt": "2026-01-19T12:00:00.000Z",
    "student": {
      "id": 1,
      "userId": 10,
      "telefono": "999888777",
      "fotoPerfil": "https://...",
      "user": {
        "id": 10,
        "nombre": "Juan",
        "apellido": "Pérez",
        "email": "juan@example.com",
        "isActive": true,
        "rol": "ALUMNO"
      }
    },
    "course": {
      "id": 5,
      "nombre": "Matemáticas Avanzadas",
      "descripcion": "Curso de matemáticas nivel avanzado",
      "cover": "https://...",
      "estado": true,
      "teacher": {
        "id": 2,
        "user": {
          "nombre": "María",
          "apellido": "González"
        }
      }
    }
  }
]
```

---

### 2. Crear una nueva inscripción
```
POST /api/enrollments
```

**Body:**
```json
{
  "studentId": 1,
  "courseId": 5,
  "estado": "ACTIVO"  // Opcional, por defecto es "ACTIVO"
}
```

**Respuesta exitosa (201):**
```json
{
  "id": 1,
  "studentId": 1,
  "courseId": 5,
  "estado": "ACTIVO",
  "createdAt": "2026-01-19T12:00:00.000Z",
  "updatedAt": "2026-01-19T12:00:00.000Z",
  "student": {
    "id": 1,
    "userId": 10,
    "telefono": "999888777",
    "fotoPerfil": "https://...",
    "user": {
      "id": 10,
      "nombre": "Juan",
      "apellido": "Pérez",
      "email": "juan@example.com",
      "isActive": true,
      "rol": "ALUMNO"
    }
  },
  "course": {
    "id": 5,
    "nombre": "Matemáticas Avanzadas",
    "descripcion": "Curso de matemáticas nivel avanzado",
    "cover": "https://..."
  }
}
```

**Errores posibles:**
- `400`: Falta studentId o courseId
- `400`: El estudiante ya está inscrito en este curso
- `404`: El estudiante o curso no existe

---

### 3. Obtener una inscripción por ID
```
GET /api/enrollments/[id]
```

**Ejemplo:**
```bash
GET /api/enrollments/1
```

**Respuesta exitosa (200):**
```json
{
  "id": 1,
  "studentId": 1,
  "courseId": 5,
  "estado": "ACTIVO",
  "createdAt": "2026-01-19T12:00:00.000Z",
  "updatedAt": "2026-01-19T12:00:00.000Z",
  "student": { ... },
  "course": { ... }
}
```

**Errores posibles:**
- `404`: Inscripción no encontrada

---

### 4. Actualizar el estado de una inscripción
```
PATCH /api/enrollments/[id]
```

**Body:**
```json
{
  "estado": "COMPLETADO"  // ACTIVO, RETIRADO, o COMPLETADO
}
```

**Ejemplo:**
```bash
PATCH /api/enrollments/1
```

**Respuesta exitosa (200):**
```json
{
  "id": 1,
  "studentId": 1,
  "courseId": 5,
  "estado": "COMPLETADO",
  "createdAt": "2026-01-19T12:00:00.000Z",
  "updatedAt": "2026-01-19T12:30:00.000Z",
  "student": { ... },
  "course": { ... }
}
```

**Errores posibles:**
- `400`: Estado inválido
- `404`: Inscripción no encontrada

---

### 5. Eliminar una inscripción
```
DELETE /api/enrollments/[id]
```

**Opción 1: Eliminar por ID de inscripción**
```bash
DELETE /api/enrollments/1
```

**Opción 2: Eliminar por query parameters**
```bash
DELETE /api/enrollments?studentId=1&courseId=5
```

**Respuesta exitosa (200):**
```json
{
  "message": "Inscripción eliminada exitosamente",
  "enrollment": { ... }
}
```

**Errores posibles:**
- `400`: Faltan parámetros requeridos
- `404`: Inscripción no encontrada

---

## Endpoint de Students-Intra actualizado

El endpoint `/api/students-intra` ahora también soporta asignar estudiantes existentes a cursos adicionales.

### Crear estudiante Y asignarlo a un curso (nuevo usuario)
```
POST /api/students-intra
```

**Body:**
```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "telefono": "999888777",
  "fotoPerfil": "https://...",
  "courseId": 5
}
```

### Asignar estudiante existente a un curso adicional
```
POST /api/students-intra
```

**Body:**
```json
{
  "userId": 10,  // ID del usuario existente
  "courseId": 8   // ID del nuevo curso a asignar
}
```

**Respuesta exitosa (201):**
```json
{
  "id": 2,
  "studentId": 1,
  "courseId": 8,
  "estado": "ACTIVO",
  "createdAt": "2026-01-19T12:30:00.000Z",
  "updatedAt": "2026-01-19T12:30:00.000Z",
  "student": { ... },
  "course": { ... }
}
```

---

## Estados de Inscripción

Las inscripciones pueden tener los siguientes estados:

- **ACTIVO**: El estudiante está actualmente cursando
- **RETIRADO**: El estudiante se retiró del curso
- **COMPLETADO**: El estudiante completó el curso

---

## Ejemplos de uso

### 1. Crear un nuevo estudiante e inscribirlo en un curso
```bash
POST /api/students-intra
Content-Type: application/json

{
  "nombre": "Ana",
  "apellido": "López",
  "email": "ana@example.com",
  "password": "securepass123",
  "courseId": 5
}
```

### 2. Inscribir ese mismo estudiante en otro curso
```bash
# Primero obtener el userId del estudiante
GET /api/students-intra

# Luego inscribirlo en otro curso
POST /api/students-intra
Content-Type: application/json

{
  "userId": 10,  // ID del usuario que acabamos de crear
  "courseId": 8   // Otro curso
}

# O usar directamente el endpoint de enrollments
POST /api/enrollments
Content-Type: application/json

{
  "studentId": 1,  // ID del registro de students_intra
  "courseId": 8
}
```

### 3. Ver todos los cursos de un estudiante
```bash
GET /api/enrollments?studentId=1
```

### 4. Ver todos los estudiantes de un curso
```bash
GET /api/students-intra?courseId=5
```

### 5. Retirar a un estudiante de un curso
```bash
PATCH /api/enrollments/1
Content-Type: application/json

{
  "estado": "RETIRADO"
}
```

### 6. Eliminar completamente una inscripción
```bash
DELETE /api/enrollments/1
```
