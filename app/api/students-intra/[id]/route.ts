import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Obtener un estudiante por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const studentId = parseInt(id);

    const student = await prisma.students_intra.findUnique({
      where: { id: studentId },
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
        course: {
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
            ciclos: true,
            tareas: true,
            examenes: true,
            recursos: true,
          },
        },
        tareasEntregadas: {
          include: {
            tarea: {
              select: {
                titulo: true,
                fechaEntrega: true,
                puntos: true,
              },
            },
          },
        },
        examenesRealizados: {
          include: {
            examen: {
              select: {
                titulo: true,
                fechaInicio: true,
                fechaFin: true,
                puntos: true,
              },
            },
          },
        },
      },
    });

    if (!student) {
      return NextResponse.json(
        { error: "Estudiante no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json(student, { status: 200 });
  } catch (error) {
    console.error("Error al obtener estudiante:", error);
    return NextResponse.json(
      { error: "Error al obtener estudiante" },
      { status: 500 },
    );
  }
}

// PUT - Actualizar un estudiante
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const studentId = parseInt(id);
    const body = await request.json();
    const {
      nombre,
      apellido,
      email,
      telefono,
      fotoPerfil,
      isActive,
      courseId,
    } = body;

    const student = await prisma.students_intra.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return NextResponse.json(
        { error: "Estudiante no encontrado" },
        { status: 404 },
      );
    }

    // Actualizar en transacción
    const result = await prisma.$transaction(async (tx) => {
      // Actualizar usuario si se proporcionan datos
      if (nombre || apellido || email || isActive !== undefined) {
        await tx.user.update({
          where: { id: student.userId },
          data: {
            ...(nombre && { nombre }),
            ...(apellido && { apellido }),
            ...(email && { email }),
            ...(isActive !== undefined && { isActive }),
          },
        });
      }

      // Actualizar estudiante
      const updatedStudent = await tx.students_intra.update({
        where: { id: studentId },
        data: {
          ...(telefono && { telefono }),
          ...(fotoPerfil && { fotoPerfil }),
          ...(courseId && { courseId }),
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
          course: {
            select: {
              id: true,
              nombre: true,
            },
          },
        },
      });

      return updatedStudent;
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar estudiante:", error);
    return NextResponse.json(
      { error: "Error al actualizar estudiante" },
      { status: 500 },
    );
  }
}

// DELETE - Eliminar un estudiante
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const studentId = parseInt(id);

    const student = await prisma.students_intra.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return NextResponse.json(
        { error: "Estudiante no encontrado" },
        { status: 404 },
      );
    }

    // Eliminar estudiante (el usuario se eliminará en cascada)
    await prisma.students_intra.delete({
      where: { id: studentId },
    });

    return NextResponse.json(
      { message: "Estudiante eliminado correctamente" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error al eliminar estudiante:", error);
    return NextResponse.json(
      { error: "Error al eliminar estudiante" },
      { status: 500 },
    );
  }
}
