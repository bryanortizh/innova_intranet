import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Obtener un curso por ID con todos sus detalles
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const courseId = parseInt(id);

    const course = await prisma.courses_intra.findUnique({
      where: { id: courseId },
      include: {
        teacher: {
          include: {
            user: {
              select: {
                id: true,
                nombre: true,
                apellido: true,
                email: true,
                isActive: true,
              },
            },
          },
        },
        students: {
          include: {
            user: {
              select: {
                id: true,
                nombre: true,
                apellido: true,
                email: true,
                isActive: true,
              },
            },
          },
        },
        ciclos: {
          orderBy: {
            orden: "asc",
          },
        },
        tareas: {
          orderBy: {
            fechaEntrega: "asc",
          },
          include: {
            _count: {
              select: {
                entregas: true,
              },
            },
          },
        },
        examenes: {
          orderBy: {
            fechaInicio: "asc",
          },
          include: {
            _count: {
              select: {
                realizados: true,
              },
            },
          },
        },
        recursos: {
          orderBy: {
            orden: "asc",
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Curso no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json(course, { status: 200 });
  } catch (error) {
    console.error("Error al obtener curso:", error);
    return NextResponse.json(
      { error: "Error al obtener curso" },
      { status: 500 },
    );
  }
}

// PUT - Actualizar un curso
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const courseId = parseInt(id);
    const body = await request.json();
    const { nombre, descripcion, cover, duracion, teacherId, estado } = body;

    const course = await prisma.courses_intra.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Curso no encontrado" },
        { status: 404 },
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

    const updatedCourse = await prisma.courses_intra.update({
      where: { id: courseId },
      data: {
        ...(nombre && { nombre }),
        ...(descripcion !== undefined && { descripcion }),
        ...(cover !== undefined && { cover }),
        ...(duracion !== undefined && { duracion }),
        ...(teacherId !== undefined && { teacherId }),
        ...(estado !== undefined && { estado }),
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
    });

    return NextResponse.json(updatedCourse, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar curso:", error);
    return NextResponse.json(
      { error: "Error al actualizar curso" },
      { status: 500 },
    );
  }
}

// DELETE - Eliminar un curso
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const courseId = parseInt(id);

    const course = await prisma.courses_intra.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Curso no encontrado" },
        { status: 404 },
      );
    }

    await prisma.courses_intra.delete({
      where: { id: courseId },
    });

    return NextResponse.json(
      { message: "Curso eliminado correctamente" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error al eliminar curso:", error);
    return NextResponse.json(
      { error: "Error al eliminar curso" },
      { status: 500 },
    );
  }
}
