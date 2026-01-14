import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuth } from '@/lib/middleware/auth'

// GET - Verificar si el token actual es válido y obtener datos del usuario
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request)

    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 401 }
      )
    }

    // Obtener datos completos del usuario
    const user = await prisma.user.findUnique({
      where: { id: authResult.user!.userId },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
        rol: true,
        createdAt: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: user
    })
  } catch (error) {
    console.error('Error al verificar sesión:', error)
    return NextResponse.json(
      { success: false, error: 'Error al verificar sesión' },
      { status: 500 }
    )
  }
}
