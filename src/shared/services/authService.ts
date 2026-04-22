import type { User, UserRole } from '@/shared/types';

// Mock credentials mapping
const MOCK_CREDENTIALS: Record<string, { password: string; role: UserRole; name: string }> = {
  'profesional@ethoshub.com': { password: 'demo', role: 'professional', name: 'Carlos Mendoza' },
  'reclutador@ethoshub.com': { password: 'demo', role: 'recruiter', name: 'Ana Garcia' },
  'admin@ethoshub.com': { password: 'demo', role: 'admin', name: 'Admin EthosHub' },
  'demo@ethoshub.com': { password: 'demo123', role: 'professional', name: 'Demo User' },
};

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

/**
 * Authenticate user with mock credentials
 * Returns user object with correct role based on email/password combination
 */
async function login(email: string, password: string, defaultRole: UserRole): Promise<User> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const normalizedEmail = email.toLowerCase().trim();
  const mockUser = MOCK_CREDENTIALS[normalizedEmail];

  // Check if credentials match a mock user
  if (mockUser && mockUser.password === password) {
    return {
      id: `user-${Date.now()}`,
      email: normalizedEmail,
      name: mockUser.name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${normalizedEmail}`,
      role: mockUser.role,
      slug: normalizedEmail.split('@')[0].replace(/[^a-z0-9]/g, '-'),
      profession: mockUser.role === 'admin' 
        ? 'Administrador del Sistema' 
        : mockUser.role === 'recruiter' 
          ? 'Reclutador de Talento Tech' 
          : 'Desarrollador Full Stack',
      bio: 'Usuario de demostración de EthosHub',
      headline: mockUser.role === 'recruiter' 
        ? 'Encontrando el mejor talento tech' 
        : 'Construyendo el futuro digital',
      location: 'Ciudad de México, México',
      website: 'https://ethoshub.com',
      company: mockUser.role === 'recruiter' ? 'TechRecruit Inc.' : undefined,
      createdAt: new Date().toISOString(),
    };
  }

  // For any other credentials, create a user with the provided/default role
  return {
    id: `user-${Date.now()}`,
    email: normalizedEmail,
    name: normalizedEmail.split('@')[0],
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${normalizedEmail}`,
    role: defaultRole,
    slug: normalizedEmail.split('@')[0].replace(/[^a-z0-9]/g, '-'),
    profession: defaultRole === 'recruiter' ? 'Reclutador' : 'Profesional',
    bio: '',
    location: '',
    website: '',
    createdAt: new Date().toISOString(),
  };
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
  updateProfile,
  logout,
  MOCK_CREDENTIALS,
  ROLE_DISPLAY_NAMES,
  ROLE_REDIRECT_PATHS,
};
