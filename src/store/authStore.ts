import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole } from '@/shared/types';
import { authService, ROLE_DISPLAY_NAMES, ROLE_REDIRECT_PATHS, type ProfileUpdatePayload } from '@/shared/services/authService';

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
  login: (email: string, password: string, role?: UserRole) => Promise<LoginResult | null>;
  updateProfile: (data: ProfileUpdatePayload) => Promise<void>;
  syncUser: (data: Partial<User>) => void;
  fetchProfile: () => Promise<void>; // <-- Añadido al tipado
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

      login: async (email: string, password: string, role?: UserRole): Promise<LoginResult | null> => {
        set({ loading: true, error: null });
        try {
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

          // Una vez logueado, traemos la info completa del perfil desde la BD
          await get().fetchProfile();

          return {
            user: get().user || user, // Devolvemos el usuario ya hidratado con la info de BD
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

      fetchProfile: async () => {
        const { user } = get();
        if (!user) return;
        try {
          const dbData = await authService.getProfile(user.id);
          set((state) => ({
            user: state.user ? { ...state.user, ...dbData } : null,
          }));
        } catch (error) {
          console.error('Error al sincronizar perfil con la BD', error);
        }
      },

      updateProfile: async (data: ProfileUpdatePayload) => {
        const { user } = get();
        if (!user) return;
        set({ loading: true, error: null });
        try {
          const updatedUser = await authService.updateProfile(user.id, data);
          
          set({ 
            user: { 
              ...user, 
              ...(updatedUser || {}), 
              ...data,
              name: data.firstName || data.lastName ? `${data.firstName || user.name.split(' ')[0]} ${data.lastName || user.name.split(' ').slice(1).join(' ')}`.trim() : user.name,
              avatar: data.photoUrl || data.avatar || user.avatar,
              location: data.country || data.location || user.location,
              phone: data.phone || user.phone,
            }, 
            loading: false 
          });
        } catch {
          set({ error: 'Error al actualizar perfil', loading: false });
        }
      },

      syncUser: (data: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : state.user,
        }));
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
          // Opcional: Refrescar la info cada vez que se checa la autenticación
          await get().fetchProfile();
        }
      },

      completeOAuthLogin: ({ user, token, tokenType = 'Bearer', expiresIn }) => {
        localStorage.setItem(ACCESS_TOKEN_KEY, token);
        localStorage.setItem(TOKEN_TYPE_KEY, tokenType);
        if (expiresIn) localStorage.setItem(EXPIRES_AT_KEY, String(Date.now() + expiresIn));
        set({ user, isAuthenticated: true, error: null, loading: false });
        // También hidratamos si entra con Google/OAuth
        get().fetchProfile();
      },

      switchRole: (role: UserRole) => {
        const { user } = get();
        if (user) set({ user: { ...user, role } });
      },

      getRoleDisplayName: () => {
        const { user } = get();
        return user ? ROLE_DISPLAY_NAMES[user.role] : 'Invitado';
      },

      getRedirectPath: () => {
        const { user } = get();
        return user ? ROLE_REDIRECT_PATHS[user.role] : '/';
      },
    }),
    { name: 'ethoshub_auth' }
  )
);