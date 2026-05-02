import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Sparkles,
  Briefcase,
  GraduationCap,
  ChevronRight,
  X,
  Plus,
  Code2,
  Palette,
  Database,
  Cloud,
  Layers,
} from 'lucide-react';
import { Button, Card } from '@/shared/ui';

// =============================================
// BIOGRAPHY CARD
// =============================================
interface BiographyCardProps {
  initialBio: string;
  onSave: (bio: string) => void;
}

export function BiographyCard({ initialBio, onSave }: BiographyCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [bio, setBio] = useState(initialBio);
  const maxChars = 500;

  const handleSave = () => {
    onSave(bio);
    setIsExpanded(false);
  };

  const handleCancel = () => {
    setBio(initialBio);
    setIsExpanded(false);
  };

  return (
    <Card
      className={`w-full cursor-pointer border-gray-200 bg-white p-4 transition-all duration-300 sm:p-6 dark:border-white/10 dark:bg-zinc-950 ${
        isExpanded ? 'ring-2 ring-violet-500/50' : 'hover:border-violet-500/30 dark:hover:border-violet-500/50'
      }`}
      onClick={() => !isExpanded && setIsExpanded(true)}
    >
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600 sm:h-11 sm:w-11 sm:rounded-2xl dark:bg-amber-500/10 dark:text-amber-500">
          <FileText className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-black sm:text-xl dark:text-white">Biografia</h2>
          <p className="truncate text-xs text-gray-500 sm:text-sm dark:text-gray-400">
            Tu presentacion profesional
          </p>
        </div>
        <ChevronRight
          className={`h-5 w-5 shrink-0 text-gray-400 transition-transform duration-300 dark:text-gray-500 ${
            isExpanded ? 'rotate-90' : ''
          }`}
        />
      </div>

      {!isExpanded && bio && (
        <div className="mt-4">
          <p
            className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400"
            style={{
              maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
            }}
          >
            {bio}
          </p>
        </div>
      )}

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mt-5 space-y-4">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Describe tu perfil profesional, tu experiencia y lo que te apasiona..."
                rows={5}
                maxLength={maxChars}
                className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-black placeholder:text-gray-400 transition-colors focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-white/20 dark:bg-black dark:text-white dark:placeholder:text-gray-500"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {bio.length}/{maxChars} caracteres
                </span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={handleCancel} className="text-black hover:bg-gray-100 dark:text-white dark:hover:bg-white/10">
                    Cancelar
                  </Button>
                  <Button variant="primary" size="sm" onClick={handleSave} className="bg-violet-600 text-white hover:bg-violet-700">
                    Guardar
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// =============================================
// SKILLS CARD
// =============================================
const skillIcons: Record<string, React.ElementType> = {
  Frontend: Code2,
  Backend: Database,
  'Bases de Datos': Database,
  Infraestructura: Cloud,
  Diseno: Palette,
  'Otras Tecnologias': Layers,
};

interface Skill {
  id: string;
  name: string;
  category: string;
}

interface SkillsCardProps {
  skills: Skill[];
  onAddSkill: (skill: Skill) => void;
  onRemoveSkill: (skillId: string) => void;
}

export function SkillsCard({ skills, onAddSkill, onRemoveSkill }: SkillsCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Frontend');

  const categories = ['Frontend', 'Backend', 'Bases de Datos', 'Infraestructura', 'Diseno', 'Otras Tecnologias'];

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      onAddSkill({
        id: crypto.randomUUID(),
        name: newSkill.trim(),
        category: selectedCategory,
      });
      setNewSkill('');
    }
  };

  return (
    <Card
      className={`w-full cursor-pointer border-gray-200 bg-white p-4 transition-all duration-300 sm:p-6 dark:border-white/10 dark:bg-zinc-950 ${
        isExpanded ? 'ring-2 ring-violet-500/50' : 'hover:border-violet-500/30 dark:hover:border-violet-500/50'
      }`}
      onClick={() => !isExpanded && setIsExpanded(true)}
    >
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600 sm:h-11 sm:w-11 sm:rounded-2xl dark:bg-violet-500/10 dark:text-violet-400">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-black sm:text-xl dark:text-white">Skills</h2>
          <p className="truncate text-xs text-gray-500 sm:text-sm dark:text-gray-400">
            Capacidades tecnicas y fortalezas
          </p>
        </div>
        <ChevronRight
          className={`h-5 w-5 shrink-0 text-gray-400 transition-transform duration-300 dark:text-gray-500 ${
            isExpanded ? 'rotate-90' : ''
          }`}
        />
      </div>

      {!isExpanded && skills.length > 0 && (
        <div className="mt-4">
          <div
            className="flex flex-wrap gap-2"
            style={{
              maskImage: 'linear-gradient(to right, black 70%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to right, black 70%, transparent 100%)',
            }}
          >
            {skills.slice(0, 4).map((skill) => {
              const Icon = skillIcons[skill.category] || Layers;
              return (
                <div
                  key={skill.id}
                  className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 dark:border-white/10 dark:bg-black/50"
                >
                  <Icon className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                  <span className="text-sm text-black dark:text-white">{skill.name}</span>
                </div>
              );
            })}
            {skills.length > 4 && (
              <span className="text-sm text-gray-500 dark:text-gray-400">+{skills.length - 4} mas</span>
            )}
          </div>
        </div>
      )}

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mt-5 space-y-4">
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => {
                  const Icon = skillIcons[skill.category] || Layers;
                  return (
                    <motion.div
                      key={skill.id}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="group flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 transition-colors hover:border-red-500/50 dark:border-white/10 dark:bg-black/50 dark:hover:border-red-500/50"
                    >
                      <Icon className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                      <span className="text-sm font-medium text-black dark:text-white">{skill.name}</span>
                      <button
                        type="button"
                        onClick={() => onRemoveSkill(skill.id)}
                        className="ml-1 rounded-full p-0.5 text-gray-400 opacity-0 transition-all hover:bg-red-100 hover:text-red-600 group-hover:opacity-100 dark:text-gray-500 dark:hover:bg-red-500/20 dark:hover:text-red-400"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </motion.div>
                  );
                })}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-black transition-colors focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-white/20 dark:bg-black dark:text-white"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <div className="flex flex-1 gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                    placeholder="Agregar skill..."
                    className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-black placeholder:text-gray-400 transition-colors focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-white/20 dark:bg-black dark:text-white dark:placeholder:text-gray-500"
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleAddSkill}
                    className="px-3 bg-violet-600 text-white hover:bg-violet-700"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex justify-end">
                <Button variant="ghost" size="sm" onClick={() => setIsExpanded(false)} className="text-black hover:bg-gray-100 dark:text-white dark:hover:bg-white/10">
                  Cerrar
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// =============================================
// NAVIGATION CARDS (Projects & Experience)
// =============================================
interface NavigationCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  iconBgClass: string;
  iconColorClass: string;
  to: string;
  itemCount?: number;
}

