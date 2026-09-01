import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { INITIAL_TASKS } from '../data/initialTasks';
import { useToast } from './ToastContext';

const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useLocalStorage('taskflow_tasks', INITIAL_TASKS);
  const [theme, setTheme] = useLocalStorage('taskflow_theme', 'dark');
  const [settings, setSettings] = useLocalStorage('taskflow_settings', {
    defaultPriority: 'Medium',
    defaultCategory: 'Work',
  });
  
  const { toast } = useToast();

  // Handle Theme switching in HTML document element
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

  const addTask = (taskData) => {
    const newTask = {
      id: `task-${Date.now()}`,
      title: taskData.title.trim(),
      description: taskData.description?.trim() || '',
      category: taskData.category || settings.defaultCategory || 'Work',
      priority: taskData.priority || settings.defaultPriority || 'Medium',
      dueDate: taskData.dueDate || '',
      completed: false,
      tags: taskData.tags || [],
      createdAt: new Date().toISOString(),
      order: tasks.length,
    };

    setTasks((prev) => [newTask, ...prev]);
    toast.success('Task created successfully');
    return newTask;
  };

  const editTask = (taskId, updatedData) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              ...updatedData,
              title: updatedData.title ? updatedData.title.trim() : t.title,
              description: updatedData.description !== undefined ? updatedData.description.trim() : t.description,
            }
          : t
      )
    );
    toast.success('Task updated successfully');
  };

  const deleteTask = (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    toast.error('Task deleted successfully');
  };

  const toggleTaskComplete = (taskId) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextCompleted = !t.completed;
          if (nextCompleted) {
            toast.success('Task marked as completed');
          } else {
            toast.info('Task marked as active');
          }
          return { ...t, completed: nextCompleted };
        }
        return t;
      })
    );
  };

  const reorderTasks = (reorderedTasks) => {
    const updated = reorderedTasks.map((task, idx) => ({
      ...task,
      order: idx,
    }));
    setTasks(updated);
    toast.info('Task order updated');
  };

  const moveTaskStatus = (taskId, newCompletedState) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return { ...t, completed: newCompletedState };
        }
        return t;
      })
    );
    toast.info(newCompletedState ? 'Task moved to Completed' : 'Task moved to Active');
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
        theme,
        settings,
        toggleTheme,
        addTask,
        editTask,
        deleteTask,
        toggleTaskComplete,
        reorderTasks,
        moveTaskStatus,
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
