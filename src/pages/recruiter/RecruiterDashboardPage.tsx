import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  Users,
  Heart,
  Building2,
  Globe,
  MapPin,
  Pencil,
  Plus,
  ChevronRight,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  TrendingUp,
  Target,
  Sparkles,
  X,
  ExternalLink,
} from 'lucide-react';
import { useAuthStore } from '@/store';
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Modal,
  Textarea,
} from '@/shared/ui';

// Company Profile Schema (maps to core.profiles_company)
interface CompanyProfile {
  company_name: string;
  industry: string;
  company_size: string;
  location: string;
  website_url: string;
  description: string;
  logo_url?: string;
}

// Vacancy Schema
interface Vacancy {
  id: string;
  title: string;
  role: string;
  status: 'open' | 'closed' | 'draft';
  applicants: number;
  salary_range: string;
  requirements: string[];
  created_at: string;
}

// Mock data
const mockCompanyProfile: CompanyProfile = {
  company_name: 'TechCorp Solutions',
  industry: 'Tecnologia',
  company_size: '50-200 empleados',
  location: 'Ciudad de Mexico, Mexico',
  website_url: 'https://techcorp.example.com',
  description: 'Empresa lider en desarrollo de software y soluciones tecnologicas innovadoras para empresas.',
  logo_url: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop',
};

const mockVacancies: Vacancy[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    role: 'Frontend',
    status: 'open',
    applicants: 24,
    salary_range: '$60,000 - $80,000 USD',
    requirements: ['React', 'TypeScript', '5+ anos experiencia'],
    created_at: '2024-03-15',
  },
  {
    id: '2',
    title: 'Backend Engineer (Node.js)',
    role: 'Backend',
    status: 'open',
    applicants: 18,
    salary_range: '$55,000 - $75,000 USD',
    requirements: ['Node.js', 'PostgreSQL', 'AWS'],
    created_at: '2024-03-10',
  },
  {
    id: '3',
    title: 'DevOps Engineer',
    role: 'DevOps',
    status: 'closed',
    applicants: 12,
    salary_range: '$70,000 - $90,000 USD',
    requirements: ['Kubernetes', 'Terraform', 'CI/CD'],
    created_at: '2024-02-28',
  },
  {
    id: '4',
    title: 'QA Automation Lead',
    role: 'QA',
    status: 'draft',
    applicants: 0,
    salary_range: '$50,000 - $65,000 USD',
    requirements: ['Playwright', 'Cypress', 'Liderazgo'],
    created_at: '2024-03-18',
  },
];

