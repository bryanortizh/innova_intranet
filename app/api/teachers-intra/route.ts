import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// GET - Listar todos los profesores
export async function GET(request: NextRequest) {
  try {
    const teachers = await prisma.teachers_intra.findMany({
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
          select: {
            id: true,
            nombre: true,
            estado: true,
          },
        },
      },
    });

    return NextResponse.json(teachers, { status: 200 });
  } catch (error) {
    console.error("Error al obtener profesores:", error);
    return NextResponse.json(
      { error: "Error al obtener profesores" },
      { status: 500 },
    );
  }
}

// POST - Crear un nuevo profesor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      nombre,
      apellido,
      email,
      password,
      telefono,
      especialidad,
      fotoPerfil,
    } = body;

    // Validaciones
    if (!nombre || !apellido || !email || !password) {
      return NextResponse.json(
        { error: "Nombre, apellido, email y contraseña son obligatorios" },
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

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario y profesor en una transacción
    const result = await prisma.$transaction(async (tx) => {
      // Crear usuario
      const user = await tx.user.create({
        data: {
          nombre,
          apellido,
          email,
          password: hashedPassword,
          rol: "PROFESOR",
          isActive: true,
        },
      });

      // Crear profesor
      const teacher = await tx.teachers_intra.create({
        data: {
          userId: user.id,
          telefono,
          especialidad,
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
        },
      });

      return teacher;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error al crear profesor:", error);
    return NextResponse.json(
      { error: "Error al crear profesor" },
      { status: 500 },
    );
  }
}
