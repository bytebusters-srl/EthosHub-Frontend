import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Sparkles,
  Mail,
  Phone,
  Globe2,
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
      className={`cursor-pointer p-5 transition-all duration-300 sm:p-6 ${
        isExpanded ? 'ring-2 ring-primary/30' : 'hover:border-primary/30'
      }`}
      onClick={() => !isExpanded && setIsExpanded(true)}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
          <FileText className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-foreground">Biografia</h2>
          <p className="text-sm text-muted-foreground">
            Tu presentacion profesional
          </p>
        </div>
        <ChevronRight
          className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${
            isExpanded ? 'rotate-90' : ''
          }`}
        />
      </div>

      {/* Collapsed Preview */}
      {!isExpanded && bio && (
        <div className="mt-4">
          <p
            className="line-clamp-2 text-sm text-muted-foreground"
            style={{
              maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
            }}
          >
            {bio}
          </p>
        </div>
      )}

      {/* Expanded Content */}
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
                className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {bio.length}/{maxChars} caracteres
                </span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={handleCancel}>
                    Cancelar
                  </Button>
                  <Button variant="primary" size="sm" onClick={handleSave}>
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
      className={`cursor-pointer p-5 transition-all duration-300 sm:p-6 ${
        isExpanded ? 'ring-2 ring-primary/30' : 'hover:border-primary/30'
      }`}
      onClick={() => !isExpanded && setIsExpanded(true)}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-600">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-foreground">Skills</h2>
          <p className="text-sm text-muted-foreground">
            Capacidades tecnicas y fortalezas
          </p>
        </div>
        <ChevronRight
          className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${
            isExpanded ? 'rotate-90' : ''
          }`}
        />
      </div>

      {/* Collapsed Preview */}
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
                  className="flex items-center gap-2 rounded-lg border border-border bg-background/70 px-3 py-1.5"
                >
                  <Icon className="h-3.5 w-3.5 text-primary" />
                  <span className="text-sm text-foreground">{skill.name}</span>
                </div>
              );
            })}
            {skills.length > 4 && (
              <span className="text-sm text-muted-foreground">+{skills.length - 4} mas</span>
            )}
          </div>
        </div>
      )}

      {/* Expanded Content */}
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
              {/* Skills Display */}
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => {
                  const Icon = skillIcons[skill.category] || Layers;
                  return (
                    <motion.div
                      key={skill.id}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="group flex items-center gap-2 rounded-lg border border-border bg-background/70 px-3 py-2 transition-colors hover:border-destructive/50"
                    >
                      <Icon className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">{skill.name}</span>
                      <button
                        type="button"
                        onClick={() => onRemoveSkill(skill.id)}
                        className="ml-1 rounded-full p-0.5 text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </motion.div>
                  );
                })}
              </div>

              {/* Add Skill Input */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <div className="flex flex-1 gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                    placeholder="Agregar skill..."
                    className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleAddSkill}
                    className="px-3"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex justify-end">
                <Button variant="ghost" size="sm" onClick={() => setIsExpanded(false)}>
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
// CONTACT CARD
// =============================================
interface ContactInfo {
  email: string;
  phone: string;
  website: string;
}

interface ContactCardProps {
  contact: ContactInfo;
  onSave: (contact: ContactInfo) => void;
}

export function ContactCard({ contact, onSave }: ContactCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState(contact);

  const handleSave = () => {
    onSave(formData);
    setIsExpanded(false);
  };

  const handleCancel = () => {
    setFormData(contact);
    setIsExpanded(false);
  };

  return (
    <Card
      className={`cursor-pointer p-5 transition-all duration-300 sm:p-6 ${
        isExpanded ? 'ring-2 ring-primary/30' : 'hover:border-primary/30'
      }`}
      onClick={() => !isExpanded && setIsExpanded(true)}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-600">
          <Mail className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-foreground">Contacto</h2>
          <p className="text-sm text-muted-foreground">
            Canales de comunicacion
          </p>
        </div>
        <ChevronRight
          className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${
            isExpanded ? 'rotate-90' : ''
          }`}
        />
      </div>

      {/* Collapsed Preview */}
      {!isExpanded && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span className="truncate">{contact.email || 'Sin email'}</span>
          </div>
        </div>
      )}

      {/* Expanded Content */}
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
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Mail className="h-4 w-4" />
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="tu@email.com"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Phone className="h-4 w-4" />
                  Telefono
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="+52 55 1234 5678"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Globe2 className="h-4 w-4" />
                  Sitio web
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
                  placeholder="https://tusitio.com"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={handleCancel}>
                  Cancelar
                </Button>
                <Button variant="primary" size="sm" onClick={handleSave}>
                  Guardar
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
      className="group cursor-pointer p-5 transition-all duration-300 hover:border-primary/30 sm:p-6"
      onClick={() => navigate(to)}
    >
      <div className="flex items-center gap-3">
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${iconBgClass} ${iconColorClass}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          {itemCount !== undefined && (
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
              {itemCount}
            </span>
          )}
          <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
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
      iconBgClass="bg-emerald-500/10"
      iconColorClass="text-emerald-600"
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
      iconBgClass="bg-rose-500/10"
      iconColorClass="text-rose-600"
      to="/dashboard/experience"
      itemCount={experienceCount}
    />
  );
}
