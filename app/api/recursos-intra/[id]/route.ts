import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Obtener un recurso por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const recursoId = parseInt(id);

    const recurso = await prisma.recursos_intra.findUnique({
      where: { id: recursoId },
      include: {
        course: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
    });

    if (!recurso) {
      return NextResponse.json(
        { error: "Recurso no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json(recurso, { status: 200 });
  } catch (error) {
    console.error("Error al obtener recurso:", error);
    return NextResponse.json(
      { error: "Error al obtener recurso" },
      { status: 500 },
    );
  }
}

// PUT - Actualizar un recurso
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const recursoId = parseInt(id);
    const body = await request.json();
    const { titulo, descripcion, tipo, url, orden } = body;

    const recurso = await prisma.recursos_intra.findUnique({
      where: { id: recursoId },
    });

    if (!recurso) {
      return NextResponse.json(
        { error: "Recurso no encontrado" },
        { status: 404 },
      );
    }

    // Validar tipo si se proporciona
    if (tipo) {
      const tiposValidos = ["PDF", "VIDEO", "LINK", "DOCUMENTO"];
      if (!tiposValidos.includes(tipo.toUpperCase())) {
        return NextResponse.json(
          { error: `El tipo debe ser uno de: ${tiposValidos.join(", ")}` },
          { status: 400 },
        );
      }
    }

    const updatedRecurso = await prisma.recursos_intra.update({
      where: { id: recursoId },
      data: {
        ...(titulo && { titulo }),
        ...(descripcion !== undefined && { descripcion }),
        ...(tipo && { tipo: tipo.toUpperCase() }),
        ...(url && { url }),
        ...(orden !== undefined && { orden }),
      },
    });

    return NextResponse.json(updatedRecurso, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar recurso:", error);
    return NextResponse.json(
      { error: "Error al actualizar recurso" },
      { status: 500 },
    );
  }
}

// DELETE - Eliminar un recurso
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const recursoId = parseInt(id);

    const recurso = await prisma.recursos_intra.findUnique({
      where: { id: recursoId },
    });

    if (!recurso) {
      return NextResponse.json(
        { error: "Recurso no encontrado" },
        { status: 404 },
      );
    }

    await prisma.recursos_intra.delete({
      where: { id: recursoId },
    });

    return NextResponse.json(
      { message: "Recurso eliminado correctamente" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error al eliminar recurso:", error);
    return NextResponse.json(
      { error: "Error al eliminar recurso" },
      { status: 500 },
    );
  }
}
