import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import {
  Users,
  Folder,
  UserPlus,
  Activity,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Terminal,
  Server,
  Database,
  Globe,
  Zap,
  Clock,
  RefreshCw,
} from 'lucide-react';
import { Button, Card, Badge } from '@/shared/ui';
import { cn } from '@/shared/lib/utils';

// Time range options
const timeRanges = [
  { label: '7d', value: 7 },
  { label: '30d', value: 30 },
  { label: '90d', value: 90 },
  { label: '1y', value: 365 },
];

// KPI Stats with dynamic values
const getKpiStats = () => [
  {
    label: 'Total Usuarios',
    value: '12,847',
    change: '+12.5%',
    trend: 'up' as const,
    icon: Users,
    description: 'core.users',
  },
  {
    label: 'Portafolios Activos',
    value: '8,234',
    change: '+8.2%',
    trend: 'up' as const,
    icon: Folder,
    description: 'core.profiles',
  },
  {
    label: 'Nuevos (24h)',
    value: '156',
    change: '+24.3%',
    trend: 'up' as const,
    icon: UserPlus,
    description: 'Ultimas 24 horas',
  },
  {
    label: 'Salud Sistema',
    value: '99.9%',
    change: '+0.1%',
    trend: 'up' as const,
    icon: Activity,
    description: 'Uptime global',
  },
];

// User growth data generator
const generateGrowthData = (days: number) => {
  const data = [];
  const baseUsers = 10000;
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
      usuarios: Math.floor(baseUsers + (days - i) * 95 + Math.random() * 50),
      activos: Math.floor((baseUsers + (days - i) * 95) * 0.75 + Math.random() * 30),
    });
  }
  return data;
};

// Role distribution data (core_types.rol_ethoshub)
const roleDistribution = [
  { name: 'Estandar', value: 9850, color: '#8B5CF6' },
  { name: 'Reclutador', value: 2847, color: '#D8B4FE' },
  { name: 'Admin', value: 150, color: '#A78BFA' },
];

// Top skills data (from portfolio.skills)
const topSkills = [
  { name: 'React', count: 4523, growth: '+12%' },
  { name: 'TypeScript', count: 3987, growth: '+18%' },
  { name: 'Python', count: 3654, growth: '+8%' },
  { name: 'Node.js', count: 3421, growth: '+5%' },
  { name: 'AWS', count: 2987, growth: '+22%' },
];

// System logs mock (admin.system_logs)
const systemLogMessages = [
  { type: 'info', message: '[AUTH] Usuario profesional@ethoshub.com inicio sesion', timestamp: '' },
  { type: 'success', message: '[PORTFOLIO] Nuevo portafolio creado por @anamartinez', timestamp: '' },
  { type: 'info', message: '[SKILL] Skill "GraphQL" agregado por 3 usuarios', timestamp: '' },
  { type: 'warning', message: '[RATE_LIMIT] IP 192.168.1.45 alcanzo limite de requests', timestamp: '' },
  { type: 'success', message: '[PROJECT] Proyecto "E-commerce App" publicado', timestamp: '' },
  { type: 'info', message: '[SEARCH] Query "React developer Madrid" ejecutada', timestamp: '' },
  { type: 'error', message: '[DB] Conexion timeout - reconectando...', timestamp: '' },
  { type: 'success', message: '[DB] Conexion restablecida exitosamente', timestamp: '' },
  { type: 'info', message: '[AUTH] Usuario reclutador@ethoshub.com inicio sesion', timestamp: '' },
  { type: 'success', message: '[MATCH] 5 candidatos encontrados para vacante #1234', timestamp: '' },
  { type: 'warning', message: '[SECURITY] Intento de login fallido detectado', timestamp: '' },
  { type: 'info', message: '[ANALYTICS] Reporte semanal generado', timestamp: '' },
];

