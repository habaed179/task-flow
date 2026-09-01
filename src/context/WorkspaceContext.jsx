import React, { createContext, useContext, useState, useEffect } from 'react';
import { getWorkspacesForUser, createWorkspace as createWorkspaceService } from '../services/workspaceService';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { PLANS } from '../utils/constants';

const WorkspaceContext = createContext(null);

export function WorkspaceProvider({ children }) {
  const { currentUser, userProfile } = useAuth();
  const { toast } = useToast();

  const [workspaces, setWorkspaces] = useState([]);
  const [currentWorkspace, setCurrentWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWorkspaces() {
      setLoading(true);
      const userId = currentUser?.uid || 'user-hassan-demo';
      const fetched = await getWorkspacesForUser(userId);
      setWorkspaces(fetched);
      if (fetched.length > 0) {
        // Keep active selection or default to first
        const savedId = localStorage.getItem('taskflow_active_workspace');
        const active = fetched.find((w) => w.id === savedId) || fetched[0];
        setCurrentWorkspace(active);
      }
      setLoading(false);
    }
    loadWorkspaces();
  }, [currentUser]);

  const switchWorkspace = (workspaceId) => {
    const found = workspaces.find((w) => w.id === workspaceId);
    if (found) {
      setCurrentWorkspace(found);
      localStorage.setItem('taskflow_active_workspace', workspaceId);
      toast.info(`Switched to ${found.name}`);
    }
  };

  const createNewWorkspace = async (name, description) => {
    const userId = currentUser?.uid || 'user-hassan-demo';
    const newWs = await createWorkspaceService(
      {
        name,
        description,
        userName: userProfile?.displayName || currentUser?.email || 'Owner',
        userEmail: currentUser?.email || '',
      },
      userId
    );

    setWorkspaces((prev) => [newWs, ...prev]);
    setCurrentWorkspace(newWs);
    localStorage.setItem('taskflow_active_workspace', newWs.id);
    toast.success('Workspace created successfully!');
    return newWs;
  };

  // Derive current user role in selected workspace
  const userMemberInfo = currentWorkspace?.members?.find(
    (m) => m.id === (currentUser?.uid || 'user-hassan-demo')
  );
  const currentRole = userMemberInfo?.role || (userProfile?.role === 'admin' ? 'admin' : 'owner');

  // Plan limits check
  const currentPlanObj = PLANS.find((p) => p.id === (currentWorkspace?.plan || 'pro')) || PLANS[1];

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        currentWorkspace,
        loading,
        currentRole,
        currentPlanObj,
        switchWorkspace,
        createNewWorkspace,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}
