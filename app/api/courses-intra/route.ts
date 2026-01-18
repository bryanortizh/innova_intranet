import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Listar todos los cursos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get("teacherId");
    const estado = searchParams.get("estado");

    const where: any = {};
    if (teacherId) where.teacherId = parseInt(teacherId);
    if (estado) where.estado = estado === "true";

    const courses = await prisma.courses_intra.findMany({
      where,
      include: {
        teacher: {
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
        students: {
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
        _count: {
          select: {
            students: true,
            ciclos: true,
            tareas: true,
            examenes: true,
            recursos: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(courses, { status: 200 });
  } catch (error) {
    console.error("Error al obtener cursos:", error);
    return NextResponse.json(
      { error: "Error al obtener cursos" },
      { status: 500 },
    );
  }
}

// POST - Crear un nuevo curso
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombre, descripcion, cover, duracion, teacherId } = body;

    // Validaciones
    if (!nombre) {
      return NextResponse.json(
        { error: "El nombre del curso es obligatorio" },
        { status: 400 },
      );
    }

    // Verificar que el profesor exista si se proporciona
    if (teacherId) {
      const teacher = await prisma.teachers_intra.findUnique({
        where: { id: teacherId },
      });

      if (!teacher) {
        return NextResponse.json(
          { error: "El profesor especificado no existe" },
          { status: 400 },
        );
      }
    }

    const course = await prisma.courses_intra.create({
      data: {
        nombre,
        descripcion,
        cover,
        duracion,
        teacherId,
        estado: true,
      },
      include: {
        teacher: {
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

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error("Error al crear curso:", error);
    return NextResponse.json(
      { error: "Error al crear curso" },
      { status: 500 },
    );
  }
}
