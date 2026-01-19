import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/middleware/auth";

// GET - Obtener un horario específico por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authResult = await verifyAuth(request);
    
    if (!authResult.success || !authResult.user) {
      return NextResponse.json({ error: authResult.error || "No autorizado" }, { status: 401 });
    }

    const { id: idParam } = await params;
    const id = parseInt(idParam);

    const horario = await prisma.horarios_intra.findUnique({
      where: { id },
      include: {
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
          },
        },
        ciclo: true,
      },
    });

    if (!horario) {
      return NextResponse.json(
        { error: "Horario no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json(horario);
  } catch (error) {
    console.error("Error obteniendo horario:", error);
    return NextResponse.json(
      { error: "Error al obtener horario" },
      { status: 500 },
    );
  }
}

// PUT - Actualizar un horario
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authResult = await verifyAuth(request);
    
    if (!authResult.success || !authResult.user) {
      return NextResponse.json({ error: authResult.error || "No autorizado" }, { status: 401 });
    }

    const user = authResult.user;
    if (user.rol !== "PROFESOR") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { id: idParam } = await params;
    const id = parseInt(idParam);
    const body = await request.json();
    const { diaSemana, horaInicio, horaFin, aula, modalidad, cicloId } = body;

    // Verificar que el horario existe
    const horarioExistente = await prisma.horarios_intra.findUnique({
      where: { id },
    });

    if (!horarioExistente) {
      return NextResponse.json(
        { error: "Horario no encontrado" },
        { status: 404 },
      );
    }

    // Validar día si se proporciona
    if (diaSemana) {
      const diasValidos = [
        "LUNES",
        "MARTES",
        "MIERCOLES",
        "JUEVES",
        "VIERNES",
        "SABADO",
        "DOMINGO",
      ];
      if (!diasValidos.includes(diaSemana.toUpperCase())) {
        return NextResponse.json(
          { error: "Día de semana inválido" },
          { status: 400 },
        );
      }
    }

    // Verificar conflictos si se cambia el horario
    if (diaSemana || horaInicio || horaFin) {
      const diaFinal = diaSemana
        ? diaSemana.toUpperCase()
        : horarioExistente.diaSemana;
      const inicioFinal = horaInicio || horarioExistente.horaInicio;
      const finFinal = horaFin || horarioExistente.horaFin;

      const conflicto = await prisma.horarios_intra.findFirst({
        where: {
          id: { not: id },
          courseId: horarioExistente.courseId,
          diaSemana: diaFinal,
          OR: [
            {
              AND: [
                { horaInicio: { lte: inicioFinal } },
                { horaFin: { gt: inicioFinal } },
              ],
            },
            {
              AND: [
                { horaInicio: { lt: finFinal } },
                { horaFin: { gte: finFinal } },
              ],
            },
          ],
        },
      });

      if (conflicto) {
        return NextResponse.json(
          {
            error: "El horario actualizado se solapa con otro existente",
          },
          { status: 409 },
        );
      }
    }

    const dataToUpdate: Partial<{
      diaSemana: string;
      horaInicio: string;
      horaFin: string;
      aula: string | null;
      modalidad: string | null;
      cicloId: number | null;
    }> = {};
    if (diaSemana) dataToUpdate.diaSemana = diaSemana.toUpperCase();
    if (horaInicio) dataToUpdate.horaInicio = horaInicio;
    if (horaFin) dataToUpdate.horaFin = horaFin;
    if (aula !== undefined) dataToUpdate.aula = aula;
    if (modalidad !== undefined) dataToUpdate.modalidad = modalidad;
    if (cicloId !== undefined) dataToUpdate.cicloId = cicloId;

    const horario = await prisma.horarios_intra.update({
      where: { id },
      data: dataToUpdate,
      include: {
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
          },
        },
        ciclo: true,
      },
    });

    return NextResponse.json(horario);
  } catch (error) {
    console.error("Error actualizando horario:", error);
    return NextResponse.json(
      { error: "Error al actualizar horario" },
      { status: 500 },
    );
  }
}

// DELETE - Eliminar un horario
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authResult = await verifyAuth(request);
    
    if (!authResult.success || !authResult.user) {
      return NextResponse.json({ error: authResult.error || "No autorizado" }, { status: 401 });
    }

    const user = authResult.user;
    if (user.rol !== "PROFESOR") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { id: idParam } = await params;
    const id = parseInt(idParam);

    // Verificar que el horario existe
    const horario = await prisma.horarios_intra.findUnique({
      where: { id },
    });

    if (!horario) {
      return NextResponse.json(
        { error: "Horario no encontrado" },
        { status: 404 },
      );
    }

    await prisma.horarios_intra.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Horario eliminado correctamente" });
  } catch (error) {
    console.error("Error eliminando horario:", error);
    return NextResponse.json(
      { error: "Error al eliminar horario" },
      { status: 500 },
    );
  }
}