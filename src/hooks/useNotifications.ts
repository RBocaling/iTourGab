import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMyNotificationsApi,
  markNotificationReadApi,
  markAllNotificationsReadApi,
} from "@/api/notificationApi";

export const useNotifications = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["notifications"],
    queryFn: getMyNotificationsApi,
  });

  const unreadCount = query.data?.filter((n: any) => !n.is_read).length ?? 0;

  const markRead = useMutation({
    mutationFn: (id: string | number) => markNotificationReadApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAllRead = useMutation({
    mutationFn: markAllNotificationsReadApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return {
    ...query,
    notifications: query.data ?? [],
    unreadCount,
    markRead,
    markAllRead,
  };
};
