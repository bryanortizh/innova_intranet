import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, generateToken, getTokenExpiration } from '@/lib/auth'

// Validar formato de email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// POST - Login de usuario
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validaciones detalladas
    const errors: { field: string; message: string }[] = []

    // Validar email
    if (!email) {
      errors.push({ field: 'email', message: 'El email es requerido' })
    } else if (typeof email !== 'string') {
      errors.push({ field: 'email', message: 'El email debe ser texto' })
    } else if (email.trim() === '') {
      errors.push({ field: 'email', message: 'El email no puede estar vacío' })
    } else if (!isValidEmail(email.trim())) {
      errors.push({ field: 'email', message: 'El formato del email no es válido' })
    }

    // Validar contraseña
    if (!password) {
      errors.push({ field: 'password', message: 'La contraseña es requerida' })
    } else if (typeof password !== 'string') {
      errors.push({ field: 'password', message: 'La contraseña debe ser texto' })
    } else if (password === '') {
      errors.push({ field: 'password', message: 'La contraseña no puede estar vacía' })
    }

    // Si hay errores de validación, retornarlos
    if (errors.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Error de validación',
          errors 
        },
        { status: 400 }
      )
    }

    // Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() }
    })

    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Credenciales inválidas',
          message: 'El email o la contraseña son incorrectos'
        },
        { status: 401 }
      )
    }

    // Verificar password (desencriptar y comparar)
    const isValidPassword = await verifyPassword(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Credenciales inválidas',
          message: 'El email o la contraseña son incorrectos'
        },
        { status: 401 }
      )
    }

    // Generar token JWT
    const token = generateToken({
      userId: user.id,
      email: user.email,
      rol: user.rol
    })

    // Invalidar todos los tokens anteriores del usuario
    await prisma.token.updateMany({
      where: {
        userId: user.id,
        isValid: true
      },
      data: {
        isValid: false,
        revokedAt: new Date()
      }
    })

    // Guardar nuevo token en la base de datos
    const expiresAt = getTokenExpiration()
    
    await prisma.token.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
        isValid: true
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Login exitoso',
      data: {
        user: {
          id: user.id,
          nombre: user.nombre,
          apellido: user.apellido,
          email: user.email,
          rol: user.rol
        },
        token,
        expiresAt
      }
    })
  } catch (error) {
    console.error('Error en login:', error)
    return NextResponse.json(
      { success: false, error: 'Error en el proceso de login' },
      { status: 500 }
    )
  }
}
