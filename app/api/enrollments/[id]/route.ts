import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Obtener una inscripción por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const id = parseInt(params.id);

    const enrollment = await prisma.enrollments_intra.findUnique({
      where: { id },
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
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "Inscripción no encontrada" },
        { status: 404 },
      );
    }

    return NextResponse.json(enrollment, { status: 200 });
  } catch (error) {
    console.error("Error al obtener inscripción:", error);
    return NextResponse.json(
      { error: "Error al obtener inscripción" },
      { status: 500 },
    );
  }
}

// PATCH - Actualizar el estado de una inscripción
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { estado } = body;

    // Validar que el estado sea válido
    const validStates = ["ACTIVO", "RETIRADO", "COMPLETADO"];
    if (estado && !validStates.includes(estado)) {
      return NextResponse.json(
        {
          error: `Estado inválido. Debe ser uno de: ${validStates.join(", ")}`,
        },
        { status: 400 },
      );
    }

    const enrollment = await prisma.enrollments_intra.update({
      where: { id },
      data: {
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
          },
        },
      },
    });

    return NextResponse.json(enrollment, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar inscripción:", error);
    return NextResponse.json(
      { error: "Error al actualizar inscripción" },
      { status: 500 },
    );
  }
}

// DELETE - Eliminar una inscripción
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const id = parseInt(params.id);

    await prisma.enrollments_intra.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Inscripción eliminada exitosamente" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error al eliminar inscripción:", error);
    return NextResponse.json(
      { error: "Error al eliminar inscripción" },
      { status: 500 },
    );
  }
}
