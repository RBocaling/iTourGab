import { Navigate } from "react-router-dom";
import { useClientSupportSession } from "@/hooks/useSupport";
import { useAuth2 } from "@/hooks/useAuth";
import ClientSupportChat from "@/components/chat-admin/ClientSupportChat";

export default function ClientSupportChatPage() {
  const { user } = useAuth2();
  const { data: session, isLoading } = useClientSupportSession();

  return (
    <div className="h-[78vh]">
      <ClientSupportChat ticketId={session?.id} />
    </div>
  );
}
