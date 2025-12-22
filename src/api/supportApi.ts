import api from "./api";

export type SupportTicketRaw = {
  id: number;
  status: "OPEN" | "CLOSED";
};

export type SupportMessageRaw = {
  id: string;
  ticket_id: string;
  message: string;
  created_at: string;
  sender: {
    id: string;
    first_name: string;
    last_name: string;
    role: "ADMIN" | "CLIENT";
    profile_url?: string | null;
  };
};

type TicketResponse = {
  success: boolean;
  data: SupportTicketRaw;
};

type MessageListResponse = {
  success: boolean;
  data: SupportMessageRaw[];
};

type MessageItemResponse = {
  success: boolean;
  data: SupportMessageRaw;
};

export const getClientSupportSessionApi =
  async (): Promise<SupportTicketRaw> => {
    const { data } = await api.post<TicketResponse>("/support/session");
    return data.data;
  };

export const getSupportMessagesApi = async (
  ticketId: number
): Promise<SupportMessageRaw[]> => {
  const { data } = await api.get<MessageListResponse>(
    `/support/message/${ticketId}`
  );
  return data.data ?? [];
};

export const sendSupportMessageApi = async (payload: {
  ticket_id: number;
  message: string;
}): Promise<SupportMessageRaw> => {
  const { data } = await api.post<MessageItemResponse>(
    "/support/message",
    payload
  );
  return data.data;
};
