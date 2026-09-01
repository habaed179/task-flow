import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  ShieldAlert,
  Users,
  Building2,
  FolderKanban,
  CheckSquare,
  BarChart3,
  Activity,
  ArrowLeft,
  Zap,
} from 'lucide-react';

export default function AdminSidebar({ isOpen, onClose }) {
  const adminNav = [
    { label: 'Admin Dashboard', path: '/admin', icon: ShieldAlert },
    { label: 'Users Management', path: '/admin/users', icon: Users },
    { label: 'Workspaces', path: '/admin/workspaces', icon: Building2 },
    { label: 'Projects', path: '/admin/projects', icon: FolderKanban },
    { label: 'Tasks Control', path: '/admin/tasks', icon: CheckSquare },
    { label: 'System Analytics', path: '/admin/analytics', icon: BarChart3 },
    { label: 'System Audit Logs', path: '/admin/activity', icon: Activity },
  ];

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/60 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 text-white flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-600/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight">TaskFlow</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  ADMIN
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400">SaaS Administration</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            System Admin Menu
          </p>
          {adminNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-800">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to User App</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
