import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Plus,
  Star,
  Trash2,
  Edit2,
  Search,
  Filter,
} from 'lucide-react';
import { useAuthStore, useSkillsStore, useUiStore } from '@/store';
import {
  Button,
  Card,
  CardContent,
  Badge,
  Modal,
  Input,
  Select,
  Textarea,
  SearchInput,
  SectionHeader,
  Skeleton,
  EmptyState,
  AvatarGroup,
  Tooltip,
  ConfirmDialog,
} from '@/shared/ui';
import type { SkillLevel, SkillCategory, GlobalSkillTag } from '@/shared/types';

const skillLevels: { value: SkillLevel; label: string }[] = [
  { value: 'Junior', label: 'Junior' },
  { value: 'Mid', label: 'Mid' },
  { value: 'Senior', label: 'Senior' },
];

const categories: SkillCategory[] = [
  'Frontend',
  'Backend',
  'Bases de Datos',
  'Infraestructura',
  'Otras Tecnologías',
];

export default function SkillsPage() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { addToast } = useUiStore();
  const {
    hardSkills,
    softSkills,
    searchResults,
    loading,
    fetchHardSkills,
    fetchSoftSkills,
    searchTags,
    addHardSkill,
    createTag,
    removeHardSkill,
    toggleTopSkill,
    addSoftSkill,
    updateSoftSkill,
    removeSoftSkill,
  } = useSkillsStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showSoftSkillModal, setShowSoftSkillModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<GlobalSkillTag | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<SkillLevel>('Mid');
  const [newTagName, setNewTagName] = useState('');
  const [newTagCategory, setNewTagCategory] = useState<SkillCategory>('Frontend');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [softSkillTitle, setSoftSkillTitle] = useState('');
  const [softSkillDescription, setSoftSkillDescription] = useState('');
  const [editingSoftSkill, setEditingSoftSkill] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'hard' | 'soft'; id: string } | null>(null);

  useEffect(() => {
    if (user) {
      fetchHardSkills(user.id);
      fetchSoftSkills(user.id);
    }
  }, [user, fetchHardSkills, fetchSoftSkills]);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchTags(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, searchTags]);

  const handleAddSkill = async () => {
    if (!user || !selectedTag) return;

    const isDuplicate = hardSkills.some(
      (s) => s.skillTag.id === selectedTag.id
    );
    if (isDuplicate) {
      addToast({ type: 'error', title: 'Esta habilidad ya existe en tu perfil' });
      return;
    }

    if (hardSkills.length >= 50) {
      addToast({ type: 'error', title: 'Máximo 50 hard skills permitidas' });
      return;
    }

    await addHardSkill(user.id, selectedTag.id, selectedLevel);
    addToast({ type: 'success', title: 'Habilidad agregada exitosamente' });
    setShowAddModal(false);
    setSelectedTag(null);
    setSearchQuery('');
  };

  const handleCreateAndAddTag = async () => {
    if (!user || !newTagName.trim()) return;

    const newTag = await createTag(newTagName.trim(), newTagCategory);
    await addHardSkill(user.id, newTag.id, selectedLevel);
    addToast({ type: 'success', title: 'Nueva etiqueta creada y agregada' });
    setShowAddModal(false);
    setNewTagName('');
  };

  const handleToggleTop = async (skillId: string) => {
    try {
      await toggleTopSkill(skillId);
    } catch {
      addToast({ type: 'error', title: t('skills.maxTopSkills') });
    }
  };

  const handleAddSoftSkill = async () => {
    if (!user || !softSkillTitle.trim()) return;

    if (editingSoftSkill) {
      await updateSoftSkill(editingSoftSkill, softSkillTitle, softSkillDescription);
      addToast({ type: 'success', title: 'Soft skill actualizada' });
    } else {
      await addSoftSkill(user.id, softSkillTitle, softSkillDescription);
      addToast({ type: 'success', title: 'Soft skill agregada' });
    }

    setShowSoftSkillModal(false);
    setSoftSkillTitle('');
    setSoftSkillDescription('');
    setEditingSoftSkill(null);
  };

  const handleEditSoftSkill = (id: string) => {
    const skill = softSkills.find((s) => s.id === id);
    if (skill) {
      setSoftSkillTitle(skill.title);
      setSoftSkillDescription(skill.description || '');
      setEditingSoftSkill(id);
      setShowSoftSkillModal(true);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;

    if (deleteConfirm.type === 'hard') {
      await removeHardSkill(deleteConfirm.id);
    } else {
      await removeSoftSkill(deleteConfirm.id);
    }

    addToast({ type: 'success', title: 'Habilidad eliminada' });
    setDeleteConfirm(null);
  };

  const topSkillsCount = hardSkills.filter((s) => s.isTop).length;
  const filteredSkills = filterCategory === 'all'
    ? hardSkills
    : hardSkills.filter((s) => s.skillTag.category === filterCategory);

  const groupedSkills = categories.reduce((acc, category) => {
    const skills = filteredSkills.filter((s) => s.skillTag.category === category);
    if (skills.length > 0) {
      acc[category] = skills;
    }
    return acc;
  }, {} as Record<string, typeof filteredSkills>);

  return (
    <div className="space-y-6">
      <SectionHeader
        title={t('skills.title')}
        description="Gestiona tus habilidades técnicas y soft skills"
        action={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowSoftSkillModal(true)}
            >
              <Plus className="h-4 w-4" />
              Soft Skill
            </Button>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4" />
              Hard Skill
            </Button>
          </div>
        }
      />

      {/* Top Skills Counter */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Star className="h-6 w-6 text-yellow-500" />
            <div>
              <p className="font-medium text-foreground">Top Skills</p>
              <p className="text-sm text-muted-foreground">
                Destaca hasta 3 habilidades principales
              </p>
            </div>
          </div>
          <Badge variant={topSkillsCount >= 3 ? 'warning' : 'secondary'} className="text-lg px-4 py-1">
            {topSkillsCount}/3
          </Badge>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            options={[
              { value: 'all', label: 'Todas las categorías' },
              ...categories.map((c) => ({ value: c, label: c })),
            ]}
            className="w-48"
          />
        </div>
        <Badge variant="outline">{filteredSkills.length} habilidades</Badge>
      </div>

      {/* Hard Skills Grid */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : Object.keys(groupedSkills).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedSkills).map(([category, skills]) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                {category}
              </h3>
              <div className="grid gap-3 md:grid-cols-2">
                {skills.map((skill) => (
                  <Card
                    key={skill.id}
                    className={skill.isTop ? 'ring-2 ring-yellow-500' : ''}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            {skill.isTop && (
                              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                            )}
                            <p className="font-medium text-foreground">
                              {skill.skillTag.name}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            <Badge variant="secondary">{skill.level}</Badge>
                            {skill.endorsements.length > 0 && (
                              <div className="flex items-center gap-2">
                                <AvatarGroup
                                  avatars={skill.endorsements.map((e) => ({
                                    src: e.endorserAvatar,
                                    name: e.endorserName,
                                  }))}
                                  max={3}
                                />
                                <span className="text-xs text-muted-foreground">
                                  {skill.endorsements.length} {t('skills.endorsements')}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Tooltip content={skill.isTop ? 'Quitar de top' : 'Marcar como top'}>
                            <button
                              onClick={() => handleToggleTop(skill.id)}
                              className="rounded-lg p-2 hover:bg-accent"
                            >
                              <Star
                                className={`h-4 w-4 ${
                                  skill.isTop
                                    ? 'fill-yellow-500 text-yellow-500'
                                    : 'text-muted-foreground'
                                }`}
                              />
                            </button>
                          </Tooltip>
                          <Tooltip content="Eliminar">
                            <button
                              onClick={() => setDeleteConfirm({ type: 'hard', id: skill.id })}
                              className="rounded-lg p-2 text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </Tooltip>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Search className="h-12 w-12" />}
          title="No tienes hard skills"
          description="Agrega tus habilidades técnicas para mostrar tu experiencia"
          action={
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4" />
              Agregar primera skill
            </Button>
          }
        />
      )}

      {/* Soft Skills Section */}
      <div className="pt-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Soft Skills</h2>
        {softSkills.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {softSkills.map((skill) => (
              <Card key={skill.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{skill.title}</p>
                      {skill.description && (
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-3">
                          {skill.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEditSoftSkill(skill.id)}
                        className="rounded-lg p-2 hover:bg-accent"
                      >
                        <Edit2 className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({ type: 'soft', id: skill.id })}
                        className="rounded-lg p-2 text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <p className="text-muted-foreground">No tienes soft skills agregadas</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setShowSoftSkillModal(true)}
              >
                <Plus className="h-4 w-4" />
                Agregar soft skill
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Hard Skill Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedTag(null);
          setSearchQuery('');
          setNewTagName('');
        }}
        title={t('skills.addSkill')}
        size="md"
      >
        <div className="space-y-4">
          <SearchInput
            placeholder={t('skills.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Search results */}
          {searchResults.length > 0 && (
            <div className="max-h-48 space-y-1 overflow-y-auto rounded-lg border border-border p-2">
              {searchResults.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => setSelectedTag(tag)}
                  className={`w-full rounded-lg px-3 py-2 text-left transition-colors ${
                    selectedTag?.id === tag.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent'
                  }`}
                >
                  <p className="font-medium">{tag.name}</p>
                  <p className="text-xs opacity-70">{tag.category}</p>
                </button>
              ))}
            </div>
          )}

          {/* Create new tag */}
          {searchQuery && searchResults.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="p-4">
                <p className="mb-3 text-sm text-muted-foreground">
                  No se encontró "{searchQuery}". Crea una nueva etiqueta:
                </p>
                <div className="space-y-3">
                  <Input
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    placeholder="Nombre de la etiqueta"
                  />
                  <Select
                    value={newTagCategory}
                    onChange={(e) => setNewTagCategory(e.target.value as SkillCategory)}
                    options={categories.map((c) => ({ value: c, label: c }))}
                    label="Categoría"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Level selector */}
          <Select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value as SkillLevel)}
            options={skillLevels}
            label={t('skills.selectLevel')}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              {t('common.cancel')}
            </Button>
            {newTagName ? (
              <Button onClick={handleCreateAndAddTag} disabled={!newTagName.trim()}>
                Crear y agregar
              </Button>
            ) : (
              <Button onClick={handleAddSkill} disabled={!selectedTag}>
                {t('common.add')}
              </Button>
            )}
          </div>
        </div>
      </Modal>

      {/* Soft Skill Modal */}
      <Modal
        isOpen={showSoftSkillModal}
        onClose={() => {
          setShowSoftSkillModal(false);
          setSoftSkillTitle('');
          setSoftSkillDescription('');
          setEditingSoftSkill(null);
        }}
        title={editingSoftSkill ? 'Editar Soft Skill' : 'Agregar Soft Skill'}
        size="md"
      >
        <div className="space-y-4">
          <Input
            value={softSkillTitle}
            onChange={(e) => setSoftSkillTitle(e.target.value)}
            label="Título"
            placeholder="Ej: Liderazgo técnico"
          />
          <Textarea
            value={softSkillDescription}
            onChange={(e) => setSoftSkillDescription(e.target.value)}
            label={t('skills.successCase')}
            placeholder="Describe un caso de éxito donde aplicaste esta habilidad..."
            maxLength={250}
            showCount
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowSoftSkillModal(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleAddSoftSkill} disabled={!softSkillTitle.trim()}>
              {editingSoftSkill ? 'Actualizar' : t('common.add')}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Eliminar habilidad"
        message="¿Estás seguro de eliminar esta habilidad? Esta acción no se puede deshacer."
        confirmLabel={t('common.delete')}
        variant="destructive"
      />
    </div>
  );
}
