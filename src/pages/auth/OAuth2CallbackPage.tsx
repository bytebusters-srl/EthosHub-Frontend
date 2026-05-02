import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthStore } from '@/store';
import type { User, UserRole } from '@/shared/types';
import { ROLE_REDIRECT_PATHS } from '@/shared/services/authService';

type JwtPayload = {
  userId?: string; // Cambiado a string obligatoriamente para soportar UUID
  email?: string;
  username?: string;
  userType?: string; // RECLUTADOR, PROFESIONAL, ADMINISTRADOR
  exp?: number;
};

function base64UrlDecode(value: string): string {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padding = normalized.length % 4;
  const withPadding = padding ? normalized + '='.repeat(4 - padding) : normalized;
  return atob(withPadding);
}

function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const raw = base64UrlDecode(parts[1]);
    return JSON.parse(raw) as JwtPayload;
  } catch {
    return null;
  }
}

function mapUserTypeToRole(userType?: string): UserRole {
  // Coincidiendo con los nombres que vienen de la BD de la U
  const type = userType?.toUpperCase();
  if (type === 'RECLUTADOR' || type === 'RECRUITER') return 'recruiter';
  if (type === 'ADMINISTRADOR' || type === 'ADMIN') return 'admin';
  return 'professional';
}

function sanitizeSlug(value: string): string {
  const base = value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return base || `usuario-${Date.now()}`;
}

function buildUserFromToken(payload: JwtPayload): User {
  const email = payload.email || '';
  const username = payload.username || (email.includes('@') ? email.split('@')[0] : 'oauth-user');
  const role = mapUserTypeToRole(payload.userType);

  return {
    id: payload.userId || `oauth-${Date.now()}`, // Aquí llega el UUID de PostgreSQL
    email,
    name: username,
    username,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email || username)}`,
    role,
    slug: sanitizeSlug(username),
    profession: role === 'recruiter' ? 'Reclutador' : role === 'admin' ? 'Administrador' : 'Profesional',
    bio: '',
    headline: role === 'recruiter' ? 'Encontrando talento verificado' : 'Construyendo mi perfil profesional',
    location: '',
    website: '',
    createdAt: new Date().toISOString(),
  };
}

export default function OAuth2CallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const completeOAuthLogin = useAuthStore((state) => state.completeOAuthLogin);

  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      toast.error('No se pudo iniciar con OAuth2', { description: error });
      navigate('/login', { replace: true });
      return;
    }

    const token = searchParams.get('token');
    
    if (!token) {
      toast.error('Respuesta OAuth2 incompleta');
      navigate('/login', { replace: true });
      return;
    }

    const payload = decodeJwtPayload(token);
    if (!payload) {
      toast.error('Token OAuth2 inválido');
      navigate('/login', { replace: true });
      return;
    }

    const user = buildUserFromToken(payload);

    // Guardamos en el Store (Zustand)
    completeOAuthLogin({
      user,
      token,
      tokenType: 'Bearer',
    });

    toast.success('Sesión iniciada correctamente', {
      description: `Bienvenido, ${user.name}`,
    });

    // Redirigir según el rol (Dashboard reclutador o Perfil profesional)
    navigate(ROLE_REDIRECT_PATHS[user.role], { replace: true });
  }, [completeOAuthLogin, navigate, searchParams]);

  return (
    <div className="flex min-h-[45vh] items-center justify-center px-6 text-center">
      <div className="animate-pulse">
        <h1 className="text-2xl font-bold text-foreground">Procesando inicio de sesión...</h1>
        <p className="mt-2 text-sm text-muted-foreground">Conectando con el servidor de la universidad.</p>
      </div>
    </div>
  );
}