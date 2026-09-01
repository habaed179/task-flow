import { PRIORITIES } from './constants';

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export const getDueDateStatus = (dueDateString, isCompleted) => {
  if (!dueDateString || isCompleted) return null;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const due = new Date(dueDateString);
  due.setHours(0, 0, 0, 0);
  
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return { status: 'overdue', label: 'Overdue', color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800' };
  } else if (diffDays === 0) {
    return { status: 'today', label: 'Due Today', color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800' };
  } else if (diffDays <= 2) {
    return { status: 'soon', label: `Due in ${diffDays}d`, color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800' };
  }
  
  return null;
};

export const filterAndSortTasks = (tasks, { searchQuery = '', status = 'all', category = 'all', priority = 'all', sortBy = 'newest' }) => {
  let result = [...tasks];

  // Search filter
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    result = result.filter((task) => {
      const matchTitle = task.title?.toLowerCase().includes(q);
      const matchDesc = task.description?.toLowerCase().includes(q);
      const matchCat = task.category?.toLowerCase().includes(q);
      const matchTags = task.tags?.some((t) => t.toLowerCase().includes(q));
      return matchTitle || matchDesc || matchCat || matchTags;
    });
  }

  // Status filter
  if (status === 'active') {
    result = result.filter((task) => !task.completed);
  } else if (status === 'completed') {
    result = result.filter((task) => task.completed);
  } else if (status === 'high-priority') {
    result = result.filter((task) => task.priority === 'High');
  }

  // Category filter
  if (category !== 'all') {
    result = result.filter((task) => task.category === category);
  }

  // Priority filter
  if (priority !== 'all') {
    result = result.filter((task) => task.priority === priority);
  }

  // Sorting
  result.sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      case 'oldest':
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      case 'dueDate':
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      case 'priority': {
        const pMap = { High: 3, Medium: 2, Low: 1 };
        return (pMap[b.priority] || 0) - (pMap[a.priority] || 0);
      }
      case 'alphabetical':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  return result;
};

export const getGreetingMessage = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning 👋';
  if (hour < 18) return 'Good afternoon 👋';
  return 'Good evening 👋';
};
