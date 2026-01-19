import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/middleware/auth";

// GET - Obtener todos los horarios o filtrar por curso/ciclo
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);

    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { error: authResult.error || "No autorizado" },
        { status: 401 },
      );
    }

    const user = authResult.user;

    const { searchParams } = new URL(request.url);
    let courseId = searchParams.get("courseId");
    const cicloId = searchParams.get("cicloId");

    const where: any = {};

    // Si es alumno, obtener automáticamente su curso
    if (user.rol === "ALUMNO") {
      const student = await prisma.students_intra.findUnique({
        where: { userId: user.userId },
        select: { courseId: true },
      });

      if (student) {
        where.courseId = student.courseId;
      } else {
        return NextResponse.json(
          { error: "Estudiante no encontrado" },
          { status: 404 },
        );
      }
    } else {
      // Si es profesor, permitir filtrado opcional por courseId
      if (courseId) {
        where.courseId = parseInt(courseId);
      }
    }

    if (cicloId) {
      where.cicloId = parseInt(cicloId);
    }

    const horarios = await prisma.horarios_intra.findMany({
      where,
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
      orderBy: [
        { courseId: "asc" },
        { diaSemana: "asc" },
        { horaInicio: "asc" },
      ],
    });

    return NextResponse.json(horarios);
  } catch (error) {
    console.error("Error obteniendo horarios:", error);
    return NextResponse.json(
      { error: "Error al obtener horarios" },
      { status: 500 },
    );
  }
}

// POST - Crear un nuevo horario
export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);

    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { error: authResult.error || "No autorizado" },
        { status: 401 },
      );
    }

    const user = authResult.user;
    if (user.rol !== "PROFESOR") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const body = await request.json();
    const {
      courseId,
      cicloId,
      diaSemana,
      horaInicio,
      horaFin,
      aula,
      modalidad,
    } = body;

    // Validaciones
    if (!courseId || !diaSemana || !horaInicio || !horaFin) {
      return NextResponse.json(
        {
          error:
            "Faltan campos requeridos: courseId, diaSemana, horaInicio, horaFin",
        },
        { status: 400 },
      );
    }

    // Validar que el curso existe
    const course = await prisma.courses_intra.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Curso no encontrado" },
        { status: 404 },
      );
    }

    // Validar formato de día
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

    // Verificar conflictos de horario
    const conflicto = await prisma.horarios_intra.findFirst({
      where: {
        courseId,
        diaSemana: diaSemana.toUpperCase(),
        OR: [
          {
            AND: [
              { horaInicio: { lte: horaInicio } },
              { horaFin: { gt: horaInicio } },
            ],
          },
          {
            AND: [
              { horaInicio: { lt: horaFin } },
              { horaFin: { gte: horaFin } },
            ],
          },
        ],
      },
    });

    if (conflicto) {
      return NextResponse.json(
        {
          error: "Ya existe un horario que se solapa con el solicitado",
        },
        { status: 409 },
      );
    }

    const horario = await prisma.horarios_intra.create({
      data: {
        courseId,
        cicloId: cicloId || null,
        diaSemana: diaSemana.toUpperCase(),
        horaInicio,
        horaFin,
        aula: aula || null,
        modalidad: modalidad || null,
      },
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

    return NextResponse.json(horario, { status: 201 });
  } catch (error) {
    console.error("Error creando horario:", error);
    return NextResponse.json(
      { error: "Error al crear horario" },
      { status: 500 },
    );
  }
}
