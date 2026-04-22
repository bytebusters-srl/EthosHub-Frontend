import { create } from 'zustand';
import type { HardSkill, SoftSkill, GlobalSkillTag, SkillLevel } from '@/shared/types';
import { skillsService } from '@/shared/services';

interface SkillsStore {
  hardSkills: HardSkill[];
  softSkills: SoftSkill[];
  globalTags: GlobalSkillTag[];
  searchResults: GlobalSkillTag[];
  loading: boolean;
  error: string | null;
  fetchHardSkills: (userId: string) => Promise<void>;
  fetchSoftSkills: (userId: string) => Promise<void>;
  searchTags: (query: string) => Promise<void>;
  addHardSkill: (userId: string, tagId: string, level: SkillLevel) => Promise<void>;
  createTag: (name: string, category: string) => Promise<GlobalSkillTag>;
  removeHardSkill: (skillId: string) => Promise<void>;
  toggleTopSkill: (skillId: string) => Promise<void>;
  toggleEndorsement: (skillId: string, endorserId: string, endorserName: string, endorserAvatar: string) => Promise<void>;
  addSoftSkill: (userId: string, title: string, description?: string) => Promise<void>;
  updateSoftSkill: (skillId: string, title: string, description?: string) => Promise<void>;
  removeSoftSkill: (skillId: string) => Promise<void>;
  fetchAllTags: () => Promise<void>;
  mergeTags: (sourceIds: string[], targetId: string) => Promise<void>;
}

export const useSkillsStore = create<SkillsStore>((set, get) => ({
  hardSkills: [],
  softSkills: [],
  globalTags: [],
  searchResults: [],
  loading: false,
  error: null,

  fetchHardSkills: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const hardSkills = await skillsService.getHardSkills(userId);
      set({ hardSkills, loading: false });
    } catch {
      set({ error: 'Error al cargar habilidades', loading: false });
    }
  },

  fetchSoftSkills: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const softSkills = await skillsService.getSoftSkills(userId);
      set({ softSkills, loading: false });
    } catch {
      set({ error: 'Error al cargar soft skills', loading: false });
    }
  },

  searchTags: async (query: string) => {
    try {
      const searchResults = await skillsService.searchTags(query);
      set({ searchResults });
    } catch {
      set({ searchResults: [] });
    }
  },

  addHardSkill: async (userId: string, tagId: string, level: SkillLevel) => {
    set({ loading: true, error: null });
    try {
      const newSkill = await skillsService.addHardSkill(userId, tagId, level);
      set((state) => ({
        hardSkills: [...state.hardSkills, newSkill],
        loading: false,
      }));
    } catch {
      set({ error: 'Error al agregar skill', loading: false });
    }
  },

  createTag: async (name: string, category: string) => {
    const newTag = await skillsService.createTag(name, category);
    set((state) => ({
      globalTags: [...state.globalTags, newTag],
      searchResults: [...state.searchResults, newTag],
    }));
    return newTag;
  },

  removeHardSkill: async (skillId: string) => {
    set({ loading: true, error: null });
    try {
      await skillsService.removeHardSkill(skillId);
      set((state) => ({
        hardSkills: state.hardSkills.filter((s) => s.id !== skillId),
        loading: false,
      }));
    } catch {
      set({ error: 'Error al eliminar skill', loading: false });
    }
  },

  toggleTopSkill: async (skillId: string) => {
    try {
      const updatedSkill = await skillsService.toggleTopSkill(skillId);
      set((state) => ({
        hardSkills: state.hardSkills.map((s) =>
          s.id === skillId ? updatedSkill : s
        ),
      }));
    } catch (error) {
      throw error;
    }
  },

  toggleEndorsement: async (skillId: string, endorserId: string, endorserName: string, endorserAvatar: string) => {
    try {
      await skillsService.toggleEndorsement(skillId, endorserId, endorserName, endorserAvatar);
      await get().fetchHardSkills(get().hardSkills[0]?.userId || '1');
    } catch {
      set({ error: 'Error al validar skill' });
    }
  },

  addSoftSkill: async (userId: string, title: string, description?: string) => {
    set({ loading: true, error: null });
    try {
      const newSkill = await skillsService.addSoftSkill(userId, title, description);
      set((state) => ({
        softSkills: [...state.softSkills, newSkill],
        loading: false,
      }));
    } catch {
      set({ error: 'Error al agregar soft skill', loading: false });
    }
  },

  updateSoftSkill: async (skillId: string, title: string, description?: string) => {
    set({ loading: true, error: null });
    try {
      const updatedSkill = await skillsService.updateSoftSkill(skillId, title, description);
      set((state) => ({
        softSkills: state.softSkills.map((s) =>
          s.id === skillId ? updatedSkill : s
        ),
        loading: false,
      }));
    } catch {
      set({ error: 'Error al actualizar soft skill', loading: false });
    }
  },

  removeSoftSkill: async (skillId: string) => {
    set({ loading: true, error: null });
    try {
      await skillsService.removeSoftSkill(skillId);
      set((state) => ({
        softSkills: state.softSkills.filter((s) => s.id !== skillId),
        loading: false,
      }));
    } catch {
      set({ error: 'Error al eliminar soft skill', loading: false });
    }
  },

  fetchAllTags: async () => {
    set({ loading: true, error: null });
    try {
      const globalTags = await skillsService.getAllTags();
      set({ globalTags, loading: false });
    } catch {
      set({ error: 'Error al cargar tags', loading: false });
    }
  },

  mergeTags: async (sourceIds: string[], targetId: string) => {
    set({ loading: true, error: null });
    try {
      await skillsService.mergeTags(sourceIds, targetId);
      set((state) => ({
        globalTags: state.globalTags.filter(
          (t) => !sourceIds.includes(t.id) || t.id === targetId
        ),
        loading: false,
      }));
    } catch {
      set({ error: 'Error al fusionar tags', loading: false });
    }
  },
}));
