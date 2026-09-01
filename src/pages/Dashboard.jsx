import React, { useState, useMemo } from 'react';
import { useTasks } from '../hooks/useTasks';
import StatsCard from '../components/StatsCard';
import TaskList from '../components/TaskList';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import SortDropdown from '../components/SortDropdown';
import {
  CheckSquare,
  Clock,
  CheckCircle2,
  AlertOctagon,
  Sparkles,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { getGreetingMessage, filterAndSortTasks } from '../utils/taskHelpers';
import { Link } from 'react-router-dom';

export default function Dashboard({ onOpenTaskModal, onEditTask, onDeleteTask }) {
  const { tasks, toggleTaskComplete, reorderTasks } = useTasks();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Greeting
  const greeting = getGreetingMessage();

  // Metrics
  const totalTasks = tasks.length;
  const activeTasks = tasks.filter((t) => !t.completed).length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const highPriorityTasks = tasks.filter((t) => t.priority === 'High' && !t.completed).length;

  // Filtered Tasks
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
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-900 via-slate-900 to-slate-950 text-white shadow-xl relative overflow-hidden border border-brand-800/40">
        <div className="absolute right-0 top-0 -mt-8 -mr-8 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Productivity Overview</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {greeting}
            </h2>
            <p className="mt-1.5 text-sm sm:text-base text-slate-300 max-w-xl font-normal">
              Let's get things done. Track your daily goals, priorities, and project milestones.
            </p>
          </div>

          <button
            onClick={onOpenTaskModal}
            type="button"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-semibold text-sm transition-all shadow-lg shadow-brand-500/30 shrink-0"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Total Tasks"
          value={totalTasks}
          total={totalTasks}
          icon={CheckSquare}
          color="blue"
          indicatorText="Total task count"
        />
        <StatsCard
          title="Active Tasks"
          value={activeTasks}
          total={totalTasks}
          icon={Clock}
          color="amber"
          indicatorText="In progress"
        />
        <StatsCard
          title="Completed"
          value={completedTasks}
          total={totalTasks}
          icon={CheckCircle2}
          color="emerald"
          indicatorText="Done tasks"
        />
        <StatsCard
          title="High Priority"
          value={highPriorityTasks}
          total={totalTasks}
          icon={AlertOctagon}
          color="rose"
          indicatorText="Needs attention"
        />
      </div>

      {/* Main Task List Header & Controls */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Tasks
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
              {filteredTasks.length}
            </span>
          </div>

          {/* Search & Sorting bar */}
          <div className="flex items-center gap-3 flex-1 md:max-w-md">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <SortDropdown value={sortBy} onChange={setSortBy} />
          </div>
        </div>

        {/* Filter controls */}
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

      {/* Task List */}
      <div>
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
    </div>
  );
}
