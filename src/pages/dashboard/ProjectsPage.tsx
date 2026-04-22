import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Plus,
  Star,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  Calendar,
  FolderKanban,
  ExternalLink,
} from 'lucide-react';
import { useAuthStore, useProjectsStore, useUiStore } from '@/store';
import {
  Button,
  Card,
  CardContent,
  Badge,
  Modal,
  Input,
  Textarea,
  Select,
  SectionHeader,
  Skeleton,
  EmptyState,
  ConfirmDialog,
  ToggleSwitch,
} from '@/shared/ui';
import { formatDate, isValidMediaUrl, getMediaType } from '@/shared/lib/utils';
import type { Project, ProjectCategory, ProjectStatus, TechnicalInfo, ProjectMedia } from '@/shared/types';

const projectCategories: { value: ProjectCategory; label: string }[] = [
  { value: 'Web', label: 'Web' },
  { value: 'Mobile', label: 'Mobile' },
  { value: 'API', label: 'API' },
  { value: 'Data', label: 'Data' },
  { value: 'DevOps', label: 'DevOps' },
  { value: 'Other', label: 'Otro' },
];

const projectStatuses: { value: ProjectStatus; label: string }[] = [
  { value: 'draft', label: 'Borrador' },
  { value: 'in_progress', label: 'En progreso' },
  { value: 'completed', label: 'Completado' },
  { value: 'archived', label: 'Archivado' },
];

const statusColors: Record<ProjectStatus, 'secondary' | 'warning' | 'success' | 'default'> = {
  draft: 'secondary',
  in_progress: 'warning',
  completed: 'success',
  archived: 'default',
};

