import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getClientSupportSessionApi,
  getSupportMessagesApi,
  sendSupportMessageApi,
} from "@/api/supportApi";

export const useClientSupportSession = () => {
  return useQuery({
    queryKey: ["support-session"],
    queryFn: getClientSupportSessionApi,
    staleTime: Infinity,
  });
};

export const useSupportMessages = (ticketId?: number) => {
  return useQuery({
    queryKey: ["support-messages", ticketId],
    queryFn: () => getSupportMessagesApi(ticketId as number),
    enabled: Boolean(ticketId),
    refetchInterval: 3000,
  });
};

export const useSendSupportMessage = (ticketId: number) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: sendSupportMessageApi,
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["support-messages", ticketId],
      });
    },
  });
};
