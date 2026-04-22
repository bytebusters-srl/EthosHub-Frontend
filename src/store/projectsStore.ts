import { create } from 'zustand';
import type { Project } from '@/shared/types';
import { projectsService } from '@/shared/services';

interface ProjectsStore {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  error: string | null;
  fetchProjects: (userId: string) => Promise<void>;
  fetchProject: (projectId: string) => Promise<void>;
  fetchPublicProjects: (userId: string) => Promise<void>;
  createProject: (userId: string, data: Partial<Project>) => Promise<void>;
  updateProject: (projectId: string, data: Partial<Project>) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  clearCurrentProject: () => void;
}

export const useProjectsStore = create<ProjectsStore>((set) => ({
  projects: [],
  currentProject: null,
  loading: false,
  error: null,

  fetchProjects: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const projects = await projectsService.getProjects(userId);
      set({ projects, loading: false });
    } catch {
      set({ error: 'Error al cargar proyectos', loading: false });
    }
  },

  fetchProject: async (projectId: string) => {
    set({ loading: true, error: null });
    try {
      const currentProject = await projectsService.getProject(projectId);
      set({ currentProject, loading: false });
    } catch {
      set({ error: 'Error al cargar proyecto', loading: false });
    }
  },

  fetchPublicProjects: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const projects = await projectsService.getPublicProjects(userId);
      set({ projects, loading: false });
    } catch {
      set({ error: 'Error al cargar proyectos', loading: false });
    }
  },

  createProject: async (userId: string, data: Partial<Project>) => {
    set({ loading: true, error: null });
    try {
      const newProject = await projectsService.createProject(userId, data);
      set((state) => ({
        projects: [...state.projects, newProject],
        loading: false,
      }));
    } catch {
      set({ error: 'Error al crear proyecto', loading: false });
    }
  },

  updateProject: async (projectId: string, data: Partial<Project>) => {
    set({ loading: true, error: null });
    try {
      const updatedProject = await projectsService.updateProject(projectId, data);
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === projectId ? updatedProject : p
        ),
        currentProject:
          state.currentProject?.id === projectId ? updatedProject : state.currentProject,
        loading: false,
      }));
    } catch {
      set({ error: 'Error al actualizar proyecto', loading: false });
    }
  },

  deleteProject: async (projectId: string) => {
    set({ loading: true, error: null });
    try {
      await projectsService.deleteProject(projectId);
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== projectId),
        currentProject:
          state.currentProject?.id === projectId ? null : state.currentProject,
        loading: false,
      }));
    } catch {
      set({ error: 'Error al eliminar proyecto', loading: false });
    }
  },

  clearCurrentProject: () => {
    set({ currentProject: null });
  },
}));
