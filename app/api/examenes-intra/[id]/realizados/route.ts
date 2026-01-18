import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST - Realizar/Iniciar un examen
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const examenId = parseInt(id);
    const body = await request.json();
    const { studentId, respuestas, calificacion } = body;

    // Validaciones
    if (!studentId) {
      return NextResponse.json(
        { error: "Se requiere el ID del estudiante" },
        { status: 400 },
      );
    }

    // Verificar que el examen exista
    const examen = await prisma.examenes_intra.findUnique({
      where: { id: examenId },
    });

    if (!examen) {
      return NextResponse.json(
        { error: "El examen especificado no existe" },
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

    // Verificar que el estudiante no haya realizado ya el examen
    const existingRealizado = await prisma.examenes_realizados.findUnique({
      where: {
        examenId_studentId: {
          examenId,
          studentId,
        },
      },
    });

    if (existingRealizado) {
      return NextResponse.json(
        { error: "El estudiante ya ha realizado este examen" },
        { status: 400 },
      );
    }

    // Crear el registro del examen realizado
    const realizado = await prisma.examenes_realizados.create({
      data: {
        examenId,
        studentId,
        respuestas: respuestas ? JSON.stringify(respuestas) : null,
        calificacion,
        finalizadoAt: calificacion !== undefined ? new Date() : null,
      },
      include: {
        examen: {
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

    return NextResponse.json(realizado, { status: 201 });
  } catch (error) {
    console.error("Error al realizar examen:", error);
    return NextResponse.json(
      { error: "Error al realizar examen" },
      { status: 500 },
    );
  }
}

// PUT - Calificar un examen realizado
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const examenId = parseInt(id);
    const body = await request.json();
    const { studentId, calificacion } = body;

    // Validaciones
    if (!studentId || calificacion === undefined) {
      return NextResponse.json(
        { error: "Se requiere el ID del estudiante y la calificación" },
        { status: 400 },
      );
    }

    // Buscar el examen realizado
    const realizado = await prisma.examenes_realizados.findUnique({
      where: {
        examenId_studentId: {
          examenId,
          studentId,
        },
      },
    });

    if (!realizado) {
      return NextResponse.json(
        { error: "No se encontró el examen realizado" },
        { status: 404 },
      );
    }

    // Actualizar la calificación
    const updatedRealizado = await prisma.examenes_realizados.update({
      where: {
        examenId_studentId: {
          examenId,
          studentId,
        },
      },
      data: {
        calificacion,
        finalizadoAt: new Date(),
      },
      include: {
        examen: {
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

    return NextResponse.json(updatedRealizado, { status: 200 });
  } catch (error) {
    console.error("Error al calificar examen:", error);
    return NextResponse.json(
      { error: "Error al calificar examen" },
      { status: 500 },
    );
  }
}
