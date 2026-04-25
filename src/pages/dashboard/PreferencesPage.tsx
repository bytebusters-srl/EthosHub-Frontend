import { useEffect, useMemo, useState } from 'react';
import {
  Briefcase,
  Globe2,
  Grip,
  Languages,
  LayoutTemplate,
  Mail,
  MapPin,
  MoonStar,
  Pencil,
  ShieldCheck,
  Sparkles,
  UserCircle2,
} from 'lucide-react';
import { Badge, Card, EmptyState, LoadingSpinner } from '@/shared/ui';
import { useAuthStore } from '@/store/authStore';
import { usePreferencesStore } from '@/store/preferencesStore';
import { ProfileEditorModal } from '@/components/preferences/ProfileEditorModal';
import {
  BiographyCard,
  SkillsCard,
  ProjectsCard,
  ExperienceCard,
} from '@/components/preferences/ExpandableCards';
import { AccountSecurityCard } from '@/components/preferences/AccountSecurityCard';
import { FormacionCard } from '@/components/preferences/FormacionCard';
import { CompanyProfileCard } from '@/components/preferences/CompanyCards';

const workSignals = [
  'Disponible para colaboraciones de producto y frontend.',
  'Interes por proyectos con impacto visible y buena narrativa visual.',
  'Preferencia por equipos pequenos, iteracion rapida y ownership claro.',
];

const initialSkills = [
  { id: '1', name: 'React', category: 'Frontend' },
  { id: '2', name: 'TypeScript', category: 'Frontend' },
  { id: '3', name: 'Node.js', category: 'Backend' },
  { id: '4', name: 'PostgreSQL', category: 'Bases de Datos' },
  { id: '5', name: 'AWS', category: 'Infraestructura' },
];

