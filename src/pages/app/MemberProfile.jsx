import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWorkspace } from '../../hooks/useWorkspace';
import { useTasks } from '../../hooks/useTasks';
import TaskList from '../../components/TaskList';
import { User, Mail, ArrowLeft, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function MemberProfile({ onOpenTaskModal, onEditTask, onDeleteTask }) {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const { currentWorkspace } = useWorkspace();
  const { tasks, toggleTaskComplete, reorderTasks } = useTasks();

  const member = currentWorkspace?.members?.find((m) => m.id === memberId) || {
    id: memberId,
    name: 'Team Member',
    email: 'member@taskflow.dev',
    role: 'Member',
  };

  const assignedTasks = tasks.filter((t) => t.assigneeId === member.id || t.assigneeName === member.name);
  const total = assignedTasks.length;
  const completed = assignedTasks.filter((t) => (t.status || t.completed) === 'Done' || t.completed).length;
  const inProgress = assignedTasks.filter((t) => t.status === 'In Progress').length;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-6 animate-fadeIn">
      <button
        onClick={() => navigate('/team')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Team Roster</span>
      </button>

      {/* Member Profile Header Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {member.avatar ? (
            <img src={member.avatar} alt={member.name} className="w-16 h-16 rounded-full object-cover border-2 border-brand-500/30" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center font-extrabold text-xl">
              {member.name.charAt(0)}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">{member.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                {member.role || 'member'}
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
              <Mail className="w-3.5 h-3.5" />
              {member.email}
            </p>
          </div>
        </div>

        {/* Member Stats pills */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Assigned</span>
            <span className="text-lg font-bold text-slate-900 dark:text-white">{total}</span>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-center">
            <span className="text-[10px] font-bold uppercase block">Completion</span>
            <span className="text-lg font-bold">{rate}%</span>
          </div>
        </div>
      </div>

      {/* Assigned Tasks Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Tasks Assigned to {member.name} ({assignedTasks.length})
        </h3>
        <TaskList
          tasks={assignedTasks}
          onToggleComplete={toggleTaskComplete}
          onEdit={onEditTask}
          onDelete={onDeleteTask}
          onReorder={reorderTasks}
          emptyType="no-tasks"
          onEmptyAction={onOpenTaskModal}
        />
      </div>
    </div>
  );
}
