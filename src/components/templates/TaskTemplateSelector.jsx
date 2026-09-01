import React from 'react';
import { Sparkles, Bug, Rocket, Layout, Megaphone } from 'lucide-react';

export const TASK_TEMPLATES = [
  {
    id: 'bug-report',
    name: 'Bug Report',
    icon: Bug,
    color: 'rose',
    title: 'Fix: [Describe Bug Issue]',
    description: 'Steps to reproduce:\n1. Open application\n2. Click on...\n3. Expected behavior vs actual result',
    priority: 'High',
    category: 'Development',
    subtasks: [
      { id: 't1', title: 'Reproduce bug locally', completed: false },
      { id: 't2', title: 'Write unit test case', completed: false },
      { id: 't3', title: 'Implement bug fix', completed: false },
      { id: 't4', title: 'Verify regression testing', completed: false },
    ],
  },
  {
    id: 'feature-request',
    name: 'Feature Request',
    icon: Rocket,
    color: 'brand',
    title: 'Feature: [New Feature Name]',
    description: 'User Story:\nAs a user, I want to [action] so that [benefit].\n\nAcceptance Criteria:\n- Criterion 1\n- Criterion 2',
    priority: 'Medium',
    category: 'Development',
    subtasks: [
      { id: 'f1', title: 'Design component layout', completed: false },
      { id: 'f2', title: 'Build React UI component', completed: false },
      { id: 'f3', title: 'Connect backend service', completed: false },
    ],
  },
  {
    id: 'website-page',
    name: 'Website Page',
    icon: Layout,
    color: 'cyan',
    title: 'Create [Page Name] Page',
    description: 'Design and deploy new marketing / product web page.',
    priority: 'Medium',
    category: 'Design',
    subtasks: [
      { id: 'w1', title: 'Figma wireframe design', completed: false },
      { id: 'w2', title: 'Draft page copywriting', completed: false },
      { id: 'w3', title: 'Responsive CSS styling', completed: false },
    ],
  },
  {
    id: 'marketing-campaign',
    name: 'Marketing Campaign',
    icon: Megaphone,
    color: 'amber',
    title: 'Campaign: [Campaign Title]',
    description: 'Launch promotional campaign across product newsletter and social media channels.',
    priority: 'Low',
    category: 'Marketing',
    subtasks: [
      { id: 'm1', title: 'Write email copy', completed: false },
      { id: 'm2', title: 'Create banner graphics', completed: false },
      { id: 'm3', title: 'Schedule blast publication', completed: false },
    ],
  },
];

export default function TaskTemplateSelector({ onSelectTemplate }) {
  return (
    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2">
      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-brand-500" />
        Quick Task Templates
      </span>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {TASK_TEMPLATES.map((tmpl) => {
          const Icon = tmpl.icon;
          return (
            <button
              key={tmpl.id}
              type="button"
              onClick={() => onSelectTemplate(tmpl)}
              className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 hover:border-brand-500 dark:hover:border-brand-400 text-left transition-all hover:scale-105 group"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                <Icon className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                <span className="truncate">{tmpl.name}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
