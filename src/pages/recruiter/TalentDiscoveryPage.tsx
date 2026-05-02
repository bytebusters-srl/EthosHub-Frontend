import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  MapPin,
  Heart,
  ExternalLink,
  X,
  Zap,
  Users,
  Briefcase
} from 'lucide-react';
import { useAuthStore } from '@/store';
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  EmptyState,
} from '@/shared/ui';

// Interface del Backend
export interface BackendTalentProfile {
  profileId: string;
  photoUrl: string | null;
  fullName: string;
  professionalTitle: string;
  location: string;
  seniority: string;
  bioHeadline: string;
  yearsOfExperience: number;
  workModality: string;
  availabilityStatus: string;
  skills: string[];
}

type SeniorityLevel = 'Junior' | 'Mid' | 'Senior' | 'Lead' | 'Architect';
type ExperienceRange = '' | '0-2' | '3-5' | '6-10' | '10+';
type StatusType = '' | 'disponible' | 'ocupado' | 'incognito';
type CategoryType = '' | 'Frontend' | 'Backend' | 'DevOps' | 'Data' | 'Mobile' | 'QA' | 'Systems';

const seniorityOptions: { value: SeniorityLevel | ''; label: string }[] = [
  { value: '', label: 'Todos los niveles' },
  { value: 'Junior', label: 'Junior' },
  { value: 'Mid', label: 'Mid' },
  { value: 'Senior', label: 'Senior' },
  { value: 'Lead', label: 'Lead' },
  { value: 'Architect', label: 'Architect' },
];

const experienceOptions: { value: ExperienceRange; label: string }[] = [
  { value: '', label: 'Cualquier experiencia' },
  { value: '0-2', label: '0 - 2 años' },
  { value: '3-5', label: '3 - 5 años' },
  { value: '6-10', label: '6 - 10 años' },
  { value: '10+', label: 'Más de 10 años' },
];

const statusOptions: { value: StatusType; label: string }[] = [
  { value: '', label: 'Cualquier estado' },
  { value: 'disponible', label: 'Disponible' },
  { value: 'ocupado', label: 'Ocupado' },
  { value: 'incognito', label: 'Incógnito' },
];

const categoryOptions: { value: CategoryType; label: string }[] = [
  { value: '', label: 'Todos los lenguajes' },
  { value: 'Frontend', label: 'Frontend' },
  { value: 'Backend', label: 'Backend' },
  { value: 'DevOps', label: 'DevOps' },
  { value: 'Data', label: 'Data Engineering' },
  { value: 'Mobile', label: 'Mobile' },
  { value: 'QA', label: 'QA / Testing' },
  { value: 'Systems', label: 'Systems' },
];

