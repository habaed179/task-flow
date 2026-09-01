import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { TaskProvider, useTasks } from './context/TaskContext';
import { ToastProvider } from './context/ToastContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TaskModal from './components/TaskModal';
import DeleteModal from './components/DeleteModal';
import ToastContainer from './components/Toast';

import Dashboard from './pages/Dashboard';
import AllTasks from './pages/AllTasks';
import ActiveTasks from './pages/ActiveTasks';
import CompletedTasks from './pages/CompletedTasks';
import HighPriority from './pages/HighPriority';
import Settings from './pages/Settings';

function AppLayout() {
  const { addTask, editTask, deleteTask } = useTasks();
  const location = useLocation();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);

  // Derive current page title for Header
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Dashboard';
      case '/tasks':
        return 'All Tasks';
      case '/tasks/active':
        return 'Active Tasks';
      case '/tasks/completed':
        return 'Completed Tasks';
      case '/tasks/high-priority':
        return 'High Priority Tasks';
      case '/settings':
        return 'Settings';
      default:
        return 'TaskFlow';
    }
  };

  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (taskData) => {
    if (editingTask) {
      editTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
    setEditingTask(null);
  };

  const handleDeleteConfirm = () => {
    if (deletingTask) {
      deleteTask(deletingTask.id);
      setDeletingTask(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Header */}
        <Header
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onOpenNewTaskModal={handleOpenCreateModal}
          title={getPageTitle()}
        />

        {/* Page View Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/dashboard"
              element={
                <Dashboard
                  onOpenTaskModal={handleOpenCreateModal}
                  onEditTask={handleOpenEditModal}
                  onDeleteTask={setDeletingTask}
                />
              }
            />
            <Route
              path="/tasks"
              element={
                <AllTasks
                  onOpenTaskModal={handleOpenCreateModal}
                  onEditTask={handleOpenEditModal}
                  onDeleteTask={setDeletingTask}
                />
              }
            />
            <Route
              path="/tasks/active"
              element={
                <ActiveTasks
                  onOpenTaskModal={handleOpenCreateModal}
                  onEditTask={handleOpenEditModal}
                  onDeleteTask={setDeletingTask}
                />
              }
            />
            <Route
              path="/tasks/completed"
              element={
                <CompletedTasks
                  onOpenTaskModal={handleOpenCreateModal}
                  onEditTask={handleOpenEditModal}
                  onDeleteTask={setDeletingTask}
                />
              }
            />
            <Route
              path="/tasks/high-priority"
              element={
                <HighPriority
                  onOpenTaskModal={handleOpenCreateModal}
                  onEditTask={handleOpenEditModal}
                  onDeleteTask={setDeletingTask}
                />
              }
            />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>

      {/* Task Add / Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        initialData={editingTask}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={Boolean(deletingTask)}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleDeleteConfirm}
        taskTitle={deletingTask?.title}
      />

      {/* Floating Toast Notification Container */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <TaskProvider>
        <Router>
          <AppLayout />
        </Router>
      </TaskProvider>
    </ToastProvider>
  );
}
