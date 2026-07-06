"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, SendIcon } from "lucide-react";
import { toast } from "sonner";
import {
  getSupportConversationMessages,
  markSupportConversationSeen,
  sendSupportMessage,
  type SupportMessage,
} from "@/lib/supportChatService";
import {
  disconnectSupportSocket,
  joinSupportConversationRoom,
} from "@/lib/supportSocket";

type UserSupportChatClientProps = {
  conversationId: string;
};

type FeedItem =
  | { kind: "date"; id: string; label: string }
  | {
      kind: "group";
      id: string;
      senderId: string;
      isSelf: boolean;
      messages: SupportMessage[];
    };

function formatTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDayLabel(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  if (isSameDay(date, today)) return "Today";
  if (isSameDay(date, yesterday)) return "Yesterday";

  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

// isSelf = the logged-in user (non-admin), since this client is the user's view
function buildFeed(messages: SupportMessage[]): FeedItem[] {
  const feed: FeedItem[] = [];
  let lastDay = "";
  let currentGroup: Extract<FeedItem, { kind: "group" }> | null = null;

  messages.forEach((message) => {
    const day = formatDayLabel(message.createdAt);

    if (day !== lastDay) {
      feed.push({ kind: "date", id: `date-${message.id}`, label: day });
      lastDay = day;
      currentGroup = null;
    }

    if (currentGroup && currentGroup.senderId === message.senderId) {
      currentGroup.messages.push(message);
    } else {
      currentGroup = {
        kind: "group",
        id: `group-${message.id}`,
        senderId: message.senderId,
        isSelf: message.sender.role !== "ADMIN",
        messages: [message],
      };
      feed.push(currentGroup);
    }
  });

  return feed;
}

function mergeUniqueMessage(prev: SupportMessage[], message: SupportMessage) {
  if (prev.some((item) => item.id === message.id)) {
    return prev;
  }

  return [...prev, message];
}

export default function UserSupportChatClient({ conversationId }: UserSupportChatClientProps) {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  const sortedMessages = useMemo(
    () =>
      [...messages].sort(
        (left, right) => new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime()
      ),
    [messages]
  );

  const feed = useMemo(() => buildFeed(sortedMessages), [sortedMessages]);

  useEffect(() => {
    const activeSocket = joinSupportConversationRoom(conversationId);
    const handleReceiveMessage = (message: SupportMessage) => {
      if (message.conversationId !== conversationId) {
        return;
      }

      setMessages((prev) => mergeUniqueMessage(prev, message));
    };

    const handleMessagesSeen = (payload: { conversationId: string; seenByUserId: string; count: number }) => {
      if (payload.conversationId !== conversationId) {
        return;
      }

      setMessages((prev) =>
        prev.map((message) =>
          message.sender.role !== "ADMIN" ? message : { ...message, isSeen: true }
        )
      );
    };

    activeSocket.on("receive_message", handleReceiveMessage);
    activeSocket.on("messages_seen", handleMessagesSeen);

    const loadMessages = async () => {
      try {
        setIsLoadingMessages(true);
        const result = await getSupportConversationMessages(conversationId);

        if (!result.success || !result.data) {
          toast.error(result.message || "Failed to load support conversation messages");
          return;
        }

        setMessages(result.data);

        const seenResult = await markSupportConversationSeen(conversationId);
        if (!seenResult.success) {
          toast.error(seenResult.message || "Failed to update seen status");
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to load support conversation messages";
        toast.error(message);
      } finally {
        setIsLoadingMessages(false);
      }
    };

    void loadMessages();

    return () => {
      activeSocket.off("receive_message", handleReceiveMessage);
      activeSocket.off("messages_seen", handleMessagesSeen);
      activeSocket.off("conversation_joined");
      disconnectSupportSocket();
    };
  }, [conversationId]);

  useEffect(() => {
    if (!listRef.current) {
      return;
    }

    listRef.current.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [sortedMessages]);

  const onSendMessage = async () => {
    const text = draft.trim();

    if (!text || isSending) {
      return;
    }

    try {
      setIsSending(true);
      const result = await sendSupportMessage({
        conversationId,
        text,
      });

      if (!result.success || !result.data) {
        toast.error(result.message || "Failed to send support message");
        return;
      }

      setDraft("");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to send support message";
      toast.error(message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex h-[100dvh] flex-col  text-slate-100">
      <section className="shrink-0 border-b border-white/[0.06] px-3 py-3 sm:px-4 md:px-0">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="hidden font-mono text-[10px] uppercase tracking-[3px] text-slate-500 sm:block">
              support / conversation
            </p>
            <h1 className="truncate text-[15px] font-semibold text-white sm:text-base">Admin</h1>
          </div>

          <Link
            href="/dashboard/support"
            className="flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-white/10 px-2 font-mono text-[11px] text-slate-400 transition hover:border-white/20 hover:text-white sm:px-2.5"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">back</span>
          </Link>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-3xl min-h-0 flex-1 flex-col px-2 py-3 sm:px-4 md:px-0">
        <div ref={listRef} className="min-h-0 flex-1 space-y-0.5 overflow-y-auto px-1 sm:px-0">
          {isLoadingMessages && (
            <div className="py-8 text-center font-mono text-xs text-slate-600">
              loading conversation...
            </div>
          )}

          {!isLoadingMessages && feed.length === 0 && (
            <div className="py-8 text-center font-mono text-xs text-slate-600">
              no messages yet — send the first one
            </div>
          )}

          {!isLoadingMessages &&
            feed.map((item) => {
              if (item.kind === "date") {
                return (
                  <div key={item.id} className="my-3 flex items-center justify-center">
                    <span className="rounded-full border border-white/[0.08] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-slate-600">
                      {item.label}
                    </span>
                  </div>
                );
              }

              const isSelf = item.isSelf;

              return (
                <div
                  key={item.id}
                  className={`flex w-full gap-2 py-1.5 sm:gap-2.5 ${
                    isSelf ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ring-1 sm:h-8 sm:w-8 sm:text-[11px] ${
                      isSelf
                        ? "bg-cyan-500/15 text-cyan-200 ring-cyan-400/25"
                        : "bg-violet-500/15 text-violet-200 ring-violet-400/25"
                    }`}
                  >
                    {isSelf ? "You" : "AD"}
                  </div>

                  <div
                    className={`flex min-w-0 max-w-[82%] flex-col sm:max-w-[70%] md:max-w-[65%] ${
                      isSelf ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`flex items-baseline gap-2 px-0.5 ${
                        isSelf ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      <span
                        className={`text-[13px] font-semibold sm:text-sm ${
                          isSelf ? "text-cyan-300" : "text-violet-300"
                        }`}
                      >
                        {isSelf ? "You" : "Admin"}
                      </span>
                      <span className="font-mono text-[10px] text-slate-600">
                        {formatTime(item.messages[0].createdAt)}
                      </span>
                    </div>

                    <div className={`mt-1 flex w-full flex-col gap-1 ${isSelf ? "items-end" : "items-start"}`}>
                      {item.messages.map((message) => (
                        <p
                          key={message.id}
                          className={`w-fit max-w-full whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2 text-[15px] leading-relaxed sm:text-base ${
                            isSelf
                              ? "bg-cyan-500/12 text-cyan-50"
                              : "bg-white/[0.045] text-slate-100"
                          }`}
                        >
                          {message.text}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        <form
          className="mt-2 flex shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-1.5"
          onSubmit={(event) => {
            event.preventDefault();
            void onSendMessage();
          }}
        >
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Write your message..."
            className="h-10 flex-1 bg-transparent px-2.5 text-[15px] text-slate-100 outline-none placeholder:text-slate-600 sm:text-sm"
          />
          <button
            type="submit"
            disabled={!draft.trim() || isSending}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-500 text-[#03181c] transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <SendIcon className="h-4 w-4" />
          </button>
        </form>
      </section>
    </div>
  );
}
