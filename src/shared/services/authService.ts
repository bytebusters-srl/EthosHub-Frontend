import type { User, UserRole } from '@/shared/types';
import api from '@/shared/api/api'; 

export type ProfileUpdatePayload = Partial<User> & {
  firstName?: string;
  lastName?: string;
  photoUrl?: string;
  country?: string;
  phone?: string;
  availabilityStatus?: string;
};

type BackendAuthResponse = {
  token: string;
  userId: string;
  email: string;
  role?: string;
  profileId?: string;
};

type BackendApiResponse<T> = {
  success: boolean;
  status: number;
  message: string;
  data: T;
  errors?: string[];
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

export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  professional: 'Profesional',
  recruiter: 'Reclutador',
  admin: 'Administrador',
  guest: 'Invitado',
};

export const ROLE_REDIRECT_PATHS: Record<UserRole, string> = {
  professional: '/dashboard',
  recruiter: '/recruiter/dashboard', // Asegurado para que no vaya al de profesional
  admin: '/admin/dashboard',
  guest: '/',
};

async function login(email: string, password: string, role?: UserRole): Promise<LoginApiResult> {
  const normalizedEmail = email.toLowerCase().trim();

  const response = await api.post<BackendApiResponse<BackendAuthResponse>>('/auth/login', { 
    email: normalizedEmail, 
    password 
  });

  const authResponse = response.data.data;
  if (!authResponse?.token) {
    throw new Error('La respuesta de login no incluyó token');
  }
  
  let finalRole: UserRole = 'professional';

  // 🔥 AQUI ESTABA EL BUG PRINCIPAL DEL FRONTEND
  if (authResponse.role) {
    const backendRole = authResponse.role.toUpperCase();
    
    if (backendRole.includes('ADMIN')) {
      finalRole = 'admin';
    } else if (backendRole.includes('RECRUITER') || backendRole.includes('RECLUTADOR')) {
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
    profession: finalRole === 'admin' ? 'Administrador' : finalRole === 'recruiter' ? 'Reclutador' : 'Profesional',
    bio: '',
    headline: finalRole === 'admin' ? 'Gestión del sistema' : finalRole === 'recruiter' ? 'Encontrando talento verificado' : 'Construyendo mi perfil profesional',
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
  await api.post('/auth/register', {
    email: normalizedEmail,
    password,
    role: mapRoleToBackend(role),
  });
}

async function getProfile(userId: string): Promise<Partial<User>> {
  const response = await api.get(`/profiles/${userId}`);
  const data = response.data;

  return {
    name: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
    bio: data.bio,
    avatar: data.photoUrl,
    location: data.country,
    phone: data.phone,
    status: data.availabilityStatus,
    seniority: data.seniority
  };
}

async function updateProfile(userId: string, data: ProfileUpdatePayload): Promise<User> {
  const response = await api.put(`/profiles/${userId}`, {
    firstName: data.firstName || data.name?.split(' ')[0] || '',
    lastName: data.lastName || data.name?.split(' ').slice(1).join(' ') || '',
    bio: data.bio || '',
    photoUrl: data.photoUrl || data.avatar || '',
    country: data.country || data.location || '',
    phone: data.phone || '',
    availabilityStatus: data.availabilityStatus || data.status || 'Disponible',
    seniority: data.seniority || 'Junior'
  });

  return {
    id: userId,
    ...data,
    avatar: data.photoUrl || data.avatar,
    location: data.country || data.location,
    phone: data.phone,
  } as User;
}

async function logout(): Promise<void> {
  // Aquí podrías llamar a un endpoint de logout si fuera necesario
}

export const authService = {
  login,
  registerLocal,
  updateProfile,
  getProfile,
  logout,
  ROLE_DISPLAY_NAMES,
  ROLE_REDIRECT_PATHS,
};