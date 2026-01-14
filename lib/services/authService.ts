// Servicio de autenticación

interface User {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
}

interface LoginResponse {
  success: boolean;
  message?: string;
  error?: string;
  errors?: { field: string; message: string }[];
  data?: {
    user: User;
    token: string;
    expiresAt: string;
  };
}

// Obtener token almacenado
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

// Obtener usuario almacenado
export function getUser(): User | null {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

// Verificar si está autenticado
export function isAuthenticated(): boolean {
  return !!getToken();
}

// Guardar sesión
export function saveSession(token: string, user: User): void {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

// Limpiar sesión local
export function clearSession(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

// Login
export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data: LoginResponse = await response.json();

  if (data.success && data.data) {
    saveSession(data.data.token, data.data.user);
  }

  return data;
}

// Logout
export async function logout(): Promise<{ success: boolean; message?: string; error?: string }> {
  const token = getToken();

  if (!token) {
    clearSession();
    return { success: true, message: 'Sesión cerrada' };
  }

  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    // Siempre limpiar la sesión local, incluso si hay error en el servidor
    clearSession();

    return data;
  } catch (error) {
    // Si hay error de red, igual limpiar sesión local
    clearSession();
    console.error('Error en logout:', error);
    return { success: true, message: 'Sesión cerrada localmente' };
  }
}

// Verificar sesión actual
export async function verifySession(): Promise<{ success: boolean; user?: User }> {
  const token = getToken();

  if (!token) {
    return { success: false };
  }

  try {
    const response = await fetch('/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!data.success) {
      clearSession();
      return { success: false };
    }

    return { success: true, user: data.data };
  } catch {
    return { success: false };
  }
}
