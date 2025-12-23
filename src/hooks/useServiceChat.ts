import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createOrGetConversationApi,
  getMyServiceConversationsApi,
  getServiceMessagesApi,
  sendServiceMessageApi,
} from "@/api/serviceChatApi";

export const SERVICE_CONVERSATIONS_KEY = ["service-conversations"];
export const SERVICE_MESSAGES_KEY = (id: string) => ["service-messages", id];

export const useCreateOrGetServiceConversation = () => {
  return useMutation({
    mutationFn: createOrGetConversationApi,
  });
};

export const useMyServiceConversations = () => {
  return useQuery({
    queryKey: SERVICE_CONVERSATIONS_KEY,
    queryFn: getMyServiceConversationsApi,
  });
};

export const useServiceMessages = (conversationId?: string) => {
  return useQuery({
    queryKey: conversationId ? SERVICE_MESSAGES_KEY(conversationId) : [],
    queryFn: () => getServiceMessagesApi(conversationId as string),
    enabled: !!conversationId,
  });
};

export const useSendServiceMessage = (conversationId: string) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (message: string) =>
      sendServiceMessageApi({ conversationId, message }),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: SERVICE_MESSAGES_KEY(conversationId),
      });
      qc.invalidateQueries({
        queryKey: SERVICE_CONVERSATIONS_KEY,
      });
    },
  });
};
