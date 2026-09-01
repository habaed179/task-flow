import React, { useState } from 'react';
import { useProjects } from '../../hooks/useProjects';
import { useTasks } from '../../hooks/useTasks';
import { useWorkspace } from '../../hooks/useWorkspace';
import { FolderKanban, Plus, Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProjectModal from '../../components/projects/ProjectModal';
import UpgradeModal from '../../components/common/UpgradeModal';

export default function ProjectsPage() {
  const { projects } = useProjects();
  const { tasks } = useTasks();
  const { currentPlanObj } = useWorkspace();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);

  const handleOpenCreateModal = () => {
    if (projects.length >= currentPlanObj.limits.projects) {
      setIsUpgradeOpen(true);
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Projects ({projects.length})
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage engineering sprint deliverables, deadlines, and project status.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold shadow-md shadow-brand-600/20"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => {
          const projTasks = tasks.filter((t) => t.projectId === proj.id);
          const total = projTasks.length;
          const done = projTasks.filter((t) => (t.status || t.completed) === 'Done' || t.completed).length;
          const progress = total > 0 ? Math.round((done / total) * 100) : 0;

          return (
            <Link
              key={proj.id}
              to={`/projects/${proj.id}`}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                    {proj.status || 'Active'}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {proj.priority || 'Medium'} Priority
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-1">
                  {proj.name}
                </h3>
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {proj.description || 'No description provided.'}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60 space-y-3">
                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                    <span>Progress</span>
                    <span>{progress}% ({done}/{total} done)</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-brand-500 h-full transition-all duration-500 rounded-full" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                {/* Dates */}
                {proj.dueDate && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Due: {proj.dueDate}</span>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      <ProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <UpgradeModal
        isOpen={isUpgradeOpen}
        onClose={() => setIsUpgradeOpen(false)}
        message={`You've reached your free project limit (${currentPlanObj.limits.projects} projects). Upgrade to Pro to create unlimited projects.`}
      />
    </div>
  );
}
