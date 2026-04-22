import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface PasswordRequirement {
  key: string;
  label: string;
  validator: (password: string) => boolean;
}

const passwordRequirements: PasswordRequirement[] = [
  {
    key: 'minLength',
    label: 'Mínimo 8 caracteres',
    validator: (p) => p.length >= 8,
  },
  {
    key: 'maxLength',
    label: 'Máximo 30 caracteres',
    validator: (p) => p.length <= 30,
  },
  {
    key: 'uppercase',
    label: 'Al menos 1 mayúscula',
    validator: (p) => /[A-Z]/.test(p),
  },
  {
    key: 'lowercase',
    label: 'Al menos 1 minúscula',
    validator: (p) => /[a-z]/.test(p),
  },
  {
    key: 'number',
    label: 'Al menos 1 número',
    validator: (p) => /[0-9]/.test(p),
  },
  {
    key: 'special',
    label: 'Al menos 1 carácter especial (!@#$%...)',
    validator: (p) => /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\;'/`~]/.test(p),
  },
];

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

export function PasswordStrengthIndicator({ password, className }: PasswordStrengthIndicatorProps) {
  const validation = useMemo(() => {
    return passwordRequirements.map((req) => ({
      ...req,
      passed: password.length > 0 ? req.validator(password) : false,
    }));
  }, [password]);

  const passedCount = validation.filter((v) => v.passed).length;
  const totalCount = validation.length;
  const allPassed = passedCount === totalCount && password.length > 0;
  const progress = password.length > 0 ? (passedCount / totalCount) * 100 : 0;

  return (
    <div className={cn('space-y-3', className)}>
      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-muted-foreground">Seguridad de contraseña</span>
          <span
            className={cn(
              'font-semibold',
              allPassed ? 'text-success' : password.length > 0 ? 'text-destructive' : 'text-muted-foreground'
            )}
          >
            {password.length === 0
              ? 'Ingresa una contraseña'
              : allPassed
                ? 'Segura'
                : `${passedCount}/${totalCount} requisitos`}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <motion.div
            className={cn(
              'h-full rounded-full transition-colors duration-300',
              allPassed ? 'bg-success' : 'bg-destructive'
            )}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Requirements List */}
      <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
        {validation.map((req) => (
          <motion.li
            key={req.key}
            className={cn(
              'flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition-colors',
              req.passed
                ? 'bg-success/10 text-success'
                : password.length > 0
                  ? 'bg-destructive/10 text-destructive'
                  : 'bg-muted text-muted-foreground'
            )}
            initial={false}
            animate={{
              scale: req.passed ? [1, 1.02, 1] : 1,
            }}
            transition={{ duration: 0.2 }}
          >
            {req.passed ? (
              <Check className="h-3.5 w-3.5 shrink-0" />
            ) : (
              <X className="h-3.5 w-3.5 shrink-0" />
            )}
            <span className="leading-tight">{req.label}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

export function usePasswordValidation(password: string) {
  return useMemo(() => {
    const results = passwordRequirements.map((req) => ({
      key: req.key,
      passed: req.validator(password),
    }));
    const allPassed = results.every((r) => r.passed) && password.length > 0;
    return { results, allPassed };
  }, [password]);
}
