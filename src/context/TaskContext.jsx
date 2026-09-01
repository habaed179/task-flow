import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTasksForWorkspace, createTask as createTaskService, updateTask as updateTaskService, deleteTask as deleteTaskService } from '../services/taskService';
import { useWorkspace } from './WorkspaceContext';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { logActivity } from '../services/activityService';
import { createNotification } from '../services/notificationService';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { INITIAL_TASKS } from '../data/initialTasks';

const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const { currentWorkspace } = useWorkspace();
  const { currentUser, userProfile } = useAuth();
  const { toast } = useToast();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useLocalStorage('taskflow_theme', 'dark');
  const [settings, setSettings] = useLocalStorage('taskflow_settings', {
    defaultPriority: 'Medium',
    defaultCategory: 'Work',
  });

  // Apply dark mode class to html element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      toast.info(`Switched to ${next === 'dark' ? 'Dark' : 'Light'} Mode`);
      return next;
    });
  };

  useEffect(() => {
    async function loadTasks() {
      if (!currentWorkspace?.id) return;
      setLoading(true);
      const fetched = await getTasksForWorkspace(currentWorkspace.id);
      setTasks(fetched);
      setLoading(false);
    }
    loadTasks();
  }, [currentWorkspace]);

  const addTask = async (taskData) => {
    const newTask = await createTaskService({
      ...taskData,
      workspaceId: currentWorkspace?.id || 'ws-demo-main',
      creatorId: currentUser?.uid || 'user-hassan-demo',
      category: taskData.category || settings.defaultCategory || 'Work',
      priority: taskData.priority || settings.defaultPriority || 'Medium',
    });

    setTasks((prev) => [newTask, ...prev]);
    toast.success('Task created successfully');

    // Activity log
    await logActivity({
      workspaceId: currentWorkspace?.id,
      actorName: userProfile?.displayName || currentUser?.email || 'Hassan Obaed',
      actorAvatar: userProfile?.photoURL || '',
      action: 'created task',
      target: newTask.title,
    });

    // Notify assignee if assigned to someone else
    if (newTask.assigneeId && newTask.assigneeId !== (currentUser?.uid || 'user-hassan-demo')) {
      await createNotification({
        userId: newTask.assigneeId,
        title: 'New Task Assigned',
        message: `${userProfile?.displayName || 'A team member'} assigned you to "${newTask.title}".`,
        type: 'assignment',
      });
    }

    return newTask;
  };

  const editTask = async (taskId, updatedData) => {
    await updateTaskService(taskId, updatedData);
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, ...updatedData } : t))
    );
    toast.success('Task updated successfully');
  };

  const deleteTask = async (taskId) => {
    const targetTask = tasks.find((t) => t.id === taskId);
    await deleteTaskService(taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    toast.error('Task deleted successfully');

    if (targetTask) {
      await logActivity({
        workspaceId: currentWorkspace?.id,
        actorName: userProfile?.displayName || currentUser?.email || 'Hassan Obaed',
        actorAvatar: userProfile?.photoURL || '',
        action: 'deleted task',
        target: targetTask.title,
      });
    }
  };

  const toggleTaskComplete = async (taskId) => {
    const target = tasks.find((t) => t.id === taskId);
    if (!target) return;

    const nextStatus = target.status === 'Done' ? 'In Progress' : 'Done';
    await editTask(taskId, { status: nextStatus, completed: nextStatus === 'Done' });

    if (nextStatus === 'Done') {
      toast.success('Task marked as completed! 🎉');
      await logActivity({
        workspaceId: currentWorkspace?.id,
        actorName: userProfile?.displayName || currentUser?.email || 'Hassan Obaed',
        actorAvatar: userProfile?.photoURL || '',
        action: 'completed task',
        target: target.title,
      });
    } else {
      toast.info('Task moved back to In Progress');
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    const target = tasks.find((t) => t.id === taskId);
    if (!target || target.status === newStatus) return;

    await editTask(taskId, { status: newStatus, completed: newStatus === 'Done' });
    toast.info(`Moved to ${newStatus}`);

    await logActivity({
      workspaceId: currentWorkspace?.id,
      actorName: userProfile?.displayName || currentUser?.email || 'Hassan Obaed',
      actorAvatar: userProfile?.photoURL || '',
      action: `moved status to ${newStatus}`,
      target: target.title,
    });
  };

  const reorderTasks = (reorderedTasks) => {
    setTasks(reorderedTasks);
    toast.info('Task order updated');
  };

  const clearAllTasks = () => {
    setTasks([]);
    toast.error('All tasks cleared');
  };

  const resetDemoData = () => {
    setTasks(INITIAL_TASKS);
    toast.success('Demo tasks restored');
  };

  const updateSettings = (newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    toast.success('Settings saved');
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        theme,
        settings,
        toggleTheme,
        addTask,
        editTask,
        deleteTask,
        toggleTaskComplete,
        updateTaskStatus,
        reorderTasks,
        clearAllTasks,
        resetDemoData,
        updateSettings,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
