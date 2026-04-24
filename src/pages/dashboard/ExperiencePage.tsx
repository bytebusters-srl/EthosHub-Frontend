import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  CalendarRange,
  MapPin,
  Plus,
  Pencil,
  X,
  Trash2,
  Building2,
  Calendar,
  Sparkles,
  Layers3,
  ChevronDown,
  ChevronUp,
  Loader2,
  Tag,
} from 'lucide-react';
import { Button } from '@/shared/ui';

// WorkExperience type based on core.work_experiences table
interface WorkExperience {
  id: string;
  userId: string;
  companyName: string;
  jobTitle: string;
  location: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
  technologies?: string[];
  createdAt: string;
  updatedAt: string;
}

// Mock data for demonstration
const mockExperiences: WorkExperience[] = [
  {
    id: '1',
    userId: 'user-1',
    companyName: 'Northlane Studio',
    jobTitle: 'Senior Product Engineer',
    location: 'Remoto, LATAM',
    startDate: '2023-01-15',
    isCurrent: true,
    description:
      'Liderando experiencias web de alto impacto, con foco en performance, consistencia visual y entregas iterativas junto a producto y diseno. Migracion gradual de interfaces legacy a una base moderna en React. Diseno de patrones reutilizables para dashboard y perfiles publicos.',
    technologies: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    userId: 'user-1',
    companyName: 'Crest Digital',
    jobTitle: 'Frontend Developer',
    location: 'Buenos Aires',
    startDate: '2021-03-01',
    endDate: '2023-01-01',
    isCurrent: false,
    description:
      'Construccion de paneles administrativos, landing pages y sistemas internos para equipos comerciales y de operaciones. Implementacion de componentes accesibles para formularios y tablas. Colaboracion estrecha con marketing para lanzamientos rapidos.',
    technologies: ['Vue.js', 'JavaScript', 'SCSS', 'Node.js'],
    createdAt: '2024-01-16T14:20:00Z',
    updatedAt: '2024-01-16T14:20:00Z',
  },
  {
    id: '3',
    userId: 'user-1',
    companyName: 'Freelance / Proyectos selectos',
    jobTitle: 'UI Engineer',
    location: 'Hibrido',
    startDate: '2019-06-01',
    endDate: '2021-02-28',
    isCurrent: false,
    description:
      'Trabajo con startups y marcas personales creando sitios visuales, portfolios y experiencias de producto enfocadas en conversion y narrativa. Construccion de experiencias estaticas elegantes y faciles de mantener.',
    technologies: ['HTML', 'CSS', 'JavaScript', 'Figma'],
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-02-01T09:00:00Z',
  },
];

const statItems = [
  { label: 'Anos construyendo producto', value: '6+' },
  { label: 'Interfaces lanzadas', value: '28' },
  { label: 'Sistemas y dashboards', value: '11' },
];

const maxDescriptionChars = 1000;

