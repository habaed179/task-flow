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
  User,
  Sparkles,
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { CATEGORIES } from '../utils/constants';
import { useTasks } from '../hooks/useTasks';

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { tasks } = useTasks();

  const totalCount = tasks.length;
  const activeCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const highPriorityCount = tasks.filter((t) => t.priority === 'High' && !t.completed).length;

  const mainNav = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, count: null },
    { label: 'All Tasks', path: '/tasks', icon: CheckSquare, count: totalCount },
    { label: 'Active Tasks', path: '/tasks/active', icon: Clock, count: activeCount },
    { label: 'Completed Tasks', path: '/tasks/completed', icon: CheckCircle2, count: completedCount },
    { label: 'High Priority', path: '/tasks/high-priority', icon: AlertOctagon, count: highPriorityCount, highlight: true },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header / Brand Logo */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800/80">
          <NavLink
            to="/dashboard"
            onClick={onClose}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 text-white flex items-center justify-center shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform duration-200">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  TaskFlow
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                  Pro
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400">Task Management SaaS</p>
            </div>
          </NavLink>
        </div>

        {/* Navigation Items Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Main Navigation Group */}
          <div>
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Overview
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
                    {item.count !== null && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          item.highlight
                            ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Quick Categories Filter */}
          <div>
            <div className="flex items-center justify-between px-3 mb-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Categories
              </p>
              <FolderKanban className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="space-y-1">
              {CATEGORIES.map((cat) => {
                const catCount = tasks.filter((t) => t.category === cat.id && !t.completed).length;
                return (
                  <NavLink
                    key={cat.id}
                    to={`/tasks?category=${cat.id}`}
                    onClick={onClose}
                    className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-brand-500" />
                      <span>{cat.label}</span>
                    </div>
                    <span className="text-slate-400 font-mono text-[11px]">{catCount}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>

          {/* System Navigation */}
          <div>
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Preferences
            </p>
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
          </div>
        </div>

        {/* Sidebar Footer: Theme Toggle & User Profile */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
          <ThemeToggle showLabel={true} className="w-full justify-between" />

          {/* User Profile Info */}
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
            <div className="w-8 h-8 rounded-full bg-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-xs">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                Jane Developer
              </p>
              <p className="text-[10px] text-slate-400 truncate">portfolio@dev.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
