// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { useQueryClient } from "@tanstack/react-query";
// import { Loader2, ImageIcon, Send } from "lucide-react";
// import { ChatEntry, useAiChats } from "@/hooks/useAiChats";
// import api from "@/api/api";

// type OutgoingPayload = { question: string };

// export default function AiChat() {
//   const { data: chats = [], isLoading: loadingChats } = useAiChats();
//   const queryClient = useQueryClient();
//   const [input, setInput] = useState("");
//   const [isSending, setIsSending] = useState(false);
//   const [aiTyping, setAiTyping] = useState(false);
//   const listRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     if (listRef.current) {
//       listRef.current.scrollTop = listRef.current.scrollHeight + 200;
//     }
//   }, [chats, aiTyping, isSending]);

//   const grouped = useMemo(() => {
//     return chats
//       .slice()
//       .sort(
//         (a, b) =>
//           new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
//       );
//   }, [chats]);

//   const sendQuestion = async (q: string) => {
//     if (!q.trim()) return;
//     setIsSending(true);
//     const optimistic: ChatEntry = {
//       id: Date.now(),
//       uuid: String(Date.now()),
//       user_id: null,
//       question: q,
//       response: null,
//       is_tourist_ai: false,
//       is_deleted: false,
//       created_at: new Date().toISOString(),
//       updated_at: new Date().toISOString(),
//     };
//     const prev = queryClient.getQueryData<ChatEntry[]>(["aiChats"]) ?? [];
//     queryClient.setQueryData<ChatEntry[]>(["aiChats"], [...prev, optimistic]);
//     try {
//       setAiTyping(true);
//       const payload: OutgoingPayload = { question: q };
//       const { data } = await api.post("/tourist_ai", payload);
//       const aiText =
//         data?.data?.ai_text ?? data?.data?.ai_entry?.response?.text ?? null;
//       const newAiEntry = data?.data?.ai_entry ?? null;
//       const updated = [
//         ...(queryClient.getQueryData<ChatEntry[]>(["aiChats"]) ?? []),
//       ];
//       if (newAiEntry) {
//         updated.push({
//           id: newAiEntry.id,
//           uuid: newAiEntry.uuid,
//           user_id: newAiEntry.user_id,
//           question: newAiEntry.question,
//           response: newAiEntry.response ?? null,
//           is_tourist_ai: true,
//           is_deleted: newAiEntry.is_deleted,
//           created_at: newAiEntry.created_at,
//           updated_at: newAiEntry.updated_at,
//         });
//       } else if (aiText) {
//         updated.push({
//           id: Date.now() + 1,
//           uuid: String(Date.now() + 1),
//           user_id: null,
//           question: q,
//           response: { text: aiText },
//           is_tourist_ai: true,
//           is_deleted: false,
//           created_at: new Date().toISOString(),
//           updated_at: new Date().toISOString(),
//         });
//       }
//       queryClient.setQueryData<ChatEntry[]>(["aiChats"], updated);
//     } catch (err) {
//       queryClient.setQueryData(["aiChats"], prev);
//     } finally {
//       setIsSending(false);
//       setAiTyping(false);
//       setInput("");
//     }
//   };

//   return (
//     <div className="max-w-3xl w-full mx-auto h-[86vh]  md:mt-20 flex flex-col bg-gradient-to-b from-white/30 to-slate-50/20 backdrop-blur-lg rounded-[28px] shadow-2xl ring-1 ring-white/20 overflow-hidden">
//       <div className="flex items-center gap-3 px-5 py-4 bg-white/60 backdrop-blur-sm border-b border-white/10">
//         <div className="flex items-center gap-3">
//           <div className="w-12 h-12 rounded-xl bg-white/70 backdrop-blur-md flex items-center justify-center shadow-sm ring-1 ring-white/30">
//             <img src="/profile-ai.png" className="w-14" alt="" />
//           </div>
//         </div>
//         <div className="flex-1 min-w-0">
//           <div className="text-sm font-semibold leading-5 text-slate-900">
//             Tourist AI
//           </div>
//           <div className="text-xs text-slate-500">
//             Ask about places, services, availability
//           </div>
//         </div>
//         <div className="flex items-center gap-3">
//           <div className="text-xs px-3 py-1 rounded-full bg-green-50 text-green-600">
//             Online
//           </div>
//         </div>
//       </div>

