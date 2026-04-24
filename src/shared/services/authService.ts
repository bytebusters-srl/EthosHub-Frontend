import type { User, UserRole } from '@/shared/types';

const API_BASE_URL = ((import.meta as ImportMeta & { env?: Record<string, string> }).env?.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '');

type ApiEnvelope<T> = {
  success: boolean;
  status: number;
  message: string;
  data?: T;
  errors?: string[];
};

type BackendAuthUser = {
  id: string;
  username: string;
  email: string;
  userType: string;
};

type BackendAuthResponse = {
  action: string;
  token: string;
  tokenType: string;
  expiresIn: number;
  user: BackendAuthUser;
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

function mapUserTypeToRole(userType?: string): UserRole {
  const normalized = (userType || '').toUpperCase();
  if (normalized === 'RECLUTADOR' || normalized === 'RECRUITER') {
    return 'recruiter';
  }
  if (normalized === 'ADMINISTRADOR' || normalized === 'ADMIN') {
    return 'admin';
  }
  return 'professional';
}

function sanitizeSlug(value: string): string {
  const base = value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return base || `usuario-${Date.now()}`;
}

function buildUserFromAuth(authUser: BackendAuthUser): User {
  const role = mapUserTypeToRole(authUser.userType);

  return {
    id: String(authUser.id),
    email: authUser.email,
    name: authUser.username,
    username: authUser.username,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(authUser.email || authUser.username)}`,
    role,
    slug: sanitizeSlug(authUser.username),
    profession: role === 'recruiter' ? 'Reclutador' : role === 'admin' ? 'Administrador' : 'Profesional',
    bio: '',
    headline: role === 'recruiter' ? 'Encontrando talento verificado' : 'Construyendo mi perfil profesional',
    location: '',
    website: '',
    createdAt: new Date().toISOString(),
  };
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

  if (!response.ok || !payload.success) {
    const details = payload.errors?.[0] || payload.message || 'Error de autenticacion';
    throw new Error(details);
  }

  if (!payload.data) {
    throw new Error('Respuesta del servidor sin datos');
  }

  return payload.data;
}

// Role display names for toast messages
export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  professional: 'Profesional',
  recruiter: 'Reclutador',
  admin: 'Administrador',
  guest: 'Invitado',
};

// Default redirect paths per role
export const ROLE_REDIRECT_PATHS: Record<UserRole, string> = {
  professional: '/dashboard',
  recruiter: '/dashboard',
  admin: '/admin/dashboard',
  guest: '/',
};

async function login(email: string, password: string): Promise<LoginApiResult> {
  const normalizedEmail = email.toLowerCase().trim();
  const authResponse = await requestJson<BackendAuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ usernameOrEmail: normalizedEmail, password }),
  });

  return {
    user: buildUserFromAuth(authResponse.user),
    token: authResponse.token,
    tokenType: authResponse.tokenType,
    expiresIn: authResponse.expiresIn,
  };
}

async function registerLocal(email: string, password: string, role: UserRole): Promise<void> {
  const normalizedEmail = email.toLowerCase().trim();
  await requestJson('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email: normalizedEmail,
      password,
      role: mapRoleToBackend(role),
    }),
  });
}

/**
 * Update user profile
 */
async function updateProfile(userId: string, data: Partial<User>): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  // In a real app, this would call an API
  // For now, just return the merged data
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
  };
}

/**
 * Logout user
 */
async function logout(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  // Clear any session data
}

export const authService = {
  login,
  registerLocal,
  updateProfile,
  logout,
  ROLE_DISPLAY_NAMES,
  ROLE_REDIRECT_PATHS,
};
