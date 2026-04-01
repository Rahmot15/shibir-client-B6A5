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
const SYLLABUS_STORAGE_KEY = "syllabus_p rogress";

function toBnDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";

  return d.toLocaleDateString("bn-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
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
        try {
          fetchedNotes = await noteService.getAllNotes();
        } catch {
          fetchedNotes = [];
        }

        const historyRows = historyRes.success && historyRes.data ? historyRes.data : [];
        let detail: WorkerReportDetails | null = null;

        if (historyRows.length > 0) {
          const latestRes = await getMyWorkerReportById(historyRows[0].id);
          if (latestRes.success && latestRes.data) {
            detail = latestRes.data;
          }
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

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SYLLABUS_STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return;

      const unique = new Set(parsed.filter((v) => typeof v === "number"));
      setSyllabusDone(unique.size);
    } catch {
      setSyllabusDone(0);
    }
  }, []);

  const onTimeRate = useMemo(() => {
    if (history.length === 0) return 0;
    const onTime = history.filter((row) => isOnTime(row.month, row.submittedAt)).length;
    return Math.round((onTime / history.length) * 100);
  }, [history]);

  const thisWeekNotes = useMemo(() => {
    const threshold = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return notes.filter((note) => new Date(note.createdAt).getTime() >= threshold).length;
  }, [notes]);

  const totalWords = useMemo(() => notes.reduce((sum, note) => sum + countWords(note), 0), [notes]);

  const reportEntries = latestReport?.numericEntries.length ?? 0;
  const quranTotal = (latestReport?.numericEntries ?? [])
    .filter((m) => m.metric === "QURAN_AYAH")
    .reduce((sum, cur) => sum + numFrom(cur.value), 0);
  const hadithTotal = (latestReport?.numericEntries ?? [])
    .filter((m) => m.metric === "HADITH_COUNT")
    .reduce((sum, cur) => sum + numFrom(cur.value), 0);

  const syllabusProgress = Math.round((syllabusDone / SYLLABUS_MODULE_TOTAL) * 100);

  return (
    <div className="min-h-screen bg-[#050f08] text-emerald-50">
      <section className="relative overflow-hidden border-b border-emerald-500/15 bg-[#071310] px-4 py-6 md:px-8 md:py-7">
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[1.2px] text-emerald-300">
                <ShieldCheckIcon className="h-3.5 w-3.5" />
                Member Overview
              </p>
              <h1 className="text-xl font-bold tracking-tight text-emerald-50 sm:text-2xl md:text-3xl">
                {me?.name || "সদস্য"} Command Snapshot
              </h1>
              <p className="mt-2 max-w-2xl text-xs text-emerald-100/70 sm:text-sm">
                রিপোর্ট, নোট, সিলেবাস এবং আপনার Member role readiness এক স্ক্রিনে দেখুন।
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:min-w-md lg:grid-cols-4">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/8 p-2.5 sm:p-3">
                <p className="text-[11px] text-emerald-200/70">রিপোর্ট</p>
                <p className="mt-1 text-lg font-bold text-emerald-200 sm:text-xl">{loading ? "..." : history.length}</p>
              </div>
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/8 p-2.5 sm:p-3">
                <p className="text-[11px] text-blue-200/70">নোট</p>
                <p className="mt-1 text-lg font-bold text-blue-200 sm:text-xl">{loading ? "..." : notes.length}</p>
              </div>
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/8 p-2.5 sm:p-3">
                <p className="text-[11px] text-amber-200/70">সিলেবাস</p>
                <p className="mt-1 text-lg font-bold text-amber-200 sm:text-xl">{syllabusProgress}%</p>
              </div>
              <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/8 p-2.5 sm:p-3">
                <p className="text-[11px] text-cyan-200/70">On-Time</p>
                <p className="mt-1 text-lg font-bold text-cyan-200 sm:text-xl">{loading ? "..." : `${onTimeRate}%`}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-2 py-4 sm:px-4 sm:py-6 md:px-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          <div className="rounded-2xl border border-emerald-500/15 bg-[#07130f]/80 p-3 backdrop-blur-md sm:p-4 md:p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-emerald-100 sm:text-base">Quick Sections</h2>
              <SparklesIcon className="h-4 w-4 text-emerald-300/70" />
            </div>

            <div className="grid gap-2.5 sm:grid-cols-3">
              <Link
                href="/reports"
                className="group rounded-xl border border-blue-500/20 bg-[#081610] p-3 transition hover:border-blue-400/35 hover:bg-blue-500/12"
              >
                <FileTextIcon className="h-4 w-4 text-blue-300" />
                <p className="mt-2 text-sm font-semibold text-emerald-100">Report Overview</p>
                <p className="mt-1 text-xs text-emerald-200/60">{loading ? "Loading..." : `${history.length} submitted report`}</p>
              </Link>

              <Link
                href="/dashboard/note"
                className="group rounded-xl border border-emerald-500/20 bg-[#081610] p-3 transition hover:border-emerald-400/35 hover:bg-emerald-500/12"
              >
                <NotebookPenIcon className="h-4 w-4 text-emerald-300" />
                <p className="mt-2 text-sm font-semibold text-emerald-100">Note Overview</p>
                <p className="mt-1 text-xs text-emerald-200/60">{loading ? "Loading..." : `${notes.length} total note`}</p>
              </Link>

              <Link
                href="/dashboard/syllabus"
                className="group rounded-xl border border-amber-500/20 bg-[#081610] p-3 transition hover:border-amber-400/35 hover:bg-amber-500/12"
              >
                <BookOpenIcon className="h-4 w-4 text-amber-300" />
                <p className="mt-2 text-sm font-semibold text-emerald-100">Syllabus Overview</p>
                <p className="mt-1 text-xs text-emerald-200/60">{syllabusDone}/{SYLLABUS_MODULE_TOTAL} complete</p>
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-500/15 bg-[#07130f]/80 p-3 backdrop-blur-md sm:p-4 md:p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-emerald-100 sm:text-base">Member Report Pulse</h2>
              <Link href="/reports" className="inline-flex items-center gap-1 text-xs text-blue-300/75 hover:text-blue-300">
                Open Report
                <ArrowRightIcon className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              <article className="rounded-xl border border-blue-500/20 bg-blue-500/8 p-3">
                <p className="text-[11px] text-blue-200/75">মোট সাবমিট</p>
                <p className="mt-1 text-xl font-bold text-blue-100">{loading ? "..." : history.length}</p>
              </article>
              <article className="rounded-xl border border-cyan-500/20 bg-cyan-500/8 p-3">
                <p className="text-[11px] text-cyan-200/75">On-Time Rate</p>
                <p className="mt-1 text-xl font-bold text-cyan-100">{loading ? "..." : `${onTimeRate}%`}</p>
              </article>
              <article className="rounded-xl border border-emerald-500/20 bg-emerald-500/8 p-3">
                <p className="text-[11px] text-emerald-200/75">কুরআন আয়াত</p>
                <p className="mt-1 text-xl font-bold text-emerald-100">{loading ? "..." : quranTotal}</p>
              </article>
              <article className="rounded-xl border border-amber-500/20 bg-amber-500/8 p-3">
                <p className="text-[11px] text-amber-200/75">হাদিস</p>
                <p className="mt-1 text-xl font-bold text-amber-100">{loading ? "..." : hadithTotal}</p>
              </article>
            </div>

            <div className="mt-3 flex items-center gap-2 rounded-xl border border-white/8 bg-white/3 px-3 py-2.5">
              <CalendarClockIcon className="h-3.5 w-3.5 text-amber-300" />
              <span className="text-[11px] text-white/50">
                সর্বশেষ সাবমিশন: {history[0] ? toBnDate(history[0].submittedAt) : "এখনও জমা হয়নি"}
              </span>
            </div>

            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-blue-500/15">
              <div className="h-full rounded-full bg-linear-to-r from-blue-400 to-cyan-300" style={{ width: `${onTimeRate}%` }} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-emerald-500/15 bg-[#07130f]/80 p-3 backdrop-blur-md sm:p-4 md:p-5">
            <h2 className="text-sm font-semibold text-emerald-100 sm:text-base">Note Overview</h2>
            <p className="mt-1 text-xs text-emerald-200/60">Personal learning notes snapshot.</p>

            <div className="mt-3 space-y-2.5">
              <div className="rounded-lg border border-emerald-500/15 bg-[#06100c] p-2.5">
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-medium text-emerald-100">This Week Added</span>
                  <span className="text-emerald-300/80">{loading ? "..." : thisWeekNotes}</span>
                </div>
              </div>
              <div className="rounded-lg border border-blue-500/15 bg-[#06100c] p-2.5">
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-medium text-emerald-100">Approx. Total Words</span>
                  <span className="text-blue-300/80">{loading ? "..." : totalWords}</span>
                </div>
              </div>
              <div className="rounded-lg border border-amber-500/15 bg-[#06100c] p-2.5">
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-medium text-emerald-100">Latest Report Entries</span>
                  <span className="text-amber-300/80">{loading ? "..." : reportEntries}</span>
                </div>
              </div>
            </div>

            <div className="mt-3">
              <Link
                href="/dashboard/note"
                className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 text-sm font-semibold text-[#03210f] transition hover:bg-emerald-400"
              >
                Open Notes
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-500/15 bg-[#07130f]/80 p-3 backdrop-blur-md sm:p-4 md:p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-emerald-100 sm:text-base">Syllabus & Role Readiness</h2>
              <TargetIcon className="h-4 w-4 text-amber-300" />
            </div>

            <div className="mt-3 rounded-lg border border-amber-500/20 bg-amber-500/8 p-3">
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-amber-100/80">Syllabus Progress</span>
                <span className="font-semibold text-amber-200">{syllabusProgress}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-amber-500/20">
                <div className="h-full rounded-full bg-linear-to-r from-amber-300 to-emerald-300" style={{ width: `${syllabusProgress}%` }} />
              </div>
              <p className="mt-1 text-[11px] text-amber-100/70">
                সম্পন্ন: {syllabusDone} / {SYLLABUS_MODULE_TOTAL} modules
              </p>
            </div>

            <div className="mt-3 space-y-1.5 text-xs text-emerald-200/70">
              <div className="rounded-lg border border-emerald-500/15 bg-[#06100c] px-3 py-2">Role: {me?.role || "MEMBER"}</div>
              <div className="rounded-lg border border-emerald-500/15 bg-[#06100c] px-3 py-2">Focus: রিপোর্ট + স্টাডি consistency + নোট refinement</div>
              <div className="rounded-lg border border-emerald-500/15 bg-[#06100c] px-3 py-2">Target: নিয়মিত রিপোর্ট submit এবং syllabus completion</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
