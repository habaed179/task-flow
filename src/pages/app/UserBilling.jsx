import React from 'react';
import { useWorkspace } from '../../hooks/useWorkspace';
import { useProjects } from '../../hooks/useProjects';
import { useTasks } from '../../hooks/useTasks';
import { PLANS } from '../../utils/constants';
import { CreditCard, CheckCircle2, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function UserBilling() {
  const { currentWorkspace, currentPlanObj } = useWorkspace();
  const { projects } = useProjects();
  const { tasks } = useTasks();

  const membersCount = currentWorkspace?.members?.length || 1;
  const projectsCount = projects.length;
  const tasksCount = tasks.length;

  const projLimit = currentPlanObj.limits.projects;
  const taskLimit = currentPlanObj.limits.tasks;
  const memberLimit = currentPlanObj.limits.members;

  return (
    <div className="max-w-4xl space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-brand-600 dark:text-brand-400" />
          Subscription & Billing
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage plan subscription, resource usage limits, and billing details.
        </p>
      </div>

      {/* Current Plan Overview */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-900 via-slate-900 to-slate-950 text-white shadow-xl border border-brand-800/40 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-500/20 text-brand-300 border border-brand-500/30">
              Active Workspace Plan
            </span>
            <h3 className="text-3xl font-extrabold mt-2 tracking-tight">
              {currentPlanObj.name} Plan
            </h3>
            <p className="text-xs text-slate-300 mt-1">{currentPlanObj.description}</p>
          </div>

          <div className="text-right">
            <span className="text-4xl font-extrabold">{currentPlanObj.price}</span>
            <span className="text-slate-400 text-xs">{currentPlanObj.period}</span>
          </div>
        </div>

        {/* Usage Limits Progress Bars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-slate-800">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-300">
              <span>Projects Used</span>
              <span>{projectsCount} / {projLimit > 100 ? '∞' : projLimit}</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-brand-500 h-full rounded-full" style={{ width: `${Math.min(100, (projectsCount / projLimit) * 100)}%` }} />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-300">
              <span>Tasks Used</span>
              <span>{tasksCount} / {taskLimit > 1000 ? '∞' : taskLimit}</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min(100, (tasksCount / taskLimit) * 100)}%` }} />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-300">
              <span>Team Members</span>
              <span>{membersCount} / {memberLimit > 100 ? '∞' : memberLimit}</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: `${Math.min(100, (membersCount / memberLimit) * 100)}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Plans Matrix */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Available Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`p-6 rounded-2xl bg-white dark:bg-slate-900 border flex flex-col justify-between ${
                plan.id === currentPlanObj.id
                  ? 'border-brand-500 ring-2 ring-brand-500/20'
                  : 'border-slate-200/80 dark:border-slate-800'
              }`}
            >
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">{plan.name}</h4>
                <p className="text-xs text-slate-400 mt-1">{plan.price} {plan.period}</p>
                <ul className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                disabled={plan.id === currentPlanObj.id}
                className={`mt-6 w-full py-2.5 rounded-xl font-semibold text-xs transition-all ${
                  plan.id === currentPlanObj.id
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-default'
                    : 'bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-600/20'
                }`}
              >
                {plan.id === currentPlanObj.id ? 'Current Plan' : 'Select Plan'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
