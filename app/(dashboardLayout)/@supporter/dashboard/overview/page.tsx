"use client"

import Link from "next/link"
import {
  BookOpenIcon, ClipboardListIcon, FileTextIcon, LayoutDashboardIcon,
  MoonIcon, TrendingUpIcon, CalendarIcon, CheckCircleIcon,
  ChevronRightIcon, StarIcon, ZapIcon, ShieldCheckIcon,
  HeartIcon, UsersIcon, BookMarkedIcon, ArrowRightIcon,
  CircleIcon, ClockIcon, AwardIcon, MessageSquareIcon,
  SunIcon, ActivityIcon, TargetIcon, BellIcon,
} from "lucide-react"

/* ═══════════════════════════════════════════════════
   MOCK DATA — replace with real API data
═══════════════════════════════════════════════════ */

const USER = {
  name: "সমর্থক",
  joinDate: "মার্চ ২০২৫",
  level: "সমর্থক",
  nextLevel: "কর্মী",
}

const REPORT_STATS = {
  thisMonth: {
    quranAvg:    "৮.৫",
    hadithAvg:   "২.৩",
    namazDays:   "২৬",
    classDays:   "২৩",
    goodworkAvg: "১.২",
    selfcrit:    "১৮",
  },
  streak: 7,
  totalReports: 3,
}

const EXAM = {
  mcqDone:     false,
  mcqScore:    null as number | null,
  vivaDone:    false,
  adminPassed: false,
}

const SYLLABUS_PROGRESS = 35 // percent

const NOTICES = [
  { id: 1, type: "info",    text: "এই সপ্তাহের হালাকা শুক্রবার সন্ধ্যা ৭টায়।",                 time: "২ ঘণ্টা আগে" },
  { id: 2, type: "warning", text: "মাসিক রিপোর্ট জমার শেষ তারিখ ৩১ মার্চ।",                     time: "১ দিন আগে" },
  { id: 3, type: "success", text: "আপনার ফেব্রুয়ারি রিপোর্ট গৃহীত হয়েছে।",                      time: "৫ দিন আগে" },
  { id: 4, type: "info",    text: "সিলেবাসে নতুন বিষয় যোগ হয়েছে — ওহী নাযিলের পদ্ধতি।",        time: "১ সপ্তাহ আগে" },
]

const DAILY_TASKS = [
  { key: "fajr",      label: "ফজর নামাজ পড়েছি",           done: true  },
  { key: "quran",     label: "কুরআন তিলাওয়াত করেছি",       done: true  },
  { key: "hadith",    label: "হাদিস পড়েছি",                 done: false },
  { key: "class",     label: "ক্লাসে উপস্থিত থেকেছি",      done: true  },
  { key: "selfcrit",  label: "আত্মসমালোচনা করেছি",          done: false },
  { key: "report",    label: "আজকের রিপোর্ট লিখেছি",        done: false },
]

const PROMOTION_STEPS = [
  { step: "০১", label: "সমর্থক হওয়া",      done: true,  active: false },
  { step: "০২", label: "সিলেবাস অধ্যয়ন",  done: false, active: true  },
  { step: "০৩", label: "মাসিক রিপোর্ট",    done: false, active: true  },
  { step: "০৪", label: "লিখিত পরীক্ষা",    done: false, active: false },
  { step: "০৫", label: "ভাইভা পরীক্ষা",    done: false, active: false },
  { step: "০৬", label: "কর্মী পদোন্নতি",   done: false, active: false },
]

const QUICK_LINKS = [
  { href: "/dashboard/syllabus", label: "সিলেবাস",     Icon: BookOpenIcon,    color: "emerald", desc: `${SYLLABUS_PROGRESS}% সম্পন্ন` },
  { href: "/dashboard/exam",     label: "পরীক্ষা",     Icon: ClipboardListIcon,color: "amber",  desc: "MCQ + ভাইভা" },
  { href: "/dashboard/report",   label: "রিপোর্ট",     Icon: FileTextIcon,    color: "blue",    desc: `${REPORT_STATS.totalReports} মাসের রিপোর্ট` },
]

