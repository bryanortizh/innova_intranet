import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST - Entregar una tarea
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const tareaId = parseInt(id);
    const body = await request.json();
    const { studentId, archivo, comentario } = body;

    // Validaciones
    if (!studentId) {
      return NextResponse.json(
        { error: "Se requiere el ID del estudiante" },
        { status: 400 },
      );
    }

    // Verificar que la tarea exista
    const tarea = await prisma.tareas_intra.findUnique({
      where: { id: tareaId },
    });

    if (!tarea) {
      return NextResponse.json(
        { error: "La tarea especificada no existe" },
        { status: 400 },
      );
    }

    // Verificar que el estudiante exista
    const student = await prisma.students_intra.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return NextResponse.json(
        { error: "El estudiante especificado no existe" },
        { status: 400 },
      );
    }

    // Verificar que el estudiante no haya entregado ya la tarea
    const existingEntrega = await prisma.tareas_entregadas.findUnique({
      where: {
        tareaId_studentId: {
          tareaId,
          studentId,
        },
      },
    });

    if (existingEntrega) {
      return NextResponse.json(
        { error: "El estudiante ya ha entregado esta tarea" },
        { status: 400 },
      );
    }

    // Crear la entrega
    const entrega = await prisma.tareas_entregadas.create({
      data: {
        tareaId,
        studentId,
        archivo,
        comentario,
      },
      include: {
        tarea: {
          select: {
            titulo: true,
            puntos: true,
          },
        },
        student: {
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
    });

    return NextResponse.json(entrega, { status: 201 });
  } catch (error) {
    console.error("Error al entregar tarea:", error);
    return NextResponse.json(
      { error: "Error al entregar tarea" },
      { status: 500 },
    );
  }
}

// PUT - Calificar una entrega de tarea
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const tareaId = parseInt(id);
    const body = await request.json();
    const { studentId, calificacion } = body;

    // Validaciones
    if (!studentId || calificacion === undefined) {
      return NextResponse.json(
        { error: "Se requiere el ID del estudiante y la calificación" },
        { status: 400 },
      );
    }

    // Buscar la entrega
    const entrega = await prisma.tareas_entregadas.findUnique({
      where: {
        tareaId_studentId: {
          tareaId,
          studentId,
        },
      },
    });

    if (!entrega) {
      return NextResponse.json(
        { error: "No se encontró la entrega" },
        { status: 404 },
      );
    }

    // Actualizar la calificación
    const updatedEntrega = await prisma.tareas_entregadas.update({
      where: {
        tareaId_studentId: {
          tareaId,
          studentId,
        },
      },
      data: {
        calificacion,
        calificadoAt: new Date(),
      },
      include: {
        tarea: {
          select: {
            titulo: true,
            puntos: true,
          },
        },
        student: {
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
    });

    return NextResponse.json(updatedEntrega, { status: 200 });
  } catch (error) {
    console.error("Error al calificar tarea:", error);
    return NextResponse.json(
      { error: "Error al calificar tarea" },
      { status: 500 },
    );
  }
}