export default function PreferencesPage() {
  const { user, updateProfile } = useAuthStore();
  const { preferences, loading, error, fetchPreferences } = usePreferencesStore();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [skills, setSkills] = useState(initialSkills);

  useEffect(() => {
    if (user?.id) {
      fetchPreferences(user.id);
    }
  }, [fetchPreferences, user?.id]);

  const orderedSections = useMemo(() => {
    return preferences?.sectionOrder ?? ['bio', 'skills', 'projects', 'experience', 'contact'];
  }, [preferences?.sectionOrder]);

  const handleBioSave = async (bio: string) => {
    await updateProfile({ bio });
  };

  const handleAddSkill = (skill: { id: string; name: string; category: string }) => {
    setSkills((prev) => [...prev, skill]);
  };

  const handleRemoveSkill = (skillId: string) => {
    setSkills((prev) => prev.filter((s) => s.id !== skillId));
  };

  if (loading && !preferences) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-gray-50 dark:bg-black">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-gray-50 p-6 dark:bg-black min-h-screen">
        <EmptyState
          icon={UserCircle2}
          title="No hay usuario activo"
          description="Inicia sesion para ver esta pantalla de preferencias."
        />
      </div>
    );
  }

  const isAdmin = user.role === 'admin';
  const isRecruiter = user.role === 'recruiter';
  const isProfessional = !isAdmin && !isRecruiter;

  return (
    <section className="w-full max-w-full space-y-4 overflow-x-hidden bg-gray-50 p-4 sm:space-y-6 sm:p-6 xl:space-y-7 dark:bg-black min-h-screen">
      {/* Hero Card */}
      <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white sm:rounded-3xl dark:border-white/10 dark:bg-zinc-950">
        <div className="relative px-4 py-5 sm:px-8 sm:py-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.14),_transparent_32%),radial-gradient(circle_at_bottom_left,_rgba(249,115,22,0.10),_transparent_28%)]" />
          <div className="relative flex flex-col gap-5 sm:gap-6 lg:grid lg:grid-cols-[1.3fr_0.9fr]">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600 dark:border-white/10 dark:bg-black/50 dark:text-gray-300">
                <Sparkles className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                {isAdmin ? 'Modo Administrador' : isRecruiter ? 'Modo reclutador' : 'Modo profesional'}
              </div>

              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-black sm:text-3xl dark:text-white">
                  {isAdmin ? 'Preferencias del Sistema' : isRecruiter ? 'Preferencias de cuenta' : 'Preferencias del perfil profesional'}
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500 dark:text-gray-400">
                  {isAdmin
                    ? 'Ajusta la seguridad de tu cuenta de administrador y preferencias visuales del panel.'
                    : isRecruiter
                    ? 'Configura los ajustes de tu cuenta y detalles de la empresa.'
                    : 'Personaliza tu identidad, habilidades y secciones del portafolio. Haz clic en cada seccion para expandirla y editarla.'}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-400">
                  {user.role}
                </Badge>
                {!isAdmin && (
                  <Badge variant="outline" className="border-gray-200 text-gray-600 dark:border-white/20 dark:text-gray-400">
                    {user.profession}
                  </Badge>
                )}
                <Badge variant="outline" className="border-gray-200 text-gray-600 dark:border-white/20 dark:text-gray-400">
                  Perfil activo
                </Badge>
              </div>
            </div>

            {/* User Card with Edit Button */}
            <div className="relative w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 backdrop-blur sm:rounded-3xl sm:p-5 dark:border-white/10 dark:bg-black/40">
              {!isAdmin && (
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(true)}
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-all hover:border-violet-500 hover:bg-violet-50 hover:text-violet-600 sm:right-4 sm:top-4 dark:border-white/10 dark:bg-zinc-900 dark:text-gray-400 dark:hover:border-violet-500/50 dark:hover:bg-violet-500/10 dark:hover:text-violet-400"
                  aria-label="Editar perfil"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              )}

              <div className="flex items-start gap-3 sm:gap-4">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-14 w-14 shrink-0 rounded-xl object-cover sm:h-16 sm:w-16 sm:rounded-2xl"
                />
                <div className="min-w-0 flex-1 pr-8">
                  <p className="truncate text-base font-semibold text-black sm:text-lg dark:text-white">{user.name}</p>
                  <p className="truncate text-sm text-violet-600 dark:text-violet-400">
                    {isAdmin ? 'Administrador Plataforma' : user.profession}
                  </p>
                  <div className="mt-2 space-y-1.5 text-sm text-gray-500 sm:mt-3 sm:space-y-2 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 shrink-0" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    {!isAdmin && (
                      <>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 shrink-0" />
                          <span className="truncate">{user.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Globe2 className="h-4 w-4 shrink-0" />
                          <span className="truncate">{user.website || 'Sitio pendiente'}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <Card className="w-full border-red-200 bg-red-50 p-3 sm:p-4 dark:border-red-500/30 dark:bg-red-500/10">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </Card>
      )}

      {/* Main Grid */}
      <div className="flex w-full flex-col gap-4 sm:gap-6 xl:grid xl:grid-cols-[1.15fr_0.85fr]">

        {/* Left Column */}
        <div className="w-full space-y-3 sm:space-y-4">

          {isProfessional && (
            <>
              <BiographyCard initialBio={user.bio || ''} onSave={handleBioSave} />
              <SkillsCard skills={skills} onAddSkill={handleAddSkill} onRemoveSkill={handleRemoveSkill} />
              <ProjectsCard projectCount={5} />
              <ExperienceCard experienceCount={3} />
              <FormacionCard />
            </>
          )}

          {isRecruiter && (
            <CompanyProfileCard />
          )}

          <AccountSecurityCard />
        </div>

        {/* Right Column */}
        <div className="w-full space-y-4 sm:space-y-6 xl:sticky xl:top-24 xl:self-start">

          <Card className="w-full border-gray-200 bg-white p-4 sm:p-6 dark:border-white/10 dark:bg-zinc-950">
            <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-center">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600 sm:h-11 sm:w-11 sm:rounded-2xl dark:bg-violet-500/10 dark:text-violet-400">
                <Languages className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-black sm:text-xl dark:text-white">Preferencias visuales</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Ajustes base cargados localmente.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              <PreferenceTile
                icon={Languages}
                label="Idioma"
                value={preferences?.language === 'en' ? 'English' : 'Español'}
                hint="Definido para la interfaz principal."
              />
              <PreferenceTile
                icon={MoonStar}
                label="Tema"
                value={preferences?.theme ?? 'light'}
                hint="Preferencia visual guardada localmente."
              />
              {isProfessional && (
                <>
                  <PreferenceTile
                    icon={ShieldCheck}
                    label="Heatmap GitHub"
                    value={preferences?.showGithubHeatmap ? 'Visible' : 'Oculto'}
                    hint="Control rapido para el perfil publico."
                  />
                  <PreferenceTile
                    icon={Briefcase}
                    label="Recomendaciones LinkedIn"
                    value={preferences?.showLinkedinRecommendations ? 'Activadas' : 'Desactivadas'}
                    hint="Ideal para reforzar credibilidad profesional."
                  />
                </>
              )}
            </div>
          </Card>

          {isProfessional && (
            <>
              <Card className="w-full border-gray-200 bg-white p-4 sm:p-6 dark:border-white/10 dark:bg-zinc-950">
                <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-center">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 sm:h-11 sm:w-11 sm:rounded-2xl dark:bg-emerald-500/10 dark:text-emerald-400">
                    <Grip className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-black sm:text-xl dark:text-white">Orden del portafolio</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Secuencia sugerida para tu perfil publico.</p>
                  </div>
                </div>

                <div className="grid gap-2 sm:gap-3">
                  {orderedSections.map((section, index) => (
                    <div
                      key={`${section}-${index}`}
                      className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 sm:rounded-2xl sm:px-4 sm:py-3 dark:border-white/10 dark:bg-black/50"
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-600 text-xs font-semibold text-white sm:h-8 sm:w-8">
                          {index + 1}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-black sm:text-base dark:text-white">{formatSectionLabel(section)}</p>
                          <p className="truncate text-xs text-gray-500 dark:text-gray-400">{sectionDescription(section)}</p>
                        </div>
                      </div>
                      <LayoutTemplate className="h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500" />
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="w-full border-gray-200 bg-white p-4 sm:p-6 dark:border-white/10 dark:bg-zinc-950">
                <h2 className="text-base font-semibold text-black sm:text-lg dark:text-white">Senales de trabajo</h2>
                <div className="mt-3 space-y-2 sm:mt-4 sm:space-y-3">
                  {workSignals.map((signal) => (
                    <div key={signal} className="rounded-xl bg-gray-50 px-3 py-2.5 text-sm text-black sm:rounded-2xl sm:px-4 sm:py-3 dark:bg-black/50 dark:text-white">
                      {signal}
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}

          {!isAdmin && (
            <Card className="w-full border-gray-200 bg-white p-4 sm:p-6 dark:border-white/10 dark:bg-zinc-950">
              <h2 className="text-base font-semibold text-black sm:text-lg dark:text-white">Resumen del perfil</h2>
              <div className="mt-3 space-y-2 sm:mt-4 sm:space-y-4">
                <SummaryRow label="Slug publico" value={user.slug} />
                <SummaryRow label="Rol activo" value={user.role} />
                <SummaryRow label="Ubicacion" value={user.location} />
                <SummaryRow label="Sitio personal" value={user.website || 'No configurado'} />
              </div>
            </Card>
          )}
        </div>
      </div>

      {!isAdmin && (
        <ProfileEditorModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}
    </section>
  );
}

function PreferenceTile({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 sm:rounded-2xl sm:p-4 dark:border-white/10 dark:bg-black/50">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600 sm:h-10 sm:w-10 sm:rounded-2xl dark:bg-violet-500/10 dark:text-violet-400">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs text-gray-500 dark:text-gray-400 sm:text-sm">{label}</p>
          <p className="truncate text-sm font-medium text-black sm:text-base dark:text-white">{value}</p>
        </div>
      </div>
      <p className="mt-2 text-xs leading-5 text-gray-500 sm:mt-3 dark:text-gray-400">{hint}</p>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 sm:rounded-2xl sm:px-4 sm:py-3 dark:border-white/10 dark:bg-black/50">
      <p className="text-xs uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-1 truncate text-sm font-medium text-black dark:text-white">{value}</p>
    </div>
  );
}

function formatSectionLabel(section: string) {
  const map: Record<string, string> = {
    bio: 'Biografia',
    skills: 'Skills',
    projects: 'Proyectos',
    experience: 'Experiencia',
    formacion: 'Formacion',
    contact: 'Contacto',
  };
  return map[section] ?? section;
}

function sectionDescription(section: string) {
  const map: Record<string, string> = {
    bio: 'Presentacion y contexto profesional.',
    skills: 'Capacidades tecnicas y fortalezas clave.',
    projects: 'Casos visibles y trabajo demostrado.',
    experience: 'Trayectoria y evolucion del perfil.',
    formacion: 'Trayectoria academica y certificaciones.',
    contact: 'Canales de contacto y conversion.',
  };
  return map[section] ?? 'Seccion del portafolio.';
}