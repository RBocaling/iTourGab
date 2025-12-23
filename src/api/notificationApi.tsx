import api from "./api";

export const getMyNotificationsApi = async () => {
  const { data } = await api.get("/notifications/me");
  return Array.isArray(data) ? data : data?.data ?? [];
};

export const markNotificationReadApi = async (id: string | number) => {
  const { data } = await api.put(`/notifications/${id}/read`);
  return data;
};

export const markAllNotificationsReadApi = async () => {
  const { data } = await api.put("/notifications/read-all");
  return data;
};

export const deleteNotificationApi = async (id: string | number) => {
  const { data } = await api.delete(`/notifications/${id}`);
  return data;
};
