import React from 'react';
import { ShieldCheck, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';

export function calculateProjectHealth(projTasks = [], dueDateString = '') {
  const total = projTasks.length;
  if (total === 0) return { status: 'Healthy', color: 'emerald', label: 'Healthy', icon: ShieldCheck };

  const completed = projTasks.filter((t) => (t.status || t.completed) === 'Done' || t.completed).length;
  const overdue = projTasks.filter((t) => {
    if (!t.dueDate || t.completed || t.status === 'Done') return false;
    return new Date(t.dueDate) < new Date();
  }).length;

  const completionRate = Math.round((completed / total) * 100);

  if (completionRate === 100) {
    return { status: 'Completed', color: 'blue', label: 'Completed', icon: CheckCircle2 };
  }

  if (overdue > 2 || (total > 3 && completionRate < 30)) {
    return { status: 'Critical', color: 'rose', label: 'Project Critical', icon: AlertCircle };
  }

  if (overdue > 0 || (total > 3 && completionRate < 50)) {
    return { status: 'At Risk', color: 'amber', label: 'At Risk', icon: AlertTriangle };
  }

  return { status: 'Healthy', color: 'emerald', label: 'Healthy', icon: ShieldCheck };
}

export default function ProjectHealthBadge({ tasks = [], dueDate = '' }) {
  const health = calculateProjectHealth(tasks, dueDate);
  const Icon = health.icon;

  const colorMap = {
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    rose: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold border ${colorMap[health.color]}`}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{health.label}</span>
    </span>
  );
}
