"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRightIcon,
  BookOpenIcon,
  CalendarClockIcon,
  FileTextIcon,
  NotebookPenIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TargetIcon,
  TrendingUpIcon,
  BookMarkedIcon,
  LayersIcon,
} from "lucide-react";

import { getMe, type UserData } from "@/lib/authService";
import { noteService, type Note } from "@/lib/noteService";
import {
  getMyWorkerReportById,
  getMyWorkerReportHistory,
  type WorkerReportDetails,
  type WorkerReportHistoryItem,
} from "@/lib/workerReportService";

const SYLLABUS_MODULE_TOTAL = 23;
const SYLLABUS_STORAGE_KEY = "syllabus_progress";

/* ─── utils ──────────────────────────────────────────────────── */

function toBnDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" });
}

function numFrom(value: string | number) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function isOnTime(monthIso: string, submittedAtIso: string) {
  const monthDate = new Date(monthIso);
  const submitted = new Date(submittedAtIso);
  if (Number.isNaN(monthDate.getTime()) || Number.isNaN(submitted.getTime())) return false;
  const due = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0, 23, 59, 59, 999);
  return submitted.getTime() <= due.getTime();
}

function countWords(note: Note) {
  const raw = JSON.stringify(note.content);
  const text = raw.replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();
  if (!text) return 0;
  return text.split(" ").length;
}

/* ─── atoms ──────────────────────────────────────────────────── */

function Divider({
  label,
  icon: Icon,
  color = "emerald",
}: {
  label: string;
  icon: React.ElementType;
  color?: "emerald" | "blue" | "amber" | "cyan";
}) {
  const cls = {
    emerald: { line: "bg-emerald-500/20", text: "text-emerald-400", icon: "text-emerald-400" },
    blue: { line: "bg-blue-500/20", text: "text-blue-400", icon: "text-blue-400" },
    amber: { line: "bg-amber-500/20", text: "text-amber-400", icon: "text-amber-400" },
    cyan: { line: "bg-cyan-500/20", text: "text-cyan-400", icon: "text-cyan-400" },
  }[color];

  return (
    <div className="flex items-center gap-3">
      <div className={`h-px flex-1 ${cls.line}`} />
      <div className="flex items-center gap-1.5">
        <Icon className={`h-3 w-3 ${cls.icon}`} strokeWidth={2} />
        <span className={`text-[10px] font-bold uppercase tracking-[2px] ${cls.text}`}>{label}</span>
      </div>
      <div className={`h-px flex-1 ${cls.line}`} />
    </div>
  );
}

function StatRow({
  label,
  value,
  sub,
  color = "emerald",
}: {
  label: string;
  value: React.ReactNode;
  sub?: string;
  color?: "emerald" | "blue" | "amber" | "cyan";
}) {
  const numCls = {
    emerald: "text-emerald-400",
    blue: "text-blue-400",
    amber: "text-amber-400",
    cyan: "text-cyan-400",
  }[color];

  return (
    <div className="flex items-center justify-between border-b border-white/[0.04] py-3 last:border-0 last:pb-0 first:pt-0">
      <div>
        <p className="text-[13px] text-white/65">{label}</p>
        {sub && <p className="mt-0.5 text-[10px] text-white/25">{sub}</p>}
      </div>
      <span className={`font-mono text-[15px] font-black tabular-nums ${numCls}`}>{value}</span>
    </div>
  );
}

function BarMeter({ pct, color = "emerald" }: { pct: number; color?: string }) {
  const grad: Record<string, string> = {
    emerald: "from-emerald-500 to-emerald-300",
    blue: "from-blue-400 to-cyan-300",
    amber: "from-amber-400 to-emerald-300",
  };
  return (
    <div className="h-1 overflow-hidden rounded-full bg-white/[0.06]">
      <div
        className={`h-full rounded-full bg-gradient-to-r transition-all duration-500 ${grad[color] ?? grad.emerald}`}
        style={{ width: `${Math.min(pct, 100)}%` }}
      />
    </div>
  );
}

function QuickLink({
  href,
  icon: Icon,
  label,
  sub,
  color,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  sub: string;
  color: "emerald" | "blue" | "amber";
}) {
  const border = {
    emerald: "border-emerald-500/20 hover:border-emerald-400/35 hover:bg-emerald-500/8",
    blue: "border-blue-500/20 hover:border-blue-400/35 hover:bg-blue-500/8",
    amber: "border-amber-500/20 hover:border-amber-400/35 hover:bg-amber-500/8",
  }[color];
  const iconCls = {
    emerald: "text-emerald-400",
    blue: "text-blue-400",
    amber: "text-amber-400",
  }[color];

  return (
    <Link
      href={href}
      className={`group flex items-center gap-3 rounded-xl border bg-white/[0.02] px-4 py-3.5 transition-colors ${border}`}
    >
      <div className={`shrink-0 ${iconCls}`}>
        <Icon className="h-4 w-4" strokeWidth={1.8} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-white/80">{label}</p>
        <p className="mt-0.5 text-[11px] text-white/28">{sub}</p>
      </div>
      <ArrowRightIcon className="h-3.5 w-3.5 shrink-0 text-white/15 transition-transform group-hover:translate-x-0.5 group-hover:text-white/35" />
    </Link>
  );
}

