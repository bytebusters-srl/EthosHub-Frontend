import { useEffect, useMemo, useState, type ElementType } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Filter,
  MapPin,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  Users,
  Zap,
} from 'lucide-react';
import { useAuthStore } from '@/store';
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  EmptyState,
  Input,
  Select,
  Skeleton,
} from '@/shared/ui';
import { recruiterTalentProfiles } from '@/shared/mocks/recruiterTalent';

type SkillScope = 'all' | 'hard' | 'soft';
type LevelFilter = '' | 'Junior' | 'Mid' | 'Senior';
type WorkModeFilter = '' | 'Remoto' | 'Hibrido' | 'Presencial';
type AvailabilityFilter = '' | 'Disponible' | 'Entrevistas' | 'Explorando';

const RESULTS_PER_PAGE = 10;
const smartSearches = ['React', 'Java', 'JavaScript', 'Python', 'AWS', 'Cobol'];

const scopeOptions = [
  { value: 'all', label: 'Todas las habilidades' },
  { value: 'hard', label: 'Solo hard skills' },
  { value: 'soft', label: 'Solo soft skills' },
];

const levelOptions = [
  { value: '', label: 'Todos los niveles' },
  { value: 'Junior', label: 'Junior' },
  { value: 'Mid', label: 'Mid' },
  { value: 'Senior', label: 'Senior' },
];

const workModeOptions = [
  { value: '', label: 'Cualquier modalidad' },
  { value: 'Remoto', label: 'Remoto' },
  { value: 'Hibrido', label: 'Hibrido' },
  { value: 'Presencial', label: 'Presencial' },
];

const availabilityOptions = [
  { value: '', label: 'Cualquier disponibilidad' },
  { value: 'Disponible', label: 'Disponible' },
  { value: 'Entrevistas', label: 'En entrevistas' },
  { value: 'Explorando', label: 'Explorando' },
];

const locationOptions = [
  { value: '', label: 'Todas las ubicaciones' },
  ...Array.from(new Set(recruiterTalentProfiles.map((profile) => profile.user.location))).map(
    (location) => ({
      value: location,
      label: location,
    })
  ),
];

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function getCandidateMatches(candidate: (typeof recruiterTalentProfiles)[number], query: string, scope: SkillScope) {
  const normalizedQuery = normalizeText(query);
  const candidateText = normalizeText(
    [
      candidate.user.name,
      candidate.user.profession,
      candidate.user.headline,
      candidate.summary,
      candidate.expectedRole,
      candidate.user.location,
    ]
      .filter(Boolean)
      .join(' ')
  );

  const hardMatches =
    scope === 'soft'
      ? []
      : candidate.hardSkills.filter((skill) =>
          normalizeText(`${skill.name} ${skill.category} ${skill.level}`).includes(normalizedQuery)
        );
  const softMatches =
    scope === 'hard'
      ? []
      : candidate.softSkills.filter((skill) => normalizeText(skill).includes(normalizedQuery));

  const hasTextMatch = normalizedQuery ? candidateText.includes(normalizedQuery) : true;
  const hasSkillMatch = hardMatches.length > 0 || softMatches.length > 0;

  return {
    hardMatches,
    softMatches,
    matchesQuery: normalizedQuery ? hasTextMatch || hasSkillMatch : true,
  };
}

