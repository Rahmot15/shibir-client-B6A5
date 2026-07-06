"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { CircleHelpIcon, ClipboardListIcon, HeadsetIcon, ChevronRightIcon } from "lucide-react";
import { toast } from "sonner";
import {
  openSupportConversation,
  type ConversationType,
} from "@/lib/supportChatService";

type SupportCategoryItem = {
  index: string;
  title: string;
  subtitle: string;
  meta: string;
  type: ConversationType;
  Icon: React.ComponentType<{ className?: string }>;
  accentBar: string;
  iconClass: string;
  dotClass: string;
};

const SUPPORT_CATEGORIES: SupportCategoryItem[] = [
  {
    index: "01",
    title: "Viva Help",
    subtitle: "Viva, oral exam, schedule, and interview related support.",
    meta: "Replies same day",
    type: "VIVA_HELP",
    Icon: HeadsetIcon,
    accentBar: "bg-violet-400",
    iconClass: "text-violet-300",
    dotClass: "bg-violet-400",
  },
  {
    index: "02",
    title: "Exam Help",
    subtitle: "Exam routine, submission, and result workflow support.",
    meta: "Fast during exam week",
    type: "EXAM_HELP",
    Icon: ClipboardListIcon,
    accentBar: "bg-amber-400",
    iconClass: "text-amber-300",
    dotClass: "bg-amber-400",
  },
  {
    index: "03",
    title: "General Support",
    subtitle: "Dashboard, account, and technical issue assistance.",
    meta: "Handled anytime",
    type: "GENERAL_SUPPORT",
    Icon: CircleHelpIcon,
    accentBar: "bg-cyan-400",
    iconClass: "text-cyan-300",
    dotClass: "bg-cyan-400",
  },
];

export default function UserSupportCategoriesClient() {
  const router = useRouter();
  const [loadingType, setLoadingType] = useState<ConversationType | null>(null);

  const handleOpenConversation = async (type: ConversationType) => {
    try {
      setLoadingType(type);
      const result = await openSupportConversation({ type });

      if (!result.success || !result.data?.id) {
        toast.error(result.message || "Support conversation open failed");
        return;
      }

      startTransition(() => {
        router.push(`/dashboard/support/${result.data?.id}`);
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Support conversation open failed";
      toast.error(message);
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <div className="min-h-screen  text-slate-100">
      <section className="mx-auto max-w-3xl px-3 pb-4 pt-10 sm:px-4 md:px-0">
        <p className="font-mono text-[11px] uppercase tracking-[3px] text-slate-500">
          support / choose a category
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
          What do you need help with?
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500">
          Pick a category below. If you already have an open thread there, we'll take you
          straight back into it.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-3 pb-16 sm:px-4 md:px-0">
        <div className="divide-y divide-white/[0.06] border-y border-white/[0.06]">
          {SUPPORT_CATEGORIES.map((category) => {
            const isLoading = loadingType === category.type;
            const isDisabled = Boolean(loadingType);

            return (
              <button
                key={category.type}
                type="button"
                disabled={isDisabled}
                onClick={() => handleOpenConversation(category.type)}
                className="group relative flex w-full items-center gap-4 py-5 pl-4 pr-2 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span
                  className={`absolute left-0 top-1/2 h-0 w-0.5 -translate-y-1/2 ${category.accentBar} transition-all duration-300 group-hover:h-3/4`}
                />

                <span className="font-mono text-xs text-slate-600">{category.index}</span>

                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.02]">
                  <category.Icon className={`h-4.5 w-4.5 ${category.iconClass}`} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline gap-2">
                    <span className="text-[15px] font-semibold text-white">{category.title}</span>
                  </span>
                  <span className="mt-0.5 block truncate text-[13px] text-slate-500">
                    {category.subtitle}
                  </span>
                </span>

                <span className="hidden shrink-0 items-center gap-1.5 font-mono text-[11px] text-slate-500 sm:flex">
                  <span className={`h-1.5 w-1.5 rounded-full ${category.dotClass}`} />
                  {category.meta}
                </span>

                <span className="ml-2 shrink-0 text-xs font-medium text-slate-400">
                  {isLoading ? (
                    <span className="font-mono text-[11px] text-slate-500">opening...</span>
                  ) : (
                    <ChevronRightIcon className="h-4 w-4 text-slate-600 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-slate-300" />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
