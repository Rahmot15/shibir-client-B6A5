"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, SendIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getSupportConversationMessages,
  sendSupportMessage,
  type SupportMessage,
} from "@/lib/supportChatService";

type UserSupportChatClientProps = {
  conversationId: string;
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

  useEffect(() => {
    const loadMessages = async () => {
      try {
        setIsLoadingMessages(true);
        const result = await getSupportConversationMessages(conversationId);

        if (!result.success || !result.data) {
          toast.error(result.message || "Failed to load support conversation messages");
          return;
        }

        setMessages(result.data);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to load support conversation messages";
        toast.error(message);
      } finally {
        setIsLoadingMessages(false);
      }
    };

    void loadMessages();
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

      setMessages((prev) => [...prev, result.data as SupportMessage]);
      setDraft("");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to send support message";
      toast.error(message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050f08] text-emerald-50">
      <section className="border-b border-emerald-500/15 bg-[#071310] px-3 py-4 sm:px-4 md:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold tracking-[1.5px] text-emerald-300/80 uppercase">
              Admin Support Chat
            </p>
            <h1 className="text-lg font-semibold text-emerald-50 md:text-xl">Conversation</h1>
          </div>

          <Button asChild variant="outline" className="border-emerald-500/30 bg-transparent text-emerald-200 hover:bg-emerald-500/10">
            <Link href="/dashboard/support">
              <ArrowLeftIcon className="h-4 w-4" />
              Back
            </Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-5xl flex-col px-3 py-4 sm:px-4 md:px-8">
        <div
          ref={listRef}
          className="h-[calc(100vh-260px)] space-y-2 overflow-y-auto rounded-xl border border-emerald-500/15 bg-[#07130f]/80 p-3"
        >
          {isLoadingMessages && (
            <div className="rounded-lg border border-emerald-500/15 bg-[#060f0c] px-3 py-4 text-center text-xs text-emerald-100/70">
              Loading conversation messages...
            </div>
          )}

          {!isLoadingMessages && sortedMessages.length === 0 && (
            <div className="rounded-lg border border-emerald-500/15 bg-[#060f0c] px-3 py-4 text-center text-xs text-emerald-100/70">
              No messages yet. Start by sending your first message.
            </div>
          )}

          {!isLoadingMessages &&
            sortedMessages.map((message) => {
              const isAdminMessage = message.sender.role === "ADMIN";

              return (
                <div
                  key={message.id}
                  className={`flex ${isAdminMessage ? "justify-start" : "justify-end"}`}
                >
                  <article
                    className={`max-w-[80%] rounded-xl border px-3 py-2 ${
                      isAdminMessage
                        ? "border-cyan-500/25 bg-cyan-500/10"
                        : "border-emerald-500/25 bg-emerald-500/12"
                    }`}
                  >
                    <p className="text-[11px] font-medium text-emerald-100/80">
                      {isAdminMessage ? "Admin" : "You"}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-emerald-50">{message.text}</p>
                    <p className="mt-1 text-[10px] text-emerald-100/60">{formatTime(message.createdAt)}</p>
                  </article>
                </div>
              );
            })}
        </div>

        <form
          className="mt-3 flex items-center gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            void onSendMessage();
          }}
        >
          <Input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Write your message..."
            className="h-10 border-emerald-500/25 bg-[#07130f] px-3 text-sm text-emerald-50 placeholder:text-emerald-100/45"
          />
          <Button
            type="submit"
            disabled={!draft.trim() || isSending}
            className="h-10 rounded-lg bg-emerald-500 px-4 text-[#03210f] hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSending ? "Sending..." : "Send"}
            {!isSending && <SendIcon className="h-4 w-4" />}
          </Button>
        </form>
      </section>
    </div>
  );
}
