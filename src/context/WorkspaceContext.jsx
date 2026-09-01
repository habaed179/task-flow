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

  const refreshWorkspaces = async () => {
    if (!currentUser?.uid) return;
    const fetched = await getWorkspacesForUser(currentUser.uid);
    setWorkspaces(fetched);
    if (fetched.length > 0) {
      const savedId = localStorage.getItem('taskflow_active_workspace');
      const active = fetched.find((w) => w.id === savedId) || fetched[0];
      setCurrentWorkspace(active);
    }
  };

  useEffect(() => {
    async function loadWorkspaces() {
      if (!currentUser?.uid) {
        setWorkspaces([]);
        setCurrentWorkspace(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      const fetched = await getWorkspacesForUser(currentUser.uid);
      if (fetched.length > 0) {
        setWorkspaces(fetched);
        const savedId = localStorage.getItem('taskflow_active_workspace');
        const active = fetched.find((w) => w.id === savedId) || fetched[0];
        setCurrentWorkspace(active);
      } else {
        // Automatically create clean workspace for new users
        try {
          const autoWs = await createWorkspaceService(
            {
              name: 'My Workspace',
              description: 'Personal Workspace',
              userName: userProfile?.displayName || currentUser?.email || 'Owner',
              userEmail: currentUser?.email || '',
            },
            currentUser.uid
          );
          setWorkspaces([autoWs]);
          setCurrentWorkspace(autoWs);
          localStorage.setItem('taskflow_active_workspace', autoWs.id);
        } catch (e) {
          console.error('Error auto-creating workspace:', e);
          setWorkspaces([]);
          setCurrentWorkspace(null);
        }
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
    if (!currentUser?.uid) return null;
    const newWs = await createWorkspaceService(
      {
        name,
        description,
        userName: userProfile?.displayName || currentUser?.email || 'Owner',
        userEmail: currentUser?.email || '',
      },
      currentUser.uid
    );

    setWorkspaces((prev) => [newWs, ...prev]);
    setCurrentWorkspace(newWs);
    localStorage.setItem('taskflow_active_workspace', newWs.id);
    toast.success('Workspace created successfully!');
    return newWs;
  };

  const userMemberInfo = currentWorkspace?.members?.find(
    (m) => m.id === currentUser?.uid
  );
  const currentRole = userMemberInfo?.role || (userProfile?.role === 'admin' ? 'admin' : 'owner');

  const currentPlanObj = PLANS.find((p) => p.id === (currentWorkspace?.plan || 'free')) || PLANS[0];

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
        refreshWorkspaces,
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
