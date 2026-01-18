import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// GET - Listar todos los estudiantes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");

    const where = courseId ? { courseId: parseInt(courseId) } : {};

    const students = await prisma.students_intra.findMany({
      where,
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
            teacher: {
              include: {
                user: {
                  select: {
                    nombre: true,
                    apellido: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json(students, { status: 200 });
  } catch (error) {
    console.error("Error al obtener estudiantes:", error);
    return NextResponse.json(
      { error: "Error al obtener estudiantes" },
      { status: 500 },
    );
  }
}

// POST - Crear un nuevo estudiante
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      nombre,
      apellido,
      email,
      password,
      telefono,
      fotoPerfil,
      courseId,
    } = body;

    // Validaciones
    if (!nombre || !apellido || !email || !password || !courseId) {
      return NextResponse.json(
        {
          error: "Nombre, apellido, email, contraseña y curso son obligatorios",
        },
        { status: 400 },
      );
    }

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "El email ya está registrado" },
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

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario y estudiante en una transacción
    const result = await prisma.$transaction(async (tx) => {
      // Crear usuario
      const user = await tx.user.create({
        data: {
          nombre,
          apellido,
          email,
          password: hashedPassword,
          rol: "ALUMNO",
          isActive: true,
        },
      });

      // Crear estudiante
      const student = await tx.students_intra.create({
        data: {
          userId: user.id,
          courseId,
          telefono,
          fotoPerfil,
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

      return student;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error al crear estudiante:", error);
    return NextResponse.json(
      { error: "Error al crear estudiante" },
      { status: 500 },
    );
  }
}
