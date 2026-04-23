import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Command,
  Filter,
  MapPin,
  Heart,
  ExternalLink,
  Briefcase,
  Star,
  X,
  ChevronDown,
  Sparkles,
  Globe,
  Building,
  Zap,
  Users,
} from 'lucide-react';
import { useAuthStore } from '@/store';
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  Input,
  Skeleton,
} from '@/shared/ui';
import { recruiterTalentProfiles } from '@/shared/mocks/recruiterTalent';
import { EthosCoreLogo } from '@/components/brand/EthosCoreLogo';

// Core Types from SQL Schema
type SeniorityLevel = 'Junior' | 'Mid' | 'Senior' | 'Lead' | 'Architect';
type RoleType = 'Estandar' | 'Profesional';
type SkillCategory = 'Software' | 'Networking' | 'Systems' | 'Frontend' | 'Backend' | 'DevOps' | 'Data' | 'Mobile' | 'QA';
type LocationType = 'Remote' | 'On-site' | 'Hybrid';

const seniorityOptions: { value: SeniorityLevel | ''; label: string }[] = [
  { value: '', label: 'Todos los niveles' },
  { value: 'Junior', label: 'Junior' },
  { value: 'Mid', label: 'Mid' },
  { value: 'Senior', label: 'Senior' },
  { value: 'Lead', label: 'Lead' },
  { value: 'Architect', label: 'Architect' },
];

const roleOptions: { value: RoleType | ''; label: string }[] = [
  { value: '', label: 'Todos los roles' },
  { value: 'Estandar', label: 'Estandar' },
  { value: 'Profesional', label: 'Profesional' },
];

const skillCategories: { value: SkillCategory | ''; label: string }[] = [
  { value: '', label: 'Todas las categorias' },
  { value: 'Frontend', label: 'Frontend' },
  { value: 'Backend', label: 'Backend' },
  { value: 'DevOps', label: 'DevOps' },
  { value: 'Data', label: 'Data Engineering' },
  { value: 'Mobile', label: 'Mobile' },
  { value: 'QA', label: 'QA / Testing' },
  { value: 'Networking', label: 'Networking' },
  { value: 'Systems', label: 'Systems' },
];

const locationOptions: { value: LocationType | ''; label: string }[] = [
  { value: '', label: 'Cualquier ubicacion' },
  { value: 'Remote', label: 'Remoto' },
  { value: 'On-site', label: 'Presencial' },
  { value: 'Hybrid', label: 'Hibrido' },
];

const smartSearches = ['React', 'Java', 'Python', 'AWS', 'TypeScript', 'Node.js', 'Kubernetes', 'SQL'];

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

// Skeleton loading component
function TalentCardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-zinc-950">
      <div className="flex items-start gap-4">
        <div className="h-16 w-16 animate-pulse rounded-2xl bg-gray-200 dark:bg-white/10" />
        <div className="flex-1 space-y-3">
          <div className="h-5 w-3/4 animate-pulse rounded-lg bg-gray-200 dark:bg-white/10" />
          <div className="h-4 w-1/2 animate-pulse rounded-lg bg-gray-200 dark:bg-white/10" />
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200 dark:bg-white/10" />
        <div className="h-6 w-24 animate-pulse rounded-full bg-gray-200 dark:bg-white/10" />
        <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200 dark:bg-white/10" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 w-full animate-pulse rounded bg-gray-200 dark:bg-white/10" />
        <div className="h-3 w-4/5 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
      </div>
    </div>
  );
}

