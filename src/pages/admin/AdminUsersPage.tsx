import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  MoreHorizontal,
  Mail,
  ExternalLink,
  Shield,
  Ban,
  UserPlus,
  Download,
  ChevronLeft,
  ChevronRight,
  Eye,
  UserCog,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  MapPin,
  Building,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Check,
  X,
  Filter,
  Briefcase,
  User,
  AlertTriangle,
} from 'lucide-react';
import {
  Button,
  Card,
  Badge,
  Avatar,
  Input,
  Modal,
  LoadingSpinner,
  EmptyState,
} from '@/shared/ui';
import { cn } from '@/shared/lib/utils';

// Types mapped to core.users and core.profiles_basic
interface UserData {
  id: string;
  email: string;
  username: string;
  nombre_completo: string;
  avatar_url?: string;
  rol: 'Estandar' | 'Reclutador' | 'Admin';
  status: 'active' | 'banned' | 'pending';
  fecha_registro: string;
  ultimo_login?: string;
  ubicacion?: string;
  empresa?: string;
  portfolio_views: number;
  proyectos_count: number;
  conexiones_count: number;
}

// Mock users data mapped to core.users and core.profiles_basic
const mockUsers: UserData[] = [
  {
    id: '1',
    email: 'ana.martinez@example.com',
    username: 'anamartinez',
    nombre_completo: 'Ana Martinez',
    avatar_url: 'https://i.pravatar.cc/150?u=ana',
    rol: 'Estandar',
    status: 'active',
    fecha_registro: '2023-06-15T10:30:00Z',
    ultimo_login: '2024-01-15T14:20:00Z',
    ubicacion: 'Madrid, Spain',
    empresa: 'TechCorp',
    portfolio_views: 1234,
    proyectos_count: 8,
    conexiones_count: 156,
  },
  {
    id: '2',
    email: 'carlos.ruiz@example.com',
    username: 'carlosruiz',
    nombre_completo: 'Carlos Ruiz',
    avatar_url: 'https://i.pravatar.cc/150?u=carlos',
    rol: 'Reclutador',
    status: 'active',
    fecha_registro: '2023-01-10T08:15:00Z',
    ultimo_login: '2024-01-16T09:00:00Z',
    ubicacion: 'Barcelona, Spain',
    empresa: 'StartupXYZ',
    portfolio_views: 5678,
    proyectos_count: 15,
    conexiones_count: 342,
  },
  {
    id: '3',
    email: 'maria.lopez@example.com',
    username: 'marialopez',
    nombre_completo: 'Maria Lopez',
    avatar_url: 'https://i.pravatar.cc/150?u=maria',
    rol: 'Admin',
    status: 'active',
    fecha_registro: '2023-03-20T12:00:00Z',
    ultimo_login: '2024-01-14T18:45:00Z',
    ubicacion: 'Valencia, Spain',
    portfolio_views: 2345,
    proyectos_count: 6,
    conexiones_count: 89,
  },
  {
    id: '4',
    email: 'pedro.sanchez@example.com',
    username: 'pedros',
    nombre_completo: 'Pedro Sanchez',
    avatar_url: 'https://i.pravatar.cc/150?u=pedro',
    rol: 'Estandar',
    status: 'pending',
    fecha_registro: '2024-01-10T15:30:00Z',
    portfolio_views: 12,
    proyectos_count: 0,
    conexiones_count: 0,
  },
  {
    id: '5',
    email: 'laura.garcia@example.com',
    username: 'lauragarcia',
    nombre_completo: 'Laura Garcia',
    avatar_url: 'https://i.pravatar.cc/150?u=laura',
    rol: 'Estandar',
    status: 'banned',
    fecha_registro: '2023-08-05T09:20:00Z',
    ultimo_login: '2023-12-20T11:30:00Z',
    ubicacion: 'Sevilla, Spain',
    portfolio_views: 567,
    proyectos_count: 3,
    conexiones_count: 45,
  },
  {
    id: '6',
    email: 'javier.fernandez@example.com',
    username: 'javierfernandez',
    nombre_completo: 'Javier Fernandez',
    avatar_url: 'https://i.pravatar.cc/150?u=javier',
    rol: 'Reclutador',
    status: 'active',
    fecha_registro: '2023-05-12T11:00:00Z',
    ultimo_login: '2024-01-16T10:30:00Z',
    ubicacion: 'Bilbao, Spain',
    empresa: 'HR Solutions',
    portfolio_views: 890,
    proyectos_count: 2,
    conexiones_count: 178,
  },
  {
    id: '7',
    email: 'sofia.torres@example.com',
    username: 'sofiatorres',
    nombre_completo: 'Sofia Torres',
    avatar_url: 'https://i.pravatar.cc/150?u=sofia',
    rol: 'Estandar',
    status: 'active',
    fecha_registro: '2023-09-01T14:15:00Z',
    ultimo_login: '2024-01-15T16:00:00Z',
    ubicacion: 'Malaga, Spain',
    portfolio_views: 1456,
    proyectos_count: 12,
    conexiones_count: 234,
  },
  {
    id: '8',
    email: 'diego.navarro@example.com',
    username: 'diegonavarro',
    nombre_completo: 'Diego Navarro',
    avatar_url: 'https://i.pravatar.cc/150?u=diego',
    rol: 'Estandar',
    status: 'active',
    fecha_registro: '2023-11-20T09:45:00Z',
    ultimo_login: '2024-01-14T12:00:00Z',
    ubicacion: 'Zaragoza, Spain',
    empresa: 'DevStudio',
    portfolio_views: 678,
    proyectos_count: 5,
    conexiones_count: 67,
  },
];

