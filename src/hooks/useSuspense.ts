import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  suspendApi,
  unsuspendApi,
  getSuspensionStatusApi,
  getSuspendedListApi,
} from "@/api/SuspenseApi";

export const useSuspend = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: suspendApi,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["suspended-list"] });
    },
  });
};

export const useUnsuspend = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: unsuspendApi,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["suspended-list"] });
    },
  });
};

export const useSuspensionStatus = (entity_type: string, entity_id: number) =>
  useQuery({
    queryKey: ["suspension-status", entity_type, entity_id],
    queryFn: () => getSuspensionStatusApi(entity_type as any, entity_id),
  });

export const useSuspendedList = () =>
  useQuery({
    queryKey: ["suspended-list"],
    queryFn: getSuspendedListApi,
  });
