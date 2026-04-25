import type { User, UserRole } from '@/shared/types';

const API_BASE_URL = ((import.meta as ImportMeta & { env?: Record<string, string> }).env?.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '');

// Adaptado al ApiResponse de tu Spring Boot
type ApiEnvelope<T> = {
  code?: number;
  status?: number;
  success?: boolean;
  message: string;
  data?: T;
  errors?: string[];
};

// Esta estructura DEBE coincidir con el AuthResponse.java de tu Backend
type BackendAuthResponse = {
  token: string;
  userId: string;
  email: string;
};

type LoginApiResult = {
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

  // Tolerancia: Spring Boot suele usar código 200/201 en lugar de un booleano 'success'
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

// Se añadió 'role' para poder armar el usuario temporal en el front
async function login(email: string, password: string, role: UserRole): Promise<LoginApiResult> {
  const normalizedEmail = email.toLowerCase().trim();
  
  // Enviamos 'email' y 'password' que es lo que espera LoginRequest en Java
  const authResponse = await requestJson<BackendAuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: normalizedEmail, password }),
  });

  // Construimos el User para Zustand con los datos que nos dio Java
  const user: User = {
    id: authResponse.userId,
    email: authResponse.email,
    name: authResponse.email.split('@')[0], // Nombre basado en email
    username: authResponse.email.split('@')[0],
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(authResponse.email)}`,
    role: role,
    slug: sanitizeSlug(authResponse.email.split('@')[0]),
    profession: role === 'recruiter' ? 'Reclutador' : 'Profesional',
    bio: '',
    headline: role === 'recruiter' ? 'Encontrando talento verificado' : 'Construyendo mi perfil profesional',
    location: '',
    website: '',
    createdAt: new Date().toISOString(),
  };

  return {
    user,
    token: authResponse.token,
    tokenType: 'Bearer',
    expiresIn: 86400, // 24hrs por defecto
  };
}

async function registerLocal(email: string, password: string, role: UserRole): Promise<void> {
  const normalizedEmail = email.toLowerCase().trim();
  await requestJson('/api/auth/register', { // Ajustado a la ruta de tu controlador
    method: 'POST',
    body: JSON.stringify({
      email: normalizedEmail,
      password,
      role: mapRoleToBackend(role),
    }),
  });
}

async function updateProfile(userId: string, data: Partial<User>): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    id: userId,
    email: data.email || '',
    name: data.name || '',
    avatar: data.avatar || '',
    role: data.role || 'professional',
    slug: data.slug || '',
    profession: data.profession || '',
    bio: data.bio || '',
    location: data.location || '',
    website: data.website || '',
    createdAt: data.createdAt || new Date().toISOString(),
  } as User;
}

async function logout(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 300));
}

export const authService = {
  login,
  registerLocal,
  updateProfile,
  logout,
  ROLE_DISPLAY_NAMES,
  ROLE_REDIRECT_PATHS,
};