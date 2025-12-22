import { useEffect, useRef, useState } from "react";
import { useSupportMessages, useSendSupportMessage } from "@/hooks/useSupport";
import { Button } from "@/components/ui/button";
import { Send, ShieldCheck } from "lucide-react";
import { useAuth2 } from "@/hooks/useAuth";

export default function ClientSupportChat({ ticketId }: { ticketId: number }) {
  const { user } = useAuth2();
  const { data: messages = [] } = useSupportMessages(ticketId);
  const sendMutation = useSendSupportMessage(ticketId);
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sendMutation.isPending]);

  return (
    <div className="flex flex-col h-full bg-neutral-100">
      <div className="sticky top-0 z-10 backdrop-blur-md bg-white/80 border-b px-4 py-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold">Admin Support</p>
          <p className="text-[11px] text-muted-foreground">
            Online • Replies shortly
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
        {messages.map((m) => {
          const isMine = String(m.sender.id) === String(user?.id);

          return (
            <div
              key={m.id}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[78%] px-4 py-2 rounded-2xl text-sm leading-relaxed ${
                  isMine
                    ? "bg-primary text-white rounded-br-md"
                    : "bg-white text-slate-900 rounded-bl-md shadow-sm"
                }`}
              >
                {m.message}
                <div
                  className={`mt-1 text-[10px] ${
                    isMine ? "text-blue-100" : "text-slate-400"
                  }`}
                >
                  {new Date(m.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {sendMutation.isPending && (
          <div className="flex justify-end">
            <div className="bg-blue-400 text-white px-4 py-2 rounded-2xl rounded-br-md text-sm animate-pulse">
              Sending…
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="border-t bg-white p-3 flex items-center gap-2">
        <textarea
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="iMessage to Admin Support"
          className="flex-1 resize-none rounded-full border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (!text.trim()) return;
              sendMutation.mutate({
                ticket_id: ticketId,
                message: text.trim(),
              });
              setText("");
            }
          }}
        />

        <Button
          size="icon"
          className="rounded-full bg-primary text-white disabled:opacity-50"
          disabled={!text.trim() || sendMutation.isPending}
          onClick={() => {
            sendMutation.mutate({
              ticket_id: ticketId,
              message: text.trim(),
            });
            setText("");
          }}
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
