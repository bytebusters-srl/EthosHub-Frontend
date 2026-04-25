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

type RegisterPrefills = {
  email?: string;
  password?: string;
  fromRegister?: boolean;
  fullName?: string;
};

const OAUTH_BASE_URL = ((import.meta as ImportMeta & { env?: Record<string, string> }).env?.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '');

export default function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, loading } = useAuthStore();
  const prefills = (location.state as { prefills?: RegisterPrefills } | null)?.prefills;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const shouldStartSkillOnboarding = (emailValue: string) => {
    const normalizedEmail = emailValue.toLowerCase().trim();
    const onboardingKey = `ethoshub_skills_onboarding_completed_${normalizedEmail}`;
    return localStorage.getItem(onboardingKey) !== 'true';
  };

  useEffect(() => {
    if (prefills?.email) setEmail(prefills.email);
    if (prefills?.password) setPassword(prefills.password);
  }, [prefills]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Llamada corregida a login (ahora acepta 2 argumentos)
    const result = await login(email, password);
    
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
    window.location.href = `${OAUTH_BASE_URL}/oauth2/authorization/${provider}`;
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground">
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
        className="overflow-hidden rounded-3xl border border-border bg-card shadow-xl"
      >
        <div className="border-b border-border bg-gradient-to-b from-primary/5 to-transparent px-5 py-6 sm:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Iniciar sesión</h2>
          <p className="mt-2 text-sm text-muted-foreground">Ingresa tus credenciales para continuar.</p>
        </div>

        <div className="space-y-6 px-5 py-6 sm:px-8 sm:py-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="h-12 pl-11 rounded-xl"
                  required
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex justify-between">
  <label className="text-sm font-semibold text-foreground">
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
                <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tu contraseña"
                  className="h-12 pl-11 pr-12 rounded-xl"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" loading={loading} className="h-12 w-full rounded-xl shadow-lg">
              Iniciar sesión
            </Button>
          </form>

          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-medium uppercase text-muted-foreground">O continúa con</span>
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