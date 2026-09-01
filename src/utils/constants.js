export const TASK_STATUSES = [
  { id: 'Todo', label: 'Todo', color: 'slate', badge: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700' },
  { id: 'In Progress', label: 'In Progress', color: 'amber', badge: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800' },
  { id: 'Review', label: 'In Review', color: 'purple', badge: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800' },
  { id: 'Done', label: 'Done', color: 'emerald', badge: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' },
];

export const TASK_PRIORITIES = [
  { id: 'Low', label: 'Low Priority', level: 1, badgeClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700' },
  { id: 'Medium', label: 'Medium Priority', level: 2, badgeClass: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800' },
  { id: 'High', label: 'High Priority', level: 3, badgeClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800' },
  { id: 'Urgent', label: 'Urgent', level: 4, badgeClass: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800 font-bold' },
];

export const PRIORITIES = TASK_PRIORITIES;

export const CATEGORIES = [
  { id: 'Work', label: 'Work', bgLight: 'bg-blue-50 text-blue-700 border-blue-200', bgDark: 'dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800' },
  { id: 'Personal', label: 'Personal', bgLight: 'bg-purple-50 text-purple-700 border-purple-200', bgDark: 'dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800' },
  { id: 'Study', label: 'Study', bgLight: 'bg-emerald-50 text-emerald-700 border-emerald-200', bgDark: 'dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800' },
  { id: 'Development', label: 'Development', bgLight: 'bg-cyan-50 text-cyan-700 border-cyan-200', bgDark: 'dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-800' },
  { id: 'Design', label: 'Design', bgLight: 'bg-pink-50 text-pink-700 border-pink-200', bgDark: 'dark:bg-pink-950/60 dark:text-pink-300 dark:border-pink-800' },
  { id: 'Marketing', label: 'Marketing', bgLight: 'bg-orange-50 text-orange-700 border-orange-200', bgDark: 'dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800' },
  { id: 'Other', label: 'Other', bgLight: 'bg-slate-100 text-slate-700 border-slate-200', bgDark: 'dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700' },
];

export const PROJECT_STATUSES = [
  { id: 'Planning', label: 'Planning', badge: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300' },
  { id: 'Active', label: 'Active', badge: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300' },
  { id: 'On Hold', label: 'On Hold', badge: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300' },
  { id: 'Completed', label: 'Completed', badge: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300' },
  { id: 'Archived', label: 'Archived', badge: 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400' },
];

export const STATUS_FILTERS = [
  { id: 'all', label: 'All Tasks' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
  { id: 'high-priority', label: 'High Priority' },
];

export const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Perfect for individual developers and small personal side projects.',
    features: [
      '3 Active Projects',
      'Up to 50 Tasks',
      '3 Team Members',
      'Basic Task Board & List',
      'Community Support',
    ],
    limits: { projects: 3, tasks: 50, members: 3 },
    isPopular: false,
    ctaText: 'Current Plan',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$9',
    period: '/month',
    description: 'Ideal for growing engineering teams and active freelancers.',
    features: [
      'Unlimited Active Projects',
      'Unlimited Tasks',
      '10 Team Members',
      'Advanced Kanban & Calendar Views',
      'File Attachments (1GB Storage)',
      'Priority Email Support',
    ],
    limits: { projects: 999, tasks: 99999, members: 10 },
    isPopular: true,
    ctaText: 'Upgrade to Pro',
  },
  {
    id: 'business',
    name: 'Business',
    price: '$29',
    period: '/month',
    description: 'For companies requiring advanced team management & admin controls.',
    features: [
      'Everything in Pro',
      'Unlimited Team Members',
      'Role-Based Granular Permissions',
      'Admin Analytics & Audit Logs',
      'Dedicated Account Manager',
      '24/7 Phone & SLA Support',
    ],
    limits: { projects: 9999, tasks: 999999, members: 9999 },
    isPopular: false,
    ctaText: 'Contact Sales / Upgrade',
  },
];

export const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest First' },
  { id: 'oldest', label: 'Oldest First' },
  { id: 'dueDate', label: 'Due Date' },
  { id: 'priority', label: 'Priority (Urgent First)' },
  { id: 'alphabetical', label: 'Alphabetical (A-Z)' },
];
