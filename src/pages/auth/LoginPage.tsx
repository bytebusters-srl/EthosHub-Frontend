import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store';
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

export default function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, loading } = useAuthStore();
  const prefills = (location.state as { prefills?: RegisterPrefills } | null)?.prefills;

  const [email, setEmail] = useState('demo@ethoshub.com');
  const [password, setPassword] = useState('demo123');
  const [showPassword, setShowPassword] = useState(false);

  const shouldStartSkillOnboarding = (emailValue: string) => {
    const normalizedEmail = emailValue.toLowerCase().trim();
    const onboardingKey = `ethoshub_skills_onboarding_completed_${normalizedEmail}`;
    return localStorage.getItem(onboardingKey) !== 'true';
  };

  useEffect(() => {
    if (!prefills) {
      return;
    }

    if (prefills.email) {
      setEmail(prefills.email);
    }
    if (prefills.password) {
      setPassword(prefills.password);
    }
  }, [prefills]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Use professional as default role, but the authService will override
    // based on the email if it matches a mock credential
    const result = await login(email, password, 'professional');
    
    if (result) {
      // Show welcome toast with role
      toast.success(`Bienvenido de nuevo, ${result.roleDisplayName}`, {
        description: 'Has iniciado sesion correctamente',
        duration: 4000,
      });

      if (result.user.role === 'professional' && shouldStartSkillOnboarding(result.user.email)) {
        navigate('/dashboard/skills?onboarding=1');
        return;
      }

      // Navigate to role-specific path
      navigate(result.redirectPath);
    }
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
        title="Inicia sesion en tu cuenta"
        description="Accede a tu portafolio profesional y continua construyendo tu presencia digital."
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
                Iniciar sesion
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Usa las credenciales demo o ingresa las tuyas para continuar.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 px-5 py-6 sm:px-8 sm:py-8">
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
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label htmlFor="password" className="text-sm font-semibold text-foreground">
                  Contrasena
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-primary transition-colors hover:text-primary/80"
                >
                  Olvidaste tu contrasena?
                </Link>
              </div>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contrasena"
                  className="h-12 rounded-xl border-border bg-background pl-11 pr-12 transition-all focus:border-ethoshub-blue focus:ring-2 focus:ring-ethoshub-blue/20"
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
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

            {/* Submit Button */}
            <Button
              type="submit"
              loading={loading}
              className="h-12 w-full rounded-xl bg-primary text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
            >
              Iniciar sesion
            </Button>

            {/* Demo Credentials */}
            <div className="rounded-xl border border-border bg-muted/50 p-4 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">Credenciales demo por rol</p>
              <div className="mt-2 space-y-1.5">
                <p><span className="font-medium text-ethoshub-blue">Profesional:</span> profesional@ethoshub.com / demo</p>
                <p><span className="font-medium text-ethoshub-blue">Reclutador:</span> reclutador@ethoshub.com / demo</p>
                <p><span className="font-medium text-ethoshub-blue">Admin:</span> admin@ethoshub.com / demo</p>
              </div>
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              O continua con
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Social Auth - At the bottom */}
          <SocialAuthGroup
            googleLabel="Continuar con Google"
            githubLabel="Continuar con GitHub"
          />

          <AuthFooterLink prompt="No tienes cuenta?" cta="Crear cuenta" to="/register" />
        </div>
      </motion.section>
    </div>
  );
}
