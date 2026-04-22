import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Key,
  Mail,
  ChevronDown,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { Card, Button } from '@/shared/ui';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '@/components/ui/input-otp';
import { PasswordStrengthIndicator } from '@/components/auth/PasswordStrengthIndicator';

type SecuritySection = 'password' | 'email' | null;

export function AccountSecurityCard() {
  const [expandedSection, setExpandedSection] = useState<SecuritySection>(null);
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordOtp, setPasswordOtp] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordOtpSent, setPasswordOtpSent] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  
  // Email change state
  const [newEmail, setNewEmail] = useState('');
  const [emailOtp, setEmailOtp] = useState('');
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);

  const toggleSection = (section: SecuritySection) => {
    if (expandedSection === section) {
      setExpandedSection(null);
      resetPasswordForm();
      resetEmailForm();
    } else {
      setExpandedSection(section);
      if (section === 'password') resetEmailForm();
      if (section === 'email') resetPasswordForm();
    }
  };

  const resetPasswordForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordOtp('');
    setPasswordOtpSent(false);
    setPasswordSuccess(false);
  };

  const resetEmailForm = () => {
    setNewEmail('');
    setEmailOtp('');
    setEmailOtpSent(false);
    setEmailSuccess(false);
  };

  const handleSendPasswordOtp = async () => {
    setPasswordLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setPasswordOtpSent(true);
    setPasswordLoading(false);
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) return;
    if (passwordOtp.length !== 6) return;
    
    setPasswordLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setPasswordLoading(false);
    setPasswordSuccess(true);
    
    // Reset and close after success
    setTimeout(() => {
      setExpandedSection(null);
      resetPasswordForm();
    }, 2000);
  };

  const handleSendEmailOtp = async () => {
    if (!newEmail) return;
    
    setEmailLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setEmailOtpSent(true);
    setEmailLoading(false);
  };

  const handleChangeEmail = async () => {
    if (emailOtp.length !== 6) return;
    
    setEmailLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setEmailLoading(false);
    setEmailSuccess(true);
    
    // Reset and close after success
    setTimeout(() => {
      setExpandedSection(null);
      resetEmailForm();
    }, 2000);
  };

  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;

  return (
    <Card className="border-destructive/20 bg-card p-0 sm:p-0">
      {/* Header */}
      <div className="border-b border-border p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Seguridad de la Cuenta</h2>
            <p className="text-sm text-muted-foreground">
              Gestiona tu contrasena y correo electronico
            </p>
          </div>
        </div>
      </div>

      {/* Change Password Section */}
      <div className="border-b border-border">
        <button
          type="button"
          onClick={() => toggleSection('password')}
          className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-muted/50 sm:p-6"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Key className="h-4 w-4" />
            </div>
            <div>
              <p className="font-medium text-foreground">Cambiar Contrasena</p>
              <p className="text-sm text-muted-foreground">
                Actualiza tu contrasena de acceso
              </p>
            </div>
          </div>
          <ChevronDown
            className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${
              expandedSection === 'password' ? 'rotate-180' : ''
            }`}
          />
        </button>

        <AnimatePresence>
          {expandedSection === 'password' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="space-y-5 border-t border-border bg-muted/30 p-5 sm:p-6">
                {passwordSuccess ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center gap-3 py-6 text-center"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success">
                      <CheckCircle2 className="h-7 w-7" />
                    </div>
                    <p className="text-lg font-medium text-foreground">
                      Contrasena actualizada
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Tu contrasena ha sido cambiada exitosamente.
                    </p>
                  </motion.div>
                ) : !passwordOtpSent ? (
                  <>
                    {/* Step 1: Request OTP */}
                    <div className="rounded-xl border border-border bg-background p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            Verificacion requerida
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Por seguridad, enviaremos un codigo de 6 digitos a tu correo electronico
                            para confirmar tu identidad.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="ghost"
                        onClick={() => toggleSection(null)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        variant="primary"
                        onClick={handleSendPasswordOtp}
                        loading={passwordLoading}
                        className="bg-primary-blue hover:bg-primary-blue/90"
                      >
                        Enviar Codigo
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Step 2: Enter OTP and new password */}
                    <div className="space-y-4">
                      {/* OTP Input */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Codigo de verificacion
                        </label>
                        <p className="text-xs text-muted-foreground">
                          Ingresa el codigo de 6 digitos enviado a tu correo
                        </p>
                        <div className="flex justify-center py-2">
                          <InputOTP
                            maxLength={6}
                            value={passwordOtp}
                            onChange={setPasswordOtp}
                          >
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup>
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
                      </div>

                      {/* Current Password */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Contrasena Actual
                        </label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Ingresa tu contrasena actual"
                            className="w-full rounded-xl border border-border bg-background px-4 py-3 pr-12 text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* New Password */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Nueva Contrasena
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Ingresa tu nueva contrasena"
                            className="w-full rounded-xl border border-border bg-background px-4 py-3 pr-12 text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        {newPassword && (
                          <PasswordStrengthIndicator password={newPassword} />
                        )}
                      </div>

                      {/* Confirm Password */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Confirmar Nueva Contrasena
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirma tu nueva contrasena"
                            className={`w-full rounded-xl border bg-background px-4 py-3 pr-12 text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:ring-2 ${
                              confirmPassword && !passwordsMatch
                                ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
                                : confirmPassword && passwordsMatch
                                  ? 'border-success focus:border-success focus:ring-success/20'
                                  : 'border-border focus:border-primary focus:ring-primary/20'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        {confirmPassword && !passwordsMatch && (
                          <p className="text-xs text-destructive">
                            Las contrasenas no coinciden
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button
                        variant="outline"
                        onClick={() => toggleSection(null)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        variant="primary"
                        onClick={handleChangePassword}
                        loading={passwordLoading}
                        disabled={
                          !currentPassword ||
                          !newPassword ||
                          !confirmPassword ||
                          !passwordsMatch ||
                          passwordOtp.length !== 6
                        }
                        className="bg-primary-blue hover:bg-primary-blue/90"
                      >
                        Guardar Cambios
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Change Email Section */}
      <div>
        <button
          type="button"
          onClick={() => toggleSection('email')}
          className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-muted/50 sm:p-6"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600">
              <Mail className="h-4 w-4" />
            </div>
            <div>
              <p className="font-medium text-foreground">Cambiar Correo Electronico</p>
              <p className="text-sm text-muted-foreground">
                Actualiza tu direccion de email
              </p>
            </div>
          </div>
          <ChevronDown
            className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${
              expandedSection === 'email' ? 'rotate-180' : ''
            }`}
          />
        </button>

        <AnimatePresence>
          {expandedSection === 'email' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="space-y-5 border-t border-border bg-muted/30 p-5 sm:p-6">
                {emailSuccess ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center gap-3 py-6 text-center"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success">
                      <CheckCircle2 className="h-7 w-7" />
                    </div>
                    <p className="text-lg font-medium text-foreground">
                      Correo actualizado
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Tu direccion de correo ha sido cambiada exitosamente.
                    </p>
                  </motion.div>
                ) : !emailOtpSent ? (
                  <>
                    {/* Step 1: Enter new email */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Nuevo Correo Electronico
                      </label>
                      <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="nuevo@email.com"
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    <div className="rounded-xl border border-border bg-background p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                        <p className="text-sm text-muted-foreground">
                          Enviaremos un codigo de verificacion a tu correo actual para
                          confirmar este cambio.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="ghost"
                        onClick={() => toggleSection(null)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        variant="primary"
                        onClick={handleSendEmailOtp}
                        loading={emailLoading}
                        disabled={!newEmail}
                        className="bg-primary-blue hover:bg-primary-blue/90"
                      >
                        Enviar Codigo
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Step 2: Verify with OTP */}
                    <div className="space-y-4">
                      <div className="rounded-xl border border-success/30 bg-success/5 p-4">
                        <p className="text-sm text-foreground">
                          Codigo enviado a tu correo actual. Ingresa el codigo de
                          6 digitos para confirmar el cambio.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Codigo de verificacion
                        </label>
                        <div className="flex justify-center py-2">
                          <InputOTP
                            maxLength={6}
                            value={emailOtp}
                            onChange={setEmailOtp}
                          >
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup>
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
                      </div>

                      <div className="rounded-xl border border-border bg-background p-4">
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">
                            Nuevo correo:
                          </span>{' '}
                          {newEmail}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button
                        variant="outline"
                        onClick={() => toggleSection(null)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        variant="primary"
                        onClick={handleChangeEmail}
                        loading={emailLoading}
                        disabled={emailOtp.length !== 6}
                        className="bg-primary-blue hover:bg-primary-blue/90"
                      >
                        Verificar y Guardar
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}
