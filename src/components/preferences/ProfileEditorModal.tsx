import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, User, Check, ChevronDown, Briefcase, Clock } from 'lucide-react';
import { Button } from '@/shared/ui';
import { useAuthStore } from '@/store/authStore';

const seniorityOptions = ['Junior', 'Mid', 'Senior', 'Lead', 'Architect'];
const statusOptions = ['Disponible', 'Ocupado', 'Incógnito'];

interface ProfileEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileEditorModal({ isOpen, onClose }: ProfileEditorModalProps) {
  const { user, updateProfile, loading } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    bio: user?.bio || '',
    avatarPreview: user?.avatar || '',
    seniority: user?.seniority || 'Junior',
    availabilityStatus: user?.status || 'Disponible',
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ').slice(1).join(' ') || '',
        bio: user.bio || '',
        avatarPreview: user.avatar || '',
        seniority: user.seniority || 'Junior',
        availabilityStatus: user.status || 'Disponible',
      });
    }
  }, [user]);

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatarPreview: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    // AQUÍ ESTÁ LA CORRECCIÓN:
    // Mapeamos los campos EXACTAMENTE a como los espera tu interfaz 'User'
    const profileUpdates = {
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      bio: formData.bio,
      avatar: formData.avatarPreview,       // Antes decía photoUrl
      status: formData.availabilityStatus,  // Antes decía availabilityStatus
      seniority: formData.seniority,
    };

    await updateProfile(profileUpdates);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-white/10 dark:bg-zinc-950"
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-white/10">
              <h2 className="font-sans text-xl font-semibold text-black dark:text-white">
                Editar Identidad Profesional
              </h2>
              <button onClick={onClose} className="text-gray-400 hover:text-black dark:hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-6 space-y-6">
              
              <div className="flex flex-col items-center gap-3">
                <div
                  onClick={handleAvatarClick}
                  className="group relative h-24 w-24 cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 transition-colors hover:border-violet-500 dark:border-white/10"
                >
                  {formData.avatarPreview ? (
                    <img src={formData.avatarPreview} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-50 dark:bg-white/5">
                      <User className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Upload className="h-6 w-6 text-white" />
                  </div>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                <p className="text-xs text-gray-500">Formato cuadrado recomendado</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Nombre</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData(p => ({...p, firstName: e.target.value}))}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Apellido</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData(p => ({...p, lastName: e.target.value}))}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                    <Briefcase className="h-3 w-3" /> Nivel Profesional
                  </label>
                  <select
                    value={formData.seniority}
                    onChange={(e) => setFormData(p => ({...p, seniority: e.target.value}))}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white appearance-none"
                  >
                    {seniorityOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                    <Clock className="h-3 w-3" /> Disponibilidad
                  </label>
                  <select
                    value={formData.availabilityStatus}
                    onChange={(e) => setFormData(p => ({...p, availabilityStatus: e.target.value}))}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white appearance-none"
                  >
                    {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Bio Profesional</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData(p => ({...p, bio: e.target.value}))}
                  rows={3}
                  maxLength={500}
                  className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-violet-500 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                  placeholder="Ej: Desarrollador Fullstack apasionado por..."
                />
                <div className="text-[10px] text-right text-gray-500">{formData.bio.length}/500</div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4 dark:border-white/10">
              <Button variant="ghost" onClick={handleCancel} className="text-red-500 hover:bg-red-50">
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                loading={loading}
                className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 text-white shadow-lg hover:from-violet-700"
              >
                Actualizar Perfil
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}