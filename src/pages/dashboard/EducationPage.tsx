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
} from 'lucide-react';
import { Button } from '@/shared/ui';
import type { AcademicRecord } from '@/shared/types';

// Mock data for demonstration
const mockAcademicRecords: AcademicRecord[] = [
  {
    id: '1',
    userId: 'user-1',
    institutionName: 'Universidad Nacional Autonoma de Mexico',
    degree: 'Ingeniero de Sistemas Computacionales',
    fieldOfStudy: 'Ciencias de la Computacion',
    startDate: '2016-08-01',
    endDate: '2020-06-15',
    isCurrent: false,
    description:
      'Enfoque en desarrollo de software, arquitectura de sistemas y algoritmos avanzados. Proyecto final sobre optimizacion de bases de datos distribuidas.',
    credentialUrl: 'https://storage.ethoshub.com/credentials/titulo-unam.pdf',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    userId: 'user-1',
    institutionName: 'Platzi',
    degree: 'Especialista en Frontend con React',
    fieldOfStudy: 'Desarrollo Web',
    startDate: '2021-03-01',
    endDate: '2021-09-15',
    isCurrent: false,
    description:
      'Certificacion completa en React, incluyendo hooks, context, testing y patrones avanzados de arquitectura.',
    createdAt: '2024-01-16T14:20:00Z',
    updatedAt: '2024-01-16T14:20:00Z',
  },
  {
    id: '3',
    userId: 'user-1',
    institutionName: 'Google',
    degree: 'Professional Cloud Architect',
    fieldOfStudy: 'Cloud Computing',
    startDate: '2023-01-10',
    endDate: '2023-04-20',
    isCurrent: false,
    description:
      'Certificacion oficial de Google Cloud para diseno e implementacion de arquitecturas escalables en la nube.',
    credentialUrl: 'https://storage.ethoshub.com/credentials/gcp-cert.pdf',
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-02-01T09:00:00Z',
  },
];

