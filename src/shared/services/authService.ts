import type { User, UserRole } from '@/shared/types';

const API_BASE_URL = ((import.meta as ImportMeta & { env?: Record<string, string> }).env?.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '');

type ApiEnvelope<T> = {
  code?: number;
  status?: number;
  success?: boolean;
  message: string;
  data?: T;
  errors?: string[];
};

type BackendAuthResponse = {
  token: string;
  userId: string;
  email: string;
  role?: string;
};

export type LoginApiResult = {
  user: User;
  token: string;
  tokenType: string;
  expiresIn: number;
};

type RegisterRole = 'PROFESSIONAL' | 'RECRUITER';

function mapRoleToBackend(role: UserRole): RegisterRole {
  return role === 'recruiter' ? 'RECRUITER' : 'PROFESSIONAL';
}

function sanitizeSlug(value: string): string {
  const base = value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return base || `usuario-${Date.now()}`;
}

async function requestJson<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
    ...init,
  });

  const payload = (await response.json()) as ApiEnvelope<T>;
  const isSuccess = response.ok || payload.success === true || payload.code === 200 || payload.code === 201;

  if (!isSuccess) {
    const details = payload.errors?.[0] || payload.message || 'Error de autenticación';
    throw new Error(details);
  }

  if (!payload.data) {
    throw new Error('Respuesta del servidor sin datos');
  }

  return payload.data;
}

export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  professional: 'Profesional',
  recruiter: 'Reclutador',
  admin: 'Administrador',
  guest: 'Invitado',
};

export const ROLE_REDIRECT_PATHS: Record<UserRole, string> = {
  professional: '/dashboard',
  recruiter: '/dashboard',
  admin: '/admin/dashboard',
  guest: '/',
};

async function login(email: string, password: string, role?: UserRole): Promise<LoginApiResult> {
  const normalizedEmail = email.toLowerCase().trim();
  
  const authResponse = await requestJson<BackendAuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: normalizedEmail, password }),
  });

  // NUEVA LÓGICA: Leemos el rol que viene de Spring Boot
  let finalRole: UserRole = 'professional'; // Por defecto

  if (authResponse.role) {
    // Normalizamos el texto por si Spring Boot envía "ROLE_RECRUITER", "RECRUITER", etc.
    const backendRole = authResponse.role.toUpperCase();
    if (backendRole.includes('RECRUITER') || backendRole.includes('RECLUTADOR')) {
      finalRole = 'recruiter';
    }
  } else if (role) {
    // Fallback por si acaso se sigue enviando desde algún lado
    finalRole = role;
  }

  const user: User = {
    id: authResponse.userId,
    email: authResponse.email,
    name: authResponse.email.split('@')[0],
    username: authResponse.email.split('@')[0],
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(authResponse.email)}`,
    role: finalRole, // Usamos el rol calculado
    slug: sanitizeSlug(authResponse.email.split('@')[0]),
    profession: finalRole === 'recruiter' ? 'Reclutador' : 'Profesional',
    bio: '',
    headline: finalRole === 'recruiter' ? 'Encontrando talento verificado' : 'Construyendo mi perfil profesional',
    location: '',
    website: '',
    createdAt: new Date().toISOString(),
  };

  return {
    user,
    token: authResponse.token,
    tokenType: 'Bearer',
    expiresIn: 86400,
  };
}

async function registerLocal(email: string, password: string, role: UserRole): Promise<void> {
  const normalizedEmail = email.toLowerCase().trim();
  await requestJson('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email: normalizedEmail,
      password,
      role: mapRoleToBackend(role),
    }),
  });
}

async function updateProfile(userId: string, data: Partial<User>): Promise<User> {
  // Simulación local para el ejemplo
  return { id: userId, ...data } as User;
}

async function logout(): Promise<void> {}

export const authService = {
  login,
  registerLocal,
  updateProfile,
  logout,
  ROLE_DISPLAY_NAMES,
  ROLE_REDIRECT_PATHS,
};