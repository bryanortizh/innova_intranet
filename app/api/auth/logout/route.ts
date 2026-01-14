import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

// POST - Logout (invalidar token)
export async function POST(request: NextRequest) {
  try {
    // Obtener token del header Authorization
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Token no proporcionado' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7) // Remover "Bearer "

    // Verificar que el token sea válido
    const decoded = verifyToken(token)
    
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Token inválido' },
        { status: 401 }
      )
    }

    // Buscar el token en la base de datos
    const existingToken = await prisma.token.findUnique({
      where: { token }
    })

    if (!existingToken) {
      return NextResponse.json(
        { success: false, error: 'Token no encontrado' },
        { status: 404 }
      )
    }

    // Invalidar el token (marcar como no válido y guardar fecha de revocación)
    await prisma.token.update({
      where: { token },
      data: {
        isValid: false,
        revokedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Sesión cerrada exitosamente'
    })
  } catch (error) {
    console.error('Error en logout:', error)
    return NextResponse.json(
      { success: false, error: 'Error al cerrar sesión' },
      { status: 500 }
    )
  }
}
