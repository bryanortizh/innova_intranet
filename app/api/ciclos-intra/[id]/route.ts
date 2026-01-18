import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Obtener un ciclo por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const cicloId = parseInt(id);

    const ciclo = await prisma.ciclos_intra.findUnique({
      where: { id: cicloId },
      include: {
        course: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
    });

    if (!ciclo) {
      return NextResponse.json(
        { error: "Ciclo no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json(ciclo, { status: 200 });
  } catch (error) {
    console.error("Error al obtener ciclo:", error);
    return NextResponse.json(
      { error: "Error al obtener ciclo" },
      { status: 500 },
    );
  }
}

// PUT - Actualizar un ciclo
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const cicloId = parseInt(id);
    const body = await request.json();
    const { titulo, descripcion, orden } = body;

    const ciclo = await prisma.ciclos_intra.findUnique({
      where: { id: cicloId },
    });

    if (!ciclo) {
      return NextResponse.json(
        { error: "Ciclo no encontrado" },
        { status: 404 },
      );
    }

    const updatedCiclo = await prisma.ciclos_intra.update({
      where: { id: cicloId },
      data: {
        ...(titulo && { titulo }),
        ...(descripcion !== undefined && { descripcion }),
        ...(orden !== undefined && { orden }),
      },
    });

    return NextResponse.json(updatedCiclo, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar ciclo:", error);
    return NextResponse.json(
      { error: "Error al actualizar ciclo" },
      { status: 500 },
    );
  }
}

// DELETE - Eliminar un ciclo
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const cicloId = parseInt(id);

    const ciclo = await prisma.ciclos_intra.findUnique({
      where: { id: cicloId },
    });

    if (!ciclo) {
      return NextResponse.json(
        { error: "Ciclo no encontrado" },
        { status: 404 },
      );
    }

    await prisma.ciclos_intra.delete({
      where: { id: cicloId },
    });

    return NextResponse.json(
      { message: "Ciclo eliminado correctamente" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error al eliminar ciclo:", error);
    return NextResponse.json(
      { error: "Error al eliminar ciclo" },
      { status: 500 },
    );
  }
}
