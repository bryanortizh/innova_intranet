import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Listar cursos de un usuario (estudiante) por su userId
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = parseInt(params.id);
    if (isNaN(userId)) {
      return NextResponse.json({ error: "ID de usuario inválido" }, { status: 400 });
    }

    // Buscar el perfil de estudiante
    const student = await prisma.students_intra.findUnique({
      where: { userId },
      include: {
        enrollments: {
          include: {
            course: {
              select: {
                id: true,
                nombre: true,
                descripcion: true,
                cover: true,
                estado: true,
                teacher: {
                  include: {
                    user: {
                      select: {
                        nombre: true,
                        apellido: true,
                        email: true,
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

    if (!student) {
      return NextResponse.json({ error: "El usuario no tiene perfil de estudiante" }, { status: 404 });
    }

    // Mapear enrollments a courses directo
    const courses = student.enrollments.map((enrollment) => ({
      ...enrollment.course,
      enrollmentId: enrollment.id,
      enrollmentEstado: enrollment.estado,
      enrollmentCreatedAt: enrollment.createdAt,
    }));

    return NextResponse.json(courses, { status: 200 });
  } catch (error) {
    console.error("Error al obtener cursos del usuario:", error);
    return NextResponse.json(
      { error: "Error al obtener cursos del usuario" },
      { status: 500 },
    );
  }
}