// KPI Card Component
function KPICard({ 
  icon: Icon, 
  label, 
  value, 
  trend, 
  delay 
}: { 
  icon: typeof Briefcase; 
  label: string; 
  value: string | number;
  trend?: { value: number; positive: boolean };
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
    >
      <Card className="relative overflow-hidden rounded-2xl border border-violet-500/20 bg-black/80 p-0">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-purple-600/5" />
        <CardContent className="relative p-6">
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600/20 to-purple-600/20">
              <Icon className="h-6 w-6 text-violet-400" />
            </div>
            {trend && (
              <div className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium ${
                trend.positive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
              }`}>
                <TrendingUp className={`h-3 w-3 ${!trend.positive && 'rotate-180'}`} />
                {trend.value}%
              </div>
            )}
          </div>
          <div className="mt-4">
            <p className="font-sans text-3xl font-bold text-white">{value}</p>
            <p className="mt-1 font-sans text-sm text-violet-300/60">{label}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Vacancy Card Component
function VacancyCard({ vacancy, index }: { vacancy: Vacancy; index: number }) {
  const statusConfig = {
    open: { label: 'Abierta', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    closed: { label: 'Cerrada', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
    draft: { label: 'Borrador', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  };

  const status = statusConfig[vacancy.status];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 * index, duration: 0.3 }}
    >
      <Card className="group rounded-2xl border border-violet-500/20 bg-black/60 p-0 transition-all hover:border-violet-500/40 hover:shadow-[0_0_20px_rgba(139,92,246,0.1)]">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h3 className="font-sans text-lg font-semibold text-white">{vacancy.title}</h3>
                <Badge className={`border ${status.color} text-xs`}>
                  {status.label}
                </Badge>
              </div>
              <p className="mt-1 font-sans text-sm text-violet-300/60">{vacancy.role}</p>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-violet-500/20 bg-violet-500/10 px-3 py-2">
              <Users className="h-4 w-4 text-violet-400" />
              <span className="font-sans text-sm font-medium text-violet-300">{vacancy.applicants}</span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {vacancy.requirements.map((req) => (
              <Badge key={req} variant="outline" className="border-violet-500/20 bg-transparent text-xs text-violet-300/70">
                {req}
              </Badge>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="font-sans text-violet-300/60">{vacancy.salary_range}</span>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 font-sans text-violet-400 hover:bg-violet-500/10 hover:text-violet-300"
            >
              Ver detalles
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Create Vacancy Modal Component
function CreateVacancyModal({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void;
}) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    role: '',
    requirements: '',
    salaryMin: '',
    salaryMax: '',
  });

  const totalSteps = 3;

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    // Submit logic here
    onClose();
    setStep(1);
    setFormData({ title: '', role: '', requirements: '', salaryMin: '', salaryMax: '' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg rounded-2xl border border-violet-500/30 bg-black/95 p-6"
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="font-sans text-xl font-bold text-white">Crear Nueva Vacante</h2>
                  <p className="mt-1 font-sans text-sm text-violet-300/60">Paso {step} de {totalSteps}</p>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-lg p-2 text-violet-300/60 transition-colors hover:bg-violet-500/10 hover:text-violet-300"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mb-6 flex gap-2">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      i < step ? 'bg-gradient-to-r from-violet-600 to-purple-600' : 'bg-violet-500/20'
                    }`}
                  />
                ))}
              </div>

              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="mb-2 block font-sans text-sm font-medium text-violet-300">
                        Titulo de la vacante
                      </label>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Ej: Senior Frontend Developer"
                        className="rounded-xl border-violet-500/20 bg-violet-500/10 font-sans text-white placeholder:text-violet-300/40 focus:border-violet-500/50"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block font-sans text-sm font-medium text-violet-300">
                        Rol / Categoria
                      </label>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full rounded-xl border border-violet-500/20 bg-violet-500/10 px-3 py-2.5 font-sans text-sm text-violet-200 focus:border-violet-500/50 focus:outline-none"
                      >
                        <option value="" className="bg-black">Seleccionar rol...</option>
                        <option value="frontend" className="bg-black">Frontend</option>
                        <option value="backend" className="bg-black">Backend</option>
                        <option value="fullstack" className="bg-black">Full Stack</option>
                        <option value="devops" className="bg-black">DevOps</option>
                        <option value="qa" className="bg-black">QA / Testing</option>
                        <option value="data" className="bg-black">Data Engineering</option>
                        <option value="mobile" className="bg-black">Mobile</option>
                      </select>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="mb-2 block font-sans text-sm font-medium text-violet-300">
                        Requisitos (separados por coma)
                      </label>
                      <Textarea
                        value={formData.requirements}
                        onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                        placeholder="React, TypeScript, 5+ anos de experiencia..."
                        className="min-h-[120px] rounded-xl border-violet-500/20 bg-violet-500/10 font-sans text-white placeholder:text-violet-300/40 focus:border-violet-500/50"
                      />
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="mb-2 block font-sans text-sm font-medium text-violet-300">
                        Rango Salarial (USD anual)
                      </label>
                      <div className="flex items-center gap-3">
                        <Input
                          type="number"
                          value={formData.salaryMin}
                          onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                          placeholder="Min"
                          className="rounded-xl border-violet-500/20 bg-violet-500/10 font-sans text-white placeholder:text-violet-300/40 focus:border-violet-500/50"
                        />
                        <span className="text-violet-300/60">-</span>
                        <Input
                          type="number"
                          value={formData.salaryMax}
                          onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                          placeholder="Max"
                          className="rounded-xl border-violet-500/20 bg-violet-500/10 font-sans text-white placeholder:text-violet-300/40 focus:border-violet-500/50"
                        />
                      </div>
                    </div>
                    <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
                      <p className="font-sans text-sm text-violet-300/60">
                        Al publicar esta vacante, sera visible para todos los profesionales en EthosHub.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-6 flex justify-between">
                <Button
                  variant="outline"
                  onClick={step === 1 ? onClose : handleBack}
                  className="rounded-xl border-violet-500/30 bg-transparent font-sans text-violet-300 hover:border-violet-500/50 hover:bg-violet-500/10"
                >
                  {step === 1 ? 'Cancelar' : 'Atras'}
                </Button>
                <Button
                  onClick={step === totalSteps ? handleSubmit : handleNext}
                  className="rounded-xl border-0 bg-gradient-to-r from-violet-600 to-purple-600 font-sans text-white shadow-lg shadow-violet-500/25"
                >
                  {step === totalSteps ? 'Publicar Vacante' : 'Siguiente'}
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// Edit Company Modal Component
function EditCompanyModal({
  isOpen,
  onClose,
  profile,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  profile: CompanyProfile;
  onSave: (data: CompanyProfile) => void;
}) {
  const [formData, setFormData] = useState(profile);

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-violet-500/30 bg-black/95 p-6"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-sans text-xl font-bold text-white">Editar Perfil de Empresa</h2>
                <button
                  onClick={onClose}
                  className="rounded-lg p-2 text-violet-300/60 transition-colors hover:bg-violet-500/10 hover:text-violet-300"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block font-sans text-sm font-medium text-violet-300">
                    Nombre de la empresa
                  </label>
                  <Input
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    className="rounded-xl border-violet-500/20 bg-violet-500/10 font-sans text-white focus:border-violet-500/50"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-sans text-sm font-medium text-violet-300">
                    Industria
                  </label>
                  <Input
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="rounded-xl border-violet-500/20 bg-violet-500/10 font-sans text-white focus:border-violet-500/50"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-sans text-sm font-medium text-violet-300">
                    Tamano de empresa
                  </label>
                  <select
                    value={formData.company_size}
                    onChange={(e) => setFormData({ ...formData, company_size: e.target.value })}
                    className="w-full rounded-xl border border-violet-500/20 bg-violet-500/10 px-3 py-2.5 font-sans text-sm text-violet-200 focus:border-violet-500/50 focus:outline-none"
                  >
                    <option value="1-10 empleados" className="bg-black">1-10 empleados</option>
                    <option value="11-50 empleados" className="bg-black">11-50 empleados</option>
                    <option value="50-200 empleados" className="bg-black">50-200 empleados</option>
                    <option value="200-500 empleados" className="bg-black">200-500 empleados</option>
                    <option value="500+ empleados" className="bg-black">500+ empleados</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block font-sans text-sm font-medium text-violet-300">
                    Ubicacion
                  </label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="rounded-xl border-violet-500/20 bg-violet-500/10 font-sans text-white focus:border-violet-500/50"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-sans text-sm font-medium text-violet-300">
                    Sitio Web
                  </label>
                  <Input
                    value={formData.website_url}
                    onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                    className="rounded-xl border-violet-500/20 bg-violet-500/10 font-sans text-white focus:border-violet-500/50"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-sans text-sm font-medium text-violet-300">
                    Descripcion
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="min-h-[100px] rounded-xl border-violet-500/20 bg-violet-500/10 font-sans text-white focus:border-violet-500/50"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="rounded-xl border-violet-500/30 bg-transparent font-sans text-violet-300 hover:border-violet-500/50 hover:bg-violet-500/10"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="rounded-xl border-0 bg-gradient-to-r from-violet-600 to-purple-600 font-sans text-white shadow-lg shadow-violet-500/25"
                >
                  Guardar Cambios
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function RecruiterDashboardPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [companyProfile, setCompanyProfile] = useState(mockCompanyProfile);
  const [showEditCompany, setShowEditCompany] = useState(false);
  const [showCreateVacancy, setShowCreateVacancy] = useState(false);

  const openVacancies = mockVacancies.filter(v => v.status === 'open').length;
  const totalApplicants = mockVacancies.reduce((sum, v) => sum + v.applicants, 0);
  const savedTalent = 12; // Mock value

  return (
    <div className="min-h-screen bg-black p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-violet-400" />
          <span className="font-sans text-sm font-medium uppercase tracking-wider text-violet-400">
            Panel de Reclutador
          </span>
        </div>
        <h1 className="mt-2 font-sans text-3xl font-bold text-white">
          Bienvenido, {user?.name?.split(' ')[0] || 'Reclutador'}
        </h1>
        <p className="mt-1 font-sans text-violet-300/60">
          Tu centro de comando para gestionar vacantes y encontrar talento.
        </p>
      </motion.div>

      {/* KPI Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KPICard
          icon={Briefcase}
          label="Vacantes Activas"
          value={openVacancies}
          trend={{ value: 12, positive: true }}
          delay={0}
        />
        <KPICard
          icon={Users}
          label="Postulaciones Recibidas"
          value={totalApplicants}
          trend={{ value: 8, positive: true }}
          delay={0.1}
        />
        <KPICard
          icon={Heart}
          label="Talento Guardado"
          value={savedTalent}
          delay={0.2}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-3"
          >
            <Button
              onClick={() => navigate('/recruiter/talent-discovery')}
              className="gap-2 rounded-xl border-0 bg-gradient-to-r from-violet-600 to-purple-600 px-5 font-sans text-white shadow-lg shadow-violet-500/25"
            >
              <Search className="h-4 w-4" />
              Busqueda de Talento
            </Button>
            <Button
              onClick={() => setShowCreateVacancy(true)}
              variant="outline"
              className="gap-2 rounded-xl border-violet-500/30 bg-transparent font-sans text-violet-300 hover:border-violet-500/50 hover:bg-violet-500/10"
            >
              <Plus className="h-4 w-4" />
              Crear Nueva Vacante
            </Button>
          </motion.div>

          {/* Mis Vacantes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="rounded-2xl border border-violet-500/20 bg-black/60 p-0">
              <CardHeader className="border-b border-violet-500/20 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600/20 to-purple-600/20">
                      <Briefcase className="h-5 w-5 text-violet-400" />
                    </div>
                    <div>
                      <CardTitle className="font-sans text-lg font-semibold text-white">
                        Mis Vacantes
                      </CardTitle>
                      <p className="font-sans text-sm text-violet-300/60">
                        {mockVacancies.length} vacantes en total
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setShowCreateVacancy(true)}
                    size="sm"
                    className="gap-1 rounded-xl border-0 bg-violet-500/20 font-sans text-sm text-violet-300 hover:bg-violet-500/30"
                  >
                    <Plus className="h-4 w-4" />
                    Nueva
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 p-5">
                {mockVacancies.map((vacancy, index) => (
                  <VacancyCard key={vacancy.id} vacancy={vacancy} index={index} />
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar - Company Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-6"
        >
          <Card className="rounded-2xl border border-violet-500/20 bg-black/60 p-0">
            <CardHeader className="border-b border-violet-500/20 p-5">
              <div className="flex items-center justify-between">
                <CardTitle className="font-sans text-lg font-semibold text-white">
                  Perfil de Empresa
                </CardTitle>
                <button
                  onClick={() => setShowEditCompany(true)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-violet-400 transition-colors hover:bg-violet-500/10"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              {/* Company Logo & Name */}
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-violet-500/30 bg-violet-500/10">
                  {companyProfile.logo_url ? (
                    <img 
                      src={companyProfile.logo_url} 
                      alt={companyProfile.company_name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Building2 className="h-8 w-8 text-violet-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-sans text-lg font-bold text-white">
                    {companyProfile.company_name}
                  </h3>
                  <p className="font-sans text-sm text-violet-400">{companyProfile.industry}</p>
                </div>
              </div>

              {/* Company Info */}
              <div className="mt-5 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Users className="h-4 w-4 text-violet-400" />
                  <span className="font-sans text-violet-300/70">{companyProfile.company_size}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-violet-400" />
                  <span className="font-sans text-violet-300/70">{companyProfile.location}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Globe className="h-4 w-4 text-violet-400" />
                  <a 
                    href={companyProfile.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 font-sans text-violet-400 hover:underline"
                  >
                    {companyProfile.website_url.replace('https://', '')}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              {/* Description */}
              <div className="mt-5 rounded-xl border border-violet-500/10 bg-violet-500/5 p-4">
                <p className="font-sans text-sm leading-relaxed text-violet-300/70">
                  {companyProfile.description}
                </p>
              </div>

              <Button
                onClick={() => setShowEditCompany(true)}
                variant="outline"
                className="mt-5 w-full gap-2 rounded-xl border-violet-500/30 bg-transparent font-sans text-violet-300 hover:border-violet-500/50 hover:bg-violet-500/10"
              >
                <Pencil className="h-4 w-4" />
                Editar Perfil de Empresa
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="rounded-2xl border border-violet-500/20 bg-black/60 p-5">
            <h3 className="mb-4 font-sans text-sm font-semibold uppercase tracking-wider text-violet-300/60">
              Resumen del mes
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-sans text-sm text-violet-300/70">Perfiles vistos</span>
                <span className="font-sans text-lg font-bold text-white">247</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-sans text-sm text-violet-300/70">Contactos enviados</span>
                <span className="font-sans text-lg font-bold text-white">18</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-sans text-sm text-violet-300/70">Tasa de respuesta</span>
                <span className="font-sans text-lg font-bold text-emerald-400">72%</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Modals */}
      <EditCompanyModal
        isOpen={showEditCompany}
        onClose={() => setShowEditCompany(false)}
        profile={companyProfile}
        onSave={setCompanyProfile}
      />
      <CreateVacancyModal
        isOpen={showCreateVacancy}
        onClose={() => setShowCreateVacancy(false)}
      />
    </div>
  );
}
