import api from "./api";

export const createOrGetConversationApi = async (serviceId: string) => {
  const { data } = await api.post("/service-conversations", {
    service_id: serviceId,
  });
  return data.data;
};

export const getMyServiceConversationsApi = async () => {
  const { data } = await api.get("/service-conversations/me");
  return data.data;
};

export const getServiceMessagesApi = async (conversationId: string) => {
  const { data } = await api.get(
    `/service-conversations/${conversationId}/messages`
  );
  return data.data;
};

export const sendServiceMessageApi = async ({
  conversationId,
  message,
}: {
  conversationId: string;
  message: string;
}) => {
  const { data } = await api.post(
    `/service-conversations/${conversationId}/messages`,
    { message }
  );
  return data.data;
};