export default function RecruiterTalentSearchPage() {
  const { user } = useAuthStore();
  const [searchDraft, setSearchDraft] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [scope, setScope] = useState<SkillScope>('all');
  const [level, setLevel] = useState<LevelFilter>('');
  const [workMode, setWorkMode] = useState<WorkModeFilter>('');
  const [availability, setAvailability] = useState<AvailabilityFilter>('');
  const [location, setLocation] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCandidates, setVisibleCandidates] = useState(recruiterTalentProfiles);

  const filteredCandidates = useMemo(() => {
    return recruiterTalentProfiles.filter((candidate) => {
      const { hardMatches, softMatches, matchesQuery } = getCandidateMatches(
        candidate,
        searchQuery,
        scope
      );

      if (!matchesQuery) {
        return false;
      }

      if (level) {
        const relevantHardSkills = searchQuery ? hardMatches : candidate.hardSkills;
        if (!relevantHardSkills.some((skill) => skill.level === level)) {
          return false;
        }
      }

      if (workMode && candidate.workMode !== workMode) {
        return false;
      }

      if (availability && candidate.availability !== availability) {
        return false;
      }

      if (location && candidate.user.location !== location) {
        return false;
      }

      if (scope === 'soft' && searchQuery && softMatches.length === 0) {
        return false;
      }

      if (scope === 'hard' && searchQuery && hardMatches.length === 0) {
        return false;
      }

      return true;
    });
  }, [availability, level, location, scope, searchQuery, workMode]);

  useEffect(() => {
    setIsLoading(true);
    const timeout = window.setTimeout(() => {
      setVisibleCandidates(filteredCandidates);
      setIsLoading(false);
    }, 420);

    return () => window.clearTimeout(timeout);
  }, [filteredCandidates]);

  useEffect(() => {
    setCurrentPage(1);
  }, [availability, level, location, scope, searchQuery, workMode]);

  const totalPages = Math.max(1, Math.ceil(visibleCandidates.length / RESULTS_PER_PAGE));
  const currentResults = visibleCandidates.slice(
    (currentPage - 1) * RESULTS_PER_PAGE,
    currentPage * RESULTS_PER_PAGE
  );
  const firstResult = visibleCandidates.length === 0 ? 0 : (currentPage - 1) * RESULTS_PER_PAGE + 1;
  const lastResult = Math.min(currentPage * RESULTS_PER_PAGE, visibleCandidates.length);
  const activeFilterCount = [level, workMode, availability, location].filter(Boolean).length;
  const seniorTalentCount = recruiterTalentProfiles.filter((candidate) =>
    candidate.hardSkills.some((skill) => skill.level === 'Senior')
  ).length;
  const remoteReadyCount = recruiterTalentProfiles.filter(
    (candidate) => candidate.workMode === 'Remoto'
  ).length;

  const handleSearch = (value?: string) => {
    const nextQuery = (value ?? searchDraft).trim();
    setSearchDraft(nextQuery);
    setSearchQuery(nextQuery);
  };

  const clearFilters = () => {
    setScope('all');
    setLevel('');
    setWorkMode('');
    setAvailability('');
    setLocation('');
    setSearchDraft('');
    setSearchQuery('');
  };

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-[2rem] border border-border bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.16),transparent_32%),radial-gradient(circle_at_top_right,rgba(249,115,22,0.12),transparent_30%),linear-gradient(135deg,#ffffff_0%,#f8fafc_52%,#ecfeff_100%)]"
      >
        <div className="grid gap-6 px-6 py-7 lg:grid-cols-[1.25fr_0.75fr] lg:px-8">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Dashboard de reclutador
            </div>
            <div>
              <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Encuentra talento por habilidades, seniority y contexto real de trabajo
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                Busca perfiles profesionales por hard skills, soft skills y nivel de dominio. Esta
                version usa resultados estaticos para que puedas evaluar el apartado del reclutador
                desde ya.
              </p>
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                handleSearch();
              }}
              className="rounded-[1.5rem] border border-border bg-background/85 p-3 shadow-sm"
            >
              <div className="flex flex-col gap-3 lg:flex-row">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={searchDraft}
                    onChange={(event) => setSearchDraft(event.target.value)}
                    placeholder="Busca por React, Java, liderazgo, AWS..."
                    className="h-12 rounded-2xl border-0 bg-muted/60 pl-11 text-sm shadow-none focus-visible:ring-1"
                  />
                </div>
                <Button type="submit" className="h-12 rounded-2xl px-6">
                  Buscar talento
                </Button>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  Sugerencias
                </span>
                {smartSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => handleSearch(term)}
                    className="rounded-full border border-border bg-background px-3 py-1 text-sm text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </form>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <RecruiterStatCard
              icon={Users}
              label="Talento disponible"
              value={String(recruiterTalentProfiles.length)}
              helper="Perfiles estaticos listos para explorar"
            />
            <RecruiterStatCard
              icon={Star}
              label="Perfiles senior"
              value={String(seniorTalentCount)}
              helper="Con al menos una skill en nivel Senior"
            />
            <RecruiterStatCard
              icon={Zap}
              label="Remote ready"
              value={String(remoteReadyCount)}
              helper="Perfiles abiertos a colaboracion remota"
            />
          </div>
        </div>
      </motion.section>

      <div className="grid gap-6 xl:grid-cols-[300px_1fr]">
        <motion.aside
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <Card className="rounded-[1.75rem] p-0">
            <CardHeader className="border-b border-border px-5 py-5">
              <CardTitle className="flex items-center gap-2 text-base">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                Filtros de busqueda
              </CardTitle>
              <CardDescription>
                Refina la lista por tipo de habilidad, seniority y contexto laboral.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-5 py-5">
              <Select
                label="Tipo de coincidencia"
                value={scope}
                options={scopeOptions}
                onChange={(event) => setScope(event.target.value as SkillScope)}
              />
              <Select
                label="Nivel de dominio"
                value={level}
                options={levelOptions}
                onChange={(event) => setLevel(event.target.value as LevelFilter)}
              />
              <Select
                label="Modalidad"
                value={workMode}
                options={workModeOptions}
                onChange={(event) => setWorkMode(event.target.value as WorkModeFilter)}
              />
              <Select
                label="Disponibilidad"
                value={availability}
                options={availabilityOptions}
                onChange={(event) => setAvailability(event.target.value as AvailabilityFilter)}
              />
              <Select
                label="Ubicacion"
                value={location}
                options={locationOptions}
                onChange={(event) => setLocation(event.target.value)}
              />

              <Button variant="outline" className="w-full rounded-2xl" onClick={clearFilters}>
                Limpiar busqueda
              </Button>

              <div className="rounded-2xl bg-muted/60 p-4 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Tip de reclutamiento</p>
                <p className="mt-2 leading-6">
                  Prueba combinaciones como <span className="font-medium text-foreground">Java</span>{' '}
                  + <span className="font-medium text-foreground">Senior</span> o{' '}
                  <span className="font-medium text-foreground">liderazgo</span> en soft skills para
                  validar el flujo de filtrado.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.aside>

        <section className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-3 rounded-[1.75rem] border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-semibold text-foreground">Resultados</h2>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  {isLoading ? 'Buscando...' : `${visibleCandidates.length} candidatos`}
                </Badge>
                {activeFilterCount > 0 && (
                  <Badge variant="outline">{activeFilterCount} filtros activos</Badge>
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchQuery
                  ? `Busqueda actual: "${searchQuery}"`
                  : 'Mostrando el universo base de talento disponible para reclutamiento.'}
              </p>
            </div>
            <div className="rounded-2xl bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
              {isLoading
                ? 'Actualizando resultados...'
                : `Mostrando ${firstResult}-${lastResult} de ${visibleCandidates.length} perfiles`}
            </div>
          </motion.div>

          {isLoading ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <Card key={index} className="rounded-[1.75rem] p-5">
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-16 w-16 rounded-2xl" />
                    <div className="flex-1 space-y-3">
                      <Skeleton className="h-5 w-44" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                  <div className="mt-5 flex gap-2">
                    <Skeleton className="h-7 w-24 rounded-full" />
                    <Skeleton className="h-7 w-28 rounded-full" />
                    <Skeleton className="h-7 w-20 rounded-full" />
                  </div>
                </Card>
              ))}
            </div>
          ) : visibleCandidates.length === 0 ? (
            <Card className="rounded-[1.75rem]">
              <EmptyState
                icon={Briefcase}
                title="No se encontraron candidatos con esta habilidad."
                description="Intenta usar terminos mas generales o elimina algunos filtros."
                action={{
                  label: 'Limpiar filtros',
                  onClick: clearFilters,
                }}
              />
            </Card>
          ) : (
            <>
              <div className="grid gap-4 lg:grid-cols-2">
                {currentResults.map((candidate, index) => {
                  const { hardMatches, softMatches } = getCandidateMatches(candidate, searchQuery, scope);
                  const topSkills = candidate.hardSkills
                    .filter((skill) => skill.isTop)
                    .slice(0, 3)
                    .map((skill) => skill.name);
                  const matchBadges = [
                    ...hardMatches.map((skill) => `${skill.name} (${skill.level})`),
                    ...softMatches,
                  ].slice(0, 3);

                  return (
                    <motion.article
                      key={candidate.user.id}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04 }}
                    >
                      <Card className="h-full rounded-[1.75rem] border-border/90 p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex min-w-0 gap-4">
                            <Avatar
                              src={candidate.user.avatar}
                              alt={candidate.user.name}
                              fallback={candidate.user.name}
                              size="xl"
                              className="rounded-[1.5rem]"
                            />
                            <div className="min-w-0">
                              <h3 className="text-lg font-semibold text-foreground">
                                {candidate.user.name}
                              </h3>
                              <p className="text-sm font-medium text-primary">{candidate.expectedRole}</p>
                              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                {candidate.user.headline}
                              </p>
                            </div>
                          </div>

                          <Badge
                            variant={candidate.availability === 'Disponible' ? 'success' : 'secondary'}
                            className="shrink-0"
                          >
                            {candidate.availability}
                          </Badge>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-2 text-xs">
                          <Badge variant="outline">{candidate.experienceYears}+ anos</Badge>
                          <Badge variant="outline">{candidate.workMode}</Badge>
                          <Badge variant="outline">{candidate.user.location}</Badge>
                        </div>

                        <div className="mt-5 rounded-2xl bg-muted/55 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            Top 3 skills
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {topSkills.map((skill) => (
                              <Badge key={skill} variant="secondary" className="bg-background">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="mt-4">
                          <p className="text-sm leading-6 text-muted-foreground">{candidate.summary}</p>
                        </div>

                        <div className="mt-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            Coincidencias detectadas
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {matchBadges.length > 0 ? (
                              matchBadges.map((match) => (
                                <Badge key={match} className="bg-primary/10 text-primary">
                                  {match}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-sm text-muted-foreground">
                                Vista general del perfil sin filtro especifico.
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between gap-3 border-t border-border pt-4">
                          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            {candidate.user.location}
                          </div>
                          <Link to={`/p/${candidate.user.slug}`}>
                            <Button className="rounded-2xl">Ver perfil</Button>
                          </Link>
                        </div>
                      </Card>
                    </motion.article>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div className="flex flex-col gap-3 rounded-[1.75rem] border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-muted-foreground">
                    Pagina {currentPage} de {totalPages}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Anterior
                    </Button>
                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                      <Button
                        key={page}
                        variant={page === currentPage ? 'primary' : 'outline'}
                        className="min-w-10"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Siguiente
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </div>

      <Card className="rounded-[1.75rem] bg-[linear-gradient(135deg,rgba(14,165,233,0.08),rgba(249,115,22,0.08))]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Estado de demo
            </p>
            <h3 className="mt-2 text-xl font-semibold text-foreground">
              Hola {user?.name?.split(' ')[0]}, este apartado ya quedo listo para reclutador
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              La vista funciona con perfiles estaticos, filtros asincronos, estado vacio amigable,
              tarjetas con top skills y acceso a perfil publico para continuar la navegacion.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="h-4 w-4 text-primary" />
            Preparado para luego conectar backend real
          </div>
        </div>
      </Card>
    </div>
  );
}

function RecruiterStatCard({
  icon: Icon,
  label,
  value,
  helper,
}: {
  icon: ElementType;
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <Card className="rounded-[1.5rem] border-background/80 bg-background/85 p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 text-3xl font-semibold text-foreground">{value}</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{helper}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}
