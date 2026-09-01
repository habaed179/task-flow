import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  Plus,
  LayoutDashboard,
  FolderKanban,
  Calendar,
  Users,
  Bell,
  Settings,
  Moon,
  LogOut,
  ArrowRight,
} from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';
import { useAuth } from '../../hooks/useAuth';

export default function CommandPalette({ isOpen, onClose, onOpenNewTaskModal }) {
  const navigate = useNavigate();
  const { toggleTheme } = useTasks();
  const { logout } = useAuth();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open command palette
          onClose(true); // signal open
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const commands = [
    {
      id: 'create-task',
      label: 'Create New Task',
      shortcut: 'N',
      icon: Plus,
      action: () => {
        onClose();
        onOpenNewTaskModal();
      },
    },
    {
      id: 'create-project',
      label: 'Create New Project',
      icon: FolderKanban,
      action: () => {
        onClose();
        navigate('/projects');
      },
    },
    {
      id: 'go-dashboard',
      label: 'Go to Dashboard Overview',
      icon: LayoutDashboard,
      action: () => {
        onClose();
        navigate('/dashboard');
      },
    },
    {
      id: 'go-projects',
      label: 'Go to Projects',
      icon: FolderKanban,
      action: () => {
        onClose();
        navigate('/projects');
      },
    },
    {
      id: 'go-calendar',
      label: 'Go to Task Calendar',
      icon: Calendar,
      action: () => {
        onClose();
        navigate('/calendar');
      },
    },
    {
      id: 'go-team',
      label: 'Go to Team Roster',
      icon: Users,
      action: () => {
        onClose();
        navigate('/team');
      },
    },
    {
      id: 'go-notifications',
      label: 'Go to Notifications',
      icon: Bell,
      action: () => {
        onClose();
        navigate('/notifications');
      },
    },
    {
      id: 'go-settings',
      label: 'Go to Settings',
      icon: Settings,
      action: () => {
        onClose();
        navigate('/settings');
      },
    },
    {
      id: 'toggle-theme',
      label: 'Toggle Dark / Light Mode',
      icon: Moon,
      action: () => {
        onClose();
        toggleTheme();
      },
    },
    {
      id: 'logout',
      label: 'Log Out',
      icon: LogOut,
      action: () => {
        onClose();
        logout();
      },
    },
  ];

  const filteredCommands = query.trim()
    ? commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase().trim()))
    : commands;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-scaleUp">
        {/* Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
          <Search className="w-5 h-5 text-brand-500 mr-3" />
          <input
            type="text"
            placeholder="Type a command or search... (Cmd + K)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            autoFocus
          />
          <button
            onClick={() => onClose()}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Commands List */}
        <div className="p-3 max-h-[60vh] overflow-y-auto space-y-1">
          <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Quick Actions ({filteredCommands.length})
          </p>

          {filteredCommands.map((cmd) => {
            const Icon = cmd.icon;
            return (
              <div
                key={cmd.id}
                onClick={cmd.action}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 group-hover:scale-105 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">
                    {cmd.label}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {cmd.shortcut && (
                    <kbd className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
                      {cmd.shortcut}
                    </kbd>
                  )}
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