// Talent Card Component
function TalentCard({ 
  candidate, 
  index,
  onSaveFavorite,
  isFavorite 
}: { 
  candidate: typeof recruiterTalentProfiles[number];
  index: number;
  onSaveFavorite: (id: string) => void;
  isFavorite: boolean;
}) {
  const navigate = useNavigate();
  const topSkills = candidate.hardSkills
    .filter((skill) => skill.isTop)
    .slice(0, 3);
  
  const seniority = candidate.hardSkills.find(s => s.isTop)?.level || 'Mid';

  return (
    <motion.article
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="group relative"
    >
      <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-violet-600/0 to-purple-600/0 opacity-0 blur transition-all duration-300 group-hover:from-violet-600/20 group-hover:to-purple-600/20 group-hover:opacity-100" />
      <Card className="relative h-full rounded-2xl border border-gray-200 bg-white p-0 transition-all duration-300 hover:border-violet-500/50 hover:shadow-lg dark:border-white/10 dark:bg-zinc-950 dark:hover:border-violet-500/50">
        <CardContent className="p-5">
          {/* Header with Avatar and Name */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 gap-4">
              <Avatar
                src={candidate.user.avatar}
                alt={candidate.user.name}
                fallback={candidate.user.name}
                size="xl"
                className="rounded-2xl border-2 border-gray-100 shadow-sm dark:border-white/10 dark:shadow-none"
              />
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-sans text-lg font-bold text-black dark:text-white">
                  {candidate.user.name}
                </h3>
                <p className="truncate font-sans text-sm font-medium text-violet-600 dark:text-violet-400">
                  {candidate.expectedRole}
                </p>
                <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <MapPin className="h-3 w-3" />
                  <span>{candidate.user.location}</span>
                </div>
              </div>
            </div>
            
            {/* Seniority Badge */}
            <Badge className="shrink-0 border-0 bg-gradient-to-r from-violet-600 to-purple-600 font-sans text-xs font-semibold text-white shadow-md">
              {seniority}
            </Badge>
          </div>

          {/* Top 3 Skills - Mini Cards */}
          <div className="mt-4 flex flex-wrap gap-2">
            {topSkills.map((skill) => (
              <div
                key={skill.name}
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 transition-colors hover:border-violet-300 dark:border-white/10 dark:bg-white/5 dark:hover:border-violet-500/40"
              >
                <Zap className="h-3 w-3 text-violet-500 dark:text-violet-400" />
                <span className="font-sans text-xs font-medium text-gray-700 dark:text-gray-300">{skill.name}</span>
              </div>
            ))}
          </div>

          {/* Quick Preview Bio */}
          <p className="mt-4 line-clamp-2 font-sans text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {candidate.summary}
          </p>

          {/* Context Tags */}
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <Badge variant="outline" className="border-gray-200 bg-transparent text-gray-600 dark:border-white/10 dark:text-gray-400">
              {candidate.experienceYears}+ anos
            </Badge>
            <Badge variant="outline" className="border-gray-200 bg-transparent text-gray-600 dark:border-white/10 dark:text-gray-400">
              {candidate.workMode}
            </Badge>
            <Badge 
              className={`border-0 ${
                candidate.availability === 'Disponible' 
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' 
                  : candidate.availability === 'Entrevistas'
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                  : 'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-400'
              }`}
            >
              {candidate.availability}
            </Badge>
          </div>

          {/* Actions */}
          <div className="mt-5 flex items-center gap-2">
            <Button
              onClick={() => navigate(`/p/${candidate.user.slug}`)}
              className="flex-1 rounded-xl border-0 bg-gradient-to-r from-violet-600 to-purple-600 font-sans text-sm font-medium text-white shadow-md transition-all hover:shadow-lg"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Ver Perfil Completo
            </Button>
            <button
              onClick={() => onSaveFavorite(candidate.user.id)}
              className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all ${
                isFavorite
                  ? 'border-pink-200 bg-pink-50 text-pink-600 dark:border-pink-500/50 dark:bg-pink-500/20 dark:text-pink-400'
                  : 'border-gray-200 bg-gray-50 text-gray-400 hover:text-red-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-500 dark:hover:text-red-400'
              }`}
              aria-label={isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.article>
  );
}

export default function TalentDiscoveryPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  // Search state
  const [searchDraft, setSearchDraft] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCommandSearch, setShowCommandSearch] = useState(false);
  
  // Filter state
  const [seniority, setSeniority] = useState<SeniorityLevel | ''>('');
  const [role, setRole] = useState<RoleType | ''>('');
  const [skillCategory, setSkillCategory] = useState<SkillCategory | ''>('');
  const [location, setLocation] = useState<LocationType | ''>('');
  const [showFilters, setShowFilters] = useState(true);
  
  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Keyboard shortcut for Command + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandSearch(true);
      }
      if (e.key === 'Escape') {
        setShowCommandSearch(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter candidates
  const filteredCandidates = useMemo(() => {
    return recruiterTalentProfiles.filter((candidate) => {
      const normalizedQuery = normalizeText(searchQuery);
      
      if (normalizedQuery) {
        const searchableText = normalizeText(
          [
            candidate.user.name,
            candidate.user.profession,
            candidate.user.headline,
            candidate.summary,
            candidate.expectedRole,
            candidate.user.location,
            ...candidate.hardSkills.map(s => s.name),
            ...candidate.softSkills,
          ].join(' ')
        );
        if (!searchableText.includes(normalizedQuery)) {
          return false;
        }
      }

      if (seniority) {
        const hasSeniority = candidate.hardSkills.some(skill => skill.level === seniority);
        if (!hasSeniority) return false;
      }

      if (skillCategory) {
        const hasCategory = candidate.hardSkills.some(skill => 
          normalizeText(skill.category).includes(normalizeText(skillCategory))
        );
        if (!hasCategory) return false;
      }

      if (location) {
        const workModeMap: Record<LocationType, string> = {
          'Remote': 'Remoto',
          'On-site': 'Presencial',
          'Hybrid': 'Hibrido',
        };
        if (candidate.workMode !== workModeMap[location]) return false;
      }

      return true;
    });
  }, [searchQuery, seniority, role, skillCategory, location]);

  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timeout);
  }, [searchQuery, seniority, role, skillCategory, location]);

  const handleSearch = (value?: string) => {
    const query = (value ?? searchDraft).trim();
    setSearchDraft(query);
    setSearchQuery(query);
    setShowCommandSearch(false);
  };

  const clearFilters = () => {
    setSeniority('');
    setRole('');
    setSkillCategory('');
    setLocation('');
    setSearchDraft('');
    setSearchQuery('');
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const activeFilterCount = [seniority, role, skillCategory, location].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Command+K Search Modal */}
      <AnimatePresence>
        {showCommandSearch && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm dark:bg-black/80"
              onClick={() => setShowCommandSearch(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="fixed left-1/2 top-1/4 z-50 w-full max-w-2xl -translate-x-1/2 rounded-2xl border border-gray-200 bg-white p-2 shadow-2xl dark:border-white/10 dark:bg-zinc-950"
            >
              <div className="flex items-center gap-3 border-b border-gray-100 px-4 pb-3 pt-2 dark:border-white/10">
                <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  value={searchDraft}
                  onChange={(e) => setSearchDraft(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Buscar talento por skill, rol, nombre..."
                  className="flex-1 bg-transparent font-sans text-lg text-black placeholder:text-gray-400 focus:outline-none dark:text-white dark:placeholder:text-gray-500"
                  autoFocus
                />
                <kbd className="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1 font-sans text-xs text-gray-500 dark:border-white/10 dark:bg-white/10 dark:text-gray-400">
                  ESC
                </kbd>
              </div>
              <div className="p-3">
                <p className="mb-2 px-2 font-sans text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Busquedas rapidas
                </p>
                <div className="flex flex-wrap gap-2">
                  {smartSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleSearch(term)}
                      className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 font-sans text-sm text-gray-600 transition-colors hover:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Header with Logo - Z-INDEX 10 PARA QUE NO TAPE EL MENÚ DEL LAYOUT */}
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/95 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/95">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <EthosCoreLogo size="sm" variant="lilac" />
            <div className="hidden h-6 w-px bg-gray-200 md:block dark:bg-white/10" />
            <h1 className="hidden font-sans text-lg font-semibold text-black md:block dark:text-white">
              Talent Discovery
            </h1>
          </div>
          
          {/* Command + K Search Bar */}
          <button
            onClick={() => setShowCommandSearch(true)}
            className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 transition-all hover:bg-gray-100 dark:border-white/10 dark:bg-black/50 dark:hover:bg-white/5"
          >
            <Search className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="font-sans text-sm text-gray-500 dark:text-gray-400">Buscar talento...</span>
            <kbd className="ml-8 flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-0.5 font-sans text-xs text-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-400">
              <Command className="h-3 w-3" />
              K
            </kbd>
          </button>

          <div className="flex items-center gap-2">
            <Badge className="border-0 bg-violet-100 font-sans text-xs text-violet-700 dark:bg-violet-500/20 dark:text-violet-300">
              {filteredCandidates.length} talentos
            </Badge>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.aside
                initial={{ opacity: 0, x: -20, width: 0 }}
                animate={{ opacity: 1, x: 0, width: 280 }}
                exit={{ opacity: 0, x: -20, width: 0 }}
                className="hidden shrink-0 lg:block"
              >
                <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-zinc-950">
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                      <h2 className="font-sans text-sm font-semibold text-black dark:text-white">Filtros</h2>
                    </div>
                    {activeFilterCount > 0 && (
                      <Badge className="border-0 bg-violet-100 text-xs text-violet-600 dark:bg-violet-500/20 dark:text-violet-300">
                        {activeFilterCount} activos
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-5">
                    {/* Seniority Filter */}
                    <div>
                      <label className="mb-2 block font-sans text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Seniority
                      </label>
                      <select
                        value={seniority}
                        onChange={(e) => setSeniority(e.target.value as SeniorityLevel | '')}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 font-sans text-sm text-black transition-colors focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-white/10 dark:bg-black dark:text-white dark:focus:border-violet-500"
                      >
                        {seniorityOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Role Filter */}
                    <div>
                      <label className="mb-2 block font-sans text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Tipo de Rol
                      </label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value as RoleType | '')}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 font-sans text-sm text-black transition-colors focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-white/10 dark:bg-black dark:text-white dark:focus:border-violet-500"
                      >
                        {roleOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Skill Category Filter */}
                    <div>
                      <label className="mb-2 block font-sans text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Categoria de Skills
                      </label>
                      <select
                        value={skillCategory}
                        onChange={(e) => setSkillCategory(e.target.value as SkillCategory | '')}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 font-sans text-sm text-black transition-colors focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-white/10 dark:bg-black dark:text-white dark:focus:border-violet-500"
                      >
                        {skillCategories.map(opt => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Location Filter */}
                    <div>
                      <label className="mb-2 block font-sans text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Ubicacion
                      </label>
                      <select
                        value={location}
                        onChange={(e) => setLocation(e.target.value as LocationType | '')}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 font-sans text-sm text-black transition-colors focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-white/10 dark:bg-black dark:text-white dark:focus:border-violet-500"
                      >
                        {locationOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Clear Filters */}
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="w-full rounded-xl border-gray-200 bg-white font-sans text-sm text-black hover:bg-gray-50 dark:border-white/20 dark:bg-transparent dark:text-white dark:hover:bg-white/5"
                    >
                      Limpiar filtros
                    </Button>
                  </div>

                  {/* Pro Tip */}
                  <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/5">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                      <p className="font-sans text-xs font-semibold text-black dark:text-white">Tip de busqueda</p>
                    </div>
                    <p className="mt-2 font-sans text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                      Usa <kbd className="rounded bg-gray-200 px-1.5 py-0.5 text-gray-600 dark:bg-white/20 dark:text-gray-300">Cmd+K</kbd> para 
                      busqueda rapida o combina filtros para resultados precisos.
                    </p>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Main Content - Talent Grid */}
          <main className="flex-1">
            {/* Stats Bar */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-zinc-950"
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 font-sans text-sm text-black transition-colors hover:bg-gray-100 lg:hidden dark:border-white/10 dark:bg-black/50 dark:text-white dark:hover:bg-white/5"
                >
                  <Filter className="h-4 w-4" />
                  Filtros
                </button>
                <div>
                  <h2 className="font-sans text-lg font-semibold text-black dark:text-white">
                    {searchQuery ? `Resultados para "${searchQuery}"` : 'Explorar Talento'}
                  </h2>
                  <p className="font-sans text-sm text-gray-500 dark:text-gray-400">
                    {isLoading ? 'Buscando...' : `${filteredCandidates.length} profesionales encontrados`}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 dark:border-white/10 dark:bg-white/5">
                  <Users className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                  <span className="font-sans text-sm text-black dark:text-white">{recruiterTalentProfiles.length} total</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-pink-200 bg-pink-50 px-3 py-2 dark:border-pink-500/20 dark:bg-pink-500/10">
                  <Heart className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                  <span className="font-sans text-sm text-pink-700 dark:text-pink-300">{favorites.size} guardados</span>
                </div>
              </div>
            </motion.div>

            {/* Talent Grid - Pinterest/Bento Style */}
            {isLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <TalentCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredCandidates.length === 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-white p-12 dark:border-white/10 dark:bg-zinc-950">
                <EmptyState
                  icon={Briefcase}
                  title="No se encontraron candidatos"
                  description="Intenta ajustar los filtros o usar terminos de busqueda mas generales."
                  action={{
                    label: 'Limpiar filtros',
                    onClick: clearFilters,
                  }}
                />
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredCandidates.map((candidate, index) => (
                  <TalentCard
                    key={candidate.user.id}
                    candidate={candidate}
                    index={index}
                    onSaveFavorite={toggleFavorite}
                    isFavorite={favorites.has(candidate.user.id)}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