function normalizeText(value: string) {
  if (!value) return '';
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

// --- TARJETA OPTIMIZADA ---
function TalentCard({ candidate, index, onSaveFavorite, isFavorite }: {
  candidate: BackendTalentProfile;
  index: number;
  onSaveFavorite: (id: string) => void;
  isFavorite: boolean;
}) {
  const navigate = useNavigate();
  const displaySkills = candidate.skills ? candidate.skills.slice(0, 3) : [];
  const remainingSkillsCount = candidate.skills ? candidate.skills.length - 3 : 0;

  const getStatusColor = (status: string) => {
    if (!status) return 'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300';
    const s = status.toLowerCase();
    if (s.includes('disponible') || s === 'available') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400';
    if (s.includes('ocupado') || s === 'busy') return 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400';
    return 'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300';
  };

  const getStatusLabel = (status: string) => {
    if (!status) return 'No especificado';
    const s = status.toLowerCase();
    if (s.includes('disponible') || s === 'available') return 'Disponible';
    if (s.includes('ocupado') || s === 'busy') return 'Ocupado';
    return 'Incógnito';
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="group relative flex h-full flex-col"
    >
      <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-violet-600/0 to-purple-600/0 opacity-0 blur transition-all duration-300 group-hover:from-violet-600/20 group-hover:to-purple-600/20 group-hover:opacity-100" />

      <Card className="relative flex h-full flex-col rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:border-violet-500/50 hover:shadow-lg dark:border-white/10 dark:bg-zinc-950 dark:hover:border-violet-500/50">
        <CardContent className="flex flex-1 flex-col p-5">

          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-1 gap-3">
              <Avatar
                src={candidate.photoUrl || undefined}
                alt={candidate.fullName}
                fallback={candidate.fullName}
                size="xl"
                className="shrink-0 rounded-2xl border-2 border-gray-100 dark:border-white/10"
              />
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-sans text-lg font-bold text-black dark:text-white" title={candidate.fullName}>
                  {candidate.fullName}
                </h3>
                <p className="truncate font-sans text-sm font-medium text-violet-600 dark:text-violet-400" title={candidate.professionalTitle}>
                  {candidate.professionalTitle}
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span className="truncate">{candidate.location || 'No especificada'}</span>
                </div>
              </div>
            </div>
            <Badge className="shrink-0 border-0 bg-gradient-to-r from-violet-600 to-purple-600 font-sans text-[10px] font-semibold text-white shadow-md">
              {candidate.seniority || 'Junior'}
            </Badge>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {displaySkills.map((skill, idx) => (
              <div key={idx} className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1 dark:border-white/10 dark:bg-white/5">
                <Zap className="h-3 w-3 text-violet-500 dark:text-violet-400" />
                <span className="font-sans text-xs font-medium text-gray-700 dark:text-gray-300">{skill}</span>
              </div>
            ))}
            {remainingSkillsCount > 0 && (
              <span className="font-sans text-xs font-medium text-gray-400 dark:text-gray-500">
                +{remainingSkillsCount}
              </span>
            )}
          </div>

          <p className="mt-4 line-clamp-2 font-sans text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {candidate.bioHeadline || 'Sin descripción disponible para este perfil.'}
          </p>

          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <Badge variant="outline" className="border-gray-200 bg-transparent text-gray-600 dark:border-white/10 dark:text-gray-400">
              {candidate.yearsOfExperience || 0}+ años
            </Badge>
            <Badge variant="outline" className="border-gray-200 bg-transparent text-gray-600 dark:border-white/10 dark:text-gray-400">
              {candidate.workModality || 'Remoto'}
            </Badge>
            <Badge className={`border-0 ${getStatusColor(candidate.availabilityStatus)}`}>
              {getStatusLabel(candidate.availabilityStatus)}
            </Badge>
          </div>

          <div className="mt-auto pt-5">
            <div className="flex items-center gap-2">
              <Button
                onClick={() => navigate(`/p/${candidate.profileId}`)}
                className="flex-1 rounded-xl border-0 bg-gradient-to-r from-violet-600 to-purple-600 font-sans text-sm font-medium text-white shadow-md transition-all hover:shadow-lg hover:from-violet-700 hover:to-purple-700"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Ver Perfil
              </Button>
              <button
                onClick={() => onSaveFavorite(candidate.profileId)}
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all ${isFavorite
                  ? 'border-pink-200 bg-pink-50 text-pink-600 dark:border-pink-500/50 dark:bg-pink-500/20 dark:text-pink-400'
                  : 'border-gray-200 bg-gray-50 text-gray-400 hover:text-red-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-500 dark:hover:text-red-400'
                  }`}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

        </CardContent>
      </Card>
    </motion.article>
  );
}

// --- PÁGINA PRINCIPAL ---
export default function TalentDiscoveryPage() {
  const [talents, setTalents] = useState<BackendTalentProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [seniority, setSeniority] = useState<SeniorityLevel | ''>('');
  const [experienceRange, setExperienceRange] = useState<ExperienceRange>('');
  const [statusFilter, setStatusFilter] = useState<StatusType>('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryType>('');

  const [skillFilters, setSkillFilters] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [countryFilters, setCountryFilters] = useState<string[]>([]);
  const [countryInput, setCountryInput] = useState('');

  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/talents')
      .then(res => res.json())
      .then(data => { setTalents(data); setIsLoading(false); })
      .catch(() => setIsLoading(false));
  }, []);

  const filteredCandidates = useMemo(() => {
    return talents.filter(candidate => {
      // 0. EXCLUIR PERFILES INCOMPLETOS / NUEVOS
      if (
        candidate.professionalTitle === 'Por definir' ||
        normalizeText(candidate.fullName) === normalizeText('Usuario Nuevo')
      ) {
        return false;
      }

      const query = normalizeText(searchQuery);
      if (query && !normalizeText(candidate.fullName + candidate.professionalTitle).includes(query)) return false;
      if (seniority && candidate.seniority !== seniority) return false;

      if (statusFilter && candidate.availabilityStatus) {
        const s = candidate.availabilityStatus.toLowerCase();
        if (statusFilter === 'disponible' && !(s.includes('disponible') || s === 'available')) return false;
        if (statusFilter === 'ocupado' && !(s.includes('ocupado') || s === 'busy')) return false;
        if (statusFilter === 'incognito' && !(s.includes('incognito') || s === 'offline')) return false;
      }

      if (experienceRange) {
        const years = candidate.yearsOfExperience || 0;
        if (experienceRange === '0-2' && years > 2) return false;
        if (experienceRange === '3-5' && (years < 3 || years > 5)) return false;
        if (experienceRange === '6-10' && (years < 6 || years > 10)) return false;
        if (experienceRange === '10+' && years < 10) return false;
      }

      if (categoryFilter) {
        const cat = normalizeText(categoryFilter);
        const inTitle = normalizeText(candidate.professionalTitle).includes(cat);
        const inSkills = candidate.skills?.some(s => normalizeText(s).includes(cat));
        if (!inTitle && !inSkills) return false;
      }

      if (skillFilters.length > 0) {
        const cSkills = candidate.skills?.map(s => normalizeText(s)) || [];
        if (!skillFilters.every(f => cSkills.some(cs => cs.includes(normalizeText(f))))) return false;
      }

      if (countryFilters.length > 0) {
        if (!countryFilters.some(f => normalizeText(candidate.location || '').includes(normalizeText(f)))) return false;
      }

      return true;
    });
  }, [talents, searchQuery, seniority, experienceRange, statusFilter, skillFilters, countryFilters, categoryFilter]);

  const addTag = (val: string, list: string[], setList: (l: string[]) => void) => {
    const trimmed = val.trim();
    if (trimmed && list.length < 3 && !list.includes(trimmed)) setList([...list, trimmed]);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/95 px-4 py-4 backdrop-blur-sm dark:border-white/10 dark:bg-zinc-950/95 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <input
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-4 pr-4 text-sm focus:border-violet-500 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
              placeholder="Buscar por nombre o cargo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Badge className="w-fit bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300">
            {filteredCandidates.length} talentos
          </Badge>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-6 p-4 sm:p-6 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-72">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-zinc-950 lg:sticky lg:top-24">
            <div className="mb-5 flex items-center gap-2">
              <Filter className="h-4 w-4 text-violet-600 dark:text-violet-400" />
              <h2 className="font-sans text-sm font-semibold text-black dark:text-white">Filtros Avanzados</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 flex justify-between font-sans text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  <span>Países</span> <span>{countryFilters.length}/3</span>
                </label>
                <input
                  className="mb-2 w-full rounded-lg border border-gray-200 bg-gray-50 p-2 font-sans text-sm focus:border-violet-500 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                  placeholder="Ej: Bolivia, Chile..."
                  value={countryInput}
                  onChange={(e) => setCountryInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { addTag(countryInput, countryFilters, setCountryFilters); setCountryInput(''); } }}
                />
                <div className="flex flex-wrap gap-1">
                  {countryFilters.map(c => (
                    <Badge key={c} className="bg-blue-100 font-sans text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">{c} <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setCountryFilters(countryFilters.filter(x => x !== c))} /></Badge>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 flex justify-between font-sans text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  <span>Skills</span> <span>{skillFilters.length}/3</span>
                </label>
                <input
                  className="mb-2 w-full rounded-lg border border-gray-200 bg-gray-50 p-2 font-sans text-sm focus:border-violet-500 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                  placeholder="Ej: Java, React..."
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { addTag(skillInput, skillFilters, setSkillFilters); setSkillInput(''); } }}
                />
                <div className="flex flex-wrap gap-1">
                  {skillFilters.map(s => (
                    <Badge key={s} className="bg-violet-100 font-sans text-violet-700 dark:bg-violet-500/20 dark:text-violet-300">{s} <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setSkillFilters(skillFilters.filter(x => x !== s))} /></Badge>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block font-sans text-[10px] font-bold uppercase tracking-wider text-gray-400">Experiencia</label>
                <select className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2 font-sans text-sm text-black focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white" value={experienceRange} onChange={(e) => setExperienceRange(e.target.value as ExperienceRange)}>
                  {experienceOptions.map(opt => <option key={opt.value} value={opt.value} className="bg-white text-black dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800">{opt.label}</option>)}
                </select>
              </div>

              <div>
                <label className="mb-2 block font-sans text-[10px] font-bold uppercase tracking-wider text-gray-400">Nivel (Seniority)</label>
                <select className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2 font-sans text-sm text-black focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white" value={seniority} onChange={(e) => setSeniority(e.target.value as SeniorityLevel | '')}>
                  {seniorityOptions.map(opt => <option key={opt.value} value={opt.value} className="bg-white text-black dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800">{opt.label}</option>)}
                </select>
              </div>

              <div>
                <label className="mb-2 block font-sans text-[10px] font-bold uppercase tracking-wider text-gray-400">Disponibilidad</label>
                <select className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2 font-sans text-sm text-black focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as StatusType)}>
                  {statusOptions.map(opt => <option key={opt.value} value={opt.value} className="bg-white text-black dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800">{opt.label}</option>)}
                </select>
              </div>

              <div>
                <label className="mb-2 block font-sans text-[10px] font-bold uppercase tracking-wider text-gray-400">Tipo de Perfil</label>
                <select className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2 font-sans text-sm text-black focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value as CategoryType)}>
                  {categoryOptions.map(opt => <option key={opt.value} value={opt.value} className="bg-white text-black dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800" >{opt.label}</option>)}
                </select>
              </div>

              <Button
                variant="outline"
                className="mt-2 w-full font-sans text-xs hover:bg-gray-50 dark:hover:bg-white/5"
                onClick={() => { setSeniority(''); setExperienceRange(''); setStatusFilter(''); setSkillFilters([]); setCountryFilters([]); setCategoryFilter(''); setSearchQuery(''); }}
              >
                Limpiar Filtros
              </Button>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-80 animate-pulse rounded-2xl bg-gray-200 dark:bg-white/5" />
              ))}
            </div>
          ) : filteredCandidates.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-zinc-950 sm:p-12">
              <EmptyState icon={Briefcase} title="Sin coincidencias" description="Ajusta los filtros para encontrar más profesionales en la base de datos." />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredCandidates.map((candidate, idx) => (
                <TalentCard
                  key={candidate.profileId}
                  candidate={candidate}
                  index={idx}
                  onSaveFavorite={id => {
                    setFavorites(prev => {
                      const next = new Set(prev);
                      next.has(id) ? next.delete(id) : next.add(id);
                      return next;
                    });
                  }}
                  isFavorite={favorites.has(candidate.profileId)}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
} 