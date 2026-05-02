import type { User, UserRole } from '@/shared/types';

export type ProfileUpdatePayload = Partial<User> & {
  firstName?: string;
  lastName?: string;
  photoUrl?: string;
  country?: string;
  phone?: string;
  availabilityStatus?: string;
};

const API_BASE_URL = ((import.meta as ImportMeta & { env?: Record<string, string> }).env?.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '');

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
  profileId?: string;
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

  let finalRole: UserRole = 'professional';

  if (authResponse.role) {
    const backendRole = authResponse.role.toUpperCase();
    if (backendRole.includes('RECRUITER') || backendRole.includes('RECLUTADOR')) {
      finalRole = 'recruiter';
    }
  } else if (role) {
    finalRole = role;
  }

  const user: User = {
    id: authResponse.userId,
    email: authResponse.email,
    name: authResponse.email.split('@')[0],
    username: authResponse.email.split('@')[0],
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(authResponse.email)}`,
    role: finalRole,
    profile_id: authResponse.profileId,
    slug: sanitizeSlug(authResponse.email.split('@')[0]),
    profession: finalRole === 'recruiter' ? 'Reclutador' : 'Profesional',
    bio: '',
    headline: finalRole === 'recruiter' ? 'Encontrando talento verificado' : 'Construyendo mi perfil profesional',
    location: '',
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

async function getProfile(userId: string): Promise<Partial<User>> {
  const token = localStorage.getItem('ethoshub_access_token');

  const response = await fetch(`${API_BASE_URL}/api/v1/profiles/${userId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) throw new Error('No se pudo cargar el perfil');

  const data = await response.json();

  return {
    name: `${data.firstName} ${data.lastName}`.trim(),
    bio: data.bio,
    avatar: data.photoUrl,
    location: data.country,
    phone: data.phone,
    status: data.availabilityStatus,
    seniority: data.seniority
  };
}

async function updateProfile(userId: string, data: ProfileUpdatePayload): Promise<User> {
  const token = localStorage.getItem('ethoshub_access_token');

  if (!token) {
    throw new Error('No hay token de sesión activo. Debes iniciar sesión de nuevo.');
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/profiles/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      firstName: data.firstName || data.name?.split(' ')[0] || '',
      lastName: data.lastName || data.name?.split(' ').slice(1).join(' ') || '',
      bio: data.bio || '',
      photoUrl: data.photoUrl || data.avatar || '',
      country: data.country || data.location || '',
      phone: data.phone || '',
      availabilityStatus: data.availabilityStatus || data.status || 'Disponible',
      seniority: data.seniority || 'Junior'
    })
  });

  if (!response.ok) {
    throw new Error(`Fallo al comunicarse con el servidor: Error ${response.status}`);
  }

  return {
    id: userId,
    ...data,
    avatar: data.photoUrl || data.avatar,
    location: data.country || data.location,
    phone: data.phone,
  } as User;
}

async function logout(): Promise<void> { }

export const authService = {
  login,
  registerLocal,
  updateProfile,
  getProfile,
  logout,
  ROLE_DISPLAY_NAMES,
  ROLE_REDIRECT_PATHS,
};