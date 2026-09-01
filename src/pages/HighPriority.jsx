import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';
import TaskList from '../components/TaskList';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import SortDropdown from '../components/SortDropdown';
import { filterAndSortTasks } from '../utils/taskHelpers';

export default function HighPriority(props) {
  const contextProps = useOutletContext() || {};
  const onOpenTaskModal = props.onOpenTaskModal || contextProps.onOpenTaskModal;
  const onEditTask = props.onEditTask || contextProps.onEditTask;
  const onDeleteTask = props.onDeleteTask || contextProps.onDeleteTask;

  const { tasks, toggleTaskComplete, reorderTasks } = useTasks();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const filteredTasks = useMemo(() => {
    return filterAndSortTasks(tasks, {
      searchQuery,
      status: statusFilter,
      category: categoryFilter,
      priority: 'High',
      sortBy,
    });
  }, [tasks, searchQuery, statusFilter, categoryFilter, sortBy]);

  const hasActiveFilters =
    searchQuery.trim() !== '' || statusFilter !== 'all' || categoryFilter !== 'all';

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setSortBy('newest');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              High Priority Tasks
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              {filteredTasks.length} urgent
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
          selectedPriority="High"
          onPriorityChange={() => {}}
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
