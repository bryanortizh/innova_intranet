import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Obtener un profesor por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const teacherId = parseInt(id);

    const teacher = await prisma.teachers_intra.findUnique({
      where: { id: teacherId },
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
        courses: {
          include: {
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
          },
        },
      },
    });

    if (!teacher) {
      return NextResponse.json(
        { error: "Profesor no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json(teacher, { status: 200 });
  } catch (error) {
    console.error("Error al obtener profesor:", error);
    return NextResponse.json(
      { error: "Error al obtener profesor" },
      { status: 500 },
    );
  }
}

// PUT - Actualizar un profesor
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const teacherId = parseInt(id);
    const body = await request.json();
    const {
      nombre,
      apellido,
      email,
      telefono,
      especialidad,
      fotoPerfil,
      isActive,
    } = body;

    const teacher = await prisma.teachers_intra.findUnique({
      where: { id: teacherId },
    });

    if (!teacher) {
      return NextResponse.json(
        { error: "Profesor no encontrado" },
        { status: 404 },
      );
    }

    // Actualizar en transacción
    const result = await prisma.$transaction(async (tx) => {
      // Actualizar usuario si se proporcionan datos
      if (nombre || apellido || email || isActive !== undefined) {
        await tx.user.update({
          where: { id: teacher.userId },
          data: {
            ...(nombre && { nombre }),
            ...(apellido && { apellido }),
            ...(email && { email }),
            ...(isActive !== undefined && { isActive }),
          },
        });
      }

      // Actualizar profesor
      const updatedTeacher = await tx.teachers_intra.update({
        where: { id: teacherId },
        data: {
          ...(telefono && { telefono }),
          ...(especialidad && { especialidad }),
          ...(fotoPerfil && { fotoPerfil }),
        },
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
      });

      return updatedTeacher;
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar profesor:", error);
    return NextResponse.json(
      { error: "Error al actualizar profesor" },
      { status: 500 },
    );
  }
}

// DELETE - Eliminar un profesor
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const teacherId = parseInt(id);

    const teacher = await prisma.teachers_intra.findUnique({
      where: { id: teacherId },
    });

    if (!teacher) {
      return NextResponse.json(
        { error: "Profesor no encontrado" },
        { status: 404 },
      );
    }

    // Eliminar profesor (el usuario se eliminará en cascada)
    await prisma.teachers_intra.delete({
      where: { id: teacherId },
    });

    return NextResponse.json(
      { message: "Profesor eliminado correctamente" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error al eliminar profesor:", error);
    return NextResponse.json(
      { error: "Error al eliminar profesor" },
      { status: 500 },
    );
  }
}
