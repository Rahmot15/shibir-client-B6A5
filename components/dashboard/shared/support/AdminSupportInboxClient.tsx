"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquareIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  getAdminSupportConversations,
  type ConversationType,
  type SupportConversationListItem,
} from "@/lib/supportChatService";

function formatConversationType(type: ConversationType) {
  if (type === "VIVA_HELP") return "Viva Help";
  if (type === "EXAM_HELP") return "Exam Help";
  return "General Support";
}

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleString([], {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminSupportInboxClient() {
  const router = useRouter();
  const [conversations, setConversations] = useState<SupportConversationListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshIndex, setRefreshIndex] = useState(0);

  useEffect(() => {
    const loadInbox = async () => {
      try {
        setIsLoading(true);
        const result = await getAdminSupportConversations();

        if (!result.success || !result.data) {
          toast.error(result.message || "Failed to load support inbox");
          return;
        }

        setConversations(result.data);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to load support inbox";
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    void loadInbox();
  }, [refreshIndex]);

  const totalUnread = useMemo(
    () => conversations.reduce((sum, item) => sum + item._count.messages, 0),
    [conversations]
  );

  return (
    <div className="min-h-screen bg-[#050f08] text-emerald-50">
      <section className="border-b border-emerald-500/15 bg-[#071310] px-3 py-5 sm:px-4 md:px-8">
        <div className="mx-auto flex max-w-6xl items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold tracking-[1.5px] text-emerald-300/80 uppercase">
              Admin Support Desk
            </p>
            <h1 className="text-xl font-semibold text-emerald-50 md:text-2xl">Support Inbox</h1>
          </div>

          <div className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-200">
            {totalUnread} unread
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-3 py-4 sm:px-4 md:px-8">
        <div className="space-y-2 rounded-xl border border-emerald-500/15 bg-[#07130f]/80 p-3">
          {isLoading && (
            <div className="rounded-lg border border-emerald-500/15 bg-[#060f0c] px-3 py-4 text-center text-xs text-emerald-100/70">
              Loading support conversations...
            </div>
          )}

          {!isLoading && conversations.length === 0 && (
            <div className="rounded-lg border border-emerald-500/15 bg-[#060f0c] px-3 py-4 text-center text-xs text-emerald-100/70">
              No support conversations found.
            </div>
          )}

          {!isLoading &&
            conversations.map((conversation) => {
              const lastMessage = conversation.messages[0] ?? null;

              return (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => router.push(`/dashboard/support/${conversation.id}`)}
                  className="w-full rounded-lg border border-emerald-500/15 bg-[#06100c] px-3 py-3 text-left transition hover:border-emerald-400/35 hover:bg-emerald-500/10"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-emerald-50">
                        {conversation.user.name || "Unnamed User"}
                      </p>
                      <p className="mt-0.5 text-[11px] text-emerald-100/65">
                        {conversation.user.role} • {formatConversationType(conversation.type)}
                      </p>
                      <p className="mt-2 truncate text-xs text-emerald-100/75">
                        {lastMessage?.text || "No message yet"}
                      </p>
                    </div>

                    <div className="ml-2 text-right">
                      <p className="text-[11px] text-emerald-100/60">
                        {formatDateTime(lastMessage?.createdAt || conversation.updatedAt)}
                      </p>

                      {conversation._count.messages > 0 ? (
                        <span className="mt-2 inline-flex rounded-full border border-amber-500/35 bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-200">
                          {conversation._count.messages} unread
                        </span>
                      ) : (
                        <span className="mt-2 inline-flex rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-200">
                          Seen
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
        </div>

        <div className="mt-4 flex justify-end">
          <Button
            type="button"
            onClick={() => setRefreshIndex((prev) => prev + 1)}
            variant="outline"
            className="border-emerald-500/30 bg-transparent text-emerald-200 hover:bg-emerald-500/10"
          >
            <MessageSquareIcon className="h-4 w-4" />
            Refresh Inbox
          </Button>
        </div>
      </section>
    </div>
  );
}
