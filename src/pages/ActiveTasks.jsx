import React, { useState, useMemo } from 'react';
import { useTasks } from '../hooks/useTasks';
import TaskList from '../components/TaskList';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import SortDropdown from '../components/SortDropdown';
import { filterAndSortTasks } from '../utils/taskHelpers';

export default function ActiveTasks({ onOpenTaskModal, onEditTask, onDeleteTask }) {
  const { tasks, toggleTaskComplete, reorderTasks } = useTasks();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const filteredTasks = useMemo(() => {
    return filterAndSortTasks(tasks, {
      searchQuery,
      status: 'active',
      category: categoryFilter,
      priority: priorityFilter,
      sortBy,
    });
  }, [tasks, searchQuery, categoryFilter, priorityFilter, sortBy]);

  const hasActiveFilters =
    searchQuery.trim() !== '' || categoryFilter !== 'all' || priorityFilter !== 'all';

  const resetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setPriorityFilter('all');
    setSortBy('newest');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Active Tasks
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              {filteredTasks.length} active
            </span>
          </div>

          <div className="flex items-center gap-3 flex-1 sm:max-w-md">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <SortDropdown value={sortBy} onChange={setSortBy} />
          </div>
        </div>

        <FilterBar
          selectedStatus="active"
          onStatusChange={() => {}}
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
        emptyType={hasActiveFilters ? 'no-results' : 'no-active'}
        onEmptyAction={hasActiveFilters ? resetFilters : onOpenTaskModal}
      />
    </div>
  );
}
