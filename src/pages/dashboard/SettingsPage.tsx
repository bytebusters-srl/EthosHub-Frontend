import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Lock,
  Bell,
  Palette,
  Shield,
  CreditCard,
  Eye,
  EyeOff,
  Camera,
  Save,
  Trash2,
  Download,
  Check,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import {
  Button,
  Card,
  Input,
  Switch,
  Avatar,
  Badge,
  Modal,
  LoadingSpinner,
} from '@/shared/ui';
import { useAuthStore } from '@/store/authStore';
import { usePreferencesStore } from '@/store/preferencesStore';
import { useUiStore } from '@/store/uiStore';
import { cn } from '@/shared/lib/utils';
import type { UserPreferences } from '@/shared/types';

type SettingsTab = 'profile' | 'account' | 'notifications' | 'privacy' | 'appearance' | 'billing';

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { user, updateProfile, logout } = useAuthStore();
  const { preferences, updatePreferences } = usePreferencesStore();
  const { addToast } = useUiStore();

  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  const safePreferences: UserPreferences = preferences ?? {
    userId: user?.id ?? '',
    language: 'es',
    theme: 'light',
    showGithubHeatmap: true,
    showLinkedinRecommendations: true,
    sectionOrder: ['bio', 'skills', 'projects', 'experience', 'contact'],
    notifications: {
      connections: true,
      messages: true,
      projectViews: true,
      weeklyDigest: true,
      marketing: false,
      push_connections: true,
      push_messages: true,
      push_mentions: true,
    },
    privacy: {
      showEmail: false,
      showLocation: true,
      showConnections: true,
      allowMessages: true,
    },
  };

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
    headline: user?.headline || '',
    location: user?.location || '',
    website: user?.website || '',
    company: user?.company || '',
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const tabs = [
    { id: 'profile' as SettingsTab, label: t('settings.profile'), icon: User },
    { id: 'account' as SettingsTab, label: t('settings.account'), icon: Lock },
    { id: 'notifications' as SettingsTab, label: t('settings.notifications'), icon: Bell },
    { id: 'privacy' as SettingsTab, label: t('settings.privacy'), icon: Shield },
    { id: 'appearance' as SettingsTab, label: t('settings.appearance'), icon: Palette },
    { id: 'billing' as SettingsTab, label: t('settings.billing'), icon: CreditCard },
  ];

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      await updateProfile(profileForm);
      addToast({
        type: 'success',
        title: t('settings.profileUpdated'),
        message: t('settings.profileUpdatedMessage'),
      });
    } catch {
      addToast({
        type: 'error',
        title: t('common.error'),
        message: t('settings.profileUpdateError'),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      addToast({
        type: 'error',
        title: t('common.error'),
        message: t('settings.passwordMismatch'),
      });
      return;
    }

    setLoading(true);
    try {
      // API call to change password
      await new Promise((resolve) => setTimeout(resolve, 1000));
      addToast({
        type: 'success',
        title: t('settings.passwordChanged'),
        message: t('settings.passwordChangedMessage'),
      });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch {
      addToast({
        type: 'error',
        title: t('common.error'),
        message: t('settings.passwordChangeError'),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      // API call to delete account
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await logout();
    } catch {
      addToast({
        type: 'error',
        title: t('common.error'),
        message: t('settings.deleteAccountError'),
      });
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    setLoading(true);
    try {
      // API call to export data
      await new Promise((resolve) => setTimeout(resolve, 2000));
      addToast({
        type: 'success',
        title: t('settings.dataExported'),
        message: t('settings.dataExportedMessage'),
      });
      setExportModalOpen(false);
    } catch {
      addToast({
        type: 'error',
        title: t('common.error'),
        message: t('settings.exportError'),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t('settings.title')}</h1>
        <p className="text-muted-foreground mt-1">{t('settings.subtitle')}</p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar */}
        <nav className="lg:w-64 flex-shrink-0">
          <Card className="p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors',
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </Card>
        </nav>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Avatar */}
                <Card className="p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    {t('settings.profilePhoto')}
                  </h2>
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <Avatar src={user?.avatar} name={user?.name || ''} size="2xl" />
                      <button className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {t('settings.profilePhotoDesc')}
                      </p>
                      <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm">
                          {t('settings.uploadPhoto')}
                        </Button>
                        <Button variant="ghost" size="sm">
                          {t('settings.removePhoto')}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Profile Info */}
                <Card className="p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    {t('settings.profileInfo')}
                  </h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          {t('settings.fullName')}
                        </label>
                        <Input
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          {t('settings.username')}
                        </label>
                        <Input
                          value={profileForm.username}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, username: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        {t('settings.headline')}
                      </label>
                      <Input
                        value={profileForm.headline}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, headline: e.target.value })
                        }
                        placeholder={t('settings.headlinePlaceholder')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        {t('settings.bio')}
                      </label>
                      <textarea
                        value={profileForm.bio}
                        onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                        rows={4}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder={t('settings.bioPlaceholder')}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          {t('settings.location')}
                        </label>
                        <Input
                          value={profileForm.location}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, location: e.target.value })
                          }
                          placeholder={t('settings.locationPlaceholder')}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          {t('settings.company')}
                        </label>
                        <Input
                          value={profileForm.company}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, company: e.target.value })
                          }
                          placeholder={t('settings.companyPlaceholder')}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        {t('settings.website')}
                      </label>
                      <Input
                        value={profileForm.website}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, website: e.target.value })
                        }
                        placeholder="https://"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end mt-6">
                    <Button onClick={handleSaveProfile} disabled={loading}>
                      {loading ? <LoadingSpinner size="sm" /> : <Save className="w-4 h-4 mr-2" />}
                      {t('common.save')}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}

            {activeTab === 'account' && (
              <motion.div
                key="account"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Email */}
                <Card className="p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    {t('settings.email')}
                  </h2>
                  <div className="flex items-center gap-4">
                    <Input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="flex-1"
                    />
                    <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                      <Check className="w-3 h-3 mr-1" />
                      {t('settings.verified')}
                    </Badge>
                  </div>
                </Card>

                {/* Password */}
                <Card className="p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    {t('settings.changePassword')}
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        {t('settings.currentPassword')}
                      </label>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          value={passwordForm.currentPassword}
                          onChange={(e) =>
                            setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                          }
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        {t('settings.newPassword')}
                      </label>
                      <Input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) =>
                          setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        {t('settings.confirmPassword')}
                      </label>
                      <Input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex justify-end mt-6">
                    <Button onClick={handleChangePassword} disabled={loading}>
                      {t('settings.updatePassword')}
                    </Button>
                  </div>
                </Card>

                {/* Two-Factor Authentication */}
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">
                        {t('settings.twoFactor')}
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('settings.twoFactorDesc')}
                      </p>
                    </div>
                    <Switch checked={false} onChange={() => {}} />
                  </div>
                </Card>

                {/* Export Data */}
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">
                        {t('settings.exportData')}
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('settings.exportDataDesc')}
                      </p>
                    </div>
                    <Button variant="outline" onClick={() => setExportModalOpen(true)}>
                      <Download className="w-4 h-4 mr-2" />
                      {t('settings.export')}
                    </Button>
                  </div>
                </Card>

                {/* Delete Account */}
                <Card className="p-6 border-red-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-red-500">
                        {t('settings.deleteAccount')}
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('settings.deleteAccountDesc')}
                      </p>
                    </div>
                    <Button variant="destructive" onClick={() => setDeleteModalOpen(true)}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      {t('settings.delete')}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <Card className="p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    {t('settings.emailNotifications')}
                  </h2>
                  <div className="space-y-4">
                    {[
                      { key: 'connections', label: t('settings.connectionRequests') },
                      { key: 'messages', label: t('settings.newMessages') },
                      { key: 'projectViews', label: t('settings.projectViews') },
                      { key: 'weeklyDigest', label: t('settings.weeklyDigest') },
                      { key: 'marketing', label: t('settings.marketing') },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between py-2 border-b border-border last:border-0"
                      >
                        <span className="text-foreground">{item.label}</span>
                        <Switch
                          checked={safePreferences.notifications[item.key as keyof UserPreferences['notifications']] ?? true}
                          onChange={(checked) =>
                            updatePreferences({
                              notifications: {
                                ...safePreferences.notifications,
                                [item.key]: checked,
                              },
                            })
                          }
                        />
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    {t('settings.pushNotifications')}
                  </h2>
                  <div className="space-y-4">
                    {[
                      { key: 'push_connections', label: t('settings.connectionRequests') },
                      { key: 'push_messages', label: t('settings.newMessages') },
                      { key: 'push_mentions', label: t('settings.mentions') },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between py-2 border-b border-border last:border-0"
                      >
                        <span className="text-foreground">{item.label}</span>
                        <Switch
                          checked={safePreferences.notifications[item.key as keyof UserPreferences['notifications']] ?? true}
                          onChange={(checked) =>
                            updatePreferences({
                              notifications: {
                                ...safePreferences.notifications,
                                [item.key]: checked,
                              },
                            })
                          }
                        />
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}

            {activeTab === 'privacy' && (
              <motion.div
                key="privacy"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <Card className="p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    {t('settings.profilePrivacy')}
                  </h2>
                  <div className="space-y-4">
                    {[
                      { key: 'showEmail', label: t('settings.showEmail') },
                      { key: 'showLocation', label: t('settings.showLocation') },
                      { key: 'showConnections', label: t('settings.showConnections') },
                      { key: 'allowMessages', label: t('settings.allowMessages') },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between py-2 border-b border-border last:border-0"
                      >
                        <span className="text-foreground">{item.label}</span>
                        <Switch
                          checked={safePreferences.privacy[item.key as keyof UserPreferences['privacy']] ?? true}
                          onChange={(checked) =>
                            updatePreferences({
                              privacy: {
                                ...safePreferences.privacy,
                                [item.key]: checked,
                              },
                            })
                          }
                        />
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}

            {activeTab === 'appearance' && (
              <motion.div
                key="appearance"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Theme */}
                <Card className="p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    {t('settings.theme')}
                  </h2>
                  <div className="grid grid-cols-3 gap-4">
                    {['light', 'dark', 'system'].map((theme) => (
                      <button
                        key={theme}
                        onClick={() => updatePreferences({ theme: theme as 'light' | 'dark' | 'system' })}
                        className={cn(
                          'p-4 rounded-lg border-2 transition-all',
                          safePreferences.theme === theme
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        )}
                      >
                        <div
                          className={cn(
                            'w-full aspect-video rounded mb-2',
                            theme === 'light' && 'bg-white border',
                            theme === 'dark' && 'bg-gray-900',
                            theme === 'system' && 'bg-gradient-to-r from-white to-gray-900'
                          )}
                        />
                        <p className="text-sm font-medium text-foreground capitalize">{theme}</p>
                      </button>
                    ))}
                  </div>
                </Card>

                {/* Language */}
                <Card className="p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    {t('settings.language')}
                  </h2>
                  <select
                    value={i18n.language}
                    onChange={(e) => i18n.changeLanguage(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                  >
                    <option value="en">English</option>
                    <option value="es">Espanol</option>
                    <option value="pt">Portugues</option>
                  </select>
                </Card>
              </motion.div>
            )}

            {activeTab === 'billing' && (
              <motion.div
                key="billing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">
                        {t('settings.currentPlan')}
                      </h2>
                      <p className="text-muted-foreground">{t('settings.freePlan')}</p>
                    </div>
                    <Badge>{t('settings.free')}</Badge>
                  </div>
                  <Button className="w-full">
                    {t('settings.upgradeToPro')}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Card>

                <Card className="p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    {t('settings.billingHistory')}
                  </h2>
                  <p className="text-muted-foreground text-center py-8">
                    {t('settings.noBillingHistory')}
                  </p>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Delete Account Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title={t('settings.deleteAccountConfirm')}
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-red-500/10 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-500">{t('settings.deleteAccountWarning')}</p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount} disabled={loading}>
              {loading ? <LoadingSpinner size="sm" /> : t('settings.deleteAccount')}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Export Data Modal */}
      <Modal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        title={t('settings.exportData')}
      >
        <div className="space-y-4">
          <p className="text-muted-foreground">{t('settings.exportDataMessage')}</p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setExportModalOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleExportData} disabled={loading}>
              {loading ? <LoadingSpinner size="sm" /> : <Download className="w-4 h-4 mr-2" />}
              {t('settings.export')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
