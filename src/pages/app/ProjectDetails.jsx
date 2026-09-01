import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjects } from '../../hooks/useProjects';
import { useTasks } from '../../hooks/useTasks';
import {
  FolderKanban,
  CheckSquare,
  Kanban as KanbanIcon,
  Calendar,
  Clock,
  Activity,
  Plus,
  ArrowLeft,
} from 'lucide-react';
import KanbanBoard from '../../components/tasks/KanbanBoard';
import TaskList from '../../components/TaskList';
import ProjectTimeline from '../../components/projects/ProjectTimeline';
import ProjectHealthBadge from '../../components/common/ProjectHealthBadge';

export default function ProjectDetails({ onOpenTaskModal, onEditTask, onDeleteTask }) {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { projects } = useProjects();
  const { tasks, toggleTaskComplete, reorderTasks } = useTasks();

  const [activeTab, setActiveTab] = useState('board');

  const project = projects.find((p) => p.id === projectId) || projects[0];

  if (!project) {
    return (
      <div className="p-8 text-center text-slate-500">
        Project not found.{' '}
        <button onClick={() => navigate('/projects')} className="text-brand-600 underline">
          Back to Projects
        </button>
      </div>
    );
  }

  const projTasks = tasks.filter((t) => t.projectId === project.id);
  const total = projTasks.length;
  const completed = projTasks.filter((t) => (t.status || t.completed) === 'Done' || t.completed).length;
  const inProgress = projTasks.filter((t) => t.status === 'In Progress').length;
  const todo = projTasks.filter((t) => (t.status || 'Todo') === 'Todo').length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      {/* Back Button & Header */}
      <div className="space-y-3">
        <button
          onClick={() => navigate('/projects')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Projects</span>
        </button>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {project.name}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                {project.status || 'Active'}
              </span>
              <ProjectHealthBadge tasks={projTasks} dueDate={project.dueDate} />
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-2xl">
              {project.description || 'No project summary provided.'}
            </p>
          </div>

          <button
            onClick={onOpenTaskModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold shadow-md shadow-brand-600/20"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Project Overview Stats Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
            <span className="text-xs text-slate-400 font-medium">Total Tasks</span>
            <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">{total}</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <span className="text-xs font-medium">Completed</span>
            <p className="text-xl font-bold mt-0.5">{completed}</p>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <span className="text-xs font-medium">In Progress</span>
            <p className="text-xl font-bold mt-0.5">{inProgress}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            <span className="text-xs font-medium">Todo</span>
            <p className="text-xl font-bold mt-0.5">{todo}</p>
          </div>
          <div className="p-3 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 col-span-2 sm:col-span-1">
            <span className="text-xs font-medium">Progress</span>
            <p className="text-xl font-bold mt-0.5">{progress}%</p>
          </div>
        </div>

        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div className="bg-brand-500 h-full transition-all duration-500 rounded-full" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1">
        {[
          { id: 'board', label: 'Kanban Board', icon: KanbanIcon },
          { id: 'list', label: 'Task List', icon: CheckSquare },
          { id: 'timeline', label: 'Timeline View', icon: Clock },
          { id: 'activity', label: 'Activity Log', icon: Activity },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
                isActive
                  ? 'border-brand-600 text-brand-600 dark:text-brand-400 bg-white dark:bg-slate-900 shadow-sm'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Views */}
      <div>
        {activeTab === 'board' && (
          <KanbanBoard
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            onOpenNewTaskModal={onOpenTaskModal}
          />
        )}

        {activeTab === 'list' && (
          <TaskList
            tasks={projTasks}
            onToggleComplete={toggleTaskComplete}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            onReorder={reorderTasks}
            emptyType="no-tasks"
            onEmptyAction={onOpenTaskModal}
          />
        )}

        {activeTab === 'timeline' && (
          <ProjectTimeline tasks={projTasks} />
        )}

        {activeTab === 'activity' && (
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-500">
            Activity tracking timeline for this project is active. Updates will appear in real time.
          </div>
        )}
      </div>
    </div>
  );
}
