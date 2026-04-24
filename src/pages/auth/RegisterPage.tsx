import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff, LockKeyhole, Mail, Briefcase, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store';
import { cn } from '@/shared/lib/utils';
import { Button, Input } from '@/shared/ui';
import { authService } from '@/shared/services/authService';
import {
  AuthFooterLink,
  AuthHero,
  SocialAuthGroup,
} from '@/components/auth/AuthShared';
import { PasswordStrengthIndicator, usePasswordValidation } from '@/components/auth/PasswordStrengthIndicator';
import { TermsModal } from '@/components/auth/TermsModal';

const OAUTH_BASE_URL = ((import.meta as ImportMeta & { env?: Record<string, string> }).env?.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '');

export default function RegisterPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [selectedRole, setSelectedRole] = useState<'Estandar' | 'Reclutador' | null>(null);
  const [showRoleRequiredMessage, setShowRoleRequiredMessage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);

  const { allPassed: isPasswordValid } = usePasswordValidation(password);
  const isFormValid = email.length > 0 && isPasswordValid && acceptedTerms && selectedRole !== null;

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

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) {
      toast.error('Debes elegir un rol para crear tu cuenta');
      return;
    }
    if (!isFormValid) return;

    const selectedFrontendRole = selectedRole === 'Estandar' ? 'professional' : 'recruiter';

    try {
      setSubmitting(true);
      await authService.registerLocal(email, password, selectedFrontendRole);

      const loginResult = await login(email, password, selectedFrontendRole);
      if (loginResult) {
        toast.success('Cuenta creada e iniciada correctamente', {
          description: `Accediendo como ${loginResult.roleDisplayName}.`,
        });

        navigate(loginResult.redirectPath, { replace: true });
        return;
      }

      toast.success('Cuenta creada correctamente', {
        description: 'Ahora puedes iniciar sesion con tus credenciales.',
      });

      navigate('/login', {
        replace: false,
        state: {
          prefills: {
            email,
            password,
            role: selectedFrontendRole,
            fromRegister: true,
          },
        },
      });
    } catch (error) {
      toast.error('No se pudo crear la cuenta', {
        description: error instanceof Error ? error.message : 'Intenta nuevamente.',
      });
    } finally {
      setSubmitting(false);
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
        eyebrow="Únete a EthosHub"
        title="Crea tu cuenta profesional"
        description="Construye tu portafolio digital y conecta con la comunidad tech."
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
              <p className="text-sm font-semibold text-primary">Registro</p>
              <h2 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
                Crear cuenta
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Solo necesitas un email y una contraseña segura para comenzar.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 px-5 py-6 sm:px-8 sm:py-8">
          {/* Role Selection Cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* Professional Card */}
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
                selectedRole === 'Estandar'
                  ? 'bg-ethoshub-blue text-white'
                  : 'bg-muted text-muted-foreground'
              )}>
                <Briefcase className="h-6 w-6" />
              </div>
              <div>
                <p className={cn(
                  'text-sm font-semibold transition-colors',
                  selectedRole === 'Estandar' ? 'text-foreground' : 'text-muted-foreground'
                )}>
                  Soy Profesional
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Busco destacar mi talento, validar mis habilidades y conectar con oportunidades.
                </p>
              </div>
              {selectedRole === 'Estandar' && (
                <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ethoshub-blue">
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </motion.button>

            {/* Recruiter Card */}
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
                selectedRole === 'Reclutador'
                  ? 'bg-ethoshub-blue text-white'
                  : 'bg-muted text-muted-foreground'
              )}>
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <p className={cn(
                  'text-sm font-semibold transition-colors',
                  selectedRole === 'Reclutador' ? 'text-foreground' : 'text-muted-foreground'
                )}>
                  Soy Reclutador
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Busco talento verificado y de alta calidad para mi organizacion.
                </p>
              </div>
              {selectedRole === 'Reclutador' && (
                <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ethoshub-blue">
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </motion.button>
          </div>

          {!selectedRole && showRoleRequiredMessage && (
            <p className="rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning">
              Debes seleccionar un rol antes de continuar con Google o GitHub.
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="register-email" className="mb-2 block text-sm font-semibold text-foreground">
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="register-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  autoComplete="email"
                  className="h-12 rounded-xl border-border bg-background pl-11 pr-4 transition-all focus:border-ethoshub-blue focus:ring-2 focus:ring-ethoshub-blue/20"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="register-password" className="mb-2 block text-sm font-semibold text-foreground">
                Contraseña
              </label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Crea una contraseña segura"
                  autoComplete="new-password"
                  className="h-12 rounded-xl border-border bg-background pl-11 pr-12 transition-all focus:border-ethoshub-blue focus:ring-2 focus:ring-ethoshub-blue/20"
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

            {/* Password Strength Indicator */}
            <PasswordStrengthIndicator password={password} />

            {/* Terms Checkbox */}
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm transition-colors hover:bg-muted/50">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-muted-foreground">
                Acepto los{' '}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setTermsModalOpen(true);
                  }}
                  className="font-semibold text-primary underline-offset-2 hover:underline"
                >
                  Términos y Condiciones
                </button>
              </span>
            </label>

            {/* Submit Button */}
            <Button
              type="submit"
              loading={submitting}
              disabled={!isFormValid}
              className="h-12 w-full rounded-xl bg-primary text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
            >
              Crear cuenta
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              O regístrate con
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Social Auth - At the bottom */}
          <SocialAuthGroup
            googleLabel="Registrarse con Google"
            githubLabel="Registrarse con GitHub"
            onProviderClick={handleOAuth}
          />

          <AuthFooterLink prompt="¿Ya tienes cuenta?" cta="Iniciar sesión" to="/login" />
        </div>
      </motion.section>

      {/* Terms Modal */}
      <TermsModal isOpen={termsModalOpen} onClose={() => setTermsModalOpen(false)} />
    </div>
  );
}
