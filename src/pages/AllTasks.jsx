import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useOutletContext } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';
import TaskList from '../components/TaskList';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import SortDropdown from '../components/SortDropdown';
import { filterAndSortTasks } from '../utils/taskHelpers';

export default function AllTasks(props) {
  const contextProps = useOutletContext() || {};
  const onOpenTaskModal = props.onOpenTaskModal || contextProps.onOpenTaskModal;
  const onEditTask = props.onEditTask || contextProps.onEditTask;
  const onDeleteTask = props.onDeleteTask || contextProps.onDeleteTask;

  const { tasks, toggleTaskComplete, reorderTasks } = useTasks();
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryParam = searchParams.get('category') || 'all';

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState(categoryParam);
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    if (searchParams.get('category')) {
      setCategoryFilter(searchParams.get('category'));
    }
  }, [searchParams]);

  const filteredTasks = useMemo(() => {
    return filterAndSortTasks(tasks, {
      searchQuery,
      status: statusFilter,
      category: categoryFilter,
      priority: priorityFilter,
      sortBy,
    });
  }, [tasks, searchQuery, statusFilter, categoryFilter, priorityFilter, sortBy]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    statusFilter !== 'all' ||
    categoryFilter !== 'all' ||
    priorityFilter !== 'all';

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setPriorityFilter('all');
    setSortBy('newest');
    setSearchParams({});
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              All Tasks
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
              {filteredTasks.length} tasks
            </span>
          </div>

          <div className="flex items-center gap-3 flex-1 sm:max-w-md">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <SortDropdown value={sortBy} onChange={setSortBy} />
          </div>
        </div>

        <FilterBar
          selectedStatus={statusFilter}
          onStatusChange={setStatusFilter}
          selectedCategory={categoryFilter}
          onCategoryChange={setCategoryFilter}
          selectedPriority={priorityFilter}
          onPriorityChange={setPriorityFilter}
          onResetFilters={resetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      <TaskList
        tasks={filteredTasks}
        onToggleComplete={toggleTaskComplete}
        onEdit={onEditTask}
        onDelete={onDeleteTask}
        onReorder={reorderTasks}
        emptyType={hasActiveFilters ? 'no-results' : 'no-tasks'}
        onEmptyAction={hasActiveFilters ? resetFilters : onOpenTaskModal}
      />
    </div>
  );
}