const statItems = [
  { label: 'Titulos y certificaciones', value: '3' },
  { label: 'Anos de formacion', value: '4+' },
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
  const [records, setRecords] = useState<AcademicRecord[]>(mockAcademicRecords);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AcademicRecord | null>(null);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
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

  useEffect(() => {
    if (editingRecord) {
      setFormData({
        institutionName: editingRecord.institutionName,
        degree: editingRecord.degree,
        fieldOfStudy: editingRecord.fieldOfStudy,
        startDate: editingRecord.startDate,
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
  }, [editingRecord, isModalOpen]);

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
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.institutionName.trim()) {
      newErrors.institutionName = 'La institucion es obligatoria';
    }
    if (!formData.degree.trim()) {
      newErrors.degree = 'El titulo es obligatorio';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const recordData = {
        institutionName: formData.institutionName,
        degree: formData.degree,
        fieldOfStudy: formData.fieldOfStudy,
        startDate: formData.startDate,
        endDate: formData.isCurrent ? undefined : formData.endDate,
        isCurrent: formData.isCurrent,
        description: formData.description,
        credentialUrl: formData.credentialUrl,
      };

      if (editingRecord) {
        // Update existing record
        setRecords((prev) =>
          prev.map((r) =>
            r.id === editingRecord.id
              ? { ...r, ...recordData, updatedAt: new Date().toISOString() }
              : r
          )
        );
      } else {
        // Add new record
        const newRecord: AcademicRecord = {
          id: `${Date.now()}`,
          userId: 'user-1',
          ...recordData,
          endDate: recordData.endDate,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setRecords((prev) => [newRecord, ...prev]);
      }

      closeModal();
    }
  };

  const handleDelete = () => {
    if (editingRecord) {
      setRecords((prev) => prev.filter((r) => r.id !== editingRecord.id));
      closeModal();
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
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const removeFile = () => {
    setUploadedFileName(null);
    setFormData((prev) => ({ ...prev, credentialUrl: '' }));
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.16),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.12),_transparent_28%)]" />
          <div className="relative grid gap-5 sm:gap-6 lg:grid-cols-[1.5fr_0.9fr]">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                Trayectoria Academica
              </div>

              <div>
                <h1 className="font-sans text-3xl font-semibold tracking-tight text-foreground">
                  Formacion y certificaciones profesionales.
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                  Registra tus titulos, certificaciones y cursos relevantes. Cada entrada refuerza
                  tu credibilidad profesional y valida tu experiencia tecnica.
                </p>
              </div>

              <Button
                variant="primary"
                onClick={openAddModal}
                className="mt-2 gap-2 bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4" />
                Agregar Trayectoria
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
        {/* Academic Records List */}
        <div className="rounded-3xl border border-border bg-card p-5 sm:p-7">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Historial Academico</h2>
              <p className="text-sm text-muted-foreground">
                Titulos, certificaciones y formacion continua.
              </p>
            </div>
          </div>

          {records.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 py-12 text-center">
              <GraduationCap className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium text-foreground">
                Sin registros academicos
              </h3>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Agrega tu formacion academica, certificaciones y cursos para fortalecer tu perfil
                profesional.
              </p>
              <Button
                variant="primary"
                onClick={openAddModal}
                className="mt-6 gap-2 bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4" />
                Agregar Trayectoria
              </Button>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-5">
              {records.map((record, index) => {
                const isExpanded = expandedCards.has(record.id);
                return (
                  <motion.article
                    key={record.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.005 }}
                    className="relative rounded-2xl border border-border bg-background/60 p-4 transition-colors hover:border-indigo-500/30 sm:p-5 dark:bg-black/40"
                  >
                    {index < records.length - 1 && (
                      <div className="absolute left-[1.35rem] top-full h-5 w-px bg-border" />
                    )}

                    <div className="flex gap-4">
                      <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600">
                        <BookOpen className="h-5 w-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-foreground">
                              {record.degree}
                            </h3>
                            <p className="text-sm font-medium text-indigo-600">
                              {record.institutionName}
                            </p>
                            {record.fieldOfStudy && (
                              <p className="mt-1 text-xs text-muted-foreground">
                                {record.fieldOfStudy}
                              </p>
                            )}
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="space-y-1 text-sm text-muted-foreground sm:text-right">
                              <div className="inline-flex items-center gap-2">
                                <CalendarRange className="h-4 w-4" />
                                {formatDate(record.startDate)} -{' '}
                                {record.isCurrent ? 'Presente' : formatDate(record.endDate || '')}
                              </div>
                            </div>
                            <button
                              onClick={() => openEditModal(record)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                              aria-label="Editar"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {record.description && (
                          <div className="mt-3">
                            <p
                              className={`text-sm leading-6 text-muted-foreground ${
                                !isExpanded ? 'line-clamp-2' : ''
                              }`}
                            >
                              {record.description}
                            </p>
                            {record.description.length > 150 && (
                              <button
                                onClick={() => toggleCardExpanded(record.id)}
                                className="mt-1 flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700"
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

        {/* Sidebar */}
        <aside className="space-y-6 xl:sticky xl:top-24 xl:self-start">
          <div className="rounded-3xl border border-border bg-card p-5 sm:p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600">
                <Award className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Tipos de formacion</h2>
            </div>

            <div className="space-y-3">
              {[
                'Titulos universitarios y posgrados.',
                'Certificaciones tecnicas (AWS, Google, etc.).',
                'Bootcamps y programas intensivos.',
                'Cursos especializados y diplomados.',
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
              Incluir certificados verificables aumenta la confianza de los reclutadores. Sube PDFs
              o imagenes de tus credenciales para destacar en busquedas.
            </p>
          </div>
        </aside>
      </div>

 {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          // 1. Contenedor Flex de pantalla completa para centrado absoluto
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={closeModal}
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              // Quitamos position absolute y translate, usamos max-h-full y flex-col
              className="relative flex max-h-full w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl dark:bg-black"
            >
              {/* Header (shrink-0 para que no se aplaste) */}
              <div className="flex shrink-0 items-center justify-between border-b border-border px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      {isEditMode ? 'Editar Trayectoria' : 'Nueva Trayectoria'}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Registro academico o certificacion
                    </p>
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

              {/* Formulario (flex-1 para rellenar espacio, overflow-y-auto para scroll interno) */}
              <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-4">
                    {/* Institution Name */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        Institucion *
                      </label>
                      <input
                        type="text"
                        value={formData.institutionName}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, institutionName: e.target.value }))
                        }
                        placeholder="Universidad Nacional Autonoma de Mexico"
                        className={`w-full rounded-xl border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                          errors.institutionName
                            ? 'border-destructive'
                            : 'border-border focus:border-indigo-500'
                        }`}
                      />
                      {errors.institutionName && (
                        <p className="text-xs text-destructive">{errors.institutionName}</p>
                      )}
                    </div>

                    {/* Degree */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        Titulo / Grado *
                      </label>
                      <input
                        type="text"
                        value={formData.degree}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, degree: e.target.value }))
                        }
                        placeholder="Ingeniero de Sistemas"
                        className={`w-full rounded-xl border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                          errors.degree
                            ? 'border-destructive'
                            : 'border-border focus:border-indigo-500'
                        }`}
                      />
                      {errors.degree && (
                        <p className="text-xs text-destructive">{errors.degree}</p>
                      )}
                    </div>

                    {/* Field of Study */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        Area de Estudio
                      </label>
                      <input
                        type="text"
                        value={formData.fieldOfStudy}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, fieldOfStudy: e.target.value }))
                        }
                        placeholder="Software Development"
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
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
                          className={`w-full rounded-xl border bg-background px-4 py-3 text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                            errors.startDate
                              ? 'border-destructive'
                              : 'border-border focus:border-indigo-500'
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
                          className={`w-full rounded-xl border bg-background px-4 py-3 text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50 ${
                            errors.endDate
                              ? 'border-destructive'
                              : 'border-border focus:border-indigo-500'
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
                        className="h-4 w-4 rounded border-border text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-foreground">Actualmente estudiando aqui</span>
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
                        placeholder="Describe tus logros, proyectos relevantes o especializacion..."
                        rows={4}
                        maxLength={maxDescriptionChars}
                        className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>

                    {/* File Upload */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        Subir Titulo o Certificado (PDF/JPG)
                      </label>

                      {isUploading ? (
                        <div className="rounded-xl border border-border bg-muted/30 px-4 py-6">
                          <div className="flex items-center gap-3">
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                              <motion.div
                                className="h-full bg-indigo-600"
                                initial={{ width: 0 }}
                                animate={{ width: `${uploadProgress}%` }}
                                transition={{ duration: 0.1 }}
                              />
                            </div>
                            <span className="text-sm font-medium text-foreground">
                              {uploadProgress}%
                            </span>
                          </div>
                          <p className="mt-2 text-center text-xs text-muted-foreground">
                            Subiendo archivo...
                          </p>
                        </div>
                      ) : uploadedFileName ? (
                        <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 px-4 py-3">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-indigo-600" />
                            <span className="text-sm text-foreground">{uploadedFileName}</span>
                          </div>
                          <button
                            type="button"
                            onClick={removeFile}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                          className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed bg-muted/30 px-4 py-8 transition-colors ${
                            isDragging
                              ? 'border-indigo-500 bg-indigo-500/5'
                              : 'border-border hover:border-indigo-500/50 hover:bg-muted/50'
                          }`}
                        >
                          <Upload className="h-8 w-8 text-muted-foreground" />
                          <p className="mt-2 text-sm text-muted-foreground">
                            Arrastra un archivo o{' '}
                            <span className="text-indigo-600">haz clic para seleccionar</span>
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">PDF, JPG o PNG</p>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileInputChange}
                            className="hidden"
                          />
                        </div>
                      )}
                      {errors.file && <p className="text-xs text-destructive">{errors.file}</p>}
                    </div>
                  </div>
                </div>

                {/* Footer (shrink-0 para proteger los botones) */}
                <div className="flex shrink-0 items-center justify-between border-t border-border bg-card px-6 py-4 dark:bg-black">
                  <div>
                    {isEditMode && (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handleDelete}
                        className="gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        Eliminar
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="ghost" onClick={closeModal}>
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      onClick={handleSubmit}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      Guardar
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