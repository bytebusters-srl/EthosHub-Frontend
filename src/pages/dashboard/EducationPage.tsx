import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  BookOpen,
  CalendarRange,
  Plus,
  Pencil,
  X,
  Upload,
  FileText,
  Trash2,
  Building2,
  Calendar,
  Sparkles,
  Award,
  ChevronDown,
  ChevronUp,
  Loader2
} from 'lucide-react';
import { Button } from '@/shared/ui';
import { useAuthStore } from '@/store/authStore';
import { educationService } from '@/shared/services/educationService';
import { AcademicRecord } from '@/shared/types/education';

const statItems = [
  { label: 'Títulos y certificaciones', value: '3' },
  { label: 'Años de formación', value: '4+' },
  { label: 'Instituciones', value: '3' },
];

const maxDescriptionChars = 500;

interface AcademicRecordFormData {
  institutionName: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  credentialUrl: string;
}

export default function EducationPage() {
  const { user } = useAuthStore();
  const [records, setRecords] = useState<AcademicRecord[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AcademicRecord | null>(null);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<AcademicRecordFormData>({
    institutionName: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: '',
    credentialUrl: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const isEditMode = !!editingRecord;

  const loadRecords = async () => {
    if (!user?.id) return;
    try {
      setIsLoadingData(true);
      const data = await educationService.getRecords(user.id);
      setRecords(data);
    } catch (error) {
      console.error("[EducationPage] Error al cargar formación:", error);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, [user?.id]);

  useEffect(() => {
    if (editingRecord) {
      setFormData({
        institutionName: editingRecord.institutionName,
        degree: editingRecord.degree,
        fieldOfStudy: editingRecord.fieldOfStudy || '',
        startDate: editingRecord.startDate || '',
        endDate: editingRecord.endDate || '',
        isCurrent: editingRecord.isCurrent,
        description: editingRecord.description || '',
        credentialUrl: editingRecord.credentialUrl || '',
      });
      if (editingRecord.credentialUrl) {
        setUploadedFileName('certificado.pdf');
      }
    } else {
      setFormData({
        institutionName: '',
        degree: '',
        fieldOfStudy: '',
        startDate: '',
        endDate: '',
        isCurrent: false,
        description: '',
        credentialUrl: '',
      });
      setUploadedFileName(null);
    }
    setErrors({});
    setUploadProgress(0);
    setIsUploading(false);
    setShowDeleteConfirm(false);
  }, [editingRecord, isModalOpen]);

  const toggleCardExpanded = (id: string) => {
    setExpandedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const openAddModal = () => {
    setEditingRecord(null);
    setIsModalOpen(true);
  };

  const openEditModal = (record: AcademicRecord) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
    setShowDeleteConfirm(false);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.institutionName.trim()) newErrors.institutionName = 'La institución es obligatoria';
    if (!formData.degree.trim()) newErrors.degree = 'El título es obligatorio';
    if (!formData.startDate) newErrors.startDate = 'La fecha de inicio es obligatoria';
    if (!formData.isCurrent && !formData.endDate) {
      newErrors.endDate = 'La fecha de fin es obligatoria si no es actual';
    } else if (formData.startDate && formData.endDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'La fecha final no puede ser antes del inicio';
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
        const payload: Partial<AcademicRecord> = { ...formData };

        if (editingRecord && editingRecord.academicRecordId) {
          await educationService.updateRecord(user.id, editingRecord.academicRecordId, payload);
        } else {
          await educationService.addRecord(user.id, payload);
        }
        await loadRecords();
        closeModal();
      } catch (error) {
        console.error("[EducationPage] Error al guardar:", error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleDelete = async () => {
    if (!user?.id || !editingRecord?.academicRecordId) return;
    setIsSaving(true);
    try {
      await educationService.deleteRecord(user.id, editingRecord.academicRecordId);
      await loadRecords();
      closeModal();
    } catch (error) {
      console.error("[EducationPage] Error al eliminar:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const simulateUpload = (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadedFileName(file.name);
          setFormData((prev) => ({
            ...prev,
            credentialUrl: `https://storage.ethoshub.com/credentials/${file.name}`,
          }));
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const handleFileUpload = (file: File) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({ ...prev, file: 'Solo se permiten archivos PDF, JPG o PNG' }));
      return;
    }
    simulateUpload(file);
    setErrors((prev) => {
      const { file: _, ...rest } = prev;
      return rest;
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const removeFile = () => {
    setUploadedFileName(null);
    setFormData((prev) => ({ ...prev, credentialUrl: '' }));
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formatDate = (dateString?: string) => {
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
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.16),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.12),_transparent_28%)]" />
          <div className="relative grid gap-5 sm:gap-6 lg:grid-cols-[1.5fr_0.9fr]">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                Trayectoria Académica
              </div>
              <div>
                <h1 className="font-sans text-3xl font-semibold tracking-tight text-foreground">
                  Formación y certificaciones profesionales.
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                  Registra tus títulos, certificaciones y cursos relevantes. Cada entrada refuerza tu credibilidad profesional y valida tu experiencia técnica.
                </p>
              </div>
              <Button variant="primary" onClick={openAddModal} className="mt-2 gap-2 bg-indigo-600 hover:bg-indigo-700">
                <Plus className="h-4 w-4" /> Agregar Trayectoria
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
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Historial Académico</h2>
              <p className="text-sm text-muted-foreground">Títulos, certificaciones y formación continua.</p>
            </div>
          </div>

          {isLoadingData ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
          ) : records.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 py-12 text-center">
              <GraduationCap className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium text-foreground">Sin registros académicos</h3>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">Agrega tu formación académica, certificaciones y cursos para fortalecer tu perfil profesional.</p>
              <Button variant="primary" onClick={openAddModal} className="mt-6 gap-2 bg-indigo-600 hover:bg-indigo-700">
                <Plus className="h-4 w-4" /> Agregar Trayectoria
              </Button>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-5">
              {records.map((record, index) => {
                const rId = record.academicRecordId || `temp-${index}`;
                const isExpanded = expandedCards.has(rId);
                return (
                  <motion.article key={rId} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} whileHover={{ scale: 1.005 }} className="relative rounded-2xl border border-border bg-background/60 p-4 transition-colors hover:border-indigo-500/30 sm:p-5 dark:bg-black/40">
                    {index < records.length - 1 && <div className="absolute left-[1.35rem] top-full h-5 w-px bg-border" />}
                    <div className="flex gap-4">
                      <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-foreground">{record.degree}</h3>
                            <p className="text-sm font-medium text-indigo-600">{record.institutionName}</p>
                            {record.fieldOfStudy && <p className="mt-1 text-xs text-muted-foreground">{record.fieldOfStudy}</p>}
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="space-y-1 text-sm text-muted-foreground sm:text-right">
                              <div className="inline-flex items-center gap-2">
                                <CalendarRange className="h-4 w-4" />
                                {formatDate(record.startDate)} - {record.isCurrent ? 'Presente' : formatDate(record.endDate)}
                              </div>
                            </div>
                            <button onClick={() => openEditModal(record)} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" aria-label="Editar">
                              <Pencil className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {record.description && (
                          <div className="mt-3">
                            <p className={`text-sm leading-6 text-muted-foreground ${!isExpanded ? 'line-clamp-2' : ''}`}>{record.description}</p>
                            {record.description.length > 150 && (
                              <button onClick={() => toggleCardExpanded(rId)} className="mt-1 flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700">
                                {isExpanded ? <>Ver menos <ChevronUp className="h-3 w-3" /></> : <>Ver más <ChevronDown className="h-3 w-3" /></>}
                              </button>
                            )}
                          </div>
                        )}

                        {record.credentialUrl && (
                          <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground">
                            <FileText className="h-3.5 w-3.5 text-indigo-600" />
                            Certificado adjunto
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
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600">
                <Award className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Tipos de formación</h2>
            </div>
            <div className="space-y-3">
              {['Títulos universitarios y posgrados.', 'Certificaciones técnicas.', 'Bootcamps.', 'Cursos y diplomados.'].map((item) => (
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
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">{isEditMode ? 'Editar Trayectoria' : 'Nueva Trayectoria'}</h2>
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
                      <label className="flex items-center gap-2 text-sm font-medium text-foreground"><Building2 className="h-4 w-4 text-muted-foreground" /> Institución *</label>
                      <input type="text" value={formData.institutionName} onChange={(e) => setFormData((prev) => ({ ...prev, institutionName: e.target.value }))} className={`w-full rounded-xl border bg-background px-4 py-3 text-foreground ${errors.institutionName ? 'border-destructive' : 'border-border focus:border-indigo-500'}`} />
                      {errors.institutionName && <p className="text-xs text-destructive">{errors.institutionName}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-foreground"><GraduationCap className="h-4 w-4 text-muted-foreground" /> Título / Grado *</label>
                      <input type="text" value={formData.degree} onChange={(e) => setFormData((prev) => ({ ...prev, degree: e.target.value }))} className={`w-full rounded-xl border bg-background px-4 py-3 text-foreground ${errors.degree ? 'border-destructive' : 'border-border focus:border-indigo-500'}`} />
                      {errors.degree && <p className="text-xs text-destructive">{errors.degree}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-foreground"><BookOpen className="h-4 w-4 text-muted-foreground" /> Área de Estudio</label>
                      <input type="text" value={formData.fieldOfStudy} onChange={(e) => setFormData((prev) => ({ ...prev, fieldOfStudy: e.target.value }))} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground focus:border-indigo-500" />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-foreground"><Calendar className="h-4 w-4 text-muted-foreground" /> Inicio *</label>
                        <input type="date" value={formData.startDate.split('T')[0]} onClick={(e) => e.currentTarget.showPicker && e.currentTarget.showPicker()} onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))} className={`w-full rounded-xl border bg-background px-4 py-3 text-foreground cursor-pointer ${errors.startDate ? 'border-destructive' : 'border-border focus:border-indigo-500'}`} />
                        {errors.startDate && <p className="text-xs text-destructive">{errors.startDate}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-foreground"><Calendar className="h-4 w-4 text-muted-foreground" /> Fin</label>
                        <input type="date" value={formData.endDate.split('T')[0]} min={formData.startDate} disabled={formData.isCurrent} onClick={(e) => e.currentTarget.showPicker && e.currentTarget.showPicker()} onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))} className={`w-full rounded-xl border bg-background px-4 py-3 text-foreground cursor-pointer disabled:opacity-50 ${errors.endDate ? 'border-destructive' : 'border-border focus:border-indigo-500'}`} />
                        {errors.endDate && <p className="text-xs text-destructive">{errors.endDate}</p>}
                      </div>
                    </div>

                    <label className="flex cursor-pointer items-center gap-3">
                      <input type="checkbox" checked={formData.isCurrent} onChange={(e) => setFormData((prev) => ({ ...prev, isCurrent: e.target.checked }))} className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500" />
                      <span className="text-sm text-foreground">Actualmente estudiando aquí</span>
                    </label>

                    <div className="space-y-2">
                      <label className="flex items-center justify-between text-sm font-medium text-foreground">
                        <span>Descripción</span><span className="text-xs text-muted-foreground">{formData.description.length}/{maxDescriptionChars}</span>
                      </label>
                      <textarea value={formData.description} onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))} rows={3} maxLength={maxDescriptionChars} className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-foreground focus:border-indigo-500" />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-foreground"><FileText className="h-4 w-4 text-muted-foreground" /> Certificado (Opcional)</label>
                      {isUploading ? (
                        <div className="rounded-xl border border-border bg-muted/30 px-4 py-6">
                          <div className="flex items-center gap-3">
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                              <motion.div className="h-full bg-indigo-600" initial={{ width: 0 }} animate={{ width: `${uploadProgress}%` }} transition={{ duration: 0.1 }} />
                            </div>
                            <span className="text-sm font-medium text-foreground">{uploadProgress}%</span>
                          </div>
                        </div>
                      ) : uploadedFileName ? (
                        <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 px-4 py-3">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-indigo-600" />
                            <span className="text-sm text-foreground">{uploadedFileName}</span>
                          </div>
                          <button type="button" onClick={removeFile} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><X className="h-4 w-4" /></button>
                        </div>
                      ) : (
                        <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()} className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed bg-muted/30 px-4 py-6 transition-colors ${isDragging ? 'border-indigo-500 bg-indigo-500/5' : 'border-border hover:border-indigo-500/50'}`}>
                          <Upload className="h-6 w-6 text-muted-foreground" />
                          <p className="mt-2 text-sm text-muted-foreground">Clic para seleccionar archivo</p>
                          <input ref={fileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileInputChange} className="hidden" />
                        </div>
                      )}
                    </div>

                  </div>
                </div>

                <div className="flex shrink-0 items-center justify-between border-t border-border bg-card px-6 py-4 dark:bg-black">
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
                        <Button type="button" variant="ghost" size="sm" onClick={(e) => { e.preventDefault(); setShowDeleteConfirm(false); }} className="h-8">No</Button>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="ghost" onClick={closeModal}>Cancelar</Button>
                    <Button type="submit" variant="primary" disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700">
                      {isSaving && <Loader2 className="h-4 w-4 animate-spin mr-2" />} Guardar
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