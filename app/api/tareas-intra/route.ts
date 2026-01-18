import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Listar todas las tareas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");

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
