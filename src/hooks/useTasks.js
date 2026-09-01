import { useTasks as useTasksFromContext } from '../context/TaskContext';

export function useTasks() {
  return useTasksFromContext();
}
