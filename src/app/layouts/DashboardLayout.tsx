import { useState } from 'react';
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
  const { sidebarOpen, setSidebarOpen } = useUiStore();
  const { unreadCount } = useNotificationsStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Get navigation items based on user role
  const navItems = getNavItemsForRole(user?.role || 'professional');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const changeLanguage = (lang: Language) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('ethoshub_language', lang);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card transition-transform lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <Link to="/dashboard">
            <EthosCoreLogo size="sm" />
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1 hover:bg-accent lg:hidden"
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
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
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
            <div className="mt-6 border-t border-border pt-6">
              <p className="mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground">
                {t('nav.admin')}
              </p>
              <ul className="space-y-1">
                <li>
                  <Link
                    to="/admin/dashboard"
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      location.pathname.startsWith('/admin')
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
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
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3">
            <Avatar src={user?.avatar} alt={user?.name} fallback={user?.name} size="md" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{user?.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user?.profession}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-card/60">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 hover:bg-accent lg:hidden"
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <ThemeToggle size="sm" />

            {/* Language switcher */}
            <div className="flex items-center gap-1 rounded-lg border border-border p-1">
              <button
                onClick={() => changeLanguage('es')}
                className={cn(
                  'rounded px-2 py-1 text-xs font-medium transition-colors',
                  i18n.language === 'es' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                )}
              >
                ES
              </button>
              <button
                onClick={() => changeLanguage('en')}
                className={cn(
                  'rounded px-2 py-1 text-xs font-medium transition-colors',
                  i18n.language === 'en' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                )}
              >
                EN
              </button>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative rounded-lg p-2 hover:bg-accent"
                aria-label="Notificaciones"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
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
                    className="absolute right-0 top-full mt-2 w-80 rounded-lg border border-border bg-card p-4 shadow-lg"
                  >
                    <p className="text-sm font-medium text-foreground">Notificaciones</p>
                    <p className="mt-2 text-sm text-muted-foreground">
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
                className="flex items-center gap-2 rounded-lg p-2 hover:bg-accent"
              >
                <Avatar src={user?.avatar} alt={user?.name} fallback={user?.name} size="sm" />
                <ChevronDown className="h-4 w-4" />
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-border bg-card py-2 shadow-lg"
                  >
                    <div className="border-b border-border px-4 pb-3">
                      <p className="text-sm font-medium text-foreground">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                      <Badge variant="secondary" className="mt-2">
                        {t(`role.${user?.role}`)}
                      </Badge>
                    </div>
                    {user?.role === 'recruiter' ? (
                      <Link
                        to="/explorar"
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Globe className="h-4 w-4" />
                        Explorar portafolios
                      </Link>
                    ) : user?.role === 'professional' ? (
                      <Link
                        to={`/p/${user?.slug}`}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Globe className="h-4 w-4" />
                        Ver mi portafolio
                      </Link>
                    ) : null}
                    <Link
                      to="/dashboard/preferences"
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="h-4 w-4" />
                      Mi perfil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-accent"
                    >
                      <LogOut className="h-4 w-4" />
                      {t('nav.logout')}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
