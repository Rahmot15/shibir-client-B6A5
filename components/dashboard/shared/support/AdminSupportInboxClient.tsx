"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCwIcon, SearchIcon, InboxIcon } from "lucide-react";
import { toast } from "sonner";
import {
  getAdminSupportConversations,
  type ConversationType,
  type SupportConversationListItem,
} from "@/lib/supportChatService";

type FilterKey = "ALL" | ConversationType | "UNREAD";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "VIVA_HELP", label: "Viva Help" },
  { key: "EXAM_HELP", label: "Exam Help" },
  { key: "GENERAL_SUPPORT", label: "General" },
  { key: "UNREAD", label: "Unread" },
];

const TYPE_META: Record<ConversationType, { label: string; dot: string; text: string }> = {
  VIVA_HELP: { label: "Viva Help", dot: "bg-violet-400", text: "text-violet-300" },
  EXAM_HELP: { label: "Exam Help", dot: "bg-amber-400", text: "text-amber-300" },
  GENERAL_SUPPORT: { label: "General", dot: "bg-cyan-400", text: "text-cyan-300" },
};

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

function getInitials(name: string | null) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  const initials = parts.slice(0, 2).map((part) => part[0]?.toUpperCase() || "");
  return initials.join("") || "?";
}

export default function AdminSupportInboxClient() {
  const router = useRouter();
  const [conversations, setConversations] = useState<SupportConversationListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshIndex, setRefreshIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState<FilterKey>("ALL");
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredConversations = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return conversations.filter((conversation) => {
      if (activeFilter === "UNREAD" && conversation._count.messages === 0) return false;
      if (
        activeFilter !== "ALL" &&
        activeFilter !== "UNREAD" &&
        conversation.type !== activeFilter
      ) {
        return false;
      }

      if (term && !(conversation.user.name || "").toLowerCase().includes(term)) {
        return false;
      }

      return true;
    });
  }, [conversations, activeFilter, searchTerm]);

  return (
    <div className="min-h-screen text-slate-100">
      <section className="mx-auto max-w-6xl px-3 pb-4 pt-8 sm:px-4 md:px-0">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[3px] text-slate-500">
              admin / support inbox
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white md:text-[1.75rem]">
              Support Inbox
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setRefreshIndex((prev) => prev + 1)}
            className="flex h-8 items-center gap-1.5 rounded-md border border-white/10 px-2.5 font-mono text-[11px] text-slate-400 transition hover:border-white/20 hover:text-white"
          >
            <RefreshCwIcon className="h-3.5 w-3.5" />
            refresh
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-3 pb-16 sm:px-4 md:px-0">
        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {FILTERS.map((filter) => {
              const isActive = activeFilter === filter.key;
              return (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => setActiveFilter(filter.key)}
                  className={`rounded-md px-2.5 py-1 font-mono text-[11px] transition ${
                    isActive
                      ? "bg-white/[0.08] text-white"
                      : "text-slate-500 hover:bg-white/[0.03] hover:text-slate-300"
                  }`}
                >
                  {filter.label}
                  {filter.key === "UNREAD" && totalUnread > 0 ? ` (${totalUnread})` : ""}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.02] px-2.5 py-1.5">
            <SearchIcon className="h-3.5 w-3.5 text-slate-600" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by name"
              className="w-36 bg-transparent text-xs text-slate-200 outline-none placeholder:text-slate-600 sm:w-48"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <div className="min-w-[720px]">
            <div className="grid grid-cols-[1.6fr_1fr_2fr_0.9fr_0.7fr] gap-3 border-b border-white/[0.06] px-1 py-2 font-mono text-[10px] uppercase tracking-wider text-slate-600">
              <span>User</span>
              <span>Category</span>
              <span>Last message</span>
              <span>Updated</span>
              <span className="text-right">Status</span>
            </div>

            {isLoading && (
              <div className="space-y-3 py-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="grid w-full grid-cols-[1.6fr_1fr_2fr_0.9fr_0.7fr] items-center gap-3 border-b border-white/[0.04] px-1 py-3"
                  >
                    <span className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-full bg-white/[0.04] animate-pulse" />
                      <div className="space-y-1">
                        <div className="h-3 w-24 rounded bg-white/[0.04] animate-pulse" />
                        <div className="h-2.5 w-12 rounded bg-white/[0.04] animate-pulse" />
                      </div>
                    </span>
                    <div className="h-3 w-16 rounded bg-white/[0.04] animate-pulse" />
                    <div className="h-3.5 w-48 rounded bg-white/[0.04] animate-pulse" />
                    <div className="h-3 w-16 rounded bg-white/[0.04] animate-pulse" />
                    <div className="flex justify-end">
                      <div className="h-4 w-8 rounded-full bg-white/[0.04] animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!isLoading && filteredConversations.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.03] text-slate-500 ring-1 ring-white/10">
                  <InboxIcon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-white">No Conversations Found</h3>
                <p className="mt-2 max-w-xs text-xs leading-relaxed text-slate-500">
                  {searchTerm.trim()
                    ? `No conversations match "${searchTerm.trim()}" for the selected filter.`
                    : "There are currently no active support conversations in this category."}
                </p>
              </div>
            )}

            {!isLoading &&
              filteredConversations.map((conversation) => {
                const lastMessage = conversation.messages[0] ?? null;
                const meta = TYPE_META[conversation.type];
                const hasUnread = conversation._count.messages > 0;

                return (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() => router.push(`/dashboard/support/${conversation.id}`)}
                    className="grid w-full grid-cols-[1.6fr_1fr_2fr_0.9fr_0.7fr] items-center gap-3 border-b border-white/[0.04] px-1 py-3 text-left transition hover:bg-white/[0.03]"
                  >
                    <span className="flex min-w-0 items-center gap-2.5">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-[10px] font-semibold text-slate-300">
                        {getInitials(conversation.user.name)}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[13px] font-medium text-white">
                          {conversation.user.name || "Unnamed User"}
                        </span>
                        <span className="block truncate font-mono text-[10px] text-slate-600">
                          {conversation.user.role}
                        </span>
                      </span>
                    </span>

                    <span className={`flex items-center gap-1.5 text-[12px] ${meta.text}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                      {meta.label}
                    </span>

                    <span className="truncate text-[13px] text-slate-400">
                      {lastMessage?.text || "No message yet"}
                    </span>

                    <span className="font-mono text-[11px] text-slate-600">
                      {formatDateTime(lastMessage?.createdAt || conversation.updatedAt)}
                    </span>

                    <span className="flex justify-end">
                      {hasUnread ? (
                        <span className="inline-flex min-w-[22px] items-center justify-center rounded-full bg-amber-400 px-1.5 py-0.5 font-mono text-[10px] font-bold text-[#150e02]">
                          {conversation._count.messages}
                        </span>
                      ) : (
                        <span className="font-mono text-[10px] text-slate-700">seen</span>
                      )}
                    </span>
                  </button>
                );
              })}
          </div>
        </div>
      </section>
    </div>
  );
}