//       <div ref={listRef} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
//         <div className="flex items-center justify-center flex-col  w-full">
//           <img src="/message-ai.png" className="max-w-[15rem] mx-auto w-full" alt="" />
//           <p className="text-sm text-neutral-500 tracking-wider text-center">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Perferendis eos vel earum blanditiis inventore incidunt vitae in provident assumenda exercitationem. Amet, eius reiciendis. Provident nisi rem mollitia </p>
//         </div>
//         {loadingChats ? (
//           <div className="w-full flex items-center justify-center py-12">
//             <div className="flex flex-col items-center gap-4">
//               <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-400 to-pink-400 flex items-center justify-center shadow-xl">
//                 <Loader2 className="animate-spin w-7 h-7 text-white" />
//               </div>
//               <div className="text-sm text-slate-600">
//                 Fetching conversations…
//               </div>
//             </div>
//           </div>
//         ) : (
//           grouped.map((c) => (
//             <div
//               key={c.uuid + c.id}
//               className={`flex ${
//                 c.is_tourist_ai ? "justify-start" : "justify-end"
//               }`}
//             >
//               {c.is_tourist_ai ? (
//                 <div className="relative max-w-[78%] bg-white/85 backdrop-blur-sm px-4 py-3 rounded-2xl shadow-md ring-1 ring-white/30">
//                   <div className="flex items-start gap-3">
//                     <img src="/ai2.png" className="w-7 h-6" alt="" />
//                     <div className="min-w-0">
//                       <div className="text-sm text-slate-800 leading-6 whitespace-pre-wrap">
//                         {c.response?.text ?? "..."}
//                       </div>
//                       <div className="mt-2 text-[11px] text-slate-400">
//                         {new Date(c.created_at).toLocaleString()}
//                       </div>
//                     </div>
//                   </div>
//                   <svg
//                     className="absolute -left-3 top-4"
//                     width="24"
//                     height="24"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     aria-hidden
//                   >
//                     <path d="M15 6 L9 10 L9 6 Z" fill="white" opacity="0.9" />
//                   </svg>
//                 </div>
//               ) : (
//                 <div className="relative max-w-[78%] bg-gradient-to-tr from-primary to-sky-500 text-white px-4 py-3 rounded-2xl shadow-lg">
//                   <div className="text-sm leading-6 whitespace-pre-wrap">
//                     {c.question}
//                   </div>
//                   <div className="mt-2 text-[11px] opacity-80">
//                     {new Date(c.created_at).toLocaleString()}
//                   </div>
//                   <svg
//                     className="absolute -right-3 top-4 rotate-180"
//                     width="24"
//                     height="24"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     aria-hidden
//                   >
//                     <path d="M15 6 L9 10 L9 6 Z" fill="white" opacity="0.15" />
//                   </svg>
//                 </div>
//               )}
//             </div>
//           ))
//         )}

