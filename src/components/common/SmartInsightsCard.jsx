import React from 'react';
import { Sparkles, AlertTriangle, AlertCircle, TrendingUp, Info } from 'lucide-react';
import { generateSmartInsights } from '../../utils/insightsEngine';
import { useTasks } from '../../hooks/useTasks';
import { useProjects } from '../../hooks/useProjects';
import { useWorkspace } from '../../hooks/useWorkspace';

export default function SmartInsightsCard() {
  const { tasks } = useTasks();
  const { projects } = useProjects();
  const { currentWorkspace } = useWorkspace();

  const members = currentWorkspace?.members || [];
  const insights = generateSmartInsights(tasks, projects, members);

  if (insights.length === 0) return null;

  const iconMap = {
    warning: AlertTriangle,
    danger: AlertCircle,
    info: Info,
    success: TrendingUp,
  };

  const badgeMap = {
    warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    danger: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    info: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  };

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 font-sans">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-brand-500" />
          Workspace Intelligence Insights
        </h3>
        <span className="text-xs font-semibold text-slate-400">Deterministic Calculations</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((item) => {
          const Icon = iconMap[item.type] || Info;
          return (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-start gap-3"
            >
              <div className={`p-2 rounded-xl border shrink-0 ${badgeMap[item.type]}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {item.title}
                </h4>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
