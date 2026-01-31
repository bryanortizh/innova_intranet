import { NextRequest, NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma';

// GET - Obtener todos los estudiantes de un curso
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
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
  } catch (error) {
    console.error('Error al obtener estudiantes del curso:', error);
    return NextResponse.json(
      { error: 'Error al obtener estudiantes del curso' },
      { status: 500 }
    );
  }
}
