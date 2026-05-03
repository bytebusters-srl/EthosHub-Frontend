import { create } from 'zustand';
import api from '@/shared/api/api'; // Ruta corregida según tu proyecto
import type { HardSkill, SoftSkill, GlobalSkillTag, SkillLevel, SkillCategory } from '@/shared/types';

interface SkillsStore {
  hardSkills: HardSkill[];
  softSkills: SoftSkill[];
  searchResults: GlobalSkillTag[];
  loading: boolean;
  error: string | null;
  
  // Acciones
  fetchHardSkills: (userId: string) => Promise<void>;
  fetchSoftSkills: (userId: string) => Promise<void>;
  searchTags: (query: string) => Promise<void>;
  addHardSkill: (userId: string, tagId: string, level: SkillLevel) => Promise<void>;
  removeHardSkill: (userId: string, skillId: string) => Promise<void>;
  addSoftSkill: (userId: string, title: string, description?: string) => Promise<void>;
  removeSoftSkill: (userId: string, skillId: string) => Promise<void>;
  
  // OPCIÓN A: Usando el tipo SkillCategory explícitamente
  createTag: (name: string, category: SkillCategory) => Promise<GlobalSkillTag>;
  updateSoftSkill: (skillId: string, title: string, description?: string) => Promise<void>;

  // Placeholders
  toggleTopSkill: (userId: string, skillId: string) => Promise<void>;
  reorderTopSkills: (userId: string, skillIds: string[]) => Promise<void>;
}

export const useSkillsStore = create<SkillsStore>((set, get) => ({
  hardSkills: [],
  softSkills: [],
  searchResults: [],
  loading: false,
  error: null,

  fetchHardSkills: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/users/${userId}/skills/hard`);
      set({ hardSkills: response.data.data || [], loading: false });
    } catch (err) {
      set({ error: 'Error al cargar habilidades', loading: false });
    }
  },

  fetchSoftSkills: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/users/${userId}/skills/soft`);
      set({ softSkills: response.data.data || [], loading: false });
    } catch (err) {
      set({ error: 'Error al cargar soft skills', loading: false });
    }
  },

  searchTags: async (query: string) => {
    if (!query) return set({ searchResults: [] });
    try {
      const response = await api.get(`/skills/tags?query=${query}`);
      set({ searchResults: response.data.data || [] });
    } catch {
      set({ searchResults: [] });
    }
  },

  addHardSkill: async (userId: string, tagId: string, level: SkillLevel) => {
    set({ loading: true });
    try {
      await api.post(`/users/${userId}/skills/hard`, { tagId, level });
      await get().fetchHardSkills(userId);
      set({ loading: false });
    } catch (err) {
      set({ error: 'Error al agregar skill', loading: false });
    }
  },

  // OPCIÓN A: Implementación con tipo estricto
  createTag: async (name: string, category: SkillCategory) => {
    const newTag: GlobalSkillTag = { 
      id: crypto.randomUUID(), 
      name, 
      category,
      isNormalized: false // <-- Agregamos esto para cumplir con la interfaz
    };
    
    set((state) => ({ 
      searchResults: [...state.searchResults, newTag] 
    }));
    
    return newTag;
  },

  removeHardSkill: async (userId: string, skillId: string) => {
    try {
      await api.delete(`/users/${userId}/skills/hard/${skillId}`);
      set((state) => ({
        hardSkills: state.hardSkills.filter((s) => s.id !== skillId),
      }));
    } catch (err) {
      set({ error: 'No se pudo eliminar la habilidad' });
    }
  },

  addSoftSkill: async (userId: string, title: string, description?: string) => {
    try {
      await api.post(`/users/${userId}/skills/soft`, { title, description });
      await get().fetchSoftSkills(userId);
    } catch (err) {
      set({ error: 'Error al agregar soft skill' });
    }
  },

  updateSoftSkill: async (skillId: string, title: string, description?: string) => {
    try {
      await api.put(`/users/skills/soft/${skillId}`, { title, description });
      set((state) => ({
        softSkills: state.softSkills.map((s) => 
          s.id === skillId ? { ...s, title, description: description || '' } : s
        ),
      }));
    } catch (err) {
      set({ error: 'Error al actualizar soft skill' });
    }
  },

  removeSoftSkill: async (userId: string, skillId: string) => {
    try {
      await api.delete(`/users/${userId}/skills/soft/${skillId}`);
      set((state) => ({
        softSkills: state.softSkills.filter((s) => s.id !== skillId),
      }));
    } catch (err) {
      set({ error: 'Error al eliminar soft skill' });
    }
  },

  toggleTopSkill: async (userId: string, skillId: string) => {
    set({ loading: true });
    try {
        await api.put(`/users/${userId}/skills/hard/${skillId}/top`);
        await get().fetchHardSkills(userId);
        set({ loading: false });
    } catch (err) {
        set({ error: 'Error al actualizar top skill', loading: false });
    }
},

reorderTopSkills: async (userId: string, skillIds: string[]) => {
    console.log('=== REORDER ===', { userId, skillIds }); // 👈 agrega esto
    set({ loading: true });
    try {
        await api.put(`/users/${userId}/skills/hard/top/reorder`, { skillIds });
        await get().fetchHardSkills(userId);
        set({ loading: false });
    } catch (err) {
        set({ error: 'Error al reordenar', loading: false });
    }
},
}));