//         {aiTyping && (
//           <div className="flex justify-start">
//             <div className="relative max-w-[60%] bg-white/90 backdrop-blur-sm px-3 py-2 rounded-2xl shadow-sm ring-1 ring-white/40 inline-flex items-center gap-3">
//               <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold">
//                 AI
//               </div>
//               <div className="text-sm text-slate-700 flex items-center gap-3">
//                 <div className="flex items-center gap-1">
//                   <span className="dot" />
//                   <span className="dot delay" />
//                   <span className="dot delay2" />
//                 </div>
//                 <span className="text-xs text-slate-400">Typing…</span>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       <div className="px-5 py-4 bg-white/60 backdrop-blur-md border-t border-white/10 mb-14 md:mb-5">
//         <div className="flex items-center gap-3">
//           <div className="flex-1 relative">
//             <textarea
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter" && !e.shiftKey) {
//                   e.preventDefault();
//                   sendQuestion(input);
//                 }
//               }}
//               placeholder="Ask anything.."
//               className="w-full min-h-[44px] max-h-32 resize-none px-4 py-3 rounded-[28px] bg-white/85 backdrop-blur-sm shadow-inner placeholder:text-slate-400 text-sm outline-none"
//             />
//             <div className="absolute right-2 top-1/2 -translate-y-1/2">
//               {isSending ? (
//                 <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50">
//                   <Loader2 className="animate-spin w-4 h-4 text-indigo-600" />
//                   <div className="text-xs text-indigo-600">Sending</div>
//                 </div>
//               ) : (
//                 <button
//                   onClick={() => sendQuestion(input)}
//                   aria-label="Send message"
//                   className="inline-flex items-center gap-2 px-4 py-2 h-12 w-16 text-center flex justify-center rounded-full bg-gradient-to-r from-primary to-sky-600 text-white shadow-lg hover:scale-[1.01] active:scale-[0.99]"
//                 >
//                   <Send className="w-6 h-6 rotate-45" />
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       <style>{`
//         .dot {
//           width: 7px;
//           height: 7px;
//           border-radius: 999px;
//           background: linear-gradient(180deg, #94a3b8, #64748b);
//           display: inline-block;
//           opacity: 0.9;
//           transform: translateY(0);
//           animation: dotBounce 1s infinite;
//         }
//         .delay {
//           margin-left: 6px;
//           animation-delay: 0.12s;
//           opacity: 0.8;
//         }
//         .delay2 {
//           margin-left: 6px;
//           animation-delay: 0.24s;
//           opacity: 0.7;
//         }
//         @keyframes dotBounce {
//           0% {
//             transform: translateY(0);
//           opacity: 0.6;
//           }
//           50% {
//             transform: translateY(-6px);
//             opacity: 1;
//           }
//           100% {
//             transform: translateY(0);
//             opacity: 0.6;
//           }
//         }
//         textarea::-webkit-scrollbar {
//           height: 6px;
//         }
//         textarea::-webkit-scrollbar-thumb {
//           background: rgba(0, 0, 0, 0.08);
//           border-radius: 999px;
//         }
//       `}</style>
//     </div>
//   );
// }











































import React, { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, ImageIcon, Send } from "lucide-react";
import { ChatEntry, useAiChats } from "@/hooks/useAiChats";
import api from "@/api/api";

type OutgoingPayload = { question: string };

