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
} from 'lucide-react';
import { Button } from '@/shared/ui';
import { useAuthStore } from '@/store/authStore';
import { experienceService } from '@/shared/services/experienceService';

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

const statItems = [
  { label: 'Años construyendo producto', value: '6+' },
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
  const { user } = useAuthStore();
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<WorkExperience | null>(null);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  const loadExperiences = async () => {
    if (!user?.id) return;
    try {
      setIsLoadingData(true);
      const data = await experienceService.getExperiences(user.id);
      setExperiences(data);
    } catch (error) {
      console.error("[ExperiencePage] Error al cargar experiencias", error);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    loadExperiences();
  }, [user?.id]);

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
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
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
    if (!formData.companyName.trim()) newErrors.companyName = 'Obligatorio';
    if (!formData.jobTitle.trim()) newErrors.jobTitle = 'Obligatorio';
    if (!formData.startDate) newErrors.startDate = 'Obligatorio';
    
    // CORRECCIÓN 1: Descripción obligatoria
    if (!formData.description.trim()) newErrors.description = 'La descripción es obligatoria';

    if (!formData.isCurrent) {
      if (!formData.endDate) {
        newErrors.endDate = 'Obligatorio';
      } 
      // CORRECCIÓN 3: La fecha de fin no puede ser anterior a la de inicio
      else if (formData.startDate && new Date(formData.endDate) < new Date(formData.startDate)) {
        newErrors.endDate = 'La fecha final no puede ser antes del inicio';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    if (validateForm()) {
      setIsSaving(true);
      try {
        if (editingExperience) {
          await experienceService.updateExperience(user.id, editingExperience.id, formData);
        } else {
          await experienceService.addExperience(user.id, formData);
        }
        await loadExperiences();
        closeModal();
      } catch (error) {
        console.error("[ExperiencePage] Error al guardar:", error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user?.id || !editingExperience?.id) return;
    
    setIsSaving(true);
    try {
      await experienceService.deleteExperience(user.id, editingExperience.id);
      await loadExperiences();
      closeModal();
    } catch (error) {
      console.error("[ExperiencePage] Error al eliminar", error);
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() + offset).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="space-y-6 xl:space-y-7"
    >
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
                  Experiencia con foco en producto, detalle visual y ejecución.
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                  Registra tu trayectoria profesional, empresas donde has trabajado y los logros que has conseguido.
                </p>
              </div>
              <Button variant="primary" onClick={openAddModal} className="mt-2 gap-2 bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4" />
                Agregar Experiencia
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {statItems.map((item) => (
                <motion.div key={item.label} whileHover={{ scale: 1.02 }} className="rounded-2xl border border-border bg-background/80 px-4 py-4 backdrop-blur">
                  <p className="text-2xl font-semibold text-foreground">{item.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">{item.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-3xl border border-border bg-card p-5 sm:p-7">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Trayectoria</h2>
              <p className="text-sm text-muted-foreground">Roles, contexto y contribuciones principales.</p>
            </div>
          </div>

          {isLoadingData ? (
             <div className="flex items-center justify-center py-12">
               <Loader2 className="h-8 w-8 animate-spin text-primary" />
             </div>
          ) : experiences.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 py-12 text-center">
              <Briefcase className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium text-foreground">Sin experiencias registradas</h3>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">Agrega tu experiencia laboral para mostrar tu trayectoria.</p>
              <Button variant="primary" onClick={openAddModal} className="mt-6 gap-2 bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4" />
                Agregar Experiencia
              </Button>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-5">
              {experiences.map((experience, index) => {
                const isExpanded = expandedCards.has(experience.id);
                return (
                  <motion.article key={experience.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} whileHover={{ scale: 1.005 }} className="relative rounded-2xl border border-border bg-background/60 p-4 transition-colors hover:border-primary/30 sm:p-5 dark:bg-black/40">
                    {index < experiences.length - 1 && <div className="absolute left-[1.35rem] top-full h-5 w-px bg-border" />}
                    <div className="flex gap-4">
                      <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Briefcase className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-foreground">{experience.jobTitle}</h3>
                            <p className="text-sm font-medium text-primary">{experience.companyName}</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="space-y-1 text-sm text-muted-foreground sm:text-right">
                              <div className="inline-flex items-center gap-2">
                                <CalendarRange className="h-4 w-4" />
                                {formatDate(experience.startDate)} - {experience.isCurrent ? 'Actualidad' : formatDate(experience.endDate || '')}
                              </div>
                            </div>
                            <button onClick={() => openEditModal(experience)} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                              <Pencil className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        {experience.description && (
                          <div className="mt-3">
                            <p className={`text-sm leading-6 text-muted-foreground ${!isExpanded ? 'line-clamp-2' : ''}`}>{experience.description}</p>
                            {experience.description.length > 150 && (
                              <button onClick={() => toggleCardExpanded(experience.id)} className="mt-1 flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80">
                                {isExpanded ? <>Ver menos <ChevronUp className="h-3 w-3" /></> : <>Ver más <ChevronDown className="h-3 w-3" /></>}
                              </button>
                            )}
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

        <aside className="space-y-6 xl:sticky xl:top-24 xl:self-start">
          <div className="rounded-3xl border border-border bg-card p-5 sm:p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
                <Layers3 className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Fortalezas visibles</h2>
            </div>
            <div className="space-y-3">
              {['Sistemas coherentes.', 'Traducción de ideas.', 'Buen criterio.', 'Entrega estable.'].map((item) => (
                <div key={item} className="rounded-2xl bg-muted/60 px-4 py-3 text-sm text-foreground">{item}</div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeModal} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ duration: 0.2 }} className="relative flex max-h-full w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl dark:bg-black">
              <div className="flex shrink-0 items-center justify-between border-b border-border px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">{isEditMode ? 'Editar Experiencia' : 'Nueva Experiencia'}</h2>
                  </div>
                </div>
                <button type="button" onClick={closeModal} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-foreground"><Building2 className="h-4 w-4 text-muted-foreground" /> Empresa *</label>
                      <input type="text" value={formData.companyName} onChange={(e) => setFormData((prev) => ({ ...prev, companyName: e.target.value }))} className={`w-full rounded-xl border bg-background px-4 py-3 text-foreground ${errors.companyName ? 'border-destructive' : 'border-border'}`} />
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-foreground"><Briefcase className="h-4 w-4 text-muted-foreground" /> Cargo *</label>
                      <input type="text" value={formData.jobTitle} onChange={(e) => setFormData((prev) => ({ ...prev, jobTitle: e.target.value }))} className={`w-full rounded-xl border bg-background px-4 py-3 text-foreground ${errors.jobTitle ? 'border-destructive' : 'border-border'}`} />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      
                      {/* CORRECCIÓN 2: El evento showPicker abre el calendario nativo al hacer clic */}
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-foreground"><Calendar className="h-4 w-4 text-muted-foreground" /> Inicio *</label>
                        <input 
                          type="date" 
                          value={formData.startDate} 
                          onClick={(e) => e.currentTarget.showPicker && e.currentTarget.showPicker()}
                          onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))} 
                          className={`w-full rounded-xl border bg-background px-4 py-3 text-foreground cursor-pointer ${errors.startDate ? 'border-destructive' : 'border-border'}`} 
                        />
                      </div>
                      
                      {/* CORRECCIÓN 3: Propiedad min={} añadida para evitar fechas pasadas */}
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-foreground"><Calendar className="h-4 w-4 text-muted-foreground" /> Fin</label>
                        <input 
                          type="date" 
                          value={formData.endDate} 
                          min={formData.startDate}
                          disabled={formData.isCurrent} 
                          onClick={(e) => e.currentTarget.showPicker && e.currentTarget.showPicker()}
                          onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))} 
                          className={`w-full rounded-xl border bg-background px-4 py-3 text-foreground cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${errors.endDate ? 'border-destructive' : 'border-border'}`} 
                        />
                        {errors.endDate && <p className="text-xs text-destructive mt-1">{errors.endDate}</p>}
                      </div>
                    </div>

                    <label className="flex cursor-pointer items-center gap-3">
                      <input type="checkbox" checked={formData.isCurrent} onChange={(e) => setFormData((prev) => ({ ...prev, isCurrent: e.target.checked }))} className="h-4 w-4 rounded" />
                      <span className="text-sm text-foreground">Trabajo aquí actualmente</span>
                    </label>

                    <div className="space-y-2">
                      <label className="flex items-center justify-between text-sm font-medium text-foreground">
                        <span>Descripción *</span><span className="text-xs text-muted-foreground">{formData.description.length}/{maxDescriptionChars}</span>
                      </label>
                      <textarea 
                        value={formData.description} 
                        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))} 
                        rows={4} 
                        maxLength={maxDescriptionChars} 
                        className={`w-full resize-none rounded-xl border bg-background px-4 py-3 text-foreground ${errors.description ? 'border-destructive' : 'border-border'}`} 
                      />
                      {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 items-center justify-between border-t border-border bg-card px-6 py-4">
                  <div>
                    {isEditMode && !showDeleteConfirm && (
                      <Button type="button" variant="ghost" onClick={(e) => { e.preventDefault(); setShowDeleteConfirm(true); }} className="gap-2 text-destructive">
                        <Trash2 className="h-4 w-4" /> Eliminar
                      </Button>
                    )}
                    {isEditMode && showDeleteConfirm && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-destructive">¿Confirmar?</span>
                        <Button type="button" variant="ghost" size="sm" onClick={handleDelete} disabled={isSaving} className="h-8 gap-1 text-destructive hover:bg-destructive/10">
                          {isSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Sí'}
                        </Button>
                        <Button type="button" variant="ghost" size="sm" onClick={(e) => { e.preventDefault(); setShowDeleteConfirm(false); }} className="h-8">
                          No
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="ghost" onClick={(e) => { e.preventDefault(); closeModal(); }}>Cancelar</Button>
                    <Button type="submit" variant="primary" disabled={isSaving} className="gap-2 bg-primary">
                      {isSaving && <Loader2 className="h-4 w-4 animate-spin" />} Guardar
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