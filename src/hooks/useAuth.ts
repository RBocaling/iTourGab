import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userGetApi } from "../api/userApi";
import { logout as logoutApi } from "../api/authApi";
import { useAuthStore } from "../store/authStore";

export const useAuth2 = () => {
  const accessToken = useAuthStore((s) => s.accessToken);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const qc = useQueryClient();

  const userQuery = useQuery<any>({
    queryKey: ["auth-user"],
    queryFn: userGetApi,
    enabled: !!accessToken,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  const logoutMutation = useMutation({
    mutationFn: () => logoutApi(),
    onSuccess: () => {
      clearAuth();
      qc.removeQueries(["auth-user"] as any);
    },
  });

  const data = userQuery.data?.data;

  return {
    user: data ? { ...data, name: `${data.first_name} ${data.last_name}` } : null,
    isAuthenticated: Boolean(accessToken && data),
    loading: userQuery.isLoading,
    logout: () => logoutMutation.mutateAsync(),
    refetch: () => userQuery.refetch(),
    error: userQuery.error ?? null,
  };

};