/* ─── page ───────────────────────────────────────────────────── */

export function MemberOverviewContent() {
  const [me, setMe] = useState<UserData | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [history, setHistory] = useState<WorkerReportHistoryItem[]>([]);
  const [latestReport, setLatestReport] = useState<WorkerReportDetails | null>(null);
  const [syllabusDone, setSyllabusDone] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const [meRes, historyRes] = await Promise.all([getMe(), getMyWorkerReportHistory()]);

        let fetchedNotes: Note[] = [];
        try { fetchedNotes = await noteService.getAllNotes(); } catch { fetchedNotes = []; }

        const historyRows = historyRes.success && historyRes.data ? historyRes.data : [];
        let detail: WorkerReportDetails | null = null;
        if (historyRows.length > 0) {
          const latestRes = await getMyWorkerReportById(historyRows[0].id);
          if (latestRes.success && latestRes.data) detail = latestRes.data;
        }

        if (!mounted) return;
        setMe(meRes.success && meRes.data ? meRes.data : null);
        setNotes(fetchedNotes);
        setHistory(historyRows);
        setLatestReport(detail);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    void load();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SYLLABUS_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return;
      setSyllabusDone(new Set(parsed.filter((v) => typeof v === "number")).size);
    } catch { setSyllabusDone(0); }
  }, []);

  const onTimeRate = useMemo(() => {
    if (history.length === 0) return 0;
    const onTime = history.filter((row) => isOnTime(row.month, row.submittedAt)).length;
    return Math.round((onTime / history.length) * 100);
  }, [history]);

  const thisWeekNotes = useMemo(() => {
    const threshold = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return notes.filter((n) => new Date(n.createdAt).getTime() >= threshold).length;
  }, [notes]);

  const totalWords = useMemo(() => notes.reduce((sum, n) => sum + countWords(n), 0), [notes]);

  const reportEntries = latestReport?.numericEntries.length ?? 0;
  const quranTotal = (latestReport?.numericEntries ?? []).filter((m) => m.metric === "QURAN_AYAH").reduce((s, c) => s + numFrom(c.value), 0);
  const hadithTotal = (latestReport?.numericEntries ?? []).filter((m) => m.metric === "HADITH_COUNT").reduce((s, c) => s + numFrom(c.value), 0);
  const syllabusProgress = Math.round((syllabusDone / SYLLABUS_MODULE_TOTAL) * 100);
  const val = (v: React.ReactNode) => (loading ? <span className="opacity-30">—</span> : v);

  return (
    <div className="min-h-screen bg-[#060e09] text-emerald-50">

      <div className="relative mx-auto max-w-4xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">

        {/* ── Hero ── */}
        <header className="mb-10">
          <div className="mb-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-emerald-500/20" />
            <div className="flex items-center gap-1.5">
              <ShieldCheckIcon className="h-3 w-3 text-emerald-500/45" strokeWidth={2} />
              <span className="font-mono text-[10px] font-bold uppercase tracking-[3px] text-emerald-500/45">
                Member Overview
              </span>
            </div>
            <div className="h-px flex-1 bg-emerald-500/20" />
          </div>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-[28px] font-black leading-none tracking-tight text-white sm:text-[38px]">
                {me?.name || "সদস্য"}
                <span className="ml-2 text-emerald-400 sm:ml-3">Snapshot</span>
              </h1>
              <p className="mt-2.5 max-w-xs text-[12px] leading-relaxed text-white/35 sm:text-[13px]">
                রিপোর্ট, নোট, সিলেবাস এবং role readiness এক স্ক্রিনে।
              </p>
            </div>

            {/* 4 stat chips — 2×2 on mobile, 4-col on sm */}
            <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-4">
              {[
                { n: val(history.length), l: "রিপোর্ট", c: "text-emerald-400" },
                { n: val(notes.length), l: "নোট", c: "text-blue-400" },
                { n: `${syllabusProgress}%`, l: "সিলেবাস", c: "text-amber-400" },
                { n: val(`${onTimeRate}%`), l: "On-Time", c: "text-cyan-400" },
              ].map((s) => (
                <div key={s.l} className="flex flex-col items-center rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 sm:rounded-none sm:border-0 sm:bg-transparent sm:px-0">
                  <span className={`font-mono text-[22px] font-black leading-none sm:text-[26px] ${s.c}`}>
                    {s.n}
                  </span>
                  <span className="mt-1 text-[9px] text-white/28">{s.l}</span>
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* ── content ── */}
        <div className="space-y-10">

          {/* ─ Quick Links ─ */}
          <section>
            <Divider label="Quick Sections" icon={SparklesIcon} color="emerald" />
            <div className="mt-5 flex flex-col gap-2">
              <QuickLink
                href="/report"
                icon={FileTextIcon}
                label="Report Overview"
                sub={loading ? "লোড হচ্ছে..." : `${history.length}টি রিপোর্ট জমা দেওয়া হয়েছে`}
                color="blue"
              />
              <QuickLink
                href="/dashboard/note"
                icon={NotebookPenIcon}
                label="Note Overview"
                sub={loading ? "লোড হচ্ছে..." : `${notes.length}টি নোট · এই সপ্তাহে ${thisWeekNotes}টি`}
                color="emerald"
              />
              <QuickLink
                href="/dashboard/syllabus"
                icon={BookOpenIcon}
                label="Syllabus Overview"
                sub={`${syllabusDone}/${SYLLABUS_MODULE_TOTAL} মডিউল সম্পন্ন`}
                color="amber"
              />
            </div>
          </section>

          {/* ─ Report Pulse ─ */}
          <section>
            <div className="flex items-center justify-between">
              <Divider label="Report Pulse" icon={TrendingUpIcon} color="blue" />
              <Link
                href="/report"
                className="ml-4 shrink-0 flex items-center gap-1 text-[11px] text-blue-400/60 transition-colors hover:text-blue-400"
              >
                সব দেখুন
                <ArrowRightIcon className="h-3 w-3" />
              </Link>
            </div>

            <div className="mt-5 space-y-0">
              <StatRow label="মোট সাবমিট" value={val(history.length)} sub="মোট রিপোর্ট" color="blue" />
              <StatRow label="On-Time Rate" value={val(`${onTimeRate}%`)} sub="সময়মতো জমার হার" color="cyan" />
              <StatRow label="কুরআন আয়াত" value={val(quranTotal)} sub="সর্বশেষ রিপোর্ট থেকে" color="emerald" />
              <StatRow label="হাদিস" value={val(hadithTotal)} sub="সর্বশেষ রিপোর্ট থেকে" color="amber" />
            </div>

            {/* on-time bar */}
            <div className="mt-4">
              <div className="mb-1.5 flex justify-between">
                <span className="text-[10px] text-white/22">On-Time Submission</span>
                <span className="font-mono text-[10px] text-blue-400/50">{val(`${onTimeRate}%`)}</span>
              </div>
              <BarMeter pct={onTimeRate} color="blue" />
            </div>

            <div className="mt-3 flex items-center gap-2">
              <CalendarClockIcon className="h-3 w-3 shrink-0 text-amber-400/50" strokeWidth={2} />
              <span className="text-[11px] text-white/28">
                সর্বশেষ: {history[0] ? toBnDate(history[0].submittedAt) : "এখনও জমা হয়নি"}
              </span>
            </div>
          </section>

          {/* ─ Note + Syllabus (side by side on md+) ─ */}
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">

            {/* Notes */}
            <section>
              <Divider label="Note Overview" icon={NotebookPenIcon} color="emerald" />
              <div className="mt-5 space-y-0">
                <StatRow label="এই সপ্তাহে যোগ" value={val(thisWeekNotes)} sub="গত ৭ দিন" color="emerald" />
                <StatRow label="আনুমানিক শব্দ" value={val(totalWords.toLocaleString("bn-BD"))} sub="সব নোটে মোট" color="blue" />
                <StatRow label="সর্বশেষ রিপোর্ট এন্ট্রি" value={val(reportEntries)} sub="latest report" color="amber" />
              </div>
              <div className="mt-4">
                <Link
                  href="/dashboard/note"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 py-2.5 text-[13px] font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/18"
                >
                  নোট খুলুন
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>
            </section>

            {/* Syllabus */}
            <section>
              <Divider label="Syllabus & Readiness" icon={TargetIcon} color="amber" />
              <div className="mt-5">
                <div className="mb-1.5 flex justify-between">
                  <span className="text-[10px] text-white/22">Syllabus Progress</span>
                  <span className="font-mono text-[10px] text-amber-400/50">{syllabusProgress}%</span>
                </div>
                <BarMeter pct={syllabusProgress} color="amber" />

                <div className="mt-4 space-y-0">
                  <StatRow label="সম্পন্ন মডিউল" value={`${syllabusDone}/${SYLLABUS_MODULE_TOTAL}`} sub="মোট মডিউল" color="amber" />
                  <StatRow label="Role" value={me?.role ?? "MEMBER"} color="emerald" />
                </div>

                <div className="mt-4 space-y-1.5">
                  {[
                    "রিপোর্ট + স্টাডি consistency",
                    "নোট refinement",
                    "নিয়মিত সিলেবাস completion",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <LayersIcon className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500/40" strokeWidth={2} />
                      <p className="text-[11px] text-white/35">{item}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <Link
                    href="/dashboard/syllabus"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/8 py-2.5 text-[13px] font-semibold text-amber-300 transition-colors hover:bg-amber-500/15"
                  >
                    সিলেবাস দেখুন
                    <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </section>

          </div>
        </div>

        {/* footer */}
        <div className="mt-14 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/[0.05]" />
          <span className="font-mono text-[9px] uppercase tracking-[3px] text-white/14">সদস্য · Member</span>
          <div className="h-px flex-1 bg-white/[0.05]" />
        </div>

      </div>
    </div>
  );
}
