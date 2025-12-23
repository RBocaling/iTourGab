import { getFavoritesApi } from "@/api/chatAiApi";
import { useQuery } from "@tanstack/react-query";

export type ChatEntry = {
  id: number;
  uuid: string;
  user_id: number | null;
  question: string;
  response: { text: string; model?: string } | null;
  is_tourist_ai: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
};

export const useAiChats = () =>
  useQuery<ChatEntry[], Error>({
    queryKey: ["aiChats"],
    queryFn: async () => {
      const data = await getFavoritesApi();
      return data;
    },
    staleTime: 1000 * 60 * 5,
    
  });
