import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// GET - Listar todos los estudiantes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");

    let students;

    if (courseId) {
      // Si se especifica un curso, obtener estudiantes de ese curso a través de enrollments
      const enrollments = await prisma.enrollments_intra.findMany({
        where: { courseId: parseInt(courseId) },
        include: {
          student: {
            include: {
              user: {
                select: {
                  id: true,
                  nombre: true,
                  apellido: true,
                  email: true,
                  isActive: true,
                  rol: true,
                },
              },
            },
          },
          course: {
            select: {
              id: true,
              nombre: true,
              teacher: {
                include: {
                  user: {
                    select: {
                      nombre: true,
                      apellido: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      // Transformar el resultado para que sea más fácil de usar
      students = enrollments.map((enrollment) => ({
        ...enrollment.student,
        enrollmentId: enrollment.id,
        enrollmentEstado: enrollment.estado,
        enrollmentCreatedAt: enrollment.createdAt,
        course: enrollment.course,
      }));
    } else {
      // Si no se especifica curso, obtener todos los estudiantes con sus cursos
      const studentsRaw = await prisma.students_intra.findMany({
        include: {
          user: {
            select: {
              id: true,
              nombre: true,
              apellido: true,
              email: true,
              isActive: true,
              rol: true,
            },
          },
          enrollments: {
            include: {
              course: {
                select: {
                  id: true,
                  nombre: true,
                  teacher: {
                    include: {
                      user: {
                        select: {
                          nombre: true,
                          apellido: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      // Mapear enrollments a courses directo para cada estudiante
      students = studentsRaw.map((student) => {
        const courses = student.enrollments.map((enrollment) => ({
          ...enrollment.course,
          enrollmentId: enrollment.id,
          enrollmentEstado: enrollment.estado,
          enrollmentCreatedAt: enrollment.createdAt,
        }));
        const { enrollments, ...rest } = student;
        return {
          ...rest,
          courses,
        };
      });
    }

    return NextResponse.json(students, { status: 200 });
  } catch (error) {
    console.error("Error al obtener estudiantes:", error);
    return NextResponse.json(
      { error: "Error al obtener estudiantes" },
      { status: 500 },
    );
  }
}

// POST - Crear un nuevo estudiante
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      nombre,
      apellido,
      email,
      password,
      telefono,
      fotoPerfil,
      courseId,
      userId, // Nuevo: para asignar un usuario existente a un curso
    } = body;

    // Si se proporciona userId, significa que el estudiante ya existe y solo se asigna a un nuevo curso
    if (userId) {
      // Validar que courseId esté presente
      if (!courseId) {
        return NextResponse.json(
          { error: "El curso es obligatorio" },
          { status: 400 },
        );
      }

      // Verificar que el usuario existe y es un estudiante
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { student: true },
      });

      if (!user) {
        return NextResponse.json(
          { error: "El usuario no existe" },
          { status: 404 },
        );
      }

      if (user.rol !== "ALUMNO") {
        return NextResponse.json(
          { error: "El usuario no es un alumno" },
          { status: 400 },
        );
      }

      if (!user.student) {
        return NextResponse.json(
          { error: "El usuario no tiene un perfil de estudiante" },
          { status: 400 },
        );
      }

      // Verificar que el curso existe
      const course = await prisma.courses_intra.findUnique({
        where: { id: courseId },
      });

      if (!course) {
        return NextResponse.json(
          { error: "El curso especificado no existe" },
          { status: 404 },
        );
      }

      // Verificar que no esté ya inscrito en el curso
      const existingEnrollment = await prisma.enrollments_intra.findUnique({
        where: {
          studentId_courseId: {
            studentId: user.student.id,
            courseId: courseId,
          },
        },
      });

      if (existingEnrollment) {
        return NextResponse.json(
          { error: "El estudiante ya está inscrito en este curso" },
          { status: 400 },
        );
      }

      // Crear inscripción en el curso
      const enrollment = await prisma.enrollments_intra.create({
        data: {
          studentId: user.student.id,
          courseId,
        },
        include: {
          student: {
            include: {
              user: {
                select: {
                  id: true,
                  nombre: true,
                  apellido: true,
                  email: true,
                  isActive: true,
                  rol: true,
                },
              },
            },
          },
          course: {
            select: {
              id: true,
              nombre: true,
            },
          },
        },
      });

      return NextResponse.json(enrollment, { status: 201 });
    }

    // Flujo original: crear un nuevo estudiante
    // Validaciones
    if (!nombre || !apellido || !email || !password || !courseId) {
      return NextResponse.json(
        {
          error: "Nombre, apellido, email, contraseña y curso son obligatorios",
        },
        { status: 400 },
      );
    }

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "El email ya está registrado" },
        { status: 400 },
      );
    }

    // Verificar que el curso exista
    const course = await prisma.courses_intra.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json(
        { error: "El curso especificado no existe" },
        { status: 400 },
      );
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario y estudiante en una transacción
    const result = await prisma.$transaction(async (tx) => {
      // Crear usuario
      const user = await tx.user.create({
        data: {
          nombre,
          apellido,
          email,
          password: hashedPassword,
          rol: "ALUMNO",
          isActive: true,
        },
      }); 

      // Crear estudiante
      const student = await tx.students_intra.create({
        data: {
          userId: user.id,
          telefono,
          fotoPerfil,
        },
      });

      // Crear inscripción en el curso
      const enrollment = await tx.enrollments_intra.create({
        data: {
          studentId: student.id,
          courseId,
        },
        include: {
          student: {
            include: {
              user: {
                select: {
                  id: true,
                  nombre: true,
                  apellido: true,
                  email: true,
                  isActive: true,
                  rol: true,
                },
              },
            },
          },
          course: {
            select: {
              id: true,
              nombre: true,
            },
          },
        },
      });

      return enrollment;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error al crear estudiante:", error);
    return NextResponse.json(
      { error: "Error al crear estudiante" },
      { status: 500 },
    );
  }
}
