import { useNotifications as useNotificationsFromContext } from '../context/NotificationContext';

export function useNotifications() {
  return useNotificationsFromContext();
}
