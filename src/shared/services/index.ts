import { delay, generateId } from '../lib/utils';
import {
  mockUsers,
  mockGlobalSkillTags,
  mockHardSkills,
  mockSoftSkills,
  mockProjects,
  mockConnections,
  mockGithubRepos,
  mockGithubHeatmap,
  mockLinkedinExperiences,
  mockLinkedinEducations,
  mockRecommendations,
  mockVisibilitySettings,
  mockModerationHistory,
  mockPlatformMetrics,
  mockActivityLogs,
  mockTimeSeriesData,
  mockUserPreferences,
  mockNotifications,
  reservedSlugs,
  takenSlugs,
} from '../mocks/data';
import type {
  User,
  UserRole,
  HardSkill,
  SoftSkill,
  GlobalSkillTag,
  SkillLevel,
  Project,
  OAuthConnection,
  GithubRepository,
  VisibilitySettings,
  SectionVisibility,
  PortfolioSection,
  ModerationAction,
  PlatformMetrics,
  ActivityLog,
  TimeSeriesData,
  UserPreferences,
  Language,
  Notification,
} from '../types';

const DELAY_MS = 500;

// =============================================
// AUTH SERVICE
// =============================================
export const authService = {
  async login(email: string, _password: string, role: UserRole): Promise<User> {
    await delay(DELAY_MS);
    const user = mockUsers.find((u) => u.role === role) || mockUsers[0];
    return { ...user, email };
  },

  async logout(): Promise<void> {
    await delay(300);
  },

  async getCurrentUser(): Promise<User | null> {
    await delay(300);
    const stored = localStorage.getItem('ethoshub_user');
    if (stored) {
      return JSON.parse(stored);
    }
    return null;
  },

  async updateProfile(userId: string, data: Partial<User>): Promise<User> {
    await delay(DELAY_MS);
    const user = mockUsers.find((entry) => entry.id === userId);
    if (!user) {
      throw new Error('User not found');
    }

    Object.assign(user, data);
    localStorage.setItem('ethoshub_user', JSON.stringify(user));
    return { ...user };
  },
};

// =============================================
// SKILLS SERVICE
// =============================================
let hardSkillsData = [...mockHardSkills];
let softSkillsData = [...mockSoftSkills];
let globalTagsData = [...mockGlobalSkillTags];

export const skillsService = {
  async searchTags(query: string): Promise<GlobalSkillTag[]> {
    await delay(300);
    if (!query) return globalTagsData.filter((t) => t.isNormalized).slice(0, 10);
    return globalTagsData.filter(
      (t) => t.isNormalized && t.name.toLowerCase().includes(query.toLowerCase())
    );
  },

  async getHardSkills(userId: string): Promise<HardSkill[]> {
    await delay(DELAY_MS);
    return hardSkillsData.filter((s) => s.userId === userId);
  },

  async addHardSkill(
    userId: string,
    tagId: string,
    level: SkillLevel
  ): Promise<HardSkill> {
    await delay(DELAY_MS);
    const tag = globalTagsData.find((t) => t.id === tagId);
    if (!tag) throw new Error('Tag not found');

    const newSkill: HardSkill = {
      id: generateId(),
      userId,
      skillTag: tag,
      level,
      isTop: false,
      endorsements: [],
      createdAt: new Date().toISOString(),
    };
    hardSkillsData.push(newSkill);
    return newSkill;
  },

  async createTag(name: string, category: string): Promise<GlobalSkillTag> {
    await delay(DELAY_MS);
    const newTag: GlobalSkillTag = {
      id: generateId(),
      name,
      category: category as GlobalSkillTag['category'],
      isNormalized: false,
    };
    globalTagsData.push(newTag);
    return newTag;
  },

  async removeHardSkill(skillId: string): Promise<void> {
    await delay(DELAY_MS);
    hardSkillsData = hardSkillsData.filter((s) => s.id !== skillId);
  },

  async toggleTopSkill(skillId: string): Promise<HardSkill> {
    await delay(300);
    const skill = hardSkillsData.find((s) => s.id === skillId);
    if (!skill) throw new Error('Skill not found');

    const topCount = hardSkillsData.filter((s) => s.userId === skill.userId && s.isTop).length;
    if (!skill.isTop && topCount >= 3) {
      throw new Error('Maximum 3 top skills allowed');
    }

    skill.isTop = !skill.isTop;
    return skill;
  },

  async toggleEndorsement(skillId: string, endorserId: string, endorserName: string, endorserAvatar: string): Promise<void> {
    await delay(DELAY_MS);
    const skill = hardSkillsData.find((s) => s.id === skillId);
    if (!skill) throw new Error('Skill not found');

    const existingIndex = skill.endorsements.findIndex((e) => e.endorserId === endorserId);
    if (existingIndex >= 0) {
      skill.endorsements.splice(existingIndex, 1);
    } else {
      skill.endorsements.push({
        id: generateId(),
        skillId,
        endorserId,
        endorserName,
        endorserAvatar,
        createdAt: new Date().toISOString(),
      });
    }
  },

  async getSoftSkills(userId: string): Promise<SoftSkill[]> {
    await delay(DELAY_MS);
    return softSkillsData.filter((s) => s.userId === userId);
  },

  async addSoftSkill(userId: string, title: string, description?: string): Promise<SoftSkill> {
    await delay(DELAY_MS);
    const newSkill: SoftSkill = {
      id: generateId(),
      userId,
      title,
      description,
      createdAt: new Date().toISOString(),
    };
    softSkillsData.push(newSkill);
    return newSkill;
  },

  async updateSoftSkill(skillId: string, title: string, description?: string): Promise<SoftSkill> {
    await delay(DELAY_MS);
    const skill = softSkillsData.find((s) => s.id === skillId);
    if (!skill) throw new Error('Skill not found');
    skill.title = title;
    skill.description = description;
    return skill;
  },

  async removeSoftSkill(skillId: string): Promise<void> {
    await delay(DELAY_MS);
    softSkillsData = softSkillsData.filter((s) => s.id !== skillId);
  },

  async getAllTags(): Promise<GlobalSkillTag[]> {
    await delay(DELAY_MS);
    return globalTagsData;
  },

  async mergeTags(sourceIds: string[], targetId: string): Promise<void> {
    await delay(DELAY_MS);
    globalTagsData = globalTagsData.filter((t) => !sourceIds.includes(t.id) || t.id === targetId);
  },
};

