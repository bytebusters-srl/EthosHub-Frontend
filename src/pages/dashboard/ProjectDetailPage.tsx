import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  Tag,
  User,
  Eye,
  EyeOff,
  Star,
  ExternalLink,
  Play,
  FileText,
  Download,
} from 'lucide-react';
import { useProjectsStore } from '@/store';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Skeleton,
} from '@/shared/ui';
import { formatDate, getYoutubeEmbedUrl, getVimeoEmbedUrl } from '@/shared/lib/utils';

export default function ProjectDetailPage() {
  const { t } = useTranslation();
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { currentProject, loading, fetchProject, clearCurrentProject } = useProjectsStore();

  useEffect(() => {
    if (projectId) {
      fetchProject(projectId);
    }
    return () => clearCurrentProject();
  }, [projectId, fetchProject, clearCurrentProject]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">Proyecto no encontrado</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/dashboard/projects')}>
          Volver a proyectos
        </Button>
      </div>
    );
  }

  const getEmbedUrl = (url: string, type: string) => {
    if (type === 'youtube') return getYoutubeEmbedUrl(url);
    if (type === 'vimeo') return getVimeoEmbedUrl(url);
    return url;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/dashboard/projects')}>
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-6 lg:grid-cols-3"
      >
        {/* Main content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Project header */}
          <Card>
            {currentProject.thumbnail && (
              <div className="aspect-video overflow-hidden rounded-t-xl">
                <img
                  src={currentProject.thumbnail}
                  alt={currentProject.title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    {currentProject.isFeatured && (
                      <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                    )}
                    <h1 className="text-2xl font-bold text-foreground">
                      {currentProject.title}
                    </h1>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{currentProject.category}</Badge>
                    <Badge
                      variant={
                        currentProject.status === 'completed'
                          ? 'success'
                          : currentProject.status === 'in_progress'
                          ? 'warning'
                          : 'secondary'
                      }
                    >
                      {currentProject.status === 'completed'
                        ? 'Completado'
                        : currentProject.status === 'in_progress'
                        ? 'En progreso'
                        : currentProject.status === 'draft'
                        ? 'Borrador'
                        : 'Archivado'}
                    </Badge>
                    {currentProject.isPublic ? (
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
                </div>
              </div>

              <p className="mt-4 text-muted-foreground">{currentProject.description}</p>

              <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Creado: {formatDate(currentProject.createdAt)}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Actualizado: {formatDate(currentProject.updatedAt)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Technical Info */}
          <Card>
            <CardHeader>
              <CardTitle>{t('projects.technicalInfo')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentProject.technicalInfo.role && (
                <div className="flex items-start gap-3">
                  <User className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {t('projects.role')}
                    </p>
                    <p className="text-foreground">{currentProject.technicalInfo.role}</p>
                  </div>
                </div>
              )}

              {currentProject.technicalInfo.technologies.length > 0 && (
                <div className="flex items-start gap-3">
                  <Tag className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {t('projects.technologies')}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {currentProject.technicalInfo.technologies.map((tech) => (
                        <Badge key={tech} variant="outline">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {(currentProject.technicalInfo.startDate || currentProject.technicalInfo.endDate) && (
                <div className="flex items-start gap-3">
                  <Calendar className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Período</p>
                    <p className="text-foreground">
                      {currentProject.technicalInfo.startDate &&
                        formatDate(currentProject.technicalInfo.startDate)}
                      {currentProject.technicalInfo.endDate &&
                        ` - ${formatDate(currentProject.technicalInfo.endDate)}`}
                      {!currentProject.technicalInfo.endDate &&
                        currentProject.technicalInfo.startDate &&
                        ' - Presente'}
                    </p>
                  </div>
                </div>
              )}

              {currentProject.technicalInfo.results && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('projects.results')}
                  </p>
                  <p className="mt-1 text-foreground">{currentProject.technicalInfo.results}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Media */}
          {currentProject.media.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  {t('projects.media')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentProject.media.map((media) => (
                    <div key={media.id} className="overflow-hidden rounded-lg border border-border">
                      {(media.type === 'youtube' || media.type === 'vimeo') && (
                        <div className="aspect-video">
                          <iframe
                            src={getEmbedUrl(media.url, media.type)}
                            title={media.title}
                            className="h-full w-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      )}
                      {(media.type === 'figma' || media.type === 'slides') && (
                        <div className="flex items-center justify-between p-4">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{media.type}</Badge>
                            <span className="text-sm">{media.title}</span>
                          </div>
                          <a
                            href={media.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Files */}
          {currentProject.files.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {t('projects.files')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {currentProject.files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between rounded-lg border border-border p-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link to="/dashboard/projects" className="block">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="h-4 w-4" />
                  Volver a proyectos
                </Button>
              </Link>
              {currentProject.isPublic && (
                <Link to={`/project/${currentProject.id}`} target="_blank" className="block">
                  <Button className="w-full">
                    <ExternalLink className="h-4 w-4" />
                    Ver página pública
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
