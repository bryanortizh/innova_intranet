import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Listar todas las tareas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");

    // Autenticación para saber si es alumno
    let user = null;
    try {
      const { verifyAuth } = await import("@/lib/middleware/auth");
      const authResult = await verifyAuth(request);
      if (authResult.success && authResult.user) {
        user = authResult.user;
      }
    } catch (e) {
      // Si no hay auth, ignorar (para endpoints públicos)
    }

    // Si es alumno y no se pasa courseId, traer tareas de todos sus cursos
    if (user && user.rol === "ALUMNO" && !courseId) {
      // Buscar el estudiante
      const student = await prisma.students_intra.findUnique({
        where: { userId: user.userId },
        select: { id: true },
      });
      if (!student) {
        return NextResponse.json({ error: "Estudiante no encontrado" }, { status: 404 });
      }
      // Buscar cursos en los que está inscrito
      const enrollments = await prisma.enrollments_intra.findMany({
        where: { studentId: student.id },
        select: { courseId: true },
      });
      const courseIds = enrollments.map(e => e.courseId);
      if (courseIds.length === 0) {
        return NextResponse.json([], { status: 200 });
      }
      const tareas = await prisma.tareas_intra.findMany({
        where: { courseId: { in: courseIds } },
        include: {
          course: { select: { id: true, nombre: true } },
          _count: { select: { entregas: true } },
        },
        orderBy: { fechaEntrega: "asc" },
      });
      return NextResponse.json(tareas, { status: 200 });
    }

    // Si se pasa courseId (o no es alumno), comportamiento normal
    if (!courseId) {
      return NextResponse.json(
        { error: "Se requiere el ID del curso" },
        { status: 400 },
      );
    }
    const tareas = await prisma.tareas_intra.findMany({
      where: { courseId: parseInt(courseId) },
      include: {
        course: {
          select: {
            id: true,
            nombre: true,
          },
        },
        _count: {
          select: {
            entregas: true,
          },
        },
      },
      orderBy: {
        fechaEntrega: "asc",
      },
    });
    return NextResponse.json(tareas, { status: 200 });
  } catch (error) {
    console.error("Error al obtener tareas:", error);
    return NextResponse.json(
      { error: "Error al obtener tareas" },
      { status: 500 },
    );
  }
}

// POST - Crear una nueva tarea
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { courseId, titulo, descripcion, fechaEntrega, puntos } = body;

    // Validaciones
    if (!courseId || !titulo) {
      return NextResponse.json(
        { error: "El curso y el título son obligatorios" },
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

    const tarea = await prisma.tareas_intra.create({
      data: {
        courseId,
        titulo,
        descripcion,
        fechaEntrega: fechaEntrega ? new Date(fechaEntrega) : null,
        puntos,
      },
      include: {
        course: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
    });

    return NextResponse.json(tarea, { status: 201 });
  } catch (error) {
    console.error("Error al crear tarea:", error);
    return NextResponse.json(
      { error: "Error al crear tarea" },
      { status: 500 },
    );
  }
}
