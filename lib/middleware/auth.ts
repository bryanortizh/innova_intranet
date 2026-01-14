import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export interface AuthUser {
  userId: number
  email: string
  rol: string
}

// Función para verificar autenticación
export async function verifyAuth(request: NextRequest): Promise<{
  success: boolean
  user?: AuthUser
  error?: string
}> {
  const authHeader = request.headers.get('Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { success: false, error: 'Token no proporcionado' }
  }

  const token = authHeader.substring(7)

  // Verificar JWT
  const decoded = verifyToken(token)
  if (!decoded) {
    return { success: false, error: 'Token inválido o expirado' }
  }

  // Verificar que el token existe y está activo en la BD
  const tokenRecord = await prisma.token.findUnique({
    where: { token }
  })

  if (!tokenRecord) {
    return { success: false, error: 'Token no encontrado' }
  }

  if (!tokenRecord.isValid) {
    return { success: false, error: 'Token ha sido revocado' }
  }

  if (tokenRecord.expiresAt < new Date()) {
    // Marcar como expirado en la BD
    await prisma.token.update({
      where: { token },
      data: { isValid: false }
    })
    return { success: false, error: 'Token expirado' }
  }

  return {
    success: true,
    user: {
      userId: decoded.userId,
      email: decoded.email,
      rol: decoded.rol
    }
  }
}

// Wrapper para proteger rutas
export function withAuth(
  handler: (request: NextRequest, user: AuthUser) => Promise<NextResponse>,
  allowedRoles?: string[]
) {
  return async (request: NextRequest) => {
    const authResult = await verifyAuth(request)

    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 401 }
      )
    }

    // Verificar rol si se especifican roles permitidos
    if (allowedRoles && !allowedRoles.includes(authResult.user!.rol)) {
      return NextResponse.json(
        { success: false, error: 'No tienes permiso para acceder a este recurso' },
        { status: 403 }
      )
    }

    return handler(request, authResult.user!)
  }
}
