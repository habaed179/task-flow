import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProjectsForWorkspace, createProject as createProjectService, updateProject as updateProjectService, deleteProject as deleteProjectService } from '../services/projectService';
import { useWorkspace } from './WorkspaceContext';
import { useToast } from './ToastContext';
import { logActivity } from '../services/activityService';
import { useAuth } from './AuthContext';

const ProjectContext = createContext(null);

export function ProjectProvider({ children }) {
  const { currentWorkspace } = useWorkspace();
  const { currentUser, userProfile } = useAuth();
  const { toast } = useToast();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      if (!currentWorkspace?.id) return;
      setLoading(true);
      const data = await getProjectsForWorkspace(currentWorkspace.id);
      setProjects(data);
      setLoading(false);
    }
    loadProjects();
  }, [currentWorkspace]);

  const addProject = async (projectData) => {
    const newProj = await createProjectService({
      ...projectData,
      workspaceId: currentWorkspace?.id || 'ws-demo-main',
      ownerId: currentUser?.uid || 'user-hassan-demo',
    });

    setProjects((prev) => [newProj, ...prev]);
    toast.success(`Project "${newProj.name}" created!`);

    await logActivity({
      workspaceId: currentWorkspace?.id,
      actorName: userProfile?.displayName || currentUser?.email || 'Hassan Obaed',
      actorAvatar: userProfile?.photoURL || '',
      action: 'created project',
      target: newProj.name,
    });

    return newProj;
  };

  const updateProject = async (projectId, fields) => {
    await updateProjectService(projectId, fields);
    setProjects((prev) => prev.map((p) => (p.id === projectId ? { ...p, ...fields } : p)));
    toast.success('Project updated successfully');
  };

  const removeProject = async (projectId) => {
    await deleteProjectService(projectId);
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    toast.error('Project deleted');
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        loading,
        addProject,
        updateProject,
        removeProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
}
