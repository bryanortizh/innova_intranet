import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Obtener un examen por ID con todos los resultados
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const examenId = parseInt(id);

    const examen = await prisma.examenes_intra.findUnique({
      where: { id: examenId },
      include: {
        course: {
          select: {
            id: true,
            nombre: true,
          },
        },
        realizados: {
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

    if (!examen) {
      return NextResponse.json(
        { error: "Examen no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json(examen, { status: 200 });
  } catch (error) {
    console.error("Error al obtener examen:", error);
    return NextResponse.json(
      { error: "Error al obtener examen" },
      { status: 500 },
    );
  }
}

// PUT - Actualizar un examen
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const examenId = parseInt(id);
    const body = await request.json();
    const { titulo, descripcion, fechaInicio, fechaFin, duracion, puntos } =
      body;

    const examen = await prisma.examenes_intra.findUnique({
      where: { id: examenId },
    });

    if (!examen) {
      return NextResponse.json(
        { error: "Examen no encontrado" },
        { status: 404 },
      );
    }

    const updatedExamen = await prisma.examenes_intra.update({
      where: { id: examenId },
      data: {
        ...(titulo && { titulo }),
        ...(descripcion !== undefined && { descripcion }),
        ...(fechaInicio !== undefined && {
          fechaInicio: fechaInicio ? new Date(fechaInicio) : null,
        }),
        ...(fechaFin !== undefined && {
          fechaFin: fechaFin ? new Date(fechaFin) : null,
        }),
        ...(duracion !== undefined && { duracion }),
        ...(puntos !== undefined && { puntos }),
      },
    });

    return NextResponse.json(updatedExamen, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar examen:", error);
    return NextResponse.json(
      { error: "Error al actualizar examen" },
      { status: 500 },
    );
  }
}

// DELETE - Eliminar un examen
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const examenId = parseInt(id);

    const examen = await prisma.examenes_intra.findUnique({
      where: { id: examenId },
    });

    if (!examen) {
      return NextResponse.json(
        { error: "Examen no encontrado" },
        { status: 404 },
      );
    }

    await prisma.examenes_intra.delete({
      where: { id: examenId },
    });

    return NextResponse.json(
      { message: "Examen eliminado correctamente" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error al eliminar examen:", error);
    return NextResponse.json(
      { error: "Error al eliminar examen" },
      { status: 500 },
    );
  }
}
