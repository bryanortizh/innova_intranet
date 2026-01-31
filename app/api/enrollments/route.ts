import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Listar todas las inscripciones
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");
    const courseId = searchParams.get("courseId");
    const estado = searchParams.get("estado");

    const where: any = {};

    if (studentId) where.studentId = parseInt(studentId);
    if (courseId) where.courseId = parseInt(courseId);
    if (estado) where.estado = estado;

    const enrollments = await prisma.enrollments_intra.findMany({
      where,
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
            descripcion: true,
            cover: true,
            estado: true,
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(enrollments, { status: 200 });
  } catch (error) {
    console.error("Error al obtener inscripciones:", error);
    return NextResponse.json(
      { error: "Error al obtener inscripciones" },
      { status: 500 },
    );
  }
}

// POST - Crear una nueva inscripción (asignar estudiante a curso)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, courseId, estado = "ACTIVO" } = body;

    // Validaciones
    if (!studentId || !courseId) {
      return NextResponse.json(
        { error: "El ID del estudiante y del curso son obligatorios" },
        { status: 400 },
      );
    }

    // Verificar que el estudiante existe
    const student = await prisma.students_intra.findUnique({
      where: { id: studentId },
      include: {
        user: true,
      },
    });

    if (!student) {
      return NextResponse.json(
        { error: "El estudiante especificado no existe" },
        { status: 404 },
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
          studentId,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { error: "El estudiante ya está inscrito en este curso" },
        { status: 400 },
      );
    }

    // Crear la inscripción
    const enrollment = await prisma.enrollments_intra.create({
      data: {
        studentId,
        courseId,
        estado,
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
            descripcion: true,
            cover: true,
          },
        },
      },
    });

    return NextResponse.json(enrollment, { status: 201 });
  } catch (error) {
    console.error("Error al crear inscripción:", error);
    return NextResponse.json(
      { error: "Error al crear inscripción" },
      { status: 500 },
    );
  }
}

// DELETE - Eliminar una inscripción
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const studentId = searchParams.get("studentId");
    const courseId = searchParams.get("courseId");

    if (id) {
      // Eliminar por ID de inscripción
      const enrollment = await prisma.enrollments_intra.delete({
        where: { id: parseInt(id) },
      });

      return NextResponse.json(
        { message: "Inscripción eliminada exitosamente", enrollment },
        { status: 200 },
      );
    } else if (studentId && courseId) {
      // Eliminar por combinación de estudiante y curso
      const enrollment = await prisma.enrollments_intra.delete({
        where: {
          studentId_courseId: {
            studentId: parseInt(studentId),
            courseId: parseInt(courseId),
          },
        },
      });

      return NextResponse.json(
        { message: "Inscripción eliminada exitosamente", enrollment },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        { error: "Se requiere el ID de inscripción o studentId y courseId" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Error al eliminar inscripción:", error);
    return NextResponse.json(
      { error: "Error al eliminar inscripción" },
      { status: 500 },
    );
  }
}
