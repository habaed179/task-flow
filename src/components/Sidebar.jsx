import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  Clock,
  CheckCircle2,
  AlertOctagon,
  Settings,
  FolderKanban,
  Zap,
  Users,
  Calendar as CalendarIcon,
  Bell,
  CreditCard,
  ShieldAlert,
  LogOut,
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import WorkspaceSwitcher from './workspace/WorkspaceSwitcher';
import { CATEGORIES } from '../utils/constants';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';

export default function Sidebar({ isOpen, onClose, onOpenWorkspaceModal }) {
  const location = useLocation();
  const { tasks } = useTasks();
  const { currentUser, userProfile, logout } = useAuth();
  const { unreadCount } = useNotifications();

  const totalCount = tasks.length;
  const activeCount = tasks.filter((t) => !t.completed && t.status !== 'Done').length;
  const completedCount = tasks.filter((t) => t.completed || t.status === 'Done').length;

  const mainNav = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Tasks', path: '/tasks', icon: CheckSquare, count: totalCount },
    { label: 'Projects', path: '/projects', icon: FolderKanban },
    { label: 'Calendar', path: '/calendar', icon: CalendarIcon },
    { label: 'Team', path: '/team', icon: Users },
    { label: 'Notifications', path: '/notifications', icon: Bell, count: unreadCount },
  ];

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Workspace Switcher Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800/80">
          <WorkspaceSwitcher onOpenNewWorkspaceModal={onOpenWorkspaceModal} />
        </div>

        {/* Scrollable Nav Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Workspace Nav
            </p>
            <nav className="space-y-1">
              {mainNav.map((item) => {
                const IconComponent = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`
                    }
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </div>
                    {item.count ? (
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-brand-500/20 text-brand-600 dark:text-brand-300">
                        {item.count}
                      </span>
                    ) : null}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Preferences & Admin */}
          <div>
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Account & System
            </p>
            <div className="space-y-1">
              <NavLink
                to="/billing"
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`
                }
              >
                <CreditCard className="w-4 h-4" />
                <span>Billing & Subscription</span>
              </NavLink>

              <NavLink
                to="/settings"
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`
                }
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </NavLink>

              {userProfile?.role === 'admin' && (
                <NavLink
                  to="/admin"
                  onClick={onClose}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Admin Application</span>
                </NavLink>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
          <ThemeToggle showLabel={true} className="w-full justify-between" />

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-xs shrink-0">
                {userProfile?.displayName ? userProfile.displayName.charAt(0) : 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                  {userProfile?.displayName || currentUser?.email || 'Hassan Obaed'}
                </p>
                <p className="text-[10px] text-slate-400 truncate">{currentUser?.email || 'hassan@taskflow.dev'}</p>
              </div>
            </div>

            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 transition-colors"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
