import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole } from '@/shared/types';
import { authService, ROLE_DISPLAY_NAMES, ROLE_REDIRECT_PATHS } from '@/shared/services/authService';

const ACCESS_TOKEN_KEY = 'ethoshub_access_token';
const TOKEN_TYPE_KEY = 'ethoshub_token_type';
const EXPIRES_AT_KEY = 'ethoshub_access_expires_at';

interface LoginResult {
  user: User;
  roleDisplayName: string;
  redirectPath: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string, role: UserRole) => Promise<LoginResult | null>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  completeOAuthLogin: (args: {
    user: User;
    token: string;
    tokenType?: string;
    expiresIn?: number;
  }) => void;
  switchRole: (role: UserRole) => void;
  getRoleDisplayName: () => string;
  getRedirectPath: () => string;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      // Se removió el guion bajo a 'role' para usarlo activamente
      login: async (email: string, password: string, role: UserRole): Promise<LoginResult | null> => {
        set({ loading: true, error: null });
        try {
          // Pasamos el rol seleccionado al servicio
          const result = await authService.login(email, password, role);
          const user = result.user;

          localStorage.setItem(ACCESS_TOKEN_KEY, result.token);
          localStorage.setItem(TOKEN_TYPE_KEY, result.tokenType || 'Bearer');
          if (typeof result.expiresIn === 'number' && Number.isFinite(result.expiresIn)) {
            localStorage.setItem(EXPIRES_AT_KEY, String(Date.now() + result.expiresIn));
          } else {
            localStorage.removeItem(EXPIRES_AT_KEY);
          }

          set({ user, isAuthenticated: true, loading: false });

          return {
            user,
            roleDisplayName: ROLE_DISPLAY_NAMES[user.role],
            redirectPath: ROLE_REDIRECT_PATHS[user.role],
          };
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Error al iniciar sesión',
            loading: false,
          });
          return null;
        }
      },

      updateProfile: async (data: Partial<User>) => {
        const { user } = get();
        if (!user) {
          set({ error: 'No hay usuario autenticado' });
          return;
        }

        set({ loading: true, error: null });
        try {
          const updatedUser = await authService.updateProfile(user.id, data);
          set({ user: updatedUser, loading: false });
        } catch {
          set({ error: 'Error al actualizar perfil', loading: false });
        }
      },

      logout: async () => {
        set({ loading: true });
        try {
          await authService.logout();
          localStorage.removeItem(ACCESS_TOKEN_KEY);
          localStorage.removeItem(TOKEN_TYPE_KEY);
          localStorage.removeItem(EXPIRES_AT_KEY);
          set({ user: null, isAuthenticated: false, loading: false });
        } catch {
          set({ loading: false });
        }
      },

      checkAuth: async () => {
        const { user } = get();
        if (user) {
          set({ isAuthenticated: true });
        }
      },

      completeOAuthLogin: ({ user, token, tokenType = 'Bearer', expiresIn }) => {
        localStorage.setItem(ACCESS_TOKEN_KEY, token);
        localStorage.setItem(TOKEN_TYPE_KEY, tokenType);
        if (typeof expiresIn === 'number' && Number.isFinite(expiresIn)) {
          localStorage.setItem(EXPIRES_AT_KEY, String(Date.now() + expiresIn));
        } else {
          localStorage.removeItem(EXPIRES_AT_KEY);
        }

        set({ user, isAuthenticated: true, error: null, loading: false });
      },

      switchRole: (role: UserRole) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, role } });
        }
      },

      getRoleDisplayName: () => {
        const { user } = get();
        if (!user) return 'Invitado';
        return ROLE_DISPLAY_NAMES[user.role] || 'Usuario';
      },

      getRedirectPath: () => {
        const { user } = get();
        if (!user) return '/';
        return ROLE_REDIRECT_PATHS[user.role] || '/dashboard';
      },
    }),
    {
      name: 'ethoshub_auth',
    }
  )
);