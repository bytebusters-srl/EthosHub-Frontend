import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff, LockKeyhole, Mail, Briefcase, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store';
import { cn } from '@/shared/lib/utils';
import { Button, Input } from '@/shared/ui';
import {
  AuthFooterLink,
  AuthHero,
  SocialAuthGroup,
} from '@/components/auth/AuthShared';
import type { UserRole } from '@/shared/types';

type RegisterPrefills = {
  email?: string;
  password?: string;
  role?: UserRole;
  fromRegister?: boolean;
  fullName?: string;
};

const OAUTH_BASE_URL = ((import.meta as ImportMeta & { env?: Record<string, string> }).env?.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '');

export default function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, loading } = useAuthStore();
  const prefills = (location.state as { prefills?: RegisterPrefills } | null)?.prefills;

  const [selectedRole, setSelectedRole] = useState<'Estandar' | 'Reclutador' | null>(null);
  const [showRoleRequiredMessage, setShowRoleRequiredMessage] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const shouldStartSkillOnboarding = (emailValue: string) => {
    const normalizedEmail = emailValue.toLowerCase().trim();
    const onboardingKey = `ethoshub_skills_onboarding_completed_${normalizedEmail}`;
    return localStorage.getItem(onboardingKey) !== 'true';
  };

  useEffect(() => {
    if (!prefills) return;

    if (prefills.email) setEmail(prefills.email);
    if (prefills.password) setPassword(prefills.password);
  }, [prefills]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación UI: Forzamos a elegir rol antes de mandar al backend
    if (!selectedRole) {
      setShowRoleRequiredMessage(true);
      toast.error('Selecciona un rol', { description: 'Indica si eres Profesional o Reclutador.' });
      return;
    }

    const roleToSend: UserRole = selectedRole === 'Reclutador' ? 'recruiter' : 'professional';
    
    // Llamada al store -> que llama al service -> que llama a Spring Boot
    const result = await login(email, password, roleToSend);
    
    if (result) {
      toast.success(`Bienvenido de nuevo, ${result.roleDisplayName}`, {
        description: 'Has iniciado sesión correctamente',
        duration: 4000,
      });

      if (result.user.role === 'professional' && shouldStartSkillOnboarding(result.user.email)) {
        navigate('/dashboard/skills?onboarding=1');
        return;
      }

      navigate(result.redirectPath);
    } else {
      toast.error('No se pudo iniciar sesión', {
        description: 'Verifica tus credenciales e intenta nuevamente.',
      });
    }
  };

  const handleOAuth = (provider: 'google' | 'github') => {
    if (!selectedRole) {
      setShowRoleRequiredMessage(true);
      toast.error('Debes elegir un rol antes de continuar', {
        description: 'Selecciona si eres Profesional o Reclutador para usar OAuth2.',
      });
      return;
    }

    const oauthRole = selectedRole === 'Estandar' ? 'PROFESSIONAL' : 'RECRUITER';
    const target = `${OAUTH_BASE_URL}/oauth2/authorization/${provider}?role=${oauthRole}`;
    window.location.href = target;
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm backdrop-blur transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Link>
      </div>

      <AuthHero
        eyebrow="Bienvenido de vuelta"
        title="Inicia sesión en tu cuenta"
        description="Accede a tu portafolio profesional y continúa construyendo tu presencia digital."
      />

      <motion.section
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="overflow-hidden rounded-3xl border border-border bg-card shadow-xl"
      >
        <div className="border-b border-border bg-gradient-to-b from-primary/5 to-transparent px-5 py-6 sm:px-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-primary">Acceso demo</p>
              <h2 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
                Iniciar sesión
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Usa las credenciales demo o ingresa las tuyas para continuar.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 px-5 py-6 sm:px-8 sm:py-8">
          <div className="grid grid-cols-2 gap-4">
            <motion.button
              type="button"
              onClick={() => {
                setSelectedRole('Estandar');
                setShowRoleRequiredMessage(false);
              }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'relative flex flex-col items-center gap-3 rounded-2xl border-2 p-5 text-center transition-all duration-200',
                selectedRole === 'Estandar'
                  ? 'border-ethoshub-blue bg-ethoshub-blue/5 shadow-[0_0_20px_-5px_rgba(37,99,235,0.3)] dark:bg-ethoshub-blue/10 dark:shadow-[0_0_25px_-5px_rgba(37,99,235,0.4)]'
                  : 'border-border bg-card opacity-70 hover:opacity-100 hover:border-muted-foreground/30'
              )}
            >
              <div className={cn(
                'flex h-12 w-12 items-center justify-center rounded-xl transition-colors',
                selectedRole === 'Estandar' ? 'bg-ethoshub-blue text-white' : 'bg-muted text-muted-foreground'
              )}>
                <Briefcase className="h-6 w-6" />
              </div>
              <p className={cn('text-sm font-semibold', selectedRole === 'Estandar' ? 'text-foreground' : 'text-muted-foreground')}>
                Soy Profesional
              </p>
            </motion.button>

            <motion.button
              type="button"
              onClick={() => {
                setSelectedRole('Reclutador');
                setShowRoleRequiredMessage(false);
              }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'relative flex flex-col items-center gap-3 rounded-2xl border-2 p-5 text-center transition-all duration-200',
                selectedRole === 'Reclutador'
                  ? 'border-ethoshub-blue bg-ethoshub-blue/5 shadow-[0_0_20px_-5px_rgba(37,99,235,0.3)] dark:bg-ethoshub-blue/10 dark:shadow-[0_0_25px_-5px_rgba(37,99,235,0.4)]'
                  : 'border-border bg-card opacity-70 hover:opacity-100 hover:border-muted-foreground/30'
              )}
            >
              <div className={cn(
                'flex h-12 w-12 items-center justify-center rounded-xl transition-colors',
                selectedRole === 'Reclutador' ? 'bg-ethoshub-blue text-white' : 'bg-muted text-muted-foreground'
              )}>
                <Building2 className="h-6 w-6" />
              </div>
              <p className={cn('text-sm font-semibold', selectedRole === 'Reclutador' ? 'text-foreground' : 'text-muted-foreground')}>
                Soy Reclutador
              </p>
            </motion.button>
          </div>

          {!selectedRole && showRoleRequiredMessage && (
            <p className="rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning">
              Debes seleccionar un rol antes de continuar.
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-foreground">
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="h-12 rounded-xl border-border bg-background pl-11 pr-4 transition-all focus:border-ethoshub-blue focus:ring-2 focus:ring-ethoshub-blue/20"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label htmlFor="password" className="text-sm font-semibold text-foreground">
                  Contraseña
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-primary transition-colors hover:text-primary/80"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  className="h-12 rounded-xl border-border bg-background pl-11 pr-12 transition-all focus:border-ethoshub-blue focus:ring-2 focus:ring-ethoshub-blue/20"
                  required
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 inline-flex -translate-y-1/2 cursor-pointer rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {prefills?.fromRegister && (
              <div className="rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
                Cuenta demo preparada{prefills.fullName ? ` para ${prefills.fullName}` : ''}. Tus datos quedaron precargados.
              </div>
            )}

            <Button
              type="submit"
              loading={loading}
              className="h-12 w-full rounded-xl bg-primary text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
            >
              Iniciar sesión
            </Button>
          </form>

          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              O continúa con
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <SocialAuthGroup
            googleLabel="Continuar con Google"
            githubLabel="Continuar con GitHub"
            onProviderClick={handleOAuth}
          />

          <AuthFooterLink prompt="¿No tienes cuenta?" cta="Crear cuenta" to="/register" />
        </div>
      </motion.section>
    </div>
  );
}