// =============================================
// PROJECTS SERVICE
// =============================================
let projectsData = [...mockProjects];

export const projectsService = {
  async getProjects(userId: string): Promise<Project[]> {
    await delay(DELAY_MS);
    return projectsData.filter((p) => p.userId === userId);
  },

  async getProject(projectId: string): Promise<Project | null> {
    await delay(DELAY_MS);
    return projectsData.find((p) => p.id === projectId) || null;
  },

  async getPublicProjects(userId: string): Promise<Project[]> {
    await delay(DELAY_MS);
    return projectsData.filter((p) => p.userId === userId && p.isPublic);
  },

  async createProject(userId: string, data: Partial<Project>): Promise<Project> {
    await delay(DELAY_MS);
    const newProject: Project = {
      id: generateId(),
      userId,
      title: data.title || '',
      description: data.description || '',
      category: data.category || 'Other',
      status: data.status || 'draft',
      isPublic: data.isPublic || false,
      isFeatured: data.isFeatured || false,
      thumbnail: data.thumbnail,
      technicalInfo: data.technicalInfo || {
        role: '',
        technologies: [],
        startDate: '',
        results: '',
      },
      media: [],
      files: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    projectsData.push(newProject);
    return newProject;
  },

  async updateProject(projectId: string, data: Partial<Project>): Promise<Project> {
    await delay(DELAY_MS);
    const index = projectsData.findIndex((p) => p.id === projectId);
    if (index === -1) throw new Error('Project not found');

    projectsData[index] = {
      ...projectsData[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return projectsData[index];
  },

  async deleteProject(projectId: string): Promise<void> {
    await delay(DELAY_MS);
    projectsData = projectsData.filter((p) => p.id !== projectId);
  },
};

// =============================================
// CONNECTIONS SERVICE
// =============================================
export const connectionsService = {
  async getConnections(userId: string): Promise<OAuthConnection[]> {
    await delay(DELAY_MS);
    return mockConnections.filter((c) => c.userId === userId);
  },

  async syncAll(userId: string): Promise<void> {
    await delay(1500);
    console.log('Synced all connections for user:', userId);
  },

  async disconnect(connectionId: string): Promise<void> {
    await delay(DELAY_MS);
    console.log('Disconnected:', connectionId);
  },

  async reconnect(connectionId: string): Promise<OAuthConnection> {
    await delay(1000);
    const connection = mockConnections.find((c) => c.id === connectionId);
    if (!connection) throw new Error('Connection not found');
    return { ...connection, status: 'connected', lastSynced: new Date().toISOString() };
  },

  async getGithubRepos(): Promise<GithubRepository[]> {
    await delay(DELAY_MS);
    return mockGithubRepos;
  },

  async getGithubHeatmap() {
    await delay(DELAY_MS);
    return mockGithubHeatmap;
  },

  async importGithubRepos(repoIds: string[]): Promise<void> {
    await delay(1000);
    console.log('Imported repos:', repoIds);
  },

  async getLinkedinExperiences() {
    await delay(DELAY_MS);
    return mockLinkedinExperiences;
  },

  async getLinkedinEducations() {
    await delay(DELAY_MS);
    return mockLinkedinEducations;
  },

  async getRecommendations() {
    await delay(DELAY_MS);
    return mockRecommendations;
  },

  async importLinkedinData(): Promise<void> {
    await delay(1000);
    console.log('LinkedIn data imported');
  },
};

// =============================================
// VISIBILITY SERVICE
// =============================================
export const visibilityService = {
  async getSettings(userId: string): Promise<VisibilitySettings | null> {
    await delay(DELAY_MS);
    return mockVisibilitySettings.find((v) => v.userId === userId) || null;
  },

  async checkSlugAvailability(slug: string): Promise<{ available: boolean; reason?: string }> {
    await delay(300);
    if (reservedSlugs.includes(slug)) {
      return { available: false, reason: 'reserved' };
    }
    if (takenSlugs.includes(slug)) {
      return { available: false, reason: 'taken' };
    }
    return { available: true };
  },

  async updateSlug(userId: string, slug: string): Promise<void> {
    await delay(DELAY_MS);
    const settings = mockVisibilitySettings.find((v) => v.userId === userId);
    if (settings) {
      settings.slug = slug;
    }
  },

  async updateSectionVisibility(
    userId: string,
    section: PortfolioSection,
    visibility: SectionVisibility
  ): Promise<void> {
    await delay(DELAY_MS);
    const settings = mockVisibilitySettings.find((v) => v.userId === userId);
    if (settings) {
      settings.sections[section] = visibility;
    }
  },

  async updateSeoSettings(userId: string, seo: { title: string; description: string }): Promise<void> {
    await delay(DELAY_MS);
    const settings = mockVisibilitySettings.find((v) => v.userId === userId);
    if (settings) {
      settings.seo = seo;
    }
  },

  async updatePasswordProtection(userId: string, enabled: boolean, password?: string): Promise<void> {
    await delay(DELAY_MS);
    const settings = mockVisibilitySettings.find((v) => v.userId === userId);
    if (settings) {
      settings.isPasswordProtected = enabled;
      settings.password = password;
    }
  },

  async getPublicPortfolio(slug: string): Promise<{ user: User; settings: VisibilitySettings } | null> {
    await delay(DELAY_MS);
    const settings = mockVisibilitySettings.find((v) => v.slug === slug);
    if (!settings) return null;
    const user = mockUsers.find((u) => u.id === settings.userId);
    if (!user) return null;
    return { user, settings };
  },

  async verifyPassword(slug: string, password: string): Promise<boolean> {
    await delay(DELAY_MS);
    const settings = mockVisibilitySettings.find((v) => v.slug === slug);
    return settings?.password === password;
  },

  async getPublicPortfolios(): Promise<{ user: User; settings: VisibilitySettings }[]> {
    await delay(DELAY_MS);
    return mockVisibilitySettings
      .filter((v) => v.isPublicProfileEnabled && !v.isPasswordProtected)
      .map((settings) => {
        const user = mockUsers.find((u) => u.id === settings.userId)!;
        return { user, settings };
      });
  },

  async getModerationHistory(portfolioId: string): Promise<ModerationAction[]> {
    await delay(DELAY_MS);
    return mockModerationHistory.filter((m) => m.portfolioId === portfolioId);
  },

  async moderatePortfolio(
    portfolioId: string,
    action: ModerationAction['actionType'],
    reason?: string
  ): Promise<void> {
    await delay(DELAY_MS);
    mockModerationHistory.push({
      id: generateId(),
      portfolioId,
      adminId: '3',
      adminName: 'Admin EthosHub',
      actionType: action,
      previousState: 'active',
      newState: action === 'deactivate' ? 'deactivated' : 'active',
      reason,
      createdAt: new Date().toISOString(),
    });
  },
};

// =============================================
// ANALYTICS SERVICE
// =============================================
export const analyticsService = {
  async getPlatformMetrics(): Promise<PlatformMetrics> {
    await delay(DELAY_MS);
    return mockPlatformMetrics;
  },

  async getRecentActivity(limit: number = 10): Promise<ActivityLog[]> {
    await delay(DELAY_MS);
    return mockActivityLogs.slice(0, limit);
  },

  async getTimeSeriesData(days: number = 30): Promise<TimeSeriesData[]> {
    await delay(DELAY_MS);
    return mockTimeSeriesData.slice(-days);
  },
};

// =============================================
// PREFERENCES SERVICE
// =============================================
let userPreferencesData = { ...mockUserPreferences };

export const preferencesService = {
  async getPreferences(userId: string): Promise<UserPreferences> {
    await delay(DELAY_MS);
    return { ...userPreferencesData, userId };
  },

  async updateLanguage(language: Language): Promise<void> {
    await delay(300);
    userPreferencesData.language = language;
    localStorage.setItem('ethoshub_language', language);
  },

  async updateSectionOrder(order: PortfolioSection[]): Promise<void> {
    await delay(DELAY_MS);
    userPreferencesData.sectionOrder = order;
  },

  async updatePreference(key: keyof UserPreferences, value: unknown): Promise<void> {
    await delay(DELAY_MS);
    (userPreferencesData as Record<string, unknown>)[key] = value;
  },
};

// =============================================
// NOTIFICATIONS SERVICE
// =============================================
let notificationsData = [...mockNotifications];

export const notificationsService = {
  async getNotifications(userId: string): Promise<Notification[]> {
    await delay(DELAY_MS);
    return notificationsData.filter((n) => n.userId === userId);
  },

  async markAsRead(notificationId: string): Promise<void> {
    await delay(300);
    const notification = notificationsData.find((n) => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
    }
  },

  async markAllAsRead(userId: string): Promise<void> {
    await delay(300);
    notificationsData
      .filter((n) => n.userId === userId)
      .forEach((n) => {
        n.isRead = true;
      });
  },
};
