import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useWorkspace } from '../hooks/useWorkspace';
import { useTasks } from '../hooks/useTasks';
import { User, Building2, Bell, Moon, Shield, Save, Download } from 'lucide-react';
import ExportDataModal from '../components/common/ExportDataModal';
import { useToast } from '../context/ToastContext';

export default function Settings() {
  const { toast } = useToast();
  const { userProfile, updateUserProfile } = useAuth();
  const { currentWorkspace } = useWorkspace();
  const { isDarkMode, toggleTheme } = useTasks();

  const [displayName, setDisplayName] = useState(userProfile?.displayName || '');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    await updateUserProfile({ displayName });
    toast.success('Profile settings updated');
  };

  return (
    <div className="space-y-6 animate-fadeIn font-sans max-w-4xl">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Account & Workspace Settings
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage profile details, notification preferences, dark mode, and workspace data export.
        </p>
      </div>

      {/* Profile Settings */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <User className="w-5 h-5 text-brand-500" />
          User Profile Details
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full max-w-md px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-600/20"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </form>
      </div>

      {/* Workspace Preferences */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Building2 className="w-5 h-5 text-brand-500" />
          Active Workspace Data
        </h3>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {currentWorkspace?.name || 'TaskFlow Demo Workspace'}
            </p>
            <p className="text-xs text-slate-400">Plan: {currentWorkspace?.plan || 'Pro'}</p>
          </div>

          <button
            type="button"
            onClick={() => setIsExportModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-bold transition-colors border border-slate-200 dark:border-slate-700"
          >
            <Download className="w-4 h-4 text-brand-500" />
            <span>Export Workspace Data (CSV/JSON)</span>
          </button>
        </div>
      </div>

      {/* Theme Settings */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Moon className="w-5 h-5 text-brand-500" />
          Appearance Preferences
        </h3>

        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Dark Mode ({isDarkMode ? 'Enabled' : 'Disabled'})
          </span>

          <button
            type="button"
            onClick={toggleTheme}
            className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold"
          >
            Toggle Theme
          </button>
        </div>
      </div>

      <ExportDataModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
}
