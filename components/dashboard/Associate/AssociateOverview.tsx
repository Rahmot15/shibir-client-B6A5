"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
   ActivityIcon,
   ArrowRightIcon,
   BookOpenIcon,
   CalendarClockIcon,
   CheckCircle2Icon,
   ChevronRightIcon,
   ClipboardListIcon,
   FileTextIcon,
   NotebookPenIcon,
   TargetIcon,
} from "lucide-react"
import { getMe, type UserData } from "@/lib/authService"
import { noteService, type Note } from "@/lib/noteService"
import {
   getMyWorkerReportById,
   getMyWorkerReportHistory,
   type WorkerReportDetails,
   type WorkerReportHistoryItem,
} from "@/lib/workerReportService"

type PlanSnapshot = Record<string, unknown>

function numFrom(value: string | number) {
   const n = Number(value)
   return Number.isFinite(n) ? n : 0
}

function averageMetric(report: WorkerReportDetails | null, metric: string) {
   if (!report) return null
   const values = report.numericEntries.filter((m) => m.metric === metric).map((m) => numFrom(m.value))
   if (values.length === 0) return null
   const avg = values.reduce((sum, cur) => sum + cur, 0) / values.length
   return avg
}

function sumMetric(report: WorkerReportDetails | null, metric: string) {
   if (!report) return 0
   return report.numericEntries
      .filter((m) => m.metric === metric)
      .reduce((sum, cur) => sum + numFrom(cur.value), 0)
}

function countChecked(report: WorkerReportDetails | null, metric: string) {
   if (!report) return 0
   return report.checkboxEntries.filter((m) => m.metric === metric && m.checked).length
}

function isOnTime(monthIso: string, submittedAtIso: string) {
   const monthDate = new Date(monthIso)
   const submitted = new Date(submittedAtIso)
   if (Number.isNaN(monthDate.getTime()) || Number.isNaN(submitted.getTime())) return false
   const due = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0, 23, 59, 59, 999)
   return submitted.getTime() <= due.getTime()
}

function toBnDate(value: string) {
   const d = new Date(value)
   if (Number.isNaN(d.getTime())) return "-"
   return d.toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
   })
}

function toRelativeBn(value: string) {
   const d = new Date(value)
   if (Number.isNaN(d.getTime())) return "সময় অজানা"
   const diffMs = Date.now() - d.getTime()
   const diffMin = Math.floor(diffMs / (1000 * 60))
   if (diffMin < 60) return `${diffMin} মিনিট আগে`
   const diffHour = Math.floor(diffMin / 60)
   if (diffHour < 24) return `${diffHour} ঘণ্টা আগে`
   const diffDay = Math.floor(diffHour / 24)
   if (diffDay === 1) return "গতকাল"
   return `${diffDay} দিন আগে`
}

function extractText(content: unknown): string {
   if (!content || typeof content !== "object") return ""
   const node = content as { text?: string; content?: unknown[] }
   let out = typeof node.text === "string" ? node.text : ""
   if (Array.isArray(node.content)) {
      for (const child of node.content) {
         out += ` ${extractText(child)}`
      }
   }
   return out.trim()
}

function notePreview(note: Note) {
   const text = extractText(note.content)
   if (!text) return "কোনো কন্টেন্ট নেই"
   return text.length > 95 ? `${text.slice(0, 95)}...` : text
}

function snapshotValue(snapshot: PlanSnapshot | null, key: string) {
   if (!snapshot) return ""
   const value = snapshot[key]
   return typeof value === "string" ? value.trim() : ""
}

function toNumber(value: string) {
   const n = Number(value)
   return Number.isFinite(n) ? n : 0
}

function nextReportDeadlineLabel() {
   const now = new Date()
   const deadline = new Date(now.getFullYear(), now.getMonth() + 1, 0)
   return deadline.toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
   })
}