// Custom Tooltip for charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-violet-500/30 bg-black/95 px-4 py-3 shadow-xl backdrop-blur-sm">
        <p className="mb-2 text-sm font-medium text-violet-300">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminDashboardPage() {
  const [selectedRange, setSelectedRange] = useState(30);
  const [growthData, setGrowthData] = useState(generateGrowthData(30));
  const [logs, setLogs] = useState<typeof systemLogMessages>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const kpiStats = getKpiStats();

  // Update growth data when range changes
  useEffect(() => {
    setGrowthData(generateGrowthData(selectedRange));
  }, [selectedRange]);

  // Simulate live system logs
  useEffect(() => {
    const interval = setInterval(() => {
      const randomLog = systemLogMessages[Math.floor(Math.random() * systemLogMessages.length)];
      const timestamp = new Date().toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      });
      setLogs(prev => [...prev.slice(-29), { 
        ...randomLog, 
        timestamp,
        message: randomLog.message 
      }]);
    }, 2500);

    // Initial logs
    const now = new Date();
    setLogs(systemLogMessages.slice(0, 8).map((log, i) => ({
      ...log,
      timestamp: new Date(now.getTime() - i * 3000).toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      })
    })));

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setGrowthData(generateGrowthData(selectedRange));
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="min-h-screen space-y-6 bg-black p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-sans text-3xl font-bold tracking-tight text-white">
            Metricas Globales
          </h1>
          <p className="mt-1 text-violet-300/70">Centro de control de EthosHub</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="border-violet-500/30 bg-transparent text-violet-300 hover:border-violet-500/50 hover:bg-violet-500/10"
          >
            <RefreshCw className={cn("mr-2 h-4 w-4", isRefreshing && "animate-spin")} />
            Actualizar
          </Button>
          <div className="flex items-center rounded-lg border border-violet-500/30 bg-black/60 p-1">
            {timeRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => setSelectedRange(range.value)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-all",
                  selectedRange === range.value
                    ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/25"
                    : "text-violet-300/70 hover:text-violet-300"
                )}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Stats - Bento Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <div className="group relative overflow-hidden rounded-xl border border-violet-500/20 bg-black p-6 transition-all hover:border-violet-500/40">
              {/* Lilac glow effect */}
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-violet-500/20 blur-3xl transition-all group-hover:bg-violet-500/30" />
              <div className="pointer-events-none absolute -bottom-10 -left-10 h-24 w-24 rounded-full bg-purple-500/10 blur-2xl" />
              
              <div className="relative flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/25">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <Badge
                  variant="secondary"
                  className={cn(
                    "border-0",
                    stat.trend === 'up' 
                      ? "bg-emerald-500/15 text-emerald-400" 
                      : "bg-red-500/15 text-red-400"
                  )}
                >
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="mr-1 h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="mr-1 h-3 w-3" />
                  )}
                  {stat.change}
                </Badge>
              </div>
              <div className="relative mt-4">
                <p className="font-sans text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-sm font-medium text-violet-300">{stat.label}</p>
                <p className="mt-1 text-xs text-violet-400/60">{stat.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* User Growth Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <div className="rounded-xl border border-violet-500/20 bg-black p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-sans text-lg font-semibold text-white">Crecimiento de Usuarios</h2>
                <p className="text-sm text-violet-300/60">Ultimos {selectedRange} dias</p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-violet-500 shadow-sm shadow-violet-500/50" />
                  <span className="text-violet-300/70">Total</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-purple-300 shadow-sm shadow-purple-300/50" />
                  <span className="text-violet-300/70">Activos</span>
                </div>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthData}>
                  <defs>
                    <linearGradient id="colorUsuarios" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.5} />
                      <stop offset="50%" stopColor="#8B5CF6" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorActivos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#D8B4FE" stopOpacity={0.4} />
                      <stop offset="50%" stopColor="#D8B4FE" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#D8B4FE" stopOpacity={0} />
                    </linearGradient>
                    {/* Glow filter */}
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" strokeOpacity={0.5} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#71717a" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#71717a" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="usuarios"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorUsuarios)"
                    name="Total Usuarios"
                    filter="url(#glow)"
                  />
                  <Area
                    type="monotone"
                    dataKey="activos"
                    stroke="#D8B4FE"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorActivos)"
                    name="Usuarios Activos"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Role Distribution Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="h-full rounded-xl border border-violet-500/20 bg-black p-6">
            <div className="mb-4">
              <h2 className="font-sans text-lg font-semibold text-white">Distribucion por Rol</h2>
              <p className="text-sm text-violet-300/60">core_types.rol_ethoshub</p>
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    <filter id="pieGlow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  <Pie
                    data={roleDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    filter="url(#pieGlow)"
                  >
                    {roleDistribution.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color}
                        strokeWidth={0}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="mt-4 space-y-2">
              {roleDistribution.map((role) => {
                const total = roleDistribution.reduce((sum, r) => sum + r.value, 0);
                const percentage = ((role.value / total) * 100).toFixed(1);
                return (
                  <div key={role.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="h-3 w-3 rounded-full shadow-sm" 
                        style={{ backgroundColor: role.color, boxShadow: `0 0 8px ${role.color}50` }} 
                      />
                      <span className="text-violet-300/80">{role.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{role.value.toLocaleString()}</span>
                      <span className="text-violet-400/60">({percentage}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Skills Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="rounded-xl border border-violet-500/20 bg-black p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-sans text-lg font-semibold text-white">Top 5 Skills</h2>
                <p className="text-sm text-violet-300/60">Habilidades mas agregadas en la plataforma</p>
              </div>
              <Badge variant="secondary" className="border-0 bg-violet-500/15 text-violet-300">
                <TrendingUp className="mr-1 h-3 w-3" />
                En crecimiento
              </Badge>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topSkills} layout="vertical" barCategoryGap="20%">
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#D8B4FE" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" strokeOpacity={0.5} horizontal={false} />
                  <XAxis 
                    type="number" 
                    stroke="#71717a" 
                    fontSize={12} 
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    stroke="#a78bfa" 
                    fontSize={12} 
                    tickLine={false}
                    axisLine={false}
                    width={80}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="count" 
                    fill="url(#barGradient)" 
                    radius={[0, 6, 6, 0]}
                    name="Usuarios"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Growth indicators */}
            <div className="mt-4 flex flex-wrap gap-2">
              {topSkills.map((skill) => (
                <div 
                  key={skill.name}
                  className="flex items-center gap-1.5 rounded-full border border-violet-500/20 bg-violet-500/10 px-2.5 py-1 text-xs"
                >
                  <span className="text-violet-300">{skill.name}</span>
                  <span className="text-emerald-400">{skill.growth}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Live System Logs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="rounded-xl border border-violet-500/20 bg-black p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/20 to-purple-500/20">
                  <Terminal className="h-5 w-5 text-violet-400" />
                </div>
                <div>
                  <h2 className="font-sans text-lg font-semibold text-white">System Logs</h2>
                  <p className="text-xs text-violet-300/60">admin.system_logs</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="text-xs font-medium text-emerald-400">LIVE</span>
              </div>
            </div>
            <div 
              ref={logContainerRef}
              className="h-72 overflow-y-auto rounded-lg border border-violet-500/10 bg-black/80 p-4 font-mono text-xs scrollbar-hide"
              style={{ scrollBehavior: 'smooth' }}
            >
              <AnimatePresence mode="popLayout">
                {logs.map((log, index) => (
                  <motion.div
                    key={`${index}-${log.timestamp}`}
                    initial={{ opacity: 0, x: -10, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: 'auto' }}
                    exit={{ opacity: 0 }}
                    className={cn(
                      'mb-1.5 flex items-start gap-2 leading-relaxed',
                    )}
                  >
                    <span className="shrink-0 text-violet-500/60">[{log.timestamp}]</span>
                    <span className={cn(
                      log.type === 'info' && 'text-violet-300',
                      log.type === 'success' && 'text-emerald-400',
                      log.type === 'warning' && 'text-amber-400',
                      log.type === 'error' && 'text-red-400'
                    )}>
                      {log.message}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div className="mt-2 flex items-center gap-1">
                <span className="animate-pulse text-violet-500">_</span>
                <span className="text-violet-500/40">Esperando logs...</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* System Health Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="rounded-xl border border-violet-500/20 bg-black p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="font-sans text-lg font-semibold text-white">Estado del Sistema</h2>
              <p className="text-sm text-violet-300/60">Monitoreo en tiempo real</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-emerald-400">
              <Clock className="h-4 w-4" />
              Ultima actualizacion: hace 5s
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { name: 'API Server', icon: Server, status: 'healthy', latency: '45ms', uptime: '99.99%' },
              { name: 'Database', icon: Database, status: 'healthy', latency: '12ms', uptime: '99.95%' },
              { name: 'CDN', icon: Globe, status: 'healthy', latency: '8ms', uptime: '100%' },
              { name: 'Auth Service', icon: Zap, status: 'healthy', latency: '23ms', uptime: '99.98%' },
            ].map((service, index) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className="group relative flex flex-col items-center gap-3 overflow-hidden rounded-xl border border-violet-500/20 bg-black/60 p-5 transition-all hover:border-violet-500/40"
              >
                {/* Animated background pulse */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                
                <div className="relative">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 transition-all group-hover:from-violet-500/30 group-hover:to-purple-500/30">
                    <service.icon className="h-7 w-7 text-violet-400" />
                  </div>
                  {/* Status indicator */}
                  <span className="absolute -right-1 -top-1 flex h-4 w-4">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50">
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    </span>
                  </span>
                </div>
                <div className="relative text-center">
                  <p className="font-sans font-medium text-white">{service.name}</p>
                  <div className="mt-1 flex items-center justify-center gap-2 text-xs">
                    <span className="text-emerald-400">{service.latency}</span>
                    <span className="text-violet-500">|</span>
                    <span className="text-violet-300/70">{service.uptime}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
