import { useState } from 'react';
import { Building2, ChevronDown, ChevronUp, Save } from 'lucide-react';
import { Card } from '@/shared/ui';

// 🏢 Tarjeta para los datos de la Empresa (Alineado con perfiles_company)
export function CompanyProfileCard() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    companySize: '',
    nit: '',
    websiteUrl: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Guardando datos de la empresa:', formData);
    // Aquí luego conectaremos con tu backend/store
    setIsExpanded(false);
  };

  return (
    <Card className="w-full overflow-hidden border-gray-200 bg-white transition-colors dark:border-white/10 dark:bg-zinc-950">
      {/* Cabecera (Click para expandir) */}
      <div 
        className="flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-gray-50 sm:p-6 dark:hover:bg-white/[0.02]"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 sm:h-12 sm:w-12 sm:rounded-2xl dark:bg-blue-500/10 dark:text-blue-400">
            <Building2 className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-black sm:text-lg dark:text-white">
              Perfil de la Empresa
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Nombre, rubro, tamaño y datos fiscales.
            </p>
          </div>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-zinc-900 dark:text-gray-400">
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </div>

      {/* Formulario Expandible */}
      {isExpanded && (
        <div className="border-t border-gray-100 bg-gray-50/50 p-4 sm:p-6 dark:border-white/5 dark:bg-black/20">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-black dark:text-white">Nombre de la empresa</label>
                <input
                  type="text"
                  placeholder="Ej. TechCorp"
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-black focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-white/10 dark:bg-zinc-900 dark:text-white"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-black dark:text-white">Rubro / Industria</label>
                <input
                  type="text"
                  placeholder="Ej. Desarrollo de Software"
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-black focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-white/10 dark:bg-zinc-900 dark:text-white"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-black dark:text-white">Tamaño de la empresa</label>
                <select
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-black focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-white/10 dark:bg-zinc-900 dark:text-white"
                  value={formData.companySize}
                  onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                >
                  <option value="">Selecciona un tamaño</option>
                  <option value="1-10">1-10 empleados</option>
                  <option value="11-50">11-50 empleados</option>
                  <option value="51-200">51-200 empleados</option>
                  <option value="201+">Más de 200 empleados</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-black dark:text-white">NIT</label>
                <input
                  type="text"
                  placeholder="Número de Identificación Tributaria"
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-black focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-white/10 dark:bg-zinc-900 dark:text-white"
                  value={formData.nit}
                  onChange={(e) => setFormData({ ...formData, nit: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-700"
              >
                <Save className="h-4 w-4" />
                Guardar cambios
              </button>
            </div>
          </form>
        </div>
      )}
    </Card>
  );
}