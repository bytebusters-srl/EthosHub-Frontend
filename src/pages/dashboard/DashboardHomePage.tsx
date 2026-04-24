import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  Image,
  FileText,
  Link2,
  ArrowRight,
  Settings,
  Eye,
  Code2,
  FolderKanban,
  Star,
  TrendingUp,
} from 'lucide-react';
import { useAuthStore, useSkillsStore, useProjectsStore } from '@/store';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  Avatar, 
  Badge, 
  Button, 
  Progress,
  Tabs,
  Skeleton 
} from '@/shared/ui';
import { FeedPost, FeedPostSkeleton, SuggestedTalents, TrendingSkills } from '@/features/feed';
import type { FeedPostData, SuggestedTalentData } from '@/features/feed';
import RecruiterTalentSearchPage from './RecruiterTalentSearchPage';

// Mock data for the social feed
const mockPosts: FeedPostData[] = [
  {
    id: '1',
    author: {
      id: 'user1',
      name: 'Carlos Mendoza',
      avatar: '',
      headline: 'Senior Backend Engineer at TechCorp',
      slug: 'carlos-mendoza',
    },
    content: 'Acabo de publicar un artículo sobre cómo optimizamos nuestras consultas PostgreSQL y redujimos el tiempo de respuesta en un 60%. Los índices parciales fueron clave para el rendimiento.',
    skills: ['PostgreSQL', 'Performance', 'Backend'],
    likes: 24,
    comments: 8,
    shares: 3,
    isLiked: false,
    isBookmarked: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    author: {
      id: 'user2',
      name: 'María Torres',
      avatar: '',
      headline: 'Frontend Lead | Design Systems',
      slug: 'maria-torres',
    },
    content: 'Nueva versión de nuestro Design System en producción. 47 componentes, dark mode completo, y documentación con Storybook. El equipo hizo un trabajo increíble.',
    skills: ['React', 'Design Systems', 'TypeScript'],
    likes: 89,
    comments: 15,
    shares: 12,
    isLiked: true,
    isBookmarked: true,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    author: {
      id: 'user3',
      name: 'Diego Ruiz',
      avatar: '',
      headline: 'DevOps Engineer | Cloud Architecture',
      slug: 'diego-ruiz',
    },
    content: 'Tip de la semana: Si están usando Kubernetes en producción, consideren implementar Pod Disruption Budgets. Nos salvó durante una actualización de nodos que casi tumba el servicio.',
    skills: ['Kubernetes', 'DevOps', 'AWS'],
    likes: 156,
    comments: 23,
    shares: 45,
    isLiked: false,
    isBookmarked: false,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    author: {
      id: 'user4',
      name: 'Ana López',
      avatar: '',
      headline: 'Full Stack Developer | Startup Enthusiast',
      slug: 'ana-lopez',
    },
    content: 'Después de 3 años trabajando con microservicios, mi conclusión es: empieza con un monolito bien estructurado. Puedes extraer servicios cuando realmente los necesites. La complejidad prematura mata proyectos.',
    skills: ['Architecture', 'Microservices', 'Best Practices'],
    likes: 234,
    comments: 67,
    shares: 89,
    isLiked: false,
    isBookmarked: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

const mockSuggestedTalents: SuggestedTalentData[] = [
  {
    id: 't1',
    name: 'Laura Sánchez',
    avatar: '',
    headline: 'React Native Developer',
    slug: 'laura-sanchez',
    skills: ['React Native', 'TypeScript'],
    mutualConnections: 5,
    isFollowing: false,
  },
  {
    id: 't2',
    name: 'Pedro Gómez',
    avatar: '',
    headline: 'Data Engineer at BigData Co',
    slug: 'pedro-gomez',
    skills: ['Python', 'Spark', 'Airflow'],
    mutualConnections: 3,
    isFollowing: false,
  },
  {
    id: 't3',
    name: 'Sofia Martinez',
    avatar: '',
    headline: 'UX Engineer',
    slug: 'sofia-martinez',
    skills: ['Figma', 'React', 'Design'],
    mutualConnections: 8,
    isFollowing: true,
  },
];

const mockTrendingSkills = [
  { name: 'AI/ML', growth: 145, posts: 1234 },
  { name: 'TypeScript', growth: 78, posts: 890 },
  { name: 'Rust', growth: 67, posts: 456 },
  { name: 'Kubernetes', growth: 45, posts: 678 },
];

type FeedTab = 'para-ti' | 'siguiendo' | 'tendencias';

export default function DashboardHomePage() {
  const { user } = useAuthStore();
  const { hardSkills, fetchHardSkills, loading: skillsLoading } = useSkillsStore();
  const { projects, fetchProjects } = useProjectsStore();
  const [activeTab, setActiveTab] = useState<FeedTab>('para-ti');
  const [feedLoading, setFeedLoading] = useState(true);

  // Recruiters see a different page
  if (user?.role === 'recruiter') {
    return <RecruiterTalentSearchPage />;
  }

  useEffect(() => {
    if (user) {
      fetchHardSkills(user.id);
      fetchProjects(user.id);
    }
    // Simulate feed loading
    const timer = setTimeout(() => setFeedLoading(false), 800);
    return () => clearTimeout(timer);
  }, [user, fetchHardSkills, fetchProjects]);

  const topSkills = hardSkills
    .filter((s) => s.isTop)
    .sort((left, right) => (left.topOrder ?? Number.MAX_SAFE_INTEGER) - (right.topOrder ?? Number.MAX_SAFE_INTEGER));
  const profileCompletion = calculateProfileCompletion(user, hardSkills.length, projects.length);

  const feedTabs = [
    { id: 'para-ti' as const, label: 'Para ti' },
    { id: 'siguiendo' as const, label: 'Siguiendo' },
    { id: 'tendencias' as const, label: 'Tendencias' },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <div className="grid gap-6 lg:grid-cols-[280px_1fr_300px]">
        {/* Left Column - Profile Summary */}
        <div className="hidden lg:block">
          <div className="sticky top-6 space-y-4">
            {/* Profile Card */}
            <Card className="overflow-hidden">
              <div className="h-16 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20" />
              <CardContent className="-mt-8 text-center">
                <Avatar
                  src={user?.avatar}
                  name={user?.name}
                  size="xl"
                  className="mx-auto ring-4 ring-card"
                />
                <h2 className="mt-3 font-semibold text-foreground">{user?.name}</h2>
                <p className="text-sm text-muted-foreground">{user?.headline || user?.profession}</p>
                
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-lg font-bold text-foreground">{hardSkills.length}</p>
                    <p className="text-xs text-muted-foreground">Skills</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-foreground">{projects.length}</p>
                    <p className="text-xs text-muted-foreground">Proyectos</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-foreground">0</p>
                    <p className="text-xs text-muted-foreground">Seguidores</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Perfil completo</span>
                    <span className="font-medium text-primary">{profileCompletion}%</span>
                  </div>
                  <Progress value={profileCompletion} size="sm" className="mt-2" />
                </div>

                <Link to={`/p/${user?.slug}`}>
                  <Button variant="outline" size="sm" className="mt-4 w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    Ver perfil público
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardContent className="p-3">
                <nav className="space-y-1">
                  {[
                    { to: '/dashboard/skills', icon: Code2, label: 'Mis habilidades' },
                    { to: '/dashboard/projects', icon: FolderKanban, label: 'Mis proyectos' },
                    { to: '/dashboard/connections', icon: Link2, label: 'Conexiones' },
                    { to: '/dashboard/settings', icon: Settings, label: 'Configuración' },
                  ].map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <link.icon className="h-4 w-4" />
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </CardContent>
            </Card>

            {/* Top Skills Preview */}
            {topSkills.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Star className="h-4 w-4 text-yellow-500" />
                    Top Skills
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {topSkills.slice(0, 3).map((skill) => (
                      <div
                        key={skill.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-foreground">{skill.skillTag.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {skill.level}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Center Column - Feed */}
        <div className="space-y-4">
          {/* Create Post Prompt */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Avatar
                  src={user?.avatar}
                  name={user?.name}
                  size="md"
                />
                <button className="flex-1 rounded-full border border-border bg-muted/50 px-4 py-2.5 text-left text-sm text-muted-foreground transition-colors hover:bg-muted">
                  ¿Qué estás pensando, {user?.name?.split(' ')[0]}?
                </button>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                <div className="flex gap-1">
                  <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                    <Image className="h-4 w-4 text-green-500" />
                    <span className="hidden sm:inline">Imagen</span>
                  </button>
                  <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                    <FileText className="h-4 w-4 text-blue-500" />
                    <span className="hidden sm:inline">Artículo</span>
                  </button>
                  <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                    <Link2 className="h-4 w-4 text-purple-500" />
                    <span className="hidden sm:inline">Proyecto</span>
                  </button>
                </div>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Publicar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Feed Tabs */}
          <Tabs
            tabs={feedTabs}
            activeTab={activeTab}
            onChange={(id) => setActiveTab(id as FeedTab)}
          />

          {/* Feed Posts */}
          <div className="space-y-4">
            {feedLoading ? (
              <>
                <FeedPostSkeleton />
                <FeedPostSkeleton />
                <FeedPostSkeleton />
              </>
            ) : (
              mockPosts.map((post) => (
                <FeedPost
                  key={post.id}
                  post={post}
                  onLike={(id) => console.log('Liked post:', id)}
                  onBookmark={(id) => console.log('Bookmarked post:', id)}
                />
              ))
            )}
          </div>

          {/* Load More */}
          {!feedLoading && (
            <div className="text-center py-4">
              <Button variant="outline">
                Cargar más publicaciones
              </Button>
            </div>
          )}
        </div>

        {/* Right Column - Suggestions */}
        <div className="hidden lg:block">
          <div className="sticky top-6 space-y-4">
            <SuggestedTalents
              talents={mockSuggestedTalents}
              onFollow={(id) => console.log('Follow:', id)}
            />
            
            <TrendingSkills skills={mockTrendingSkills} />

            {/* Quick Stats */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Tu actividad
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Vistas de perfil</span>
                    <span className="font-medium text-foreground">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Impresiones</span>
                    <span className="font-medium text-foreground">89</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Apariciones en búsqueda</span>
                    <span className="font-medium text-foreground">23</span>
                  </div>
                </div>
                <Link
                  to="/dashboard/analytics"
                  className="mt-3 flex items-center justify-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  Ver analytics
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function calculateProfileCompletion(
  user: typeof useAuthStore.prototype.user,
  skillsCount: number,
  projectsCount: number
): number {
  let score = 0;
  const total = 6;

  if (user?.name) score++;
  if (user?.bio) score++;
  if (user?.avatar) score++;
  if (user?.headline || user?.profession) score++;
  if (skillsCount > 0) score++;
  if (projectsCount > 0) score++;

  return Math.round((score / total) * 100);
}
