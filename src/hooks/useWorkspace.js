import { useWorkspace as useWorkspaceFromContext } from '../context/WorkspaceContext';

export function useWorkspace() {
  return useWorkspaceFromContext();
}
