import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface TokenUser {
  id: number
  nombre: string
  apellido: string
  email: string
  rol: string
}

interface TokenRecord {
  id: number
  token: string
  userId: number
  user: TokenUser
  isValid: boolean
  expiresAt: Date
  createdAt: Date
  revokedAt: Date | null
}

// GET - Obtener todos los tokens (para administración)
export async function GET() {
  try {
    const tokens: TokenRecord[] = await prisma.token.findMany({
      include: {
        user: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
            rol: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Clasificar tokens
    const activeTokens = tokens.filter((t: TokenRecord) => t.isValid && t.expiresAt > new Date())
    const revokedTokens = tokens.filter((t: TokenRecord) => !t.isValid && t.revokedAt !== null)
    const expiredTokens = tokens.filter((t: TokenRecord) => t.expiresAt <= new Date())

    interface TokenResponse {
        id: number
        token: string
        userId: number
        user: TokenUser
        isValid: boolean
        expiresAt: Date
        createdAt: Date
        revokedAt: Date | null
        status: 'REVOCADO' | 'EXPIRADO' | 'ACTIVO'
    }

    interface GetTokensResponse {
        success: boolean
        data: {
            total: number
            active: number
            revoked: number
            expired: number
            tokens: TokenResponse[]
        }
    }

            return NextResponse.json<GetTokensResponse>({
                success: true,
                data: {
                    total: tokens.length,
                    active: activeTokens.length,
                    revoked: revokedTokens.length,
                    expired: expiredTokens.length,
                    tokens: tokens.map((t): TokenResponse => ({
                        id: t.id,
                        token: t.token.substring(0, 20) + '...', // Mostrar solo parte del token
                        userId: t.userId,
                        user: t.user,
                        isValid: t.isValid,
                        expiresAt: t.expiresAt,
                        createdAt: t.createdAt,
                        revokedAt: t.revokedAt,
                        status: !t.isValid && t.revokedAt 
                            ? 'REVOCADO' 
                            : t.expiresAt <= new Date() 
                                ? 'EXPIRADO' 
                                : 'ACTIVO'
                    }))
                }
            })
  } catch (error) {
    console.error('Error al obtener tokens:', error)
    return NextResponse.json(
      { success: false, error: 'Error al obtener tokens' },
      { status: 500 }
    )
  }
}

// DELETE - Limpiar tokens expirados o inválidos
export async function DELETE() {
  try {
    const result = await prisma.token.deleteMany({
      where: {
        OR: [
          { isValid: false },
          { expiresAt: { lt: new Date() } }
        ]
      }
    })

    return NextResponse.json({
      success: true,
      message: `Se eliminaron ${result.count} tokens expirados/revocados`
    })
  } catch (error) {
    console.error('Error al limpiar tokens:', error)
    return NextResponse.json(
      { success: false, error: 'Error al limpiar tokens' },
      { status: 500 }
    )
  }
}
