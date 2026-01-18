import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Obtener una tarea por ID con todas las entregas
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const tareaId = parseInt(id);

    const tarea = await prisma.tareas_intra.findUnique({
      where: { id: tareaId },
      include: {
        course: {
          select: {
            id: true,
            nombre: true,
          },
        },
        entregas: {
          include: {
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
        },
      },
    });

    if (!tarea) {
      return NextResponse.json(
        { error: "Tarea no encontrada" },
        { status: 404 },
      );
    }

    return NextResponse.json(tarea, { status: 200 });
  } catch (error) {
    console.error("Error al obtener tarea:", error);
    return NextResponse.json(
      { error: "Error al obtener tarea" },
      { status: 500 },
    );
  }
}

// PUT - Actualizar una tarea
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const tareaId = parseInt(id);
    const body = await request.json();
    const { titulo, descripcion, fechaEntrega, puntos } = body;

    const tarea = await prisma.tareas_intra.findUnique({
      where: { id: tareaId },
    });

    if (!tarea) {
      return NextResponse.json(
        { error: "Tarea no encontrada" },
        { status: 404 },
      );
    }

    const updatedTarea = await prisma.tareas_intra.update({
      where: { id: tareaId },
      data: {
        ...(titulo && { titulo }),
        ...(descripcion !== undefined && { descripcion }),
        ...(fechaEntrega !== undefined && {
          fechaEntrega: fechaEntrega ? new Date(fechaEntrega) : null,
        }),
        ...(puntos !== undefined && { puntos }),
      },
    });

    return NextResponse.json(updatedTarea, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar tarea:", error);
    return NextResponse.json(
      { error: "Error al actualizar tarea" },
      { status: 500 },
    );
  }
}

// DELETE - Eliminar una tarea
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const tareaId = parseInt(id);

    const tarea = await prisma.tareas_intra.findUnique({
      where: { id: tareaId },
    });

    if (!tarea) {
      return NextResponse.json(
        { error: "Tarea no encontrada" },
        { status: 404 },
      );
    }

    await prisma.tareas_intra.delete({
      where: { id: tareaId },
    });

    return NextResponse.json(
      { message: "Tarea eliminada correctamente" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error al eliminar tarea:", error);
    return NextResponse.json(
      { error: "Error al eliminar tarea" },
      { status: 500 },
    );
  }
}
