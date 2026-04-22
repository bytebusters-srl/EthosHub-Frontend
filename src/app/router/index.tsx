import { createBrowserRouter } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { DashboardLayout, AdminLayout, AuthLayout, PublicPortfolioLayout } from '../layouts';
import { ProtectedRoute } from './ProtectedRoute';
import { Skeleton } from '@/shared/ui';

// Lazy loaded pages
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const HomePage = lazy(() => import('@/pages/public/HomePage'));
const DashboardHomePage = lazy(() => import('@/pages/dashboard/DashboardHomePage'));
const SkillsPage = lazy(() => import('@/pages/dashboard/SkillsPage'));
const ProjectsPage = lazy(() => import('@/pages/dashboard/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('@/pages/dashboard/ProjectDetailPage'));
const ConnectionsPage = lazy(() => import('@/pages/dashboard/ConnectionsPage'));
const VisibilityPage = lazy(() => import('@/pages/dashboard/VisibilityPage'));
const ExperiencePage = lazy(() => import('@/pages/dashboard/ExperiencePage'));
const EducationPage = lazy(() => import('@/pages/dashboard/EducationPage'));
const PreferencesPage = lazy(() => import('@/pages/dashboard/PreferencesPage'));
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'));
const AdminUsersPage = lazy(() => import('@/pages/admin/AdminUsersPage'));
const AdminModerationPage = lazy(() => import('@/pages/admin/AdminModerationPage'));
const AdminSkillsPage = lazy(() => import('@/pages/admin/AdminSkillsPage'));
const AdminPortfoliosPage = lazy(() => import('@/pages/admin/AdminPortfoliosPage'));
const ExplorePage = lazy(() => import('@/pages/public/ExplorePage'));
const PublicPortfolioPage = lazy(() => import('@/pages/public/PublicPortfolioPage'));
const PasswordPortfolioPage = lazy(() => import('@/pages/public/PasswordPortfolioPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const AccessDeniedPage = lazy(() => import('@/pages/AccessDeniedPage'));
const RecruiterDashboardPage = lazy(() => import('@/pages/recruiter/RecruiterDashboardPage'));
const TalentDiscoveryPage = lazy(() => import('@/pages/recruiter/TalentDiscoveryPage'));

function PageLoader() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: (
          <Suspense fallback={<PageLoader />}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: 'register',
        element: (
          <Suspense fallback={<PageLoader />}>
            <RegisterPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    element: (
      <ProtectedRoute allowedRoles={['professional', 'recruiter', 'admin']}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<PageLoader />}>
            <DashboardHomePage />
          </Suspense>
        ),
      },
      {
        path: 'dashboard/skills',
        element: (
          <Suspense fallback={<PageLoader />}>
            <SkillsPage />
          </Suspense>
        ),
      },
      {
        path: 'dashboard/projects',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProjectsPage />
          </Suspense>
        ),
      },
      {
        path: 'dashboard/projects/:projectId',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProjectDetailPage />
          </Suspense>
        ),
      },
      {
        path: 'dashboard/connections',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ConnectionsPage />
          </Suspense>
        ),
      },
      {
        path: 'dashboard/visibility',
        element: (
          <Suspense fallback={<PageLoader />}>
            <VisibilityPage />
          </Suspense>
        ),
      },
      {
        path: 'dashboard/experience',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ExperiencePage />
          </Suspense>
        ),
      },
      {
        path: 'dashboard/education',
        element: (
          <Suspense fallback={<PageLoader />}>
            <EducationPage />
          </Suspense>
        ),
      },
      {
        path: 'dashboard/preferences',
        element: (
          <Suspense fallback={<PageLoader />}>
            <PreferencesPage />
          </Suspense>
        ),
      },
      {
        path: 'recruiter/dashboard',
        element: (
          <Suspense fallback={<PageLoader />}>
            <RecruiterDashboardPage />
          </Suspense>
        ),
      },
      {
        path: 'recruiter/talent-discovery',
        element: (
          <Suspense fallback={<PageLoader />}>
            <TalentDiscoveryPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'admin/dashboard',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminDashboardPage />
          </Suspense>
        ),
      },
      {
        path: 'admin/users',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminUsersPage />
          </Suspense>
        ),
      },
      {
        path: 'admin/moderation',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminModerationPage />
          </Suspense>
        ),
      },
      {
        path: 'admin/skills',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminSkillsPage />
          </Suspense>
        ),
      },
      {
        path: 'admin/portfolios',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminPortfoliosPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    element: <PublicPortfolioLayout />,
    children: [
      {
        path: '/',
        element: (
          <Suspense fallback={<PageLoader />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: 'explorar',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ExplorePage />
          </Suspense>
        ),
      },
      {
        path: 'p/:slug',
        element: (
          <Suspense fallback={<PageLoader />}>
            <PublicPortfolioPage />
          </Suspense>
        ),
      },
      {
        path: 'p/:slug/password',
        element: (
          <Suspense fallback={<PageLoader />}>
            <PasswordPortfolioPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: 'access-denied',
    element: (
      <Suspense fallback={<PageLoader />}>
        <AccessDeniedPage />
      </Suspense>
    ),
  },
  {
    path: '*',
    element: (
      <Suspense fallback={<PageLoader />}>
        <NotFoundPage />
      </Suspense>
    ),
  },
]);
