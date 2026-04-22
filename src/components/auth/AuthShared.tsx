import { Code2, ArrowRight, Briefcase, Eye, Shield, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/shared/lib/utils';
import type { UserRole } from '@/shared/types';

type RoleOption = {
  role: UserRole;
  icon: typeof User;
  label: string;
  description: string;
};

export const authRoles: RoleOption[] = [
  { role: 'professional', icon: User, label: 'Profesional', description: 'Gestiona tu portafolio' },
  { role: 'recruiter', icon: Briefcase, label: 'Reclutador', description: 'Explora talento' },
  { role: 'guest', icon: Eye, label: 'Invitado', description: 'Descubre perfiles' },
  { role: 'admin', icon: Shield, label: 'Administrador', description: 'Gestiona la plataforma' },
];

export function EthosHubMark() {
  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#635bff_0%,#4f46e5_55%,#312e81_100%)] text-white shadow-[0_16px_40px_-20px_rgba(79,70,229,0.8)] ring-1 ring-white/40 dark:ring-white/10">
      <Code2 className="h-7 w-7" />
    </div>
  );
}

export function AuthHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-8 text-center">
      <div className="mb-5 flex justify-center">
        <EthosHubMark />
      </div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.32em] text-primary/80">{eyebrow}</p>
      <h1 className="text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">
        EthosHub
      </h1>
      <p className="mt-3 text-base text-slate-600 dark:text-slate-300 sm:text-lg">{title}</p>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}

export function AuthRoleSelector({
  selectedRole,
  onChange,
}: {
  selectedRole: UserRole;
  onChange: (role: UserRole) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">Tipo de acceso</label>
        <span className="text-xs text-slate-500 dark:text-slate-400">Demo estático</span>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {authRoles.map(({ role, icon: Icon, label, description }) => {
          const active = selectedRole === role;
          return (
            <button
              key={role}
              type="button"
              onClick={() => onChange(role)}
              aria-pressed={active}
              className={cn(
                'group flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:scale-[0.99] dark:focus-visible:ring-offset-slate-950',
                active
                  ? 'border-primary/40 bg-primary/10 shadow-[0_14px_40px_-28px_rgba(99,91,255,0.9)] dark:border-primary/50 dark:bg-primary/15'
                  : 'border-slate-200 bg-white hover:border-primary/30 hover:bg-slate-50 hover:shadow-[0_16px_35px_-28px_rgba(15,23,42,0.5)] dark:border-slate-800 dark:bg-slate-950/55 dark:hover:border-slate-700 dark:hover:bg-slate-900/80',
              )}
            >
              <div
                className={cn(
                  'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors',
                  active
                    ? 'bg-primary text-white'
                    : 'bg-slate-100 text-slate-500 group-hover:bg-primary/10 group-hover:text-primary dark:bg-slate-900 dark:text-slate-300',
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-950 dark:text-white">{label}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.68-.06-1.33-.18-1.95H12v3.69h5.39a4.62 4.62 0 0 1-2 3.04v2.52h3.24c1.9-1.75 2.97-4.32 2.97-7.3Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.97-.9 6.62-2.47l-3.24-2.52c-.9.6-2.05.96-3.38.96-2.6 0-4.81-1.76-5.6-4.12H3.05v2.6A9.99 9.99 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.4 13.85A5.98 5.98 0 0 1 6.09 12c0-.64.11-1.26.31-1.85v-2.6H3.05A9.98 9.98 0 0 0 2 12c0 1.61.39 3.13 1.05 4.45l3.35-2.6Z"
      />
      <path
        fill="#EA4335"
        d="M12 6.03c1.47 0 2.78.5 3.81 1.5l2.85-2.85C16.96 3.1 14.7 2 12 2A9.99 9.99 0 0 0 3.05 7.55l3.35 2.6C7.19 7.79 9.4 6.03 12 6.03Z"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
      <path d="M12 .5a12 12 0 0 0-3.8 23.39c.6.1.82-.26.82-.58v-2.23c-3.34.73-4.04-1.61-4.04-1.61-.55-1.38-1.33-1.75-1.33-1.75-1.08-.74.08-.72.08-.72 1.2.08 1.84 1.22 1.84 1.22 1.06 1.83 2.8 1.3 3.49 1 .11-.78.42-1.3.76-1.6-2.66-.3-5.47-1.33-5.47-5.9 0-1.3.47-2.36 1.22-3.2-.12-.3-.53-1.52.12-3.17 0 0 1-.32 3.3 1.22a11.5 11.5 0 0 1 6 0c2.3-1.54 3.3-1.22 3.3-1.22.65 1.65.24 2.87.12 3.17.76.84 1.22 1.9 1.22 3.2 0 4.58-2.82 5.6-5.5 5.9.43.37.82 1.1.82 2.23v3.3c0 .32.21.69.83.58A12 12 0 0 0 12 .5Z" />
    </svg>
  );
}

const socialStyles = {
  google:
    'border-border bg-background text-foreground hover:border-primary/30 hover:bg-muted hover:shadow-lg active:bg-muted/80',
  github:
    'border-foreground bg-foreground text-background hover:bg-foreground/90 hover:shadow-lg active:bg-foreground/80',
} as const;

export function SocialAuthButton({
  provider,
  label,
}: {
  provider: 'google' | 'github';
  label: string;
}) {
  const Icon = provider === 'google' ? GoogleIcon : GitHubIcon;

  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        'inline-flex h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-2xl border px-4 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:scale-[0.985] dark:focus-visible:ring-offset-slate-950',
        socialStyles[provider],
      )}
    >
      <Icon />
      <span>{label}</span>
    </button>
  );
}

export function SocialAuthGroup({
  googleLabel,
  githubLabel,
}: {
  googleLabel: string;
  githubLabel: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <SocialAuthButton provider="google" label={googleLabel} />
      <SocialAuthButton provider="github" label={githubLabel} />
    </div>
  );
}

export function AuthFooterLink({
  prompt,
  cta,
  to,
}: {
  prompt: string;
  cta: string;
  to: string;
}) {
  return (
    <p className="text-center text-sm text-slate-500 dark:text-slate-400">
      {prompt}{' '}
      <Link
        to={to}
        className="inline-flex items-center gap-1 font-semibold text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        {cta}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </p>
  );
}