export default function AiChat() {
  const { data: chats = [], isLoading: loadingChats } = useAiChats();
  const queryClient = useQueryClient();
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [aiTyping, setAiTyping] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);
const [hasAiCredit] = useState(false); // ← set false kapag walang OpenAI credit
const [creditError, setCreditError] = useState(false);


  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight + 200;
    }
  }, [chats, aiTyping, isSending]);

  const grouped = useMemo(() => {
    return chats
      .slice()
      .sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
  }, [chats]);

  const sendQuestion = async (q: string) => {
    if (!q.trim()) return;

    if (!hasAiCredit) {
      setCreditError(true);
      return;
    }

    setIsSending(true);
  }

  return (
    <div className="max-w-3xl w-full mx-auto h-[86vh]  md:mt-20 flex flex-col bg-gradient-to-b from-white/30 to-slate-50/20 backdrop-blur-lg rounded-[28px] shadow-2xl ring-1 ring-white/20 overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 bg-white/60 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/70 backdrop-blur-md flex items-center justify-center shadow-sm ring-1 ring-white/30">
            <img src="/profile-ai.png" className="w-14" alt="" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold leading-5 text-slate-900">
            Tourist AI
          </div>
          <div className="text-xs text-slate-500">
            Ask about places, services, availability
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs px-3 py-1 rounded-full bg-green-50 text-green-600">
            Online
          </div>
        </div>
      </div>

      <div ref={listRef} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
        <div className="flex items-center justify-center flex-col  w-full">
          <img
            src="/message-ai.png"
            className="max-w-[15rem] mx-auto w-full"
            alt=""
          />
          <p className="text-sm text-neutral-500 tracking-wider text-center">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Perferendis eos vel earum blanditiis inventore incidunt vitae in
            provident assumenda exercitationem. Amet, eius reiciendis. Provident
            nisi rem mollitia{" "}
          </p>
        </div>
        {loadingChats ? (
          <div className="w-full flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-400 to-pink-400 flex items-center justify-center shadow-xl">
                <Loader2 className="animate-spin w-7 h-7 text-white" />
              </div>
              <div className="text-sm text-slate-600">
                Fetching conversations…
              </div>
            </div>
          </div>
        ) : (
          grouped.map((c) => (
            <div
              key={c.uuid + c.id}
              className={`flex ${
                c.is_tourist_ai ? "justify-start" : "justify-end"
              }`}
            >
              {c.is_tourist_ai ? (
                <div className="relative max-w-[78%] bg-white/85 backdrop-blur-sm px-4 py-3 rounded-2xl shadow-md ring-1 ring-white/30">
                  <div className="flex items-start gap-3">
                    <img src="/ai2.png" className="w-7 h-6" alt="" />
                    <div className="min-w-0">
                      <div className="text-sm text-slate-800 leading-6 whitespace-pre-wrap">
                        {c.response?.text ?? "..."}
                      </div>
                      <div className="mt-2 text-[11px] text-slate-400">
                        {new Date(c.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <svg
                    className="absolute -left-3 top-4"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden
                  >
                    <path d="M15 6 L9 10 L9 6 Z" fill="white" opacity="0.9" />
                  </svg>
                </div>
              ) : (
                <div className="relative max-w-[78%] bg-gradient-to-tr from-primary to-sky-500 text-white px-4 py-3 rounded-2xl shadow-lg">
                  <div className="text-sm leading-6 whitespace-pre-wrap">
                    {c.question}
                  </div>
                  <div className="mt-2 text-[11px] opacity-80">
                    {new Date(c.created_at).toLocaleString()}
                  </div>
                  <svg
                    className="absolute -right-3 top-4 rotate-180"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden
                  >
                    <path d="M15 6 L9 10 L9 6 Z" fill="white" opacity="0.15" />
                  </svg>
                </div>
              )}
            </div>
          ))
        )}

        {aiTyping && (
          <div className="flex justify-start">
            <div className="relative max-w-[60%] bg-white/90 backdrop-blur-sm px-3 py-2 rounded-2xl shadow-sm ring-1 ring-white/40 inline-flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold">
                AI
              </div>
              <div className="text-sm text-slate-700 flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <span className="dot" />
                  <span className="dot delay" />
                  <span className="dot delay2" />
                </div>
                <span className="text-xs text-slate-400">Typing…</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="px-5 py-4 bg-white/60 backdrop-blur-md border-t border-white/10 mb-14 md:mb-5">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendQuestion(input);
                }
              }}
              placeholder="Ask anything.."
              className="w-full min-h-[44px] max-h-32 resize-none px-4 py-3 rounded-[28px] bg-white/85 backdrop-blur-sm shadow-inner placeholder:text-slate-400 text-sm outline-none"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              {isSending ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50">
                  <Loader2 className="animate-spin w-4 h-4 text-indigo-600" />
                  <div className="text-xs text-indigo-600">Sending</div>
                </div>
              ) : (
                <button
                  onClick={() => sendQuestion(input)}
                  aria-label="Send message"
                  className="inline-flex items-center gap-2 px-4 py-2 h-12 w-16 text-center flex justify-center rounded-full bg-gradient-to-r from-primary to-sky-600 text-white shadow-lg hover:scale-[1.01] active:scale-[0.99]"
                >
                  <Send className="w-6 h-6 rotate-45" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .dot {
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: linear-gradient(180deg, #94a3b8, #64748b);
          display: inline-block;
          opacity: 0.9;
          transform: translateY(0);
          animation: dotBounce 1s infinite;
        }
        .delay {
          margin-left: 6px;
          animation-delay: 0.12s;
          opacity: 0.8;
        }
        .delay2 {
          margin-left: 6px;
          animation-delay: 0.24s;
          opacity: 0.7;
        }
        @keyframes dotBounce {
          0% {
            transform: translateY(0);
          opacity: 0.6;
          }
          50% {
            transform: translateY(-6px);
            opacity: 1;
          }
          100% {
            transform: translateY(0);
            opacity: 0.6;
          }
        }
        textarea::-webkit-scrollbar {
          height: 6px;
        }
        textarea::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.08);
          border-radius: 999px;
        }
      `}</style>
      {creditError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-[28px] bg-white/90 backdrop-blur-xl shadow-2xl ring-1 ring-white/30 p-6 animate-in fade-in zoom-in">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-rose-500 to-orange-400 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                !
              </div>

              <div className="text-lg font-semibold text-slate-900">
                AI Credit Unavailable
              </div>

              <div className="text-sm text-slate-600 leading-relaxed">
                Tourist AI is currently unavailable due to insufficient OpenAI
                credits. Please try again later.
              </div>

              <button
                onClick={() => setCreditError(false)}
                className="mt-2 w-full rounded-full py-3 text-sm font-semibold text-white bg-gradient-to-r from-primary to-sky-600 shadow-lg hover:scale-[1.01] active:scale-[0.98]"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