/* ═══════════════════════════════════════════════════
   SMALL HELPERS
═══════════════════════════════════════════════════ */

function Ring({ pct, size = 64, stroke = 5, color = "#00c853" }: {
  pct: number; size?: number; stroke?: number; color?: string
}) {
  const r = (size - stroke * 2) / 2
  const circ = 2 * Math.PI * r
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color}
        strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={`${(pct/100)*circ} ${circ}`}
        style={{ transition: "stroke-dasharray .7s ease" }}
      />
    </svg>
  )
}

function StatCard({ label, value, sub, color = "emerald" }: {
  label: string; value: string; sub?: string; color?: string
}) {
  const map: Record<string, string> = {
    emerald: "border-emerald-500/15 bg-emerald-500/5 text-emerald-400",
    amber:   "border-amber-500/15 bg-amber-500/5 text-amber-400",
    blue:    "border-blue-500/15 bg-blue-500/5 text-blue-400",
    purple:  "border-purple-500/15 bg-purple-500/5 text-purple-400",
    rose:    "border-rose-500/15 bg-rose-500/5 text-rose-400",
  }
  return (
    <div className={`rounded-xl border px-4 py-3 ${map[color]}`}>
      <div className={`font-mono text-[20px] font-bold leading-none`}>{value}</div>
      <div className="mt-1 text-[11px] font-medium text-white/50">{label}</div>
      {sub && <div className="mt-0.5 font-mono text-[9px] text-white/20">{sub}</div>}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════ */

export default function SupporterOverview() {
  const dailyDone  = DAILY_TASKS.filter(t => t.done).length
  const dailyTotal = DAILY_TASKS.length
  const dailyPct   = Math.round((dailyDone / dailyTotal) * 100)

  const promotionDone = PROMOTION_STEPS.filter(s => s.done).length
  const promotionPct  = Math.round((promotionDone / PROMOTION_STEPS.length) * 100)

  return (
    <div className="min-h-screen bg-[#050f08]">

      {/* ════════════════════════════════════════
          HERO — greeting + quick stats
      ════════════════════════════════════════ */}
      <div className="relative overflow-hidden border-b rounded border-emerald-500/10 bg-[#071310] px-5 py-7 md:px-8">
        {/* bg glow */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-emerald-500/5 blur-3xl" />

        <div className="relative mx-auto max-w-5xl">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            {/* Left */}
            <div>
              <div className="mb-1 flex items-center gap-2">
                <SunIcon className="h-4 w-4 text-amber-400" strokeWidth={1.8} />
                <span className="font-mono text-[10px] tracking-[2px] text-amber-400/55 uppercase">
                  আস্সালামু আলাইকুম
                </span>
              </div>
              <h1 className="mb-1 text-[24px] font-bold text-emerald-50 md:text-[28px]">
                {USER.name} ভাই! 👋
              </h1>
              <p className="max-w-sm text-[13px] leading-relaxed text-white/35">
                আজকের দিনটি সুন্দরভাবে পার করুন। সিলেবাস পড়ুন, রিপোর্ট লিখুন এবং কর্মী হওয়ার লক্ষ্যে এগিয়ে যান।
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/8 px-3 py-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_5px_rgba(251,191,36,0.7)]" />
                  <span className="font-mono text-[10px] font-semibold text-amber-400">{USER.level}</span>
                </span>
                <span className="flex items-center gap-1.5 rounded-full border border-white/8 bg-white/3 px-3 py-1">
                  <CalendarIcon className="h-3 w-3 text-white/30" strokeWidth={1.8} />
                  <span className="font-mono text-[10px] text-white/30">যোগদান: {USER.joinDate}</span>
                </span>
                <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/15 bg-emerald-500/6 px-3 py-1">
                  <ZapIcon className="h-3 w-3 text-emerald-400" strokeWidth={1.8} />
                  <span className="font-mono text-[10px] text-emerald-400">{REPORT_STATS.streak} দিনের streak</span>
                </span>
              </div>
            </div>

            {/* Right — daily progress ring */}
            <div className="flex flex-shrink-0 items-center gap-5 rounded-2xl border border-emerald-500/12 bg-[#050f08] p-5">
              <div className="relative flex items-center justify-center">
                <Ring pct={dailyPct} size={80} stroke={6} />
                <div className="absolute text-center">
                  <div className="font-mono text-[17px] font-bold text-emerald-400">{dailyPct}%</div>
                </div>
              </div>
              <div>
                <div className="mb-0.5 text-[13px] font-semibold text-emerald-50">আজকের টার্গেট</div>
                <div className="font-mono text-[11px] text-white/30">{dailyDone}/{dailyTotal} কাজ সম্পন্ন</div>
                <div className="mt-2 space-y-1">
                  {DAILY_TASKS.slice(0, 3).map(t => (
                    <div key={t.key} className="flex items-center gap-1.5">
                      {t.done
                        ? <CheckCircleIcon className="h-3 w-3 text-emerald-400" strokeWidth={2} />
                        : <CircleIcon className="h-3 w-3 text-white/15" strokeWidth={2} />
                      }
                      <span className={`text-[10px] ${t.done ? "text-emerald-400/60 line-through" : "text-white/30"}`}>{t.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════
          MAIN CONTENT
      ════════════════════════════════════════ */}
      <div className="mx-auto max-w-5xl px-4 py-5 md:px-8">
        <div className="grid gap-4 lg:grid-cols-[1fr_300px]">

          {/* ── LEFT ── */}
          <div className="space-y-4">

            {/* Quick links */}
            <div className="grid grid-cols-3 gap-3">
              {QUICK_LINKS.map(l => {
                const map: Record<string, { card: string; icon: string; badge: string }> = {
                  emerald: { card: "border-emerald-500/14 hover:border-emerald-500/28 hover:bg-emerald-500/5", icon: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400", badge: "text-emerald-400/60" },
                  amber:   { card: "border-amber-500/14 hover:border-amber-500/28 hover:bg-amber-500/5",       icon: "bg-amber-500/10 border-amber-500/20 text-amber-400",     badge: "text-amber-400/60" },
                  blue:    { card: "border-blue-500/14 hover:border-blue-500/28 hover:bg-blue-500/5",          icon: "bg-blue-500/10 border-blue-500/20 text-blue-400",        badge: "text-blue-400/60" },
                }
                const c = map[l.color]
                return (
                  <Link key={l.href} href={l.href}
                    className={`group flex flex-col gap-3 rounded-2xl border bg-[#071310] p-4 transition-all duration-200 ${c.card}`}>
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${c.icon}`}>
                      <l.Icon className="h-4 w-4" strokeWidth={1.8} />
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-white/75 group-hover:text-white/90 transition-colors">{l.label}</div>
                      <div className={`font-mono text-[10px] ${c.badge}`}>{l.desc}</div>
                    </div>
                    <ArrowRightIcon className="h-3.5 w-3.5 text-white/15 group-hover:text-white/35 transition-colors" />
                  </Link>
                )
              })}
            </div>

            {/* Promotion roadmap */}
            <div className="rounded-2xl border border-emerald-500/14 bg-[#071310] overflow-hidden">
              <div className="h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
              <div className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TargetIcon className="h-4 w-4 text-emerald-400" strokeWidth={1.8} />
                    <span className="text-[13px] font-semibold text-emerald-50">কর্মী পদোন্নতির রোডম্যাপ</span>
                  </div>
                  <span className="font-mono text-[11px] text-emerald-400">{promotionPct}%</span>
                </div>

                {/* Steps */}
                <div className="relative">
                  {/* connector line */}
                  <div className="absolute left-[18px] top-5 bottom-5 w-px bg-white/6" />

                  <div className="space-y-3">
                    {PROMOTION_STEPS.map((s, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className={`relative z-10 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border font-mono text-[11px] font-bold transition-all ${
                          s.done
                            ? "border-emerald-500 bg-emerald-500/15 text-emerald-400 shadow-[0_0_12px_rgba(0,200,83,0.2)]"
                            : s.active
                            ? "border-amber-500/50 bg-amber-500/10 text-amber-400"
                            : "border-white/8 bg-white/3 text-white/20"
                        }`}>
                          {s.done ? <CheckCircleIcon className="h-4 w-4" strokeWidth={2} /> : s.step}
                        </div>
                        <div className="flex flex-1 items-center justify-between rounded-xl border px-3 py-2 transition-all" style={{
                          borderColor: s.done ? "rgba(0,200,83,0.15)" : s.active ? "rgba(251,191,36,0.12)" : "rgba(255,255,255,0.05)",
                          background:  s.done ? "rgba(0,200,83,0.04)"  : s.active ? "rgba(251,191,36,0.04)" : "rgba(255,255,255,0.02)",
                        }}>
                          <span className={`text-[12px] font-medium ${s.done ? "text-emerald-400/80" : s.active ? "text-amber-300/80" : "text-white/25"}`}>
                            {s.label}
                          </span>
                          {s.done && <CheckCircleIcon className="h-3.5 w-3.5 text-emerald-400/60" strokeWidth={2} />}
                          {s.active && !s.done && <div className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />}
                          {!s.done && !s.active && <LockIcon className="h-3 w-3 text-white/12" strokeWidth={1.8} />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Link href="/dashboard/exam"
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/8 py-2.5 text-[12px] font-semibold text-emerald-400 hover:bg-emerald-500/14 transition-all">
                  পরীক্ষায় অংশ নিন
                  <ArrowRightIcon className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* This month's report summary */}
            <div className="rounded-2xl border border-blue-500/12 bg-[#071310] overflow-hidden">
              <div className="h-0.5 bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />
              <div className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ActivityIcon className="h-4 w-4 text-blue-400" strokeWidth={1.8} />
                    <span className="text-[13px] font-semibold text-emerald-50">এই মাসের সারসংক্ষেপ</span>
                  </div>
                  <Link href="/dashboard/report" className="flex items-center gap-1 font-mono text-[10px] text-blue-400/60 hover:text-blue-400 transition-colors">
                    বিস্তারিত <ChevronRightIcon className="h-3 w-3" />
                  </Link>
                </div>

                <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
                  <StatCard label="কুরআন গড়"    value={REPORT_STATS.thisMonth.quranAvg}    sub="পৃষ্ঠা/দিন" color="emerald" />
                  <StatCard label="হাদিস গড়"    value={REPORT_STATS.thisMonth.hadithAvg}    sub="টি/দিন"    color="emerald" />
                  <StatCard label="নামাজ দিন"    value={REPORT_STATS.thisMonth.namazDays}    sub="দিন/৩১"    color="purple" />
                  <StatCard label="ক্লাস"        value={REPORT_STATS.thisMonth.classDays}    sub="দিন/৩১"    color="blue" />
                  <StatCard label="ভালো কাজ"    value={REPORT_STATS.thisMonth.goodworkAvg}  sub="ঘণ্টা/দিন" color="amber" />
                  <StatCard label="আত্মসমালোচনা" value={REPORT_STATS.thisMonth.selfcrit}     sub="দিন/৩১"    color="rose" />
                </div>

                <div className="mt-3 flex items-center gap-3 rounded-xl border border-white/6 bg-white/2 px-4 py-2.5">
                  <ClockIcon className="h-3.5 w-3.5 text-amber-400/60" strokeWidth={1.8} />
                  <span className="text-[11px] text-white/35">রিপোর্ট জমার শেষ তারিখ: ৩১ মার্চ ২০২৬</span>
                  <Link href="/dashboard/report"
                    className="ml-auto flex items-center gap-1 rounded-lg border border-amber-500/20 bg-amber-500/8 px-2.5 py-1 text-[10px] font-semibold text-amber-400 hover:bg-amber-500/15 transition-all">
                    রিপোর্ট দিন <ArrowRightIcon className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Syllabus progress */}
            <div className="rounded-2xl border border-emerald-500/12 bg-[#071310] overflow-hidden">
              <div className="h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
              <div className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpenIcon className="h-4 w-4 text-emerald-400" strokeWidth={1.8} />
                    <span className="text-[13px] font-semibold text-emerald-50">সিলেবাস অগ্রগতি</span>
                  </div>
                  <Link href="/dashboard/syllabus" className="flex items-center gap-1 font-mono text-[10px] text-emerald-400/60 hover:text-emerald-400 transition-colors">
                    সম্পূর্ণ দেখুন <ChevronRightIcon className="h-3 w-3" />
                  </Link>
                </div>

                <div className="grid gap-2.5 sm:grid-cols-2">
                  {[
                    { label: "কুরআন পরিচিতি",   pct: 80, color: "#4ade80" },
                    { label: "হাদিস পরিচিতি",   pct: 60, color: "#34d399" },
                    { label: "তাহারাত ও সালাত", pct: 40, color: "#a78bfa" },
                    { label: "সংগঠন পরিচিতি",   pct: 20, color: "#fbbf24" },
                    { label: "পাঁচ দফা",          pct: 10, color: "#fb923c" },
                    { label: "গুরুত্বপূর্ণ তারিখ", pct: 0, color: "#94a3b8" },
                  ].map(s => (
                    <div key={s.label} className="rounded-xl border border-white/5 bg-white/2 px-3 py-2.5">
                      <div className="mb-1.5 flex items-center justify-between">
                        <span className="text-[11px] text-white/50">{s.label}</span>
                        <span className="font-mono text-[10px]" style={{ color: s.color }}>{s.pct}%</span>
                      </div>
                      <div className="h-1 overflow-hidden rounded-full bg-white/5">
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${s.pct}%`, background: s.color }} />
                      </div>
                    </div>
                  ))}
                </div>

                <Link href="/dashboard/syllabus"
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/6 py-2.5 text-[12px] font-semibold text-emerald-400 hover:bg-emerald-500/12 transition-all">
                  পড়া শুরু করুন
                  <ArrowRightIcon className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Daily tasks */}
            <div className="rounded-2xl border border-white/6 bg-[#071310] overflow-hidden">
              <div className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="h-4 w-4 text-emerald-400/70" strokeWidth={1.8} />
                    <span className="text-[13px] font-semibold text-emerald-50">আজকের আমল চেকলিস্ট</span>
                  </div>
                  <span className="rounded-full border border-emerald-500/15 bg-emerald-500/8 px-2.5 py-0.5 font-mono text-[10px] text-emerald-400">
                    {dailyDone}/{dailyTotal}
                  </span>
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  {DAILY_TASKS.map(t => (
                    <div key={t.key} className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-all ${
                      t.done
                        ? "border-emerald-500/15 bg-emerald-500/5"
                        : "border-white/5 bg-white/2"
                    }`}>
                      {t.done
                        ? <CheckCircleIcon className="h-4 w-4 flex-shrink-0 text-emerald-400" strokeWidth={2} />
                        : <CircleIcon className="h-4 w-4 flex-shrink-0 text-white/12" strokeWidth={2} />
                      }
                      <span className={`text-[12px] ${t.done ? "text-emerald-400/70 line-through" : "text-white/45"}`}>
                        {t.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="space-y-4">

            {/* Exam status card */}
            <div className="rounded-2xl border border-amber-500/14 bg-[#0f0f07] overflow-hidden">
              <div className="h-0.5 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
              <div className="p-5">
                <div className="mb-3 flex items-center gap-2">
                  <ClipboardListIcon className="h-4 w-4 text-amber-400" strokeWidth={1.8} />
                  <span className="text-[13px] font-semibold text-amber-100">পরীক্ষার অবস্থা</span>
                </div>

                <div className="space-y-2.5">
                  {[
                    {
                      label: "লিখিত পরীক্ষা",
                      done:  EXAM.mcqDone,
                      sub:   EXAM.mcqScore ? `স্কোর: ${EXAM.mcqScore}%` : "এখনো দেওয়া হয়নি",
                      href:  "/dashboard/exam",
                    },
                    {
                      label: "ভাইভা পরীক্ষা",
                      done:  EXAM.vivaDone,
                      sub:   "লিখিত পাস করলে যোগ্য",
                      href:  "/dashboard/exam",
                    },
                    {
                      label: "Admin অনুমোদন",
                      done:  EXAM.adminPassed,
                      sub:   "ভাইভা পাস করলে অনুমোদন হবে",
                      href:  "#",
                    },
                  ].map(e => (
                    <div key={e.label} className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 ${
                      e.done ? "border-emerald-500/15 bg-emerald-500/5" : "border-white/5 bg-white/2"
                    }`}>
                      {e.done
                        ? <CheckCircleIcon className="h-4 w-4 flex-shrink-0 text-emerald-400" strokeWidth={2} />
                        : <CircleIcon className="h-4 w-4 flex-shrink-0 text-white/12" strokeWidth={2} />
                      }
                      <div className="min-w-0 flex-1">
                        <div className={`text-[12px] font-medium ${e.done ? "text-emerald-400/80" : "text-white/40"}`}>{e.label}</div>
                        <div className="font-mono text-[9px] text-white/20">{e.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <Link href="/dashboard/exam"
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-amber-500/25 bg-amber-500/8 py-2.5 text-[12px] font-semibold text-amber-400 hover:bg-amber-500/15 transition-all">
                  পরীক্ষা দিন
                  <ArrowRightIcon className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Notices */}
            <div className="rounded-2xl border border-white/6 bg-[#071310] overflow-hidden">
              <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
                <BellIcon className="h-3.5 w-3.5 text-amber-400/70" strokeWidth={1.8} />
                <span className="text-[12px] font-semibold text-white/60">নোটিশ বোর্ড</span>
              </div>
              <div className="divide-y divide-white/4">
                {NOTICES.map(n => {
                  const dot: Record<string, string> = {
                    info:    "bg-blue-400",
                    warning: "bg-amber-400",
                    success: "bg-emerald-400",
                  }
                  return (
                    <div key={n.id} className="flex items-start gap-3 px-4 py-3">
                      <div className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${dot[n.type]}`} />
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] leading-relaxed text-white/55">{n.text}</p>
                        <div className="mt-0.5 font-mono text-[9px] text-white/20">{n.time}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Shibir info card */}
            <div className="rounded-2xl border border-emerald-500/10 bg-[#071310] overflow-hidden">
              <div className="h-0.5 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
              <div className="p-5">
                <div className="mb-3 flex items-center gap-2">
                  <MoonIcon className="h-4 w-4 text-emerald-400/70" strokeWidth={1.8} />
                  <span className="text-[12px] font-semibold text-white/50">সংগঠন পরিচিতি</span>
                </div>
                <div className="space-y-2">
                  {[
                    { label: "প্রতিষ্ঠা",         value: "৬ ফেব্রুয়ারি ১৯৭৭" },
                    { label: "লক্ষ্য",              value: "ইসলামী সমাজ বিনির্মাণ" },
                    { label: "কেন্দ্রীয় সভাপতি", value: "মুজুকুল ইসলাম" },
                    { label: "স্তর",                value: "সমর্থক → কর্মী → সাথী → সদস্য" },
                  ].map(r => (
                    <div key={r.label} className="flex items-start gap-2 rounded-lg border border-white/4 bg-white/2 px-3 py-2">
                      <span className="min-w-[90px] flex-shrink-0 font-mono text-[9px] text-white/25 uppercase tracking-widest">{r.label}</span>
                      <span className="text-[11px] text-white/50">{r.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Motivational quote */}
            <div className="rounded-2xl border border-purple-500/12 bg-purple-500/4 p-5">
              <div className="mb-2 font-arabic text-lg text-purple-300/70 text-center leading-loose">
                إِنَّ مَعَ الْعُسْرِ يُسْرًا
              </div>
              <p className="text-center text-[12px] leading-relaxed text-purple-100/45">
                &ldquo;নিশ্চয়ই কষ্টের সাথে স্বস্তি আছে।&rdquo; — সূরা আল-ইনশিরাহ: ৬
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

/* tiny lock icon inline */
function LockIcon({ className, strokeWidth }: { className?: string; strokeWidth?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={strokeWidth ?? 2} strokeLinecap="round" strokeLinejoin="round"
      className={className}>
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  )
}
