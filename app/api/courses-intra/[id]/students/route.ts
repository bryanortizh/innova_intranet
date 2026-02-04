import { NextRequest, NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma';

// GET - Obtener todos los estudiantes de un curso
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (id === 'all') {
      // Obtener el usuario autenticado (profesor) desde el token
      const authHeader = request.headers.get('authorization') || '';
      const token = authHeader.replace('Bearer ', '');
      let userIdFromToken: number | null = null;
      if (token) {
        try {
          const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
          userIdFromToken = payload.id || payload.userId || null;
        } catch (e) {
          userIdFromToken = null;
        }
      }
      if (!userIdFromToken) {
        return NextResponse.json([], { status: 200 });
      }
      // Buscar el profesor
      const teacher = await prisma.teachers_intra.findUnique({
        where: { userId: userIdFromToken },
      });
      if (!teacher) {
        return NextResponse.json([], { status: 200 });
      }
      // Obtener todos los cursos del profesor
      const courses = await prisma.courses_intra.findMany({
        where: { teacherId: teacher.id },
        select: { id: true },
      });
      const courseIds = courses.map(c => c.id);
      if (courseIds.length === 0) {
        return NextResponse.json([], { status: 200 });
      }
      // Obtener todos los enrollments de esos cursos
      const enrollments = await prisma.enrollments_intra.findMany({
        where: { courseId: { in: courseIds } },
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
                },
              },
              tareasEntregadas: {
                include: {
                  tarea: {
                    select: {
                      titulo: true,
                      puntos: true,
                    },
                  },
                },
              },
              examenesRealizados: {
                include: {
                  examen: {
                    select: {
                      titulo: true,
                      puntos: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      // Devolver solo los datos del estudiante y datos de inscripción
      const students = enrollments.map((enrollment) => ({
        ...enrollment.student,
        enrollmentId: enrollment.id,
        enrollmentEstado: enrollment.estado,
        enrollmentCreatedAt: enrollment.createdAt,
      }));
      return NextResponse.json(students, { status: 200 });
    } else {
      const courseId = parseInt(id);
      const enrollments = await prisma.enrollments_intra.findMany({
        where: { courseId },
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
                },
              },
              tareasEntregadas: {
                include: {
                  tarea: {
                    select: {
                      titulo: true,
                      puntos: true,
                    },
                  },
                },
              },
              examenesRealizados: {
                include: {
                  examen: {
                    select: {
                      titulo: true,
                      puntos: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      // Devolver solo los datos del estudiante y datos de inscripción
      const students = enrollments.map((enrollment) => ({
        ...enrollment.student,
        enrollmentId: enrollment.id,
        enrollmentEstado: enrollment.estado,
        enrollmentCreatedAt: enrollment.createdAt,
      }));
      return NextResponse.json(students, { status: 200 });
    }
  } catch (error) {
    console.error('Error al obtener estudiantes del curso:', error);
    return NextResponse.json(
      { error: 'Error al obtener estudiantes del curso' },
      { status: 500 }
    );
  }
}
