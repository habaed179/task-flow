import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../Sidebar';
import Header from '../Header';
import TaskModal from '../TaskModal';
import DeleteModal from '../DeleteModal';
import WorkspaceModal from '../workspace/WorkspaceModal';
import SearchModal from '../common/SearchModal';
import CommandPalette from '../common/CommandPalette';
import NetworkStatus from '../common/NetworkStatus';
import TaskDetailModal from '../tasks/TaskDetailModal';
import ToastContainer from '../Toast';
import { useTasks } from '../../hooks/useTasks';

export default function AppLayout() {
  const { addTask, editTask, deleteTask } = useTasks();
  const location = useLocation();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);

  // Global Keyboard Shortcuts (N -> New Task, / -> Search, Cmd+K -> Command Palette)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if (e.key === '/') {
        e.preventDefault();
        setIsSearchModalOpen(true);
      } else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setEditingTask(null);
        setIsTaskModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Dashboard';
      case '/tasks':
        return 'My Tasks';
      case '/projects':
        return 'Projects';
      case '/calendar':
        return 'Calendar';
      case '/team':
        return 'Team';
      case '/notifications':
        return 'Notifications';
      case '/settings':
        return 'Settings';
      case '/billing':
        return 'Billing & Subscriptions';
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

  const handleSaveTask = async (taskData) => {
    if (editingTask) {
      await editTask(editingTask.id, taskData);
    } else {
      await addTask(taskData);
    }
    setEditingTask(null);
  };

  const handleDeleteConfirm = async () => {
    if (deletingTask) {
      await deleteTask(deletingTask.id);
      setDeletingTask(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200 font-sans">
      <NetworkStatus />

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onOpenWorkspaceModal={() => setIsWorkspaceModalOpen(true)}
      />

      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Header
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onOpenNewTaskModal={handleOpenCreateModal}
          onOpenSearchModal={() => setIsSearchModalOpen(true)}
          title={getPageTitle()}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet
            context={{
              onOpenTaskModal: handleOpenCreateModal,
              onEditTask: handleOpenEditModal,
              onDeleteTask: setDeletingTask,
              onViewTask: setViewingTask,
            }}
          />
        </main>
      </div>

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        initialData={editingTask}
      />

      <DeleteModal
        isOpen={Boolean(deletingTask)}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleDeleteConfirm}
        taskTitle={deletingTask?.title}
      />

      <WorkspaceModal
        isOpen={isWorkspaceModalOpen}
        onClose={() => setIsWorkspaceModalOpen(false)}
      />

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={(val) => {
          if (typeof val === 'boolean') setIsCommandPaletteOpen(val);
          else setIsCommandPaletteOpen(false);
        }}
        onOpenNewTaskModal={handleOpenCreateModal}
      />

      <TaskDetailModal
        task={viewingTask}
        isOpen={Boolean(viewingTask)}
        onClose={() => setViewingTask(null)}
        onEdit={(taskId, fields) => editTask(taskId, fields)}
      />

      <ToastContainer />
    </div>
  );
}