interface ExperienceFormData {
  companyName: string;
  jobTitle: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  technologies: string;
}

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<WorkExperience[]>(mockExperiences);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<WorkExperience | null>(null);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Form state
  const [formData, setFormData] = useState<ExperienceFormData>({
    companyName: '',
    jobTitle: '',
    location: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: '',
    technologies: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditMode = !!editingExperience;

  useEffect(() => {
    if (editingExperience) {
      setFormData({
        companyName: editingExperience.companyName,
        jobTitle: editingExperience.jobTitle,
        location: editingExperience.location || '',
        startDate: editingExperience.startDate,
        endDate: editingExperience.endDate || '',
        isCurrent: editingExperience.isCurrent,
        description: editingExperience.description || '',
        technologies: editingExperience.technologies?.join(', ') || '',
      });
    } else {
      setFormData({
        companyName: '',
        jobTitle: '',
        location: '',
        startDate: '',
        endDate: '',
        isCurrent: false,
        description: '',
        technologies: '',
      });
    }
    setErrors({});
    setShowDeleteConfirm(false);
  }, [editingExperience, isModalOpen]);

  const toggleCardExpanded = (id: string) => {
    setExpandedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const openAddModal = () => {
    setEditingExperience(null);
    setIsModalOpen(true);
  };

  const openEditModal = (experience: WorkExperience) => {
    setEditingExperience(experience);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingExperience(null);
    setShowDeleteConfirm(false);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'El nombre de la empresa es obligatorio';
    }
    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = 'El cargo es obligatorio';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'La fecha de inicio es obligatoria';
    }
    if (!formData.isCurrent && !formData.endDate) {
      newErrors.endDate = 'La fecha de fin es obligatoria si no es actual';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSaving(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      const technologiesArray = formData.technologies
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const experienceData = {
        companyName: formData.companyName,
        jobTitle: formData.jobTitle,
        location: formData.location,
        startDate: formData.startDate,
        endDate: formData.isCurrent ? undefined : formData.endDate,
        isCurrent: formData.isCurrent,
        description: formData.description,
        technologies: technologiesArray.length > 0 ? technologiesArray : undefined,
      };

      if (editingExperience) {
        // Update existing experience
        setExperiences((prev) =>
          prev.map((e) =>
            e.id === editingExperience.id
              ? { ...e, ...experienceData, updatedAt: new Date().toISOString() }
              : e
          )
        );
      } else {
        // Add new experience
        const newExperience: WorkExperience = {
          id: `${Date.now()}`,
          userId: 'user-1',
          ...experienceData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setExperiences((prev) => [newExperience, ...prev]);
      }

      setIsSaving(false);
      closeModal();
    }
  };

  const handleDelete = async () => {
    if (editingExperience) {
      setIsSaving(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setExperiences((prev) => prev.filter((e) => e.id !== editingExperience.id));
      setIsSaving(false);
      closeModal();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="space-y-6 xl:space-y-7"
    >
      {/* Header Card */}
      <div className="overflow-hidden rounded-3xl border border-border bg-card">
        <div className="relative px-5 py-7 sm:px-8 sm:py-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.12),_transparent_28%)]" />
          <div className="relative grid gap-5 sm:gap-6 lg:grid-cols-[1.5fr_0.9fr]">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Perfil profesional
              </div>

              <div>
                <h1 className="font-sans text-3xl font-semibold tracking-tight text-foreground">
                  Experiencia con foco en producto, detalle visual y ejecucion.
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                  Registra tu trayectoria profesional, empresas donde has trabajado y los logros que
                  has conseguido. Cada experiencia fortalece tu perfil y visibilidad.
                </p>
              </div>

              <Button
                variant="primary"
                onClick={openAddModal}
                className="mt-2 gap-2 bg-primary hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                Agregar Experiencia
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {statItems.map((item) => (
                <motion.div
                  key={item.label}
                  whileHover={{ scale: 1.02 }}
                  className="rounded-2xl border border-border bg-background/80 px-4 py-4 backdrop-blur"
                >
                  <p className="text-2xl font-semibold text-foreground">{item.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    {item.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        {/* Experience List */}
        <div className="rounded-3xl border border-border bg-card p-5 sm:p-7">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Trayectoria</h2>
              <p className="text-sm text-muted-foreground">
                Roles, contexto y contribuciones principales.
              </p>
            </div>
          </div>

          {experiences.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 py-12 text-center">
              <Briefcase className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium text-foreground">
                Sin experiencias registradas
              </h3>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Agrega tu experiencia laboral para mostrar tu trayectoria profesional y logros.
              </p>
              <Button
                variant="primary"
                onClick={openAddModal}
                className="mt-6 gap-2 bg-primary hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                Agregar Experiencia
              </Button>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-5">
              {experiences.map((experience, index) => {
                const isExpanded = expandedCards.has(experience.id);
                return (
                  <motion.article
                    key={experience.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.005 }}
                    className="relative rounded-2xl border border-border bg-background/60 p-4 transition-colors hover:border-primary/30 sm:p-5 dark:bg-black/40"
                  >
                    {index < experiences.length - 1 && (
                      <div className="absolute left-[1.35rem] top-full h-5 w-px bg-border" />
                    )}

                    <div className="flex gap-4">
                      <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Briefcase className="h-5 w-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-foreground">
                              {experience.jobTitle}
                            </h3>
                            <p className="text-sm font-medium text-primary">
                              {experience.companyName}
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="space-y-1 text-sm text-muted-foreground sm:text-right">
                              <div className="inline-flex items-center gap-2">
                                <CalendarRange className="h-4 w-4" />
                                {formatDate(experience.startDate)} -{' '}
                                {experience.isCurrent
                                  ? 'Actualidad'
                                  : formatDate(experience.endDate || '')}
                              </div>
                              {experience.location && (
                                <div className="inline-flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  {experience.location}
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => openEditModal(experience)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                              aria-label="Editar experiencia"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {experience.description && (
                          <div className="mt-3">
                            <p
                              className={`text-sm leading-6 text-muted-foreground ${
                                !isExpanded ? 'line-clamp-2' : ''
                              }`}
                            >
                              {experience.description}
                            </p>
                            {experience.description.length > 150 && (
                              <button
                                onClick={() => toggleCardExpanded(experience.id)}
                                className="mt-1 flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80"
                              >
                                {isExpanded ? (
                                  <>
                                    Ver menos <ChevronUp className="h-3 w-3" />
                                  </>
                                ) : (
                                  <>
                                    Ver mas <ChevronDown className="h-3 w-3" />
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        )}

                        {experience.technologies && experience.technologies.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {experience.technologies.map((tech) => (
                              <span
                                key={tech}
                                className="inline-flex items-center rounded-lg bg-muted/50 px-2.5 py-1 text-xs font-medium text-foreground"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6 xl:sticky xl:top-24 xl:self-start">
          <div className="rounded-3xl border border-border bg-card p-5 sm:p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
                <Layers3 className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Fortalezas visibles</h2>
            </div>

            <div className="space-y-3">
              {[
                'Sistemas de interfaz coherentes y mantenibles.',
                'Traduccion de ideas de producto en pantallas claras.',
                'Buen criterio para simplificar sin perder ambicion visual.',
                'Entrega estable para demos, portfolios y paneles internos.',
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-muted/60 px-4 py-3 text-sm text-foreground"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-foreground">Consejo</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Incluir tecnologias y logros especificos aumenta tu visibilidad en busquedas. Describe
              el impacto de tu trabajo con metricas cuando sea posible.
            </p>
          </div>
        </aside>
      </div>

{/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          // 1. Contenedor Flex de pantalla completa (reemplaza el top-1/2)
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            
            {/* Backdrop con position absolute relativo al nuevo contenedor */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={closeModal}
            />

            {/* Modal Container: max-h-full asegura que nunca exceda la pantalla */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="relative flex max-h-full w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl dark:bg-black"
            >
              {/* Header: shrink-0 para que se mantenga fijo arriba */}
              <div className="flex shrink-0 items-center justify-between border-b border-border px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      {isEditMode ? 'Editar Experiencia' : 'Nueva Experiencia'}
                    </h2>
                    <p className="text-xs text-muted-foreground">Experiencia laboral</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Formulario Flex que envuelve el scroll Y el footer */}
              <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
                
                {/* Contenido scrolleable: flex-1 y overflow-y-auto */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-4">
                    {/* Company Name */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        Empresa *
                      </label>
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, companyName: e.target.value }))
                        }
                        placeholder="Nombre de la empresa"
                        className={`w-full rounded-xl border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                          errors.companyName
                            ? 'border-destructive'
                            : 'border-border focus:border-primary'
                        }`}
                      />
                      {errors.companyName && (
                        <p className="text-xs text-destructive">{errors.companyName}</p>
                      )}
                    </div>

                    {/* Job Title */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        Cargo *
                      </label>
                      <input
                        type="text"
                        value={formData.jobTitle}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, jobTitle: e.target.value }))
                        }
                        placeholder="Senior Product Engineer"
                        className={`w-full rounded-xl border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                          errors.jobTitle
                            ? 'border-destructive'
                            : 'border-border focus:border-primary'
                        }`}
                      />
                      {errors.jobTitle && (
                        <p className="text-xs text-destructive">{errors.jobTitle}</p>
                      )}
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        Ubicacion
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, location: e.target.value }))
                        }
                        placeholder="Remoto, Madrid, ES..."
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    {/* Date Range */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          Fecha de Inicio *
                        </label>
                        <input
                          type="date"
                          value={formData.startDate}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, startDate: e.target.value }))
                          }
                          className={`w-full rounded-xl border bg-background px-4 py-3 text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                            errors.startDate
                              ? 'border-destructive'
                              : 'border-border focus:border-primary'
                          }`}
                        />
                        {errors.startDate && (
                          <p className="text-xs text-destructive">{errors.startDate}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          Fecha de Fin
                        </label>
                        <input
                          type="date"
                          value={formData.endDate}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, endDate: e.target.value }))
                          }
                          disabled={formData.isCurrent}
                          className={`w-full rounded-xl border bg-background px-4 py-3 text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 ${
                            errors.endDate
                              ? 'border-destructive'
                              : 'border-border focus:border-primary'
                          }`}
                        />
                        {errors.endDate && (
                          <p className="text-xs text-destructive">{errors.endDate}</p>
                        )}
                      </div>
                    </div>

                    {/* Is Current Checkbox */}
                    <label className="flex cursor-pointer items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.isCurrent}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, isCurrent: e.target.checked }))
                        }
                        className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-foreground">Trabajo aqui actualmente</span>
                    </label>

                    {/* Description */}
                    <div className="space-y-2">
                      <label className="flex items-center justify-between text-sm font-medium text-foreground">
                        <span>Descripcion</span>
                        <span className="text-xs text-muted-foreground">
                          {formData.description.length}/{maxDescriptionChars}
                        </span>
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, description: e.target.value }))
                        }
                        placeholder="Describe tus responsabilidades, logros y contribuciones principales..."
                        rows={4}
                        maxLength={maxDescriptionChars}
                        className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    {/* Technologies */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        Tecnologias / Habilidades
                      </label>
                      <input
                        type="text"
                        value={formData.technologies}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, technologies: e.target.value }))
                        }
                        placeholder="React, TypeScript, Node.js (separadas por coma)"
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <p className="text-xs text-muted-foreground">
                        Separa cada tecnologia con una coma
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer: shrink-0 para que se mantenga fijo abajo */}
                <div className="flex shrink-0 items-center justify-between border-t border-border bg-card px-6 py-4 dark:bg-black">
                  <div>
                    {isEditMode && !showDeleteConfirm && (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setShowDeleteConfirm(true)}
                        className="gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        Eliminar
                      </Button>
                    )}
                    {isEditMode && showDeleteConfirm && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-destructive">Confirmar?</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleDelete}
                          disabled={isSaving}
                          className="h-8 gap-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                          {isSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Si'}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowDeleteConfirm(false)}
                          className="h-8"
                        >
                          No
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="ghost" onClick={closeModal}>
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={isSaving}
                      className="gap-2 bg-primary hover:bg-primary/90"
                    >
                      {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                      Guardar Cambios
                    </Button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}