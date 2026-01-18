import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Listar todos los ciclos
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

    const ciclos = await prisma.ciclos_intra.findMany({
      where: { courseId: parseInt(courseId) },
      orderBy: {
        orden: "asc",
      },
    });

    return NextResponse.json(ciclos, { status: 200 });
  } catch (error) {
    console.error("Error al obtener ciclos:", error);
    return NextResponse.json(
      { error: "Error al obtener ciclos" },
      { status: 500 },
    );
  }
}

// POST - Crear un nuevo ciclo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { courseId, titulo, descripcion, orden } = body;

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

    const ciclo = await prisma.ciclos_intra.create({
      data: {
        courseId,
        titulo,
        descripcion,
        orden,
      },
    });

    return NextResponse.json(ciclo, { status: 201 });
  } catch (error) {
    console.error("Error al crear ciclo:", error);
    return NextResponse.json(
      { error: "Error al crear ciclo" },
      { status: 500 },
    );
  }
}
