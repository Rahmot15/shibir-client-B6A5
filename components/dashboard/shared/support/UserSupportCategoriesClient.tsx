"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { CircleHelpIcon, ClipboardListIcon, HeadsetIcon, ArrowRightIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  openSupportConversation,
  type ConversationType,
} from "@/lib/supportChatService";

type SupportCategoryItem = {
  title: string;
  subtitle: string;
  type: ConversationType;
  Icon: React.ComponentType<{ className?: string }>;
  iconToneClass: string;
  borderToneClass: string;
  bgToneClass: string;
};

const SUPPORT_CATEGORIES: SupportCategoryItem[] = [
  {
    title: "Viva Help",
    subtitle: "Viva, oral exam, schedule, and interview related support.",
    type: "VIVA_HELP",
    Icon: HeadsetIcon,
    iconToneClass: "text-cyan-300",
    borderToneClass: "border-cyan-500/30",
    bgToneClass: "bg-cyan-500/10",
  },
  {
    title: "Exam Help",
    subtitle: "Exam routine, submission, and result workflow support.",
    type: "EXAM_HELP",
    Icon: ClipboardListIcon,
    iconToneClass: "text-amber-300",
    borderToneClass: "border-amber-500/30",
    bgToneClass: "bg-amber-500/10",
  },
  {
    title: "General Support",
    subtitle: "Dashboard, account, and technical issue assistance.",
    type: "GENERAL_SUPPORT",
    Icon: CircleHelpIcon,
    iconToneClass: "text-emerald-300",
    borderToneClass: "border-emerald-500/30",
    bgToneClass: "bg-emerald-500/10",
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
    <div className="min-h-screen bg-[#050f08] text-emerald-50">
      <section className="relative overflow-hidden border-b border-emerald-500/15 bg-[#071310] px-3 py-6 sm:px-4 md:px-8 md:py-8">
        <div className="pointer-events-none absolute -left-24 bottom-0 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl">
          <h1 className="text-2xl font-bold tracking-tight text-emerald-50 md:text-3xl">
            Admin Support Desk
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-emerald-100/70">
            Select a support category. We will open your existing conversation if available,
            otherwise create a new one.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-3 py-6 sm:px-4 md:grid-cols-2 md:px-8 lg:grid-cols-3">
        {SUPPORT_CATEGORIES.map((category) => {
          const isLoading = loadingType === category.type;

          return (
            <article
              key={category.type}
              className={`rounded-2xl border ${category.borderToneClass} ${category.bgToneClass} p-4 backdrop-blur-md`}
            >
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-[#050f08]/70">
                <category.Icon className={`h-5 w-5 ${category.iconToneClass}`} />
              </div>

              <h2 className="text-lg font-semibold text-emerald-50">{category.title}</h2>
              <p className="mt-2 min-h-12 text-xs text-emerald-100/70">{category.subtitle}</p>

              <Button
                type="button"
                onClick={() => handleOpenConversation(category.type)}
                disabled={Boolean(loadingType)}
                className="mt-4 h-9 w-full rounded-lg bg-emerald-500 text-[#03210f] hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Opening..." : "Open Support Chat"}
                {!isLoading && <ArrowRightIcon className="ml-1 h-4 w-4" />}
              </Button>
            </article>
          );
        })}
      </section>
    </div>
  );
}