export function NavigationCard({
  title,
  description,
  icon: Icon,
  iconBgClass,
  iconColorClass,
  to,
  itemCount,
}: NavigationCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      className="group w-full cursor-pointer border-gray-200 bg-white p-4 transition-all duration-300 hover:border-violet-500/30 sm:p-6 dark:border-white/10 dark:bg-zinc-950 dark:hover:border-violet-500/50"
      onClick={() => navigate(to)}
    >
      <div className="flex items-center gap-2 sm:gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11 sm:rounded-2xl ${iconBgClass} ${iconColorClass}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-black sm:text-xl dark:text-white">{title}</h2>
          <p className="truncate text-xs text-gray-500 sm:text-sm dark:text-gray-400">{description}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {itemCount !== undefined && (
            <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-600 sm:px-2.5 sm:py-1 dark:bg-violet-500/20 dark:text-violet-400">
              {itemCount}
            </span>
          )}
          <ChevronRight className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1 dark:text-gray-500" />
        </div>
      </div>
    </Card>
  );
}

export function ProjectsCard({ projectCount }: { projectCount?: number }) {
  return (
    <NavigationCard
      title="Proyectos"
      description="Casos visibles y trabajo demostrado"
      icon={Briefcase}
      iconBgClass="bg-emerald-100 dark:bg-emerald-500/10"
      iconColorClass="text-emerald-600 dark:text-emerald-400"
      to="/dashboard/projects"
      itemCount={projectCount}
    />
  );
}

export function ExperienceCard({ experienceCount }: { experienceCount?: number }) {
  return (
    <NavigationCard
      title="Experiencia"
      description="Trayectoria y evolucion del perfil"
      icon={GraduationCap}
      iconBgClass="bg-rose-100 dark:bg-rose-500/10"
      iconColorClass="text-rose-600 dark:text-rose-400"
      to="/dashboard/experience"
      itemCount={experienceCount}
    />
  );
}