function PillStat({ label, value }: { label: string; value: string }) {
   return (
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/8 px-3 py-2">
         <div className="font-mono text-[16px] font-bold text-emerald-300">{value}</div>
         <div className="text-[11px] text-emerald-100/65">{label}</div>
      </div>
   )
}

export function AssociateOverviewContent() {
   const [me, setMe] = useState<UserData | null>(null)
   const [notes, setNotes] = useState<Note[]>([])
   const [history, setHistory] = useState<WorkerReportHistoryItem[]>([])
   const [latestReport, setLatestReport] = useState<WorkerReportDetails | null>(null)
   const [loading, setLoading] = useState(true)

   useEffect(() => {
      let mounted = true

      const load = async () => {
         setLoading(true)
         try {
            const [meRes, historyRes] = await Promise.all([getMe(), getMyWorkerReportHistory()])

            let fetchedNotes: Note[] = []
            try {
               fetchedNotes = await noteService.getAllNotes()
            } catch {
               fetchedNotes = []
            }

            const historyRows = historyRes.success && historyRes.data ? historyRes.data : []
            let detail: WorkerReportDetails | null = null

            if (historyRows.length > 0) {
               const reportRes = await getMyWorkerReportById(historyRows[0].id)
               if (reportRes.success && reportRes.data) {
                  detail = reportRes.data
               }
            }

            if (!mounted) return

            setMe(meRes.success && meRes.data ? meRes.data : null)
            setNotes(fetchedNotes)
            setHistory(historyRows)
            setLatestReport(detail)
         } finally {
            if (mounted) setLoading(false)
         }
      }

      void load()

      return () => {
         mounted = false
      }
   }, [])

   const onTimeRate = useMemo(() => {
      if (history.length === 0) return "0%"
      const onTime = history.filter((h) => isOnTime(h.month, h.submittedAt)).length
      return `${Math.round((onTime / history.length) * 100)}%`
   }, [history])

   const weeklyAdded = notes.filter((note) => {
      const created = new Date(note.createdAt).getTime()
      return Number.isFinite(created) && created >= Date.now() - 7 * 24 * 60 * 60 * 1000
   }).length

   const recentNotes = [...notes]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 3)

   const avgQuran = averageMetric(latestReport, "QURAN_AYAH")
   const avgHadith = averageMetric(latestReport, "HADITH_COUNT")
   const avgTextbookHours = averageMetric(latestReport, "TEXTBOOK_HOURS")
   const classDays = countChecked(latestReport, "CLASS")
   const studyDays = (latestReport?.numericEntries ?? []).filter(
      (m) => m.metric === "TEXTBOOK_HOURS" && numFrom(m.value) > 0,
   ).length

   const latestPlan =
      latestReport && latestReport.planSnapshot && typeof latestReport.planSnapshot === "object"
         ? (latestReport.planSnapshot as PlanSnapshot)
         : null

   const plannedQuran = snapshotValue(latestPlan, "planQuranAvgAyah")
   const plannedHadith = snapshotValue(latestPlan, "planHadithAvg")
   const plannedTextbookDays = snapshotValue(latestPlan, "planTextbookDays")
   const plannedTextbookHours = snapshotValue(latestPlan, "planTextbookHrs")
   const plannedClass = snapshotValue(latestPlan, "planClassUpst")

   const studyProgressPct = useMemo(() => {
      const target = toNumber(plannedTextbookDays)
      if (target <= 0) return null
      return Math.min(100, Math.round((studyDays / target) * 100))
   }, [plannedTextbookDays, studyDays])

   const quranTotal = sumMetric(latestReport, "QURAN_AYAH")
   const hadithTotal = sumMetric(latestReport, "HADITH_COUNT")

   const quickLinks = [
      {
         href: "/reports",
         label: "রিপোর্ট",
         desc: loading ? "লোড হচ্ছে..." : `${history.length} টি সাবমিটেড`,
         icon: FileTextIcon,
         color: "blue",
      },
      {
         href: "/dashboard/note",
         label: "নোট",
         desc: loading ? "লোড হচ্ছে..." : `${notes.length} টি মোট নোট`,
         icon: NotebookPenIcon,
         color: "purple",
      },
      {
         href: "/dashboard/syllabus",
         label: "সিলেবাস",
         desc: latestPlan ? "সর্বশেষ রিপোর্ট থেকে অগ্রগতি" : "এখনও পরিকল্পনা সেভ নেই",
         icon: BookOpenIcon,
         color: "emerald",
      },
      {
         href: "/dashboard/exam",
         label: "পরীক্ষা",
         desc: "MCQ ও ভাইভা মডিউল",
         icon: ClipboardListIcon,
         color: "amber",
      },
   ]

   return (
      <div className="min-h-screen bg-[#050f08] text-emerald-50">
         <div className="relative overflow-hidden border-b border-emerald-500/15 bg-[#071310] px-5 py-7 md:px-8">
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -left-20 -bottom-24 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />

            <div className="relative mx-auto max-w-6xl">
               <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                     <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold tracking-[1.4px] text-emerald-300 uppercase">
                        Associate Command Center
                     </p>
                     <h1 className="text-[26px] font-extrabold tracking-tight text-emerald-50 md:text-[31px]">
                        {me?.name || "সাথী"} Overview
                     </h1>
                     <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-white/45 md:text-sm">
                        রিপোর্ট, নোট, সিলেবাস ও পরীক্ষার বাস্তব ডেটা একসাথে দেখে মাসিক প্রস্তুতি ও অগ্রগতি ট্র্যাক করুন।
                     </p>

                     <div className="mt-4 flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 font-mono text-[10px] text-amber-300">
                           রোল: {me?.role || "ASSOCIATE"}
                        </span>
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[10px] text-white/40">
                           সর্বশেষ রিপোর্ট: {history[0] ? toBnDate(history[0].submittedAt) : "এখনও জমা হয়নি"}
                        </span>
                        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/8 px-3 py-1 font-mono text-[10px] text-emerald-300">
                           পরবর্তী ডেডলাইন: {nextReportDeadlineLabel()}
                        </span>
                     </div>
                  </div>

                  <div className="grid w-full max-w-sm grid-cols-2 gap-3">
                     <PillStat label="রিপোর্ট অন-টাইম" value={loading ? "..." : onTimeRate} />
                     <PillStat label="মোট নোট" value={loading ? "..." : `${notes.length}`} />
                     <PillStat label="স্টাডি ডে" value={loading ? "..." : `${studyDays}`} />
                     <PillStat label="ক্লাস উপস্থিতি" value={loading ? "..." : `${classDays}`} />
                  </div>
               </div>
            </div>
         </div>

         <div className="mx-auto max-w-6xl px-4 py-5 md:px-8">
            <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
               <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                     {quickLinks.map((item) => {
                        const colors: Record<string, { card: string; icon: string; badge: string }> = {
                           emerald: {
                              card: "border-emerald-500/16 hover:border-emerald-500/30 hover:bg-emerald-500/6",
                              icon: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
                              badge: "text-emerald-300/70",
                           },
                           blue: {
                              card: "border-blue-500/16 hover:border-blue-500/30 hover:bg-blue-500/6",
                              icon: "border-blue-500/25 bg-blue-500/10 text-blue-300",
                              badge: "text-blue-300/70",
                           },
                           amber: {
                              card: "border-amber-500/16 hover:border-amber-500/30 hover:bg-amber-500/6",
                              icon: "border-amber-500/25 bg-amber-500/10 text-amber-300",
                              badge: "text-amber-300/70",
                           },
                           purple: {
                              card: "border-purple-500/16 hover:border-purple-500/30 hover:bg-purple-500/6",
                              icon: "border-purple-500/25 bg-purple-500/10 text-purple-300",
                              badge: "text-purple-300/70",
                           },
                        }

                        const tone = colors[item.color]

                        return (
                           <Link
                              key={item.href}
                              href={item.href}
                              className={`group rounded-2xl border bg-[#071310] p-4 transition-all duration-200 ${tone.card}`}
                           >
                              <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl border ${tone.icon}`}>
                                 <item.icon className="h-4 w-4" strokeWidth={1.8} />
                              </div>
                              <div className="text-[13px] font-semibold text-white/75 group-hover:text-white/95">{item.label}</div>
                              <div className={`font-mono text-[10px] ${tone.badge}`}>{item.desc}</div>
                              <ArrowRightIcon className="mt-3 h-3.5 w-3.5 text-white/20 transition-colors group-hover:text-white/40" />
                           </Link>
                        )
                     })}
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-blue-500/15 bg-[#071310]">
                     <div className="h-0.5 bg-linear-to-r from-transparent via-blue-500/60 to-transparent" />
                     <div className="p-5">
                        <div className="mb-4 flex items-center justify-between">
                           <div className="flex items-center gap-2">
                              <ActivityIcon className="h-4 w-4 text-blue-300" strokeWidth={1.8} />
                              <span className="text-[13px] font-semibold text-emerald-50">রিপোর্ট সারসংক্ষেপ</span>
                           </div>
                           <Link href="/reports" className="flex items-center gap-1 font-mono text-[10px] text-blue-300/75 hover:text-blue-300">
                              বিস্তারিত <ChevronRightIcon className="h-3 w-3" />
                           </Link>
                        </div>

                        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
                           <PillStat label="সাবমিটেড" value={loading ? "..." : `${history.length}`} />
                           <PillStat label="অন-টাইম" value={loading ? "..." : onTimeRate} />
                           <PillStat label="কুরআন গড়" value={loading ? "..." : avgQuran ? avgQuran.toFixed(1) : "-"} />
                           <PillStat label="হাদিস গড়" value={loading ? "..." : avgHadith ? avgHadith.toFixed(1) : "-"} />
                           <PillStat label="পাঠ্যপুস্তক গড়" value={loading ? "..." : avgTextbookHours ? avgTextbookHours.toFixed(1) : "-"} />
                        </div>

                        <div className="mt-3 flex items-center gap-2 rounded-xl border border-white/8 bg-white/3 px-3 py-2.5">
                           <CalendarClockIcon className="h-3.5 w-3.5 text-amber-300" strokeWidth={1.8} />
                           <span className="text-[11px] text-white/45">
                              সর্বশেষ সাবমিশন: {history[0] ? toBnDate(history[0].submittedAt) : "এখনও জমা হয়নি"}
                           </span>
                        </div>
                     </div>
                  </div>

                  <div className="grid gap-4 xl:grid-cols-2">
                     <div className="overflow-hidden rounded-2xl border border-emerald-500/14 bg-[#071310]">
                        <div className="h-0.5 bg-linear-to-r from-transparent via-emerald-500/70 to-transparent" />
                        <div className="p-5">
                           <div className="mb-4 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                 <BookOpenIcon className="h-4 w-4 text-emerald-300" strokeWidth={1.8} />
                                 <span className="text-[13px] font-semibold text-emerald-50">সিলেবাস Overview</span>
                              </div>
                              <Link href="/dashboard/syllabus" className="flex items-center gap-1 font-mono text-[10px] text-emerald-300/70 hover:text-emerald-300">
                                 খুলুন <ChevronRightIcon className="h-3 w-3" />
                              </Link>
                           </div>

                           <div className="mb-3 rounded-xl border border-white/8 bg-white/4 p-3">
                              <div className="mb-2 flex items-center justify-between text-[11px] text-white/50">
                                 <span>পরিকল্পনা অনুযায়ী স্টাডি ডে</span>
                                 <span className="font-mono text-emerald-300">
                                    {loading ? "..." : `${studyDays}/${plannedTextbookDays || "-"}`}
                                 </span>
                              </div>
                              <div className="h-1.5 overflow-hidden rounded-full bg-white/8">
                                 <div
                                    className="h-full rounded-full bg-linear-to-r from-emerald-400 to-cyan-400"
                                    style={{ width: `${studyProgressPct ?? 0}%` }}
                                 />
                              </div>
                           </div>

                           <div className="grid grid-cols-2 gap-2">
                              <PillStat label="কুরআন মোট" value={loading ? "..." : `${quranTotal || 0}`} />
                              <PillStat label="হাদিস মোট" value={loading ? "..." : `${hadithTotal || 0}`} />
                           </div>

                           <div className="mt-3 rounded-xl border border-emerald-500/20 bg-emerald-500/8 px-3 py-2 text-[11px] text-emerald-100/80">
                              লক্ষ্য: কুরআন {plannedQuran || "-"}, হাদিস {plannedHadith || "-"}, পাঠ্যপুস্তক {plannedTextbookHours || "-"} ঘণ্টা, ক্লাস {plannedClass || "-"}
                           </div>
                        </div>
                     </div>

                     <div className="overflow-hidden rounded-2xl border border-amber-500/16 bg-[#0f1008]">
                        <div className="h-0.5 bg-linear-to-r from-transparent via-amber-500/70 to-transparent" />
                        <div className="p-5">
                           <div className="mb-4 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                 <ClipboardListIcon className="h-4 w-4 text-amber-300" strokeWidth={1.8} />
                                 <span className="text-[13px] font-semibold text-amber-100">পরীক্ষা Overview</span>
                              </div>
                              <Link href="/dashboard/exam" className="flex items-center gap-1 font-mono text-[10px] text-amber-300/70 hover:text-amber-300">
                                 পরীক্ষা দিন <ChevronRightIcon className="h-3 w-3" />
                              </Link>
                           </div>

                           <div className="space-y-2.5">
                              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/8 px-3 py-2.5 text-[12px] text-emerald-100/90">
                                 MCQ + Viva module সক্রিয় আছে
                              </div>
                              <div className="rounded-xl border border-white/8 bg-white/4 px-3 py-2.5 text-[12px] text-white/55">
                                 ব্যক্তিগত পরীক্ষার ফলাফল backend-এ এখনো সংরক্ষণ হচ্ছে না
                              </div>
                              <div className="rounded-xl border border-white/8 bg-white/4 px-3 py-2.5 text-[12px] text-white/55">
                                 সর্বশেষ রিপোর্ট মাস: {history[0]?.month || "রিপোর্ট নেই"}
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-purple-500/14 bg-[#0e0a14]">
                     <div className="h-0.5 bg-linear-to-r from-transparent via-purple-500/65 to-transparent" />
                     <div className="p-5">
                        <div className="mb-4 flex items-center justify-between">
                           <div className="flex items-center gap-2">
                              <NotebookPenIcon className="h-4 w-4 text-purple-300" strokeWidth={1.8} />
                              <span className="text-[13px] font-semibold text-purple-100">নোট Overview</span>
                           </div>
                           <Link href="/dashboard/note" className="font-mono text-[10px] text-purple-300/70 hover:text-purple-200">
                              সব নোট
                           </Link>
                        </div>

                        <div className="mb-3 grid gap-2 sm:grid-cols-3">
                           <PillStat label="মোট নোট" value={loading ? "..." : `${notes.length}`} />
                           <PillStat label="এই সপ্তাহে" value={loading ? "..." : `+${weeklyAdded}`} />
                           <PillStat label="লাস্ট আপডেট" value={recentNotes[0] ? toRelativeBn(recentNotes[0].updatedAt) : "-"} />
                        </div>

                        <div className="space-y-2.5">
                           {recentNotes.length === 0 && !loading ? (
                              <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-[12px] text-white/50">
                                 এখনো কোনো নোট পাওয়া যায়নি।
                              </div>
                           ) : null}

                           {recentNotes.map((note) => (
                              <div key={note.id} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
                                 <div className="flex items-center justify-between gap-2">
                                    <p className="truncate text-[12px] font-semibold text-white/80">{note.title}</p>
                                    <span className="font-mono text-[9px] text-white/35">{toRelativeBn(note.updatedAt)}</span>
                                 </div>
                                 <p className="mt-1 text-[11px] leading-relaxed text-white/45">{notePreview(note)}</p>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="overflow-hidden rounded-2xl border border-emerald-500/14 bg-[#071310]">
                     <div className="h-0.5 bg-linear-to-r from-transparent via-emerald-500/60 to-transparent" />
                     <div className="p-5">
                        <div className="mb-3 flex items-center gap-2">
                           <TargetIcon className="h-4 w-4 text-emerald-300" strokeWidth={1.8} />
                           <span className="text-[12px] font-semibold text-emerald-100">এই মাসে ফোকাস</span>
                        </div>

                        <div className="space-y-2">
                           <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/8 px-3 py-2 text-[11px] text-emerald-100/85">
                              মাসিক রিপোর্ট নির্ধারিত সময়ের মধ্যে সাবমিট নিশ্চিত করুন
                           </div>
                           <div className="rounded-xl border border-white/8 bg-white/3 px-3 py-2 text-[11px] text-white/50">
                              সাপ্তাহিক নোট আপডেট ধরে রাখুন
                           </div>
                           <div className="rounded-xl border border-white/8 bg-white/3 px-3 py-2 text-[11px] text-white/50">
                              সিলেবাস প্ল্যান বনাম actual অগ্রগতি মিলিয়ে নিন
                           </div>
                           <div className="rounded-xl border border-white/8 bg-white/3 px-3 py-2 text-[11px] text-white/50">
                              পরীক্ষার জন্য MCQ ও Viva প্র্যাকটিস সম্পন্ন করুন
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-cyan-500/14 bg-[#071310]">
                     <div className="h-0.5 bg-linear-to-r from-transparent via-cyan-500/60 to-transparent" />
                     <div className="p-5">
                        <div className="mb-3 flex items-center gap-2">
                           <CheckCircle2Icon className="h-4 w-4 text-cyan-300" strokeWidth={1.8} />
                           <span className="text-[12px] font-semibold text-cyan-100">Quick Action</span>
                        </div>
                        <div className="space-y-2.5">
                           <Link
                              href="/reports"
                              className="flex items-center justify-between rounded-xl border border-blue-500/20 bg-blue-500/8 px-3 py-2 text-[11px] text-blue-100/90 hover:bg-blue-500/12"
                           >
                              <span>রিপোর্ট আপডেট করুন</span>
                              <ChevronRightIcon className="h-3.5 w-3.5" />
                           </Link>
                           <Link
                              href="/dashboard/note"
                              className="flex items-center justify-between rounded-xl border border-purple-500/20 bg-purple-500/8 px-3 py-2 text-[11px] text-purple-100/90 hover:bg-purple-500/12"
                           >
                              <span>নোট যোগ করুন</span>
                              <ChevronRightIcon className="h-3.5 w-3.5" />
                           </Link>
                           <Link
                              href="/dashboard/syllabus"
                              className="flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/8 px-3 py-2 text-[11px] text-emerald-100/90 hover:bg-emerald-500/12"
                           >
                              <span>সিলেবাস রিভিউ</span>
                              <ChevronRightIcon className="h-3.5 w-3.5" />
                           </Link>
                           <Link
                              href="/dashboard/exam"
                              className="flex items-center justify-between rounded-xl border border-amber-500/20 bg-amber-500/8 px-3 py-2 text-[11px] text-amber-100/90 hover:bg-amber-500/12"
                           >
                              <span>পরীক্ষা দিন</span>
                              <ChevronRightIcon className="h-3.5 w-3.5" />
                           </Link>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}
