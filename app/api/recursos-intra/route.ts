import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Listar todos los recursos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");
    const tipo = searchParams.get("tipo");

    if (!courseId) {
      return NextResponse.json(
        { error: "Se requiere el ID del curso" },
        { status: 400 },
      );
    }

    const where: any = { courseId: parseInt(courseId) };
    if (tipo) where.tipo = tipo;

    const recursos = await prisma.recursos_intra.findMany({
      where,
      include: {
        course: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
      orderBy: {
        orden: "asc",
      },
    });

    return NextResponse.json(recursos, { status: 200 });
  } catch (error) {
    console.error("Error al obtener recursos:", error);
    return NextResponse.json(
      { error: "Error al obtener recursos" },
      { status: 500 },
    );
  }
}

// POST - Crear un nuevo recurso
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { courseId, titulo, descripcion, tipo, url, orden } = body;

    // Validaciones
    if (!courseId || !titulo || !tipo || !url) {
      return NextResponse.json(
        { error: "El curso, título, tipo y URL son obligatorios" },
        { status: 400 },
      );
    }

    // Validar tipo de recurso
    const tiposValidos = ["PDF", "VIDEO", "LINK", "DOCUMENTO"];
    if (!tiposValidos.includes(tipo.toUpperCase())) {
      return NextResponse.json(
        { error: `El tipo debe ser uno de: ${tiposValidos.join(", ")}` },
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

    const recurso = await prisma.recursos_intra.create({
      data: {
        courseId,
        titulo,
        descripcion,
        tipo: tipo.toUpperCase(),
        url,
        orden,
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

    return NextResponse.json(recurso, { status: 201 });
  } catch (error) {
    console.error("Error al crear recurso:", error);
    return NextResponse.json(
      { error: "Error al crear recurso" },
      { status: 500 },
    );
  }
}