// Role options from core_types.rol_ethoshub
const roleOptions = [
  { value: 'all', label: 'Todos los Roles', icon: Users },
  { value: 'Estandar', label: 'Estandar', icon: User },
  { value: 'Reclutador', label: 'Reclutador', icon: Briefcase },
  { value: 'Admin', label: 'Admin', icon: Shield },
];

const statusOptions = [
  { value: 'all', label: 'Todos los Estados' },
  { value: 'active', label: 'Activo' },
  { value: 'banned', label: 'Baneado' },
  { value: 'pending', label: 'Pendiente' },
];

// Helper function to format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export default function AdminUsersPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ type: string; userId: string } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'nombre_completo' | 'fecha_registro' | 'portfolio_views'>('fecha_registro');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 800);
  }, []);

  // Fuzzy search and filter logic
  const filteredUsers = useMemo(() => {
    return users
      .filter((user) => {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch =
          user.nombre_completo.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.username.toLowerCase().includes(searchLower);
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
        const matchesRole = roleFilter === 'all' || user.rol === roleFilter;
        return matchesSearch && matchesStatus && matchesRole;
      })
      .sort((a, b) => {
        let comparison = 0;
        if (sortBy === 'nombre_completo') {
          comparison = a.nombre_completo.localeCompare(b.nombre_completo);
        } else if (sortBy === 'fecha_registro') {
          comparison = new Date(a.fecha_registro).getTime() - new Date(b.fecha_registro).getTime();
        } else if (sortBy === 'portfolio_views') {
          comparison = a.portfolio_views - b.portfolio_views;
        }
        return sortOrder === 'asc' ? comparison : -comparison;
      });
  }, [users, searchQuery, statusFilter, roleFilter, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: 'nombre_completo' | 'fecha_registro' | 'portfolio_views') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleSelectAll = () => {
    if (selectedUsers.size === paginatedUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(paginatedUsers.map(u => u.id)));
    }
  };

  const handleSelectUser = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const handleAction = (action: string, user: UserData) => {
    if (action === 'view') {
      setSelectedUser(user);
      setDetailModalOpen(true);
    } else if (action === 'changeRole') {
      setSelectedUser(user);
      setRoleModalOpen(true);
    } else if (action === 'ban' || action === 'unban') {
      setConfirmAction({ type: action, userId: user.id });
      setConfirmModalOpen(true);
    }
  };

  const confirmActionHandler = () => {
    if (confirmAction) {
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === confirmAction.userId) {
            if (confirmAction.type === 'ban') {
              return { ...u, status: 'banned' as const };
            } else if (confirmAction.type === 'unban') {
              return { ...u, status: 'active' as const };
            }
          }
          return u;
        })
      );
    }
    setConfirmModalOpen(false);
    setConfirmAction(null);
  };

  const handleChangeRole = (newRole: 'Estandar' | 'Reclutador' | 'Admin') => {
    if (selectedUser) {
      setUsers((prev) =>
        prev.map((u) => (u.id === selectedUser.id ? { ...u, rol: newRole } : u))
      );
      setRoleModalOpen(false);
      setSelectedUser(null);
    }
  };

  const handleBulkExport = () => {
    const selectedData = users.filter((u) => selectedUsers.has(u.id));
    const csv = [
      ['Email', 'Nombre', 'Username', 'Rol', 'Estado', 'Fecha Registro'].join(','),
      ...selectedData.map((u) =>
        [u.email, u.nombre_completo, u.username, u.rol, u.status, u.fecha_registro].join(',')
      ),
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'usuarios_ethoshub.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: UserData['status']) => {
    const variants = {
      active: { className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', icon: CheckCircle, label: 'Activo' },
      pending: { className: 'bg-amber-500/15 text-amber-400 border-amber-500/30', icon: Clock, label: 'Pendiente' },
      banned: { className: 'bg-red-500/15 text-red-400 border-red-500/30', icon: XCircle, label: 'Baneado' },
    };
    const variant = variants[status];
    const Icon = variant.icon;

    return (
      <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium', variant.className)}>
        <Icon className="h-3 w-3" />
        {variant.label}
      </span>
    );
  };

  const getRoleBadge = (rol: UserData['rol']) => {
    const variants = {
      Admin: { className: 'bg-violet-500/15 text-violet-400 border-violet-500/30', icon: Shield },
      Reclutador: { className: 'bg-purple-500/15 text-purple-400 border-purple-500/30', icon: Briefcase },
      Estandar: { className: 'bg-slate-500/15 text-slate-400 border-slate-500/30', icon: User },
    };
    const variant = variants[rol];
    const Icon = variant.icon;

    return (
      <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium', variant.className)}>
        <Icon className="h-3 w-3" />
        {rol}
      </span>
    );
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortBy !== field) return <ArrowUpDown className="h-3 w-3 text-violet-400/50" />;
    return sortOrder === 'asc' 
      ? <ArrowUp className="h-3 w-3 text-violet-400" />
      : <ArrowDown className="h-3 w-3 text-violet-400" />;
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner size="lg" />
          <p className="text-sm text-violet-300/60">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-6 bg-black p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-sans text-3xl font-bold tracking-tight text-white">
            Gestion de Usuarios
          </h1>
          <p className="mt-1 text-violet-300/70">
            {users.length.toLocaleString()} usuarios registrados en core.users
          </p>
        </div>
        <div className="flex items-center gap-3">
          {selectedUsers.size > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2"
            >
              <span className="text-sm text-violet-300">
                {selectedUsers.size} seleccionados
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkExport}
                className="border-violet-500/30 bg-transparent text-violet-300 hover:border-violet-500/50 hover:bg-violet-500/10"
              >
                <Download className="mr-2 h-4 w-4" />
                Exportar CSV
              </Button>
            </motion.div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "border-violet-500/30 bg-transparent hover:border-violet-500/50 hover:bg-violet-500/10",
              showFilters ? "text-violet-300" : "text-violet-300/70"
            )}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filtros
          </Button>
          <Button className="bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/25 hover:from-violet-700 hover:to-purple-700">
            <UserPlus className="mr-2 h-4 w-4" />
            Agregar Usuario
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-violet-400/50" />
          <input
            type="text"
            placeholder="Buscar por email, nombre o username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-violet-500/20 bg-black py-3 pl-12 pr-4 text-white placeholder-violet-400/40 transition-all focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
          />
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-4 rounded-xl border border-violet-500/20 bg-black/60 p-4">
                <div className="flex-1 min-w-[200px]">
                  <label className="mb-2 block text-xs font-medium text-violet-300/70">Rol (core_types.rol_ethoshub)</label>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="w-full rounded-lg border border-violet-500/20 bg-black px-3 py-2 text-sm text-white focus:border-violet-500/50 focus:outline-none"
                  >
                    {roleOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label className="mb-2 block text-xs font-medium text-violet-300/70">Estado</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full rounded-lg border border-violet-500/20 bg-black px-3 py-2 text-sm text-white focus:border-violet-500/50 focus:outline-none"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-xl border border-violet-500/20 bg-black">
        {paginatedUsers.length === 0 ? (
          <div className="p-12">
            <EmptyState
              icon={Users}
              title="No se encontraron usuarios"
              description="Intenta ajustar los filtros de busqueda"
            />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-violet-500/20 bg-violet-500/5">
                    <th className="w-12 px-4 py-4">
                      <button
                        onClick={handleSelectAll}
                        className={cn(
                          "flex h-5 w-5 items-center justify-center rounded border transition-all",
                          selectedUsers.size === paginatedUsers.length
                            ? "border-violet-500 bg-violet-500 text-white"
                            : "border-violet-500/30 hover:border-violet-500/50"
                        )}
                      >
                        {selectedUsers.size === paginatedUsers.length && (
                          <Check className="h-3 w-3" />
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-4 text-left">
                      <button
                        onClick={() => handleSort('nombre_completo')}
                        className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-300/70 hover:text-violet-300"
                      >
                        Usuario
                        <SortIcon field="nombre_completo" />
                      </button>
                    </th>
                    <th className="px-4 py-4 text-left">
                      <span className="text-xs font-semibold uppercase tracking-wider text-violet-300/70">
                        Rol
                      </span>
                    </th>
                    <th className="px-4 py-4 text-left">
                      <span className="text-xs font-semibold uppercase tracking-wider text-violet-300/70">
                        Estado
                      </span>
                    </th>
                    <th className="px-4 py-4 text-left">
                      <button
                        onClick={() => handleSort('fecha_registro')}
                        className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-300/70 hover:text-violet-300"
                      >
                        Registro
                        <SortIcon field="fecha_registro" />
                      </button>
                    </th>
                    <th className="px-4 py-4 text-left">
                      <button
                        onClick={() => handleSort('portfolio_views')}
                        className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-300/70 hover:text-violet-300"
                      >
                        Vistas
                        <SortIcon field="portfolio_views" />
                      </button>
                    </th>
                    <th className="w-16 px-4 py-4" />
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {paginatedUsers.map((user, index) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: index * 0.03 }}
                        className={cn(
                          "border-b border-violet-500/10 transition-colors hover:bg-violet-500/5",
                          selectedUsers.has(user.id) && "bg-violet-500/10"
                        )}
                      >
                        <td className="px-4 py-4">
                          <button
                            onClick={() => handleSelectUser(user.id)}
                            className={cn(
                              "flex h-5 w-5 items-center justify-center rounded border transition-all",
                              selectedUsers.has(user.id)
                                ? "border-violet-500 bg-violet-500 text-white"
                                : "border-violet-500/30 hover:border-violet-500/50"
                            )}
                          >
                            {selectedUsers.has(user.id) && (
                              <Check className="h-3 w-3" />
                            )}
                          </button>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar 
                              src={user.avatar_url} 
                              name={user.nombre_completo} 
                              size="md" 
                              className="border border-violet-500/20"
                            />
                            <div>
                              <p className="font-medium text-white">{user.nombre_completo}</p>
                              <p className="text-sm text-violet-300/60">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">{getRoleBadge(user.rol)}</td>
                        <td className="px-4 py-4">{getStatusBadge(user.status)}</td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-violet-300/80">
                            {formatDate(user.fecha_registro)}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm font-medium text-white">
                            {user.portfolio_views.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="group relative">
                            <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-violet-500/20 text-violet-400 transition-all hover:border-violet-500/40 hover:bg-violet-500/10">
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                            {/* Dropdown */}
                            <div className="invisible absolute right-0 top-full z-50 mt-2 min-w-[200px] rounded-xl border border-violet-500/30 bg-black/95 p-2 opacity-0 shadow-xl backdrop-blur-sm transition-all group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                              <button
                                onClick={() => handleAction('view', user)}
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-violet-300 transition-colors hover:bg-violet-500/10"
                              >
                                <Eye className="h-4 w-4" />
                                Ver Perfil Publico
                              </button>
                              <button
                                onClick={() => handleAction('changeRole', user)}
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-violet-300 transition-colors hover:bg-violet-500/10"
                              >
                                <UserCog className="h-4 w-4" />
                                Cambiar Rol
                              </button>
                              <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-violet-300 transition-colors hover:bg-violet-500/10">
                                <Mail className="h-4 w-4" />
                                Enviar Email
                              </button>
                              <div className="my-2 border-t border-violet-500/20" />
                              {user.status !== 'banned' ? (
                                <button
                                  onClick={() => handleAction('ban', user)}
                                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10"
                                >
                                  <Ban className="h-4 w-4" />
                                  Banear Usuario
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleAction('unban', user)}
                                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-emerald-400 transition-colors hover:bg-emerald-500/10"
                                >
                                  <Shield className="h-4 w-4" />
                                  Desbanear Usuario
                                </button>
                              )}
                            </div>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-violet-500/20 px-6 py-4">
              <p className="text-sm text-violet-300/60">
                Mostrando {(currentPage - 1) * itemsPerPage + 1} a{' '}
                {Math.min(currentPage * itemsPerPage, filteredUsers.length)} de{' '}
                {filteredUsers.length} usuarios
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="border-violet-500/30 bg-transparent text-violet-300 hover:border-violet-500/50 hover:bg-violet-500/10 disabled:opacity-30"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum = i + 1;
                  if (totalPages > 5) {
                    if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                  }
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className={cn(
                        currentPage === pageNum
                          ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white"
                          : "border-violet-500/30 bg-transparent text-violet-300 hover:border-violet-500/50 hover:bg-violet-500/10"
                      )}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="border-violet-500/30 bg-transparent text-violet-300 hover:border-violet-500/50 hover:bg-violet-500/10 disabled:opacity-30"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* User Detail Modal */}
      <Modal
        isOpen={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedUser(null);
        }}
        title="Detalles del Usuario"
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar 
                src={selectedUser.avatar_url} 
                name={selectedUser.nombre_completo} 
                size="xl" 
                className="border-2 border-violet-500/30"
              />
              <div>
                <h3 className="text-xl font-semibold text-white">{selectedUser.nombre_completo}</h3>
                <p className="text-violet-300/70">@{selectedUser.username}</p>
                <div className="mt-2 flex items-center gap-2">
                  {getRoleBadge(selectedUser.rol)}
                  {getStatusBadge(selectedUser.status)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-violet-300/60">Email</p>
                <p className="text-white">{selectedUser.email}</p>
              </div>
              {selectedUser.ubicacion && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-violet-300/60">Ubicacion</p>
                  <p className="flex items-center gap-1 text-white">
                    <MapPin className="h-4 w-4 text-violet-400" />
                    {selectedUser.ubicacion}
                  </p>
                </div>
              )}
              {selectedUser.empresa && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-violet-300/60">Empresa</p>
                  <p className="flex items-center gap-1 text-white">
                    <Building className="h-4 w-4 text-violet-400" />
                    {selectedUser.empresa}
                  </p>
                </div>
              )}
              <div className="space-y-1">
                <p className="text-xs font-medium text-violet-300/60">Fecha de Registro</p>
                <p className="flex items-center gap-1 text-white">
                  <Calendar className="h-4 w-4 text-violet-400" />
                  {formatDate(selectedUser.fecha_registro)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4 text-center">
                <p className="text-2xl font-bold text-white">
                  {selectedUser.portfolio_views.toLocaleString()}
                </p>
                <p className="text-sm text-violet-300/60">Vistas</p>
              </div>
              <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4 text-center">
                <p className="text-2xl font-bold text-white">{selectedUser.proyectos_count}</p>
                <p className="text-sm text-violet-300/60">Proyectos</p>
              </div>
              <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4 text-center">
                <p className="text-2xl font-bold text-white">{selectedUser.conexiones_count}</p>
                <p className="text-sm text-violet-300/60">Conexiones</p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setDetailModalOpen(false)}
                className="border-violet-500/30 text-violet-300 hover:border-violet-500/50 hover:bg-violet-500/10"
              >
                Cerrar
              </Button>
              <Button className="bg-gradient-to-r from-violet-600 to-purple-600 text-white">
                <ExternalLink className="mr-2 h-4 w-4" />
                Ver Portafolio
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Change Role Modal */}
      <Modal
        isOpen={roleModalOpen}
        onClose={() => {
          setRoleModalOpen(false);
          setSelectedUser(null);
        }}
        title="Cambiar Rol de Usuario"
        size="sm"
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Avatar 
                src={selectedUser.avatar_url} 
                name={selectedUser.nombre_completo} 
                size="md" 
              />
              <div>
                <p className="font-medium text-white">{selectedUser.nombre_completo}</p>
                <p className="text-sm text-violet-300/60">Rol actual: {selectedUser.rol}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium text-violet-300/70">Seleccionar nuevo rol (core_types.rol_ethoshub)</p>
              {(['Estandar', 'Reclutador', 'Admin'] as const).map((rol) => (
                <button
                  key={rol}
                  onClick={() => handleChangeRole(rol)}
                  disabled={selectedUser.rol === rol}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all",
                    selectedUser.rol === rol
                      ? "border-violet-500 bg-violet-500/10"
                      : "border-violet-500/20 hover:border-violet-500/40 hover:bg-violet-500/5"
                  )}
                >
                  <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg",
                    rol === 'Admin' && "bg-violet-500/20 text-violet-400",
                    rol === 'Reclutador' && "bg-purple-500/20 text-purple-400",
                    rol === 'Estandar' && "bg-slate-500/20 text-slate-400"
                  )}>
                    {rol === 'Admin' && <Shield className="h-5 w-5" />}
                    {rol === 'Reclutador' && <Briefcase className="h-5 w-5" />}
                    {rol === 'Estandar' && <User className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="font-medium text-white">{rol}</p>
                    <p className="text-xs text-violet-300/60">
                      {rol === 'Admin' && 'Acceso completo al sistema'}
                      {rol === 'Reclutador' && 'Puede buscar y contactar talento'}
                      {rol === 'Estandar' && 'Usuario profesional estandar'}
                    </p>
                  </div>
                  {selectedUser.rol === rol && (
                    <Check className="ml-auto h-5 w-5 text-violet-400" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* Confirm Action Modal */}
      <Modal
        isOpen={confirmModalOpen}
        onClose={() => {
          setConfirmModalOpen(false);
          setConfirmAction(null);
        }}
        title={confirmAction?.type === 'ban' ? 'Confirmar Baneo' : 'Confirmar Desbaneo'}
        size="sm"
      >
        <div className="space-y-6">
          <div className="flex items-center gap-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
            <AlertTriangle className="h-8 w-8 text-amber-400" />
            <p className="text-sm text-amber-200">
              {confirmAction?.type === 'ban'
                ? 'Esta accion baneara al usuario y restringira su acceso a la plataforma.'
                : 'Esta accion reactivara la cuenta del usuario.'}
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setConfirmModalOpen(false)}
              className="border-violet-500/30 text-violet-300 hover:border-violet-500/50 hover:bg-violet-500/10"
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmActionHandler}
              className={cn(
                confirmAction?.type === 'ban'
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-emerald-600 text-white hover:bg-emerald-700"
              )}
            >
              {confirmAction?.type === 'ban' ? (
                <>
                  <Ban className="mr-2 h-4 w-4" />
                  Banear Usuario
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Desbanear Usuario
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
