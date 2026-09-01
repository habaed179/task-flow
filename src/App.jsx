import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WorkspaceProvider } from './context/WorkspaceContext';
import { ProjectProvider } from './context/ProjectContext';
import { TaskProvider } from './context/TaskContext';
import { ToastProvider } from './context/ToastContext';
import { NotificationProvider } from './context/NotificationContext';

import ErrorBoundary from './components/common/ErrorBoundary';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleGuard from './components/auth/RoleGuard';

import AppLayout from './components/layout/AppLayout';
import AdminLayout from './components/layout/AdminLayout';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import FeaturesPage from './pages/public/FeaturesPage';
import PricingPage from './pages/public/PricingPage';
import AboutPage from './pages/public/AboutPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import ForgotPasswordPage from './pages/public/ForgotPasswordPage';

// App Pages
import Dashboard from './pages/Dashboard';
import AllTasks from './pages/AllTasks';
import ActiveTasks from './pages/ActiveTasks';
import CompletedTasks from './pages/CompletedTasks';
import HighPriority from './pages/HighPriority';
import ProjectsPage from './pages/app/ProjectsPage';
import ProjectDetails from './pages/app/ProjectDetails';
import CalendarView from './pages/app/CalendarView';
import TeamPage from './pages/app/TeamPage';
import MemberProfile from './pages/app/MemberProfile';
import NotificationsPage from './pages/app/NotificationsPage';
import Settings from './pages/Settings';
import UserBilling from './pages/app/UserBilling';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminWorkspaces from './pages/admin/AdminWorkspaces';
import AdminProjects from './pages/admin/AdminProjects';
import AdminTasks from './pages/admin/AdminTasks';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminActivityLogs from './pages/admin/AdminActivityLogs';

// Error Pages
import NotFoundPage from './pages/errors/NotFoundPage';
import ForbiddenPage from './pages/errors/ForbiddenPage';

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <WorkspaceProvider>
            <ProjectProvider>
              <TaskProvider>
                <NotificationProvider>
                  <Router>
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<LandingPage />} />
                      <Route path="/features" element={<FeaturesPage />} />
                      <Route path="/pricing" element={<PricingPage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                      {/* Error Status Routes */}
                      <Route path="/403" element={<ForbiddenPage />} />
                      <Route path="/404" element={<NotFoundPage />} />

                      {/* Protected User App Routes */}
                      <Route element={<ProtectedRoute />}>
                        <Route element={<AppLayout />}>
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/tasks" element={<AllTasks />} />
                          <Route path="/tasks/active" element={<ActiveTasks />} />
                          <Route path="/tasks/completed" element={<CompletedTasks />} />
                          <Route path="/tasks/high-priority" element={<HighPriority />} />
                          <Route path="/projects" element={<ProjectsPage />} />
                          <Route path="/projects/:projectId" element={<ProjectDetails />} />
                          <Route path="/calendar" element={<CalendarView />} />
                          <Route path="/team" element={<TeamPage />} />
                          <Route path="/team/:memberId" element={<MemberProfile />} />
                          <Route path="/notifications" element={<NotificationsPage />} />
                          <Route path="/settings" element={<Settings />} />
                          <Route path="/billing" element={<UserBilling />} />
                        </Route>
                      </Route>

                      {/* Protected Admin Portal Routes */}
                      <Route element={<ProtectedRoute />}>
                        <Route element={<RoleGuard requiredRole="admin" />}>
                          <Route element={<AdminLayout />}>
                            <Route path="/admin" element={<AdminDashboard />} />
                            <Route path="/admin/users" element={<AdminUsers />} />
                            <Route path="/admin/workspaces" element={<AdminWorkspaces />} />
                            <Route path="/admin/projects" element={<AdminProjects />} />
                            <Route path="/admin/tasks" element={<AdminTasks />} />
                            <Route path="/admin/analytics" element={<AdminAnalytics />} />
                            <Route path="/admin/activity" element={<AdminActivityLogs />} />
                          </Route>
                        </Route>
                      </Route>

                      {/* Fallback */}
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </Router>
                </NotificationProvider>
              </TaskProvider>
            </ProjectProvider>
          </WorkspaceProvider>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}
