import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Code2,
  FolderKanban,
  Link2,
  Eye,
  Briefcase,
  GraduationCap,
  Settings,
  Bell,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Globe,
  User,
  Search,
  Users,
  BarChart3,
  Shield,
  FileText,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useAuthStore, useUiStore, useNotificationsStore } from '@/store';
import { Avatar, Badge } from '@/shared/ui';
import { EthosCoreLogo } from '@/components/brand/EthosCoreLogo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import type { Language, UserRole } from '@/shared/types';

type DashboardNavItem = {
  path: string;
  icon: typeof LayoutDashboard;
  labelKey?: string;
  label?: string;
};

// Navigation items for Estandar (Professional) users
const professionalNavItems: DashboardNavItem[] = [
  { path: '/dashboard', icon: LayoutDashboard, labelKey: 'nav.dashboard' },
  { path: '/dashboard/skills', icon: Code2, labelKey: 'nav.skills' },
  { path: '/dashboard/projects', icon: FolderKanban, labelKey: 'nav.projects' },
  { path: '/dashboard/connections', icon: Link2, labelKey: 'nav.connections' },
  { path: '/dashboard/visibility', icon: Eye, labelKey: 'nav.visibility' },
  { path: '/dashboard/experience', icon: Briefcase, labelKey: 'nav.experience' },
  { path: '/dashboard/education', icon: GraduationCap, label: 'Formacion' },
  { path: '/dashboard/preferences', icon: Settings, labelKey: 'nav.preferences' },
];

// Navigation items for Reclutador users
const recruiterNavItems: DashboardNavItem[] = [
  { path: '/recruiter/dashboard', icon: LayoutDashboard, label: 'Panel Principal' },
  { path: '/recruiter/talent-discovery', icon: Search, label: 'Busqueda de Talento' },
  { path: '/dashboard/preferences', icon: Settings, labelKey: 'nav.preferences' },
];

// Navigation items for Administrador users
const adminNavItems: DashboardNavItem[] = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Panel Principal' },
  { path: '/admin/moderation', icon: Shield, label: 'Panel de Moderacion' },
  { path: '/admin/metrics', icon: BarChart3, label: 'Metricas Globales' },
  { path: '/admin/users', icon: Users, label: 'Gestion de Usuarios' },
  { path: '/dashboard/preferences', icon: Settings, labelKey: 'nav.preferences' },
];

// Get navigation items based on user role
function getNavItemsForRole(role: UserRole): DashboardNavItem[] {
  switch (role) {
    case 'recruiter':
      return recruiterNavItems;
    case 'admin':
      return adminNavItems;
    default:
      return professionalNavItems;
  }
}

export function DashboardLayout() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { sidebarOpen, setSidebarOpen, resolvedTheme, initializeTheme } = useUiStore();
  const { unreadCount } = useNotificationsStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // SOLUCIÓN MODO OSCURO: Determinar si el tema es dark
  const isDark = resolvedTheme === 'dark';
  const navItems = getNavItemsForRole(user?.role || 'professional');

  // Cerrar sidebar al cambiar de ruta
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname, setSidebarOpen]);

  // Inicializar tema y forzar la clase "dark" en el HTML
  useEffect(() => {
    if (initializeTheme) initializeTheme();
  }, [initializeTheme]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const changeLanguage = (lang: Language) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('ethoshub_language', lang);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-black">
      {/* Sidebar - Subimos el z-index a 70 para móviles */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-[70] flex w-64 flex-col border-r border-gray-200 bg-white transition-transform lg:static lg:translate-x-0 dark:border-white/10 dark:bg-zinc-950',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4 dark:border-white/10">
          <Link to="/dashboard">
            <EthosCoreLogo size="sm" />
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 lg:hidden dark:text-gray-400 dark:hover:bg-white/10"
            aria-label="Cerrar menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-violet-600 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-black dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white'
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.labelKey ? t(item.labelKey) : item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Admin link for professional/recruiter users who also have admin access */}
          {user?.role === 'admin' && (
            <div className="mt-6 border-t border-gray-200 pt-6 dark:border-white/10">
              <p className="mb-2 px-3 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                {t('nav.admin')}
              </p>
              <ul className="space-y-1">
                <li>
                  <Link
                    to="/admin/dashboard"
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      location.pathname.startsWith('/admin')
                        ? 'bg-violet-600 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-black dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white'
                    )}
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    Panel Admin
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </nav>

        {/* User section */}
        <div className="border-t border-gray-200 p-4 dark:border-white/10">
          <div className="flex items-center gap-3">
            <Avatar src={user?.avatar} alt={user?.name} fallback={user?.name} size="md" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-black dark:text-white">{user?.name}</p>
              <p className="truncate text-xs text-gray-500 dark:text-gray-400">{user?.profession}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile - z-60 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Header - Z-INDEX [60] para que no lo pise ninguna otra pagina */}
        <header className="sticky top-0 z-[60] flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-white/10 dark:bg-zinc-950/95 dark:supports-[backdrop-filter]:bg-zinc-950/60">
          {/* Botón menú móvil a la izquierda */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden dark:text-gray-400 dark:hover:bg-white/10"
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Contenedor derecho: ml-auto asegura que siempre esté a la derecha */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Theme toggle */}
            <ThemeToggle size="sm" />

            {/* Language switcher */}
            <div className="flex items-center gap-1 rounded-lg border border-gray-200 p-1 dark:border-white/10">
              <button
                onClick={() => changeLanguage('es')}
                className={cn(
                  'rounded px-2 py-1 text-xs font-medium transition-colors',
                  i18n.language === 'es' 
                    ? 'bg-violet-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10'
                )}
              >
                ES
              </button>
              <button
                onClick={() => changeLanguage('en')}
                className={cn(
                  'rounded px-2 py-1 text-xs font-medium transition-colors',
                  i18n.language === 'en' 
                    ? 'bg-violet-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10'
                )}
              >
                EN
              </button>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10"
                aria-label="Notificaciones"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-[calc(100%+0.5rem)] z-[100] w-80 rounded-lg border border-gray-200 bg-white p-4 shadow-xl dark:border-white/10 dark:bg-zinc-950"
                  >
                    <p className="text-sm font-medium text-black dark:text-white">Notificaciones</p>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      {unreadCount > 0
                        ? `Tienes ${unreadCount} notificaciones sin leer`
                        : 'No tienes notificaciones nuevas'}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-white/10"
              >
                <Avatar src={user?.avatar} alt={user?.name} fallback={user?.name} size="sm" />
                <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-[calc(100%+0.5rem)] z-[100] w-56 rounded-lg border border-gray-200 bg-white py-2 shadow-xl dark:border-white/10 dark:bg-zinc-950"
                  >
                    <div className="border-b border-gray-200 px-4 pb-3 dark:border-white/10">
                      <p className="text-sm font-medium text-black dark:text-white">{user?.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                      <Badge variant="secondary" className="mt-2 bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300 border-0">
                        {t(`role.${user?.role}`)}
                      </Badge>
                    </div>
                    <div className="pt-2">
                      {user?.role === 'recruiter' ? (
                        <Link
                          to="/explorar"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-black dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Globe className="h-4 w-4" />
                          Explorar portafolios
                        </Link>
                      ) : user?.role === 'professional' ? (
                        <Link
                          to={`/p/${user?.slug}`}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-black dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Globe className="h-4 w-4" />
                          Ver mi portafolio
                        </Link>
                      ) : null}
                      <Link
                        to="/dashboard/preferences"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-black dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="h-4 w-4" />
                        Mi perfil
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        {t('nav.logout')}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50 dark:bg-black">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
