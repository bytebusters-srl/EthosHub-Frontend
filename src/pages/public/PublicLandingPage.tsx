import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Code2,
  GitBranch,
  Globe,
  Search,
  Sparkles,
  UserRoundSearch,
  Users,
  Zap,
  Shield,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button, Badge } from '@/shared/ui';

const features = [
  {
    icon: GitBranch,
    title: 'Integración GitHub',
    description: 'Importa repositorios, stack y evidencia real para fortalecer tu portafolio.',
  },
  {
    icon: Briefcase,
    title: 'Integración LinkedIn',
    description: 'Sincroniza experiencia, formación y logros para ahorrar tiempo de carga.',
  },
  {
    icon: UserRoundSearch,
    title: 'Red de talento',
    description: 'Conecta con profesionales y reclutadores desde una sola plataforma.',
  },
  {
    icon: Zap,
    title: 'Matchmaking IA',
    description: 'Algoritmos inteligentes que conectan tu perfil con oportunidades relevantes.',
  },
  {
    icon: Shield,
    title: 'Verificación de skills',
    description: 'Sistema de endorsements que valida tus habilidades con credibilidad.',
  },
  {
    icon: Code2,
    title: 'Portafolio visual',
    description: 'Presenta tus proyectos con galerías, videos y documentación técnica.',
  },
];

const stats = [
  { value: '1,200+', label: 'Profesionales activos' },
  { value: '5,000+', label: 'Skills verificados' },
  { value: '850+', label: 'Conexiones mensuales' },
];

const highlights = [
  '+1,200 profesionales',
  'Integración GitHub',
  'Integración LinkedIn',
];

export default function PublicLandingPage() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.15),transparent_50%),radial-gradient(circle_at_bottom_right,hsl(var(--accent)/0.1),transparent_40%)]" />
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 sm:pb-24 sm:pt-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-4xl text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              <Sparkles className="h-4 w-4" />
              La plataforma para desarrolladores
            </div>

            <h1 className="mt-8 text-5xl font-black tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Tu portafolio digital
              <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                profesional
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-muted-foreground sm:text-xl">
              Crea un portafolio impresionante, muestra tus proyectos y conecta con reclutadores de las mejores empresas tech. Todo en un solo lugar.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/register">
                <Button className="h-12 min-w-56 rounded-2xl px-6 text-base font-semibold shadow-[0_20px_45px_-24px_hsl(var(--primary)/0.6)]">
                  Crear mi portafolio
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/explorar">
                <Button variant="outline" className="h-12 min-w-56 rounded-2xl px-6 text-base">
                  Explorar talento
                </Button>
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {['bg-green-400', 'bg-yellow-400', 'bg-blue-400', 'bg-red-400'].map((color, index) => (
                    <div
                      key={index}
                      className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-background text-xs font-bold text-foreground ${color}`}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>
                  ))}
                </div>
                <span>{highlights[0]}</span>
              </div>
              <span className="inline-flex items-center gap-2">
                <GitBranch className="h-4 w-4" />
                {highlights[1]}
              </span>
              <span className="inline-flex items-center gap-2">
                <Users className="h-4 w-4" />
                {highlights[2]}
              </span>
            </div>
          </motion.div>

          {/* Preview Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-14 max-w-5xl rounded-[2rem] border border-border bg-card shadow-2xl"
          >
            <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3 text-sm text-muted-foreground">
              <span>ethoshub.com/u/ana-garcia</span>
              <Badge className="rounded-full">
                Perfil verificado
              </Badge>
            </div>

            <div className="grid gap-6 p-4 sm:p-6">
              <div className="rounded-[1.75rem] border border-border bg-card p-5 sm:p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-bold text-primary">
                    AG
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-bold text-foreground">Ana Garcia</h2>
                      <span className="inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                        <BadgeCheck className="h-3.5 w-3.5" />
                        Senior Full Stack Engineer
                      </span>
                    </div>
                    <p className="mt-3 text-muted-foreground">Cochabamba, Bolivia - +8 años</p>
                    <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
                      Construye productos SaaS escalables con foco en experiencia de usuario, arquitectura frontend y calidad técnica.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {['React', 'TypeScript', 'Node.js', 'Design Systems', 'GraphQL'].map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-foreground"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-[1.75rem] border border-border bg-muted/50 p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Code2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Resumen profesional</p>
                      <p className="text-sm text-muted-foreground">Listo para compartir como link directo</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">
                    Presenta proyectos, experiencia y habilidades en un perfil elegante, verificable y pensado para reclutadores.
                  </p>
                </div>

                <div className="rounded-[1.75rem] border border-border bg-muted/50 p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Search className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Visibilidad inmediata</p>
                      <p className="text-sm text-muted-foreground">Perfil, talento y networking</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    {['Proyectos destacados', 'Links profesionales', 'Experiencia curada'].map((item) => (
                      <div
                        key={item}
                        className="rounded-2xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-muted/30 py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-8 md:grid-cols-3">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-4xl font-black text-primary">{stat.value}</p>
                <p className="mt-2 text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="caracteristicas" className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-3xl text-center"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Características</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-foreground">
              Todo lo que necesitas para destacar
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Herramientas potentes para crear un portafolio profesional y mostrar tu potencial.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {features.map(({ icon: Icon, title, description }, index) => (
              <motion.article
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group rounded-[1.75rem] border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_24px_50px_-20px_hsl(var(--primary)/0.2)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-2xl font-bold text-foreground">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="explorar-talento" className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="overflow-hidden rounded-[2rem] border border-border bg-gradient-to-br from-card via-card to-primary/5 px-6 py-10 shadow-2xl sm:px-10"
          >
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">
                  Explorar talento
                </p>
                <h2 className="mt-4 text-4xl font-black tracking-tight text-foreground sm:text-5xl">
                  Descubre profesionales tech antes de iniciar sesión
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
                  Navega previews de perfiles públicos, evalúa trayectorias y luego desbloquea la experiencia completa con tu cuenta.
                </p>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <Link to="/explorar">
                    <Button className="h-12 rounded-2xl px-6 text-base font-semibold">
                      Ver talento ahora
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button
                      variant="outline"
                      className="h-12 rounded-2xl px-6 text-base"
                    >
                      Iniciar sesión
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="grid gap-4">
                {[
                  { icon: Globe, title: 'Perfil público', text: 'Comparte tu link profesional en segundos.' },
                  { icon: Users, title: 'Networking', text: 'Conecta con talento y reclutadores en el mismo flujo.' },
                  { icon: Briefcase, title: 'Presentación clara', text: 'Muestra experiencia, skills y proyectos de forma ordenada.' },
                ].map(({ icon: Icon, title, text }, index) => (
                  <motion.div 
                    key={title} 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="rounded-[1.5rem] border border-border bg-card/80 p-5 backdrop-blur"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{title}</p>
                        <p className="text-sm leading-6 text-muted-foreground">{text}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
