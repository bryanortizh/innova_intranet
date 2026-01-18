import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Listar todos los exámenes
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

    const examenes = await prisma.examenes_intra.findMany({
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
            realizados: true,
          },
        },
      },
      orderBy: {
        fechaInicio: "asc",
      },
    });

    return NextResponse.json(examenes, { status: 200 });
  } catch (error) {
    console.error("Error al obtener exámenes:", error);
    return NextResponse.json(
      { error: "Error al obtener exámenes" },
      { status: 500 },
    );
  }
}

// POST - Crear un nuevo examen
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      courseId,
      titulo,
      descripcion,
      fechaInicio,
      fechaFin,
      duracion,
      puntos,
    } = body;

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

    const examen = await prisma.examenes_intra.create({
      data: {
        courseId,
        titulo,
        descripcion,
        fechaInicio: fechaInicio ? new Date(fechaInicio) : null,
        fechaFin: fechaFin ? new Date(fechaFin) : null,
        duracion,
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

    return NextResponse.json(examen, { status: 201 });
  } catch (error) {
    console.error("Error al crear examen:", error);
    return NextResponse.json(
      { error: "Error al crear examen" },
      { status: 500 },
    );
  }
}
