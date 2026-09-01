export const CATEGORIES = [
  { id: 'Work', label: 'Work', color: 'blue', bgLight: 'bg-blue-50 text-blue-700 border-blue-200', bgDark: 'dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800' },
  { id: 'Personal', label: 'Personal', color: 'purple', bgLight: 'bg-purple-50 text-purple-700 border-purple-200', bgDark: 'dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800' },
  { id: 'Study', label: 'Study', color: 'emerald', bgLight: 'bg-emerald-50 text-emerald-700 border-emerald-200', bgDark: 'dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800' },
  { id: 'Shopping', label: 'Shopping', color: 'amber', bgLight: 'bg-amber-50 text-amber-700 border-amber-200', bgDark: 'dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800' },
  { id: 'Other', label: 'Other', color: 'slate', bgLight: 'bg-slate-100 text-slate-700 border-slate-200', bgDark: 'dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700' },
];

export const PRIORITIES = [
  { id: 'Low', label: 'Low Priority', level: 1, badgeClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700' },
  { id: 'Medium', label: 'Medium Priority', level: 2, badgeClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800' },
  { id: 'High', label: 'High Priority', level: 3, badgeClass: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800' },
];

export const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest First' },
  { id: 'oldest', label: 'Oldest First' },
  { id: 'dueDate', label: 'Due Date' },
  { id: 'priority', label: 'Priority (High to Low)' },
  { id: 'alphabetical', label: 'Alphabetical (A-Z)' },
];

export const STATUS_FILTERS = [
  { id: 'all', label: 'All Tasks' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
  { id: 'high-priority', label: 'High Priority' },
];
