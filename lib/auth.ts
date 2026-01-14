import bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'

const JWT_SECRET: jwt.Secret = (process.env.JWT_SECRET || 'default_secret') as jwt.Secret
const JWT_EXPIRES_IN: jwt.SignOptions['expiresIn'] = (process.env.JWT_EXPIRES_IN || '24h') as jwt.SignOptions['expiresIn']

// Encriptar password
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12)
  return bcrypt.hash(password, salt)
}

// Verificar password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Generar token JWT
export function generateToken(payload: { userId: number; email: string; rol: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

// Verificar token JWT
export function verifyToken(token: string): { userId: number; email: string; rol: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number; email: string; rol: string }
  } catch {
    return null
  }
}

// Calcular fecha de expiración del token
export function getTokenExpiration(): Date {
  const expiresIn = String(JWT_EXPIRES_IN ?? '24h')
  const match = expiresIn.match(/^(\d+)([smhd])$/)
  
  if (!match) {
    // Por defecto 24 horas
    return new Date(Date.now() + 24 * 60 * 60 * 1000)
  }

  const value = parseInt(match[1])
  const unit = match[2]

  let milliseconds: number
  switch (unit) {
    case 's':
      milliseconds = value * 1000
      break
    case 'm':
      milliseconds = value * 60 * 1000
      break
    case 'h':
      milliseconds = value * 60 * 60 * 1000
      break
    case 'd':
      milliseconds = value * 24 * 60 * 60 * 1000
      break
    default:
      milliseconds = 24 * 60 * 60 * 1000
  }

  return new Date(Date.now() + milliseconds)
}
