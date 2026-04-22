import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole } from '@/shared/types';
import { authService, ROLE_DISPLAY_NAMES, ROLE_REDIRECT_PATHS } from '@/shared/services/authService';

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

      login: async (email: string, password: string, role: UserRole): Promise<LoginResult | null> => {
        set({ loading: true, error: null });
        try {
          const user = await authService.login(email, password, role);
          set({ user, isAuthenticated: true, loading: false });
          
          return {
            user,
            roleDisplayName: ROLE_DISPLAY_NAMES[user.role],
            redirectPath: ROLE_REDIRECT_PATHS[user.role],
          };
        } catch {
          set({ error: 'Error al iniciar sesión', loading: false });
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
