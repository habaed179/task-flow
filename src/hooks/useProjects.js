import { useProjects as useProjectsFromContext } from '../context/ProjectContext';

export function useProjects() {
  return useProjectsFromContext();
}
