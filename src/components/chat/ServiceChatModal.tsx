import { X, Send, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  useCreateOrGetServiceConversation,
  useServiceMessages,
  useSendServiceMessage,
} from "@/hooks/useServiceChat";

export default function ServiceChatModal({
  open,
  onClose,
  service,
  spot,
}: any) {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const { mutateAsync: openConversation, isPending } =
    useCreateOrGetServiceConversation();

  const { data: messages } = useServiceMessages(conversationId ?? undefined);
  const { mutateAsync: sendMessage, isPending: sending } =
    useSendServiceMessage(conversationId ?? "");

  useEffect(() => {
    if (open && service?.id) {
      openConversation(service.id).then((res: any) => {
        setConversationId(res.id);
      });
    }
  }, [open, service]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!open) return null;

    
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end md:items-center justify-center">
      <div className="bg-white w-full md:max-w-md h-[85vh] rounded-t-3xl md:rounded-3xl flex flex-col overflow-hidden shadow-xl">
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div>
            <p className="text-sm font-semibold">{service?.name}</p>
            <p className="text-xs text-muted-foreground">{spot?.name}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-muted">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 bg-muted/30">
          {isPending && (
            <p className="text-xs text-center text-muted-foreground">
              Opening conversation…
            </p>
          )}

          {messages?.map((m: any) => {
            const mine = m.sender?.role === "CLIENT";

            return (
              <div
                key={m.id}
                className={`flex items-end gap-2 ${
                  mine ? "justify-end" : "justify-start"
                }`}
              >
                {!mine && (
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-xs font-semibold text-muted-foreground">
                      {m.sender?.first_name?.[0] ?? "B"}
                    </span>
                  </div>
                )}

                <div
                  className={`max-w-[72%] px-4 py-2 text-sm leading-relaxed rounded-2xl ${
                    mine
                      ? "bg-primary text-white rounded-br-md"
                      : "bg-white border rounded-bl-md"
                  }`}
                >
                  <p>{m.message}</p>

                  <div
                    className={`text-[10px] mt-1 ${
                      mine ? "text-white/70" : "text-muted-foreground"
                    } text-right`}
                  >
                    {new Date(m.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                {mine && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-xs font-semibold text-white">
                      {m.sender?.first_name?.[0] ?? "C"}
                    </span>
                  </div>
                )}
              </div>
            );
          })}

          <div ref={bottomRef} />
        </div>

        {/* INPUT */}
        <div className="p-3 border-t flex items-center gap-2 mb-28">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message…"
            className="flex-1 rounded-full border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            disabled={!message || sending}
            onClick={async () => {
              await sendMessage(message);
              setMessage("");
            }}
            className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