export default function ProjectsPage() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { addToast } = useUiStore();
  const { projects, loading, fetchProjects, createProject, updateProject, deleteProject } = useProjectsStore();

  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Web' as ProjectCategory,
    status: 'draft' as ProjectStatus,
    isPublic: false,
    isFeatured: false,
    thumbnail: '',
    technicalInfo: {
      role: '',
      technologies: [] as string[],
      startDate: '',
      endDate: '',
      results: '',
    } as TechnicalInfo,
  });
  const [techInput, setTechInput] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaList, setMediaList] = useState<ProjectMedia[]>([]);

  useEffect(() => {
    if (user) {
      fetchProjects(user.id);
    }
  }, [user, fetchProjects]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'Web',
      status: 'draft',
      isPublic: false,
      isFeatured: false,
      thumbnail: '',
      technicalInfo: {
        role: '',
        technologies: [],
        startDate: '',
        endDate: '',
        results: '',
      },
    });
    setMediaList([]);
    setTechInput('');
    setMediaUrl('');
    setEditingProject(null);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      category: project.category,
      status: project.status,
      isPublic: project.isPublic,
      isFeatured: project.isFeatured,
      thumbnail: project.thumbnail || '',
      technicalInfo: { ...project.technicalInfo },
    });
    setMediaList([...project.media]);
    setShowModal(true);
  };

  const handleAddTech = () => {
    if (techInput.trim() && !formData.technicalInfo.technologies.includes(techInput.trim())) {
      setFormData({
        ...formData,
        technicalInfo: {
          ...formData.technicalInfo,
          technologies: [...formData.technicalInfo.technologies, techInput.trim()],
        },
      });
      setTechInput('');
    }
  };

  const handleRemoveTech = (tech: string) => {
    setFormData({
      ...formData,
      technicalInfo: {
        ...formData.technicalInfo,
        technologies: formData.technicalInfo.technologies.filter((t) => t !== tech),
      },
    });
  };

  const handleAddMedia = () => {
    if (!mediaUrl.trim()) return;

    if (!isValidMediaUrl(mediaUrl)) {
      addToast({ type: 'error', title: 'URL no válida. Solo YouTube, Vimeo, Figma o Google Slides.' });
      return;
    }

    const type = getMediaType(mediaUrl);
    if (!type) return;

    setMediaList([
      ...mediaList,
      {
        id: Date.now().toString(),
        projectId: editingProject?.id || '',
        url: mediaUrl,
        type,
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} embed`,
      },
    ]);
    setMediaUrl('');
  };

  const handleSubmit = async () => {
    if (!user || !formData.title.trim() || !formData.description.trim()) {
      addToast({ type: 'error', title: 'Título y descripción son obligatorios' });
      return;
    }

    const projectData = {
      ...formData,
      media: mediaList,
    };

    if (editingProject) {
      await updateProject(editingProject.id, projectData);
      addToast({ type: 'success', title: 'Proyecto actualizado exitosamente' });
    } else {
      await createProject(user.id, projectData);
      addToast({ type: 'success', title: 'Proyecto creado exitosamente' });
    }

    setShowModal(false);
    resetForm();
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    await deleteProject(deleteConfirm);
    addToast({ type: 'success', title: 'Proyecto eliminado' });
    setDeleteConfirm(null);
  };

  const filteredProjects = filterStatus === 'all'
    ? projects
    : projects.filter((p) => p.status === filterStatus);

  return (
    <div className="space-y-6">
      <SectionHeader
        title={t('projects.title')}
        description="Gestiona tu catálogo de proyectos y evidencias"
        action={
          <Button onClick={() => setShowModal(true)}>
            <Plus className="h-4 w-4" />
            {t('projects.addProject')}
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          options={[
            { value: 'all', label: 'Todos los estados' },
            ...projectStatuses,
          ]}
          className="w-48"
        />
        <Badge variant="outline">{filteredProjects.length} proyectos</Badge>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group overflow-hidden">
                {/* Thumbnail */}
                {project.thumbnail ? (
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                    {project.isFeatured && (
                      <div className="absolute left-2 top-2">
                        <Badge className="bg-yellow-500 text-white">
                          <Star className="mr-1 h-3 w-3" />
                          Destacado
                        </Badge>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex aspect-video items-center justify-center bg-muted">
                    <FolderKanban className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}

                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-foreground truncate">
                        {project.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Badge variant={statusColors[project.status]}>
                      {projectStatuses.find((s) => s.value === project.status)?.label}
                    </Badge>
                    <Badge variant="outline">{project.category}</Badge>
                    {project.isPublic ? (
                      <Badge variant="success" className="gap-1">
                        <Eye className="h-3 w-3" />
                        Público
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="gap-1">
                        <EyeOff className="h-3 w-3" />
                        Privado
                      </Badge>
                    )}
                  </div>

                  {/* Technologies */}
                  {project.technicalInfo.technologies.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {project.technicalInfo.technologies.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technicalInfo.technologies.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{project.technicalInfo.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDate(project.updatedAt)}
                    </span>
                    <div className="flex gap-1">
                      <Link to={`/dashboard/projects/${project.id}`}>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(project)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteConfirm(project.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<FolderKanban className="h-12 w-12" />}
          title="No tienes proyectos"
          description="Agrega tu primer proyecto para mostrar tu trabajo"
          action={
            <Button onClick={() => setShowModal(true)}>
              <Plus className="h-4 w-4" />
              Crear proyecto
            </Button>
          }
        />
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editingProject ? t('projects.editProject') : t('projects.addProject')}
        size="xl"
      >
        <div className="max-h-[70vh] space-y-6 overflow-y-auto pr-2">
          {/* Basic Info */}
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label={t('projects.projectTitle')}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Nombre del proyecto"
            />
            <Select
              label={t('projects.category')}
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as ProjectCategory })}
              options={projectCategories}
            />
          </div>

          <Textarea
            label={t('projects.description')}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe tu proyecto..."
          />

          <div className="grid gap-4 md:grid-cols-2">
            <Select
              label={t('projects.status')}
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
              options={projectStatuses}
            />
            <Input
              label="Thumbnail URL"
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className="flex flex-wrap gap-6">
            <ToggleSwitch
              checked={formData.isPublic}
              onChange={(checked) => setFormData({ ...formData, isPublic: checked })}
              label={t('projects.public')}
            />
            <ToggleSwitch
              checked={formData.isFeatured}
              onChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
              label={t('projects.featured')}
            />
          </div>

          {/* Technical Info */}
          <div className="space-y-4 rounded-lg border border-border p-4">
            <h4 className="font-medium text-foreground">{t('projects.technicalInfo')}</h4>

            <Input
              label={t('projects.role')}
              value={formData.technicalInfo.role}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  technicalInfo: { ...formData.technicalInfo, role: e.target.value },
                })
              }
              placeholder="Ej: Lead Developer"
            />

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                type="date"
                label={t('projects.startDate')}
                value={formData.technicalInfo.startDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    technicalInfo: { ...formData.technicalInfo, startDate: e.target.value },
                  })
                }
              />
              <Input
                type="date"
                label={t('projects.endDate')}
                value={formData.technicalInfo.endDate || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    technicalInfo: { ...formData.technicalInfo, endDate: e.target.value },
                  })
                }
              />
            </div>

            {/* Technologies */}
            <div>
              <label className="mb-1.5 block text-sm font-medium">{t('projects.technologies')}</label>
              <div className="flex gap-2">
                <Input
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                  placeholder="Agregar tecnología..."
                  className="flex-1"
                />
                <Button type="button" variant="outline" onClick={handleAddTech}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.technicalInfo.technologies.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.technicalInfo.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary" className="gap-1">
                      {tech}
                      <button
                        onClick={() => handleRemoveTech(tech)}
                        className="ml-1 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <Textarea
              label={t('projects.results')}
              value={formData.technicalInfo.results}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  technicalInfo: { ...formData.technicalInfo, results: e.target.value },
                })
              }
              placeholder="Describe los resultados obtenidos..."
            />
          </div>

          {/* Media */}
          <div className="space-y-4 rounded-lg border border-border p-4">
            <h4 className="font-medium text-foreground">{t('projects.media')}</h4>
            <p className="text-sm text-muted-foreground">
              Solo YouTube, Vimeo, Figma o Google Slides
            </p>

            <div className="flex gap-2">
              <Input
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="flex-1"
              />
              <Button type="button" variant="outline" onClick={handleAddMedia}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {mediaList.length > 0 && (
              <div className="space-y-2">
                {mediaList.map((media, index) => (
                  <div
                    key={media.id}
                    className="flex items-center justify-between rounded-lg bg-muted p-3"
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{media.type}</Badge>
                      <span className="text-sm truncate max-w-xs">{media.url}</span>
                    </div>
                    <button
                      onClick={() => setMediaList(mediaList.filter((_, i) => i !== index))}
                      className="text-destructive hover:text-destructive/80"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-border pt-4">
          <Button
            variant="outline"
            onClick={() => {
              setShowModal(false);
              resetForm();
            }}
          >
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSubmit} disabled={!formData.title.trim() || !formData.description.trim()}>
            {editingProject ? 'Actualizar' : 'Crear'} proyecto
          </Button>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title={t('projects.deleteProject')}
        message={`${t('projects.confirmDelete')} ${t('projects.deleteWarning')}`}
        confirmLabel={t('common.delete')}
        variant="destructive"
      />
    </div>
  );
}
