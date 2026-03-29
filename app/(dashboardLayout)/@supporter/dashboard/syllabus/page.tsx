"use client"

import { useState } from "react"
import {
  BookOpenIcon, CheckCircleIcon, CircleIcon, ChevronDownIcon,
  ChevronRightIcon, StarIcon, CalendarIcon, BookMarkedIcon,
  UsersIcon, ShieldIcon, HeartIcon, GraduationCapIcon,
  MoonIcon, ScrollTextIcon, ZapIcon, TrophyIcon, ClockIcon,
  CheckIcon, LockIcon,
} from "lucide-react"

/* ═══════════════════════════════════════
   SYLLABUS DATA — Supporter Level
═══════════════════════════════════════ */

const QURAN_DATA = {
  para: 30, ayah: "৬৬৬৬/৬২৩৬", surah: '১১৪', ruku: '৫৪০', sajda: '১৪',
  firstSurah: "আল ফাতিহা", lastSurah: "আন নাস", firstAyah: "আল আলাক (১-৫)",
}

const HADITH_SECTIONS = [
  {
    title: "হাদিস কুদসী",
    desc: "যে হাদেসর মূল বক্তব্য আল্লাহ, মহানবী (সাঃ) কে জানিয়েদিয়েছন আর রাসূল (সাঃ) তা নিজ ভাষায় বর্ণনা করেছেন।",
  },
  {
    title: "হাদিসের প্রকারঃ",
    items: [
      "কাওলী — রাসূল (সাঃ) এর কথাকে কওলী হাদিস বলে",
      "ফেলী — রাসূল (সাঃ) এর কাজকে ফেলী হাদিস বলে",
      "তাকরীরী — রাসূল (সাঃ) এর মৌন সম্মতি তাকরীরী হাদিস বলে",
    ],
  },
]

const TAHARAH_SECTIONS = [
  {
    title: "অযুর ফরজ চারটি",
    items: ["সমস্ত মুখমণ্ডল ভালোভাবে ধোয়া", "দুই হাত কনুইসহ ধোয়া", "মাথা মাসেহ করা", "দুই পা টাখনুসহ ধোয়া"],
  },
  {
    title: "তায়াম্মুমের ফরজ তিনটি",
    items: ["নিয়ত করা", "মুখমণ্ডল মাসেহ করা", "দুই হাত কনুইসহ একবার মাসেহ করা"],
  },
  {
    title: "গোসলের ফরজ তিনটি",
    items: ["ভালোভাবে কুলি করা", "নাকের ভিতর ভালোভাবে পানি দিয়ে পরিষ্কার করা", "সমস্ত শরীর ভালোভাবে পানি ঢেলে ধৌত করা"],
  },
]

const ORGANISATION_SECTIONS = [
  {
    title: "সাংগঠনিক স্তর চারটি",
    items: ["সমর্থক", "কর্মী", "সাথী", "সদস্য"],
  },
  {
    title: "কর্মী হওয়ার শর্ত চারটি",
    items: ["দাওয়াতী কাজ করা", "প্রোগ্রামসমূহে উপস্থিত থাকা", "রিপোর্ট রাখা", "বাইতুলমাল এমানত দেওয়া"],
  },
  {
    title: "সক্রিয় কর্মীর গুণাবলী আটটি",
    items: ["মজবুত ঈমান", "খোদাভীতি", "আদর্শ সুস্পষ্ট জ্ঞান", "আন্তরিকতা", "নিষ্ঠা", "কর্মস্পৃহা", "চরিত্রক মানুষ", "কর্মসূচি ও কর্মপদ্ধতি যথাযথ অনুসরণ"],
  },
  {
    title: "কর্মীর কাজ আটটি",
    items: [
      "দাওয়াতী কাজ করা",
      "প্রোগ্রামসমূহে উপস্থিত থাকা",
      "রিপোর্ট রাখা",
      "বাইতুলমাল এমানত দেওয়া",
      "কুরআন ও হাদিস নিয়মত অধ্যয়ন করা",
      "ইসলামী সাহিত্য অধ্যয়ন করা",
      "ইসলামের প্রাথমিক বিধান সমূহ মেনে চলা",
      "সংগঠন কর্তৃক নির্দিষ্ট দায়িত্ব যথাযথভাবে পালন করা",
    ],
  },
]

const SURAH_FATIHA_MEANINGS = [
  "সমস্ত প্রশংসা একমাত্র আল্লাহর তায়ালার জন্য",
  "তিনি পরম করুণাময় ও মহান দয়ালু",
  "তিনি বিচার দিবেসর মালিক",
  "আমরা তোমারই ইবাদত করি এবং তোমারই সাহায্য প্রার্থনা করি",
  "তুমি আমেদর সহজ সরল পথ দেখাও",
  "তোদর পথ যারা তোমার অনুগ্রহ দান করেছ",
  "তোদর পথ নয় যারা জিতষ্প এবং পথভারা হয়েছে",
]

const IMPORTANT_DATES = [
  { name: "প্রতিষ্ঠাবার্ষিকী", date: "৬ ফেব্রুয়ারী ১৯৭৭" },
  { name: "শহীদ দিবস",        date: "১১ মার্চ ১৯৮২" },
  { name: "বালাকোট দিবস",    date: "৬ মে ১৮৩১" },
  { name: "কুরআনদিবস",       date: "১১ মে ১৯৮৫" },
  { name: "পলাশী দিবস",      date: "২৩ জুন ১৭৫৭" },
  { name: "ইসলামী শিক্ষা দিবস", date: "২৫ আগস্ট ১৯৬৯" },
  { name: "পল্টন ট্র্যাজেডি দিবস", date: "২৮ অক্টোবর ২০০৬" },
  { name: "বাবরি মসজিদ দিবস", date: "৬ ডিসেম্বর ১৯৯২" },
  { name: "বদর দিবস",         date: "১৭ রমজান" },
]

const LEADERSHIP = [
  { level: "কেন্দ্রীয় সভাপতি",           name: "মুজুকুল ইসলাম" },
  { level: "কেন্দ্রীয় সেক্রেটারি জেনারেল", name: "ইজাজুল ইসলাম" },
]

const DAWAH_STEPS = [
  {
    step: "প্রথম দফা",
    title: "দাওয়াত",
    desc: "তরুণ ছাত্র সমাজের কাছে ইসলামের আহবান পৌঁছে তাদের নেতৃত্ব অর্জন করে বাবর জীবন ইসলামের অনুশীলনের দিয়াহনুভূতি জাগ্রত করা।",
    color: "emerald",
  },
  {
    step: "দ্বিতীয় দফা",
    title: "সংগঠন",
    desc: "যে সব ছাত্র ইসলামী জীবনবিধান প্রতিষ্ঠার সংগ্রামে অংশ নিতে তোদলে কর্মীদের তাদেরকে সংগঠনের অধীনে সংঘবদ্ধ করি।",
    color: "blue",
  },
  {
    step: "তৃতীয় দফা",
    title: "প্রশিক্ষণ",
    desc: "এই সংগঠনের অধীনে সংঘবদ্ধ ছাত্রদেরকে ইসলামী জ্ঞান প্রদান এবং আদর্শ চরিত্রবলকে গড়ে তুলে জেহাদিয়তের সমস্ত প্রতিকূলতা মোকাবেলা করার যোগ্য কর্মী হিসেবে গড়ার কার্যকরী ব্যবস্থা করা।",
    color: "amber",
  },
  {
    step: "চতুর্থ দফা",
    title: "ইসলামী শিক্ষা আন্দোলন ও ছাত্র সমস্যা",
    desc: "আদর্শ নাগরিক তৈরীর উদ্দেশ্যে ইসলামী মূল্যবোধের ভিত্তিতে শিক্ষা ব্যবস্থার পরিবর্তন। সাধনের দিবস সংগ্রাম এবং ছাত্রসমাজের প্রকৃত সমস্যা সমাধানের লক্ষ্যে সংগ্রামে নেতৃত্ব প্রদান।",
    color: "purple",
  },
  {
    step: "পঞ্চম দফা",
    title: "ইসলামী সমাজবিনির্মাণ",
    desc: "আর্থনৈতিক শোষণ, রাজনৈতিক নিপীড়ন এবং সাংস্কৃতিক গোলামির হেত মানবতার মুক্তির জন্য ইসলামী সমাজ বিনির্মাণের সর্বাত্মক প্রচেষ্টা চালানো।",
    color: "rose",
  },
]

/* ═══════════════════════════════════════
   TRACKING STATE TYPE
═══════════════════════════════════════ */

type TrackKey = string
type TrackState = Record<TrackKey, boolean>

const ALL_TRACK_KEYS = [
  "quran_stats", "hadith_kudsi", "hadith_types", "taharah_wudu",
  "taharah_tayammum", "taharah_ghusl", "org_levels", "org_worker_conditions",
  "org_worker_qualities", "org_worker_tasks", "surah_fatiha", "dawah_steps",
  "dates_all", "leadership",
]

/* ═══════════════════════════════════════
   COMPONENTS
═══════════════════════════════════════ */

function SectionCard({
  id, title, icon: Icon, color = "emerald", children, tracked, onToggle,
}: {
  id: string
  title: string
  icon: React.ElementType
  color?: "emerald" | "amber" | "blue" | "purple" | "rose"
  children: React.ReactNode
  tracked: boolean
  onToggle: (id: string) => void
}) {
  const [open, setOpen] = useState(true)

  const colors = {
    emerald: { border: "border-emerald-500/20", bg: "bg-emerald-500/6",   icon: "text-emerald-400",  badge: "bg-emerald-500/12 text-emerald-400 border-emerald-500/20" },
    amber:   { border: "border-amber-500/20",   bg: "bg-amber-500/6",     icon: "text-amber-400",    badge: "bg-amber-500/12 text-amber-400 border-amber-500/20" },
    blue:    { border: "border-blue-500/20",     bg: "bg-blue-500/6",      icon: "text-blue-400",     badge: "bg-blue-500/12 text-blue-400 border-blue-500/20" },
    purple:  { border: "border-purple-500/20",   bg: "bg-purple-500/6",    icon: "text-purple-400",   badge: "bg-purple-500/12 text-purple-400 border-purple-500/20" },
    rose:    { border: "border-rose-500/20",     bg: "bg-rose-500/6",      icon: "text-rose-400",     badge: "bg-rose-500/12 text-rose-400 border-rose-500/20" },
  }
  const c = colors[color]

  return (
    <div className={`rounded-xl border ${c.border} bg-[#071310] overflow-hidden transition-all duration-300`}>
      {/* Header */}
      <div
        className="flex items-center gap-3 px-5 py-4 cursor-pointer select-none hover:bg-white/2 transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${c.bg} border ${c.border}`}>
          <Icon className={`h-4 w-4 ${c.icon}`} strokeWidth={1.8} />
        </div>
        <div className="flex-1">
          <h3 className="text-[14px] font-semibold text-emerald-50">{title}</h3>
        </div>

        {/* Completion toggle */}
        <button
          onClick={e => { e.stopPropagation(); onToggle(id) }}
          className={`flex h-7 items-center gap-1.5 rounded-lg border px-2.5 text-[11px] font-semibold transition-all duration-200 ${
            tracked
              ? "border-emerald-500/40 bg-emerald-500/14 text-emerald-400"
              : "border-white/10 bg-white/4 text-white/30 hover:border-white/20 hover:text-white/50"
          }`}
        >
          {tracked ? <CheckIcon className="h-3 w-3" /> : <CircleIcon className="h-3 w-3" />}
          {tracked ? "সম্পন্ন" : "অসম্পন্ন"}
        </button>

        <ChevronDownIcon className={`h-4 w-4 text-white/25 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </div>

      {/* Body */}
      {open && (
        <div className="border-t border-white/5 px-5 pb-5 pt-4">
          {children}
        </div>
      )}
    </div>
  )
}

function ItemList({ items, color = "emerald" }: { items: string[]; color?: string }) {
  const dotColor: Record<string, string> = {
    emerald: "bg-emerald-400",
    amber:   "bg-amber-400",
    blue:    "bg-blue-400",
    purple:  "bg-purple-400",
    rose:    "bg-rose-400",
  }
  return (
    <ul className="space-y-2 mt-1">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5">
          <span className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${dotColor[color] ?? "bg-emerald-400"}`} />
          <span className="text-[13px] leading-relaxed text-emerald-100/60">{item}</span>
        </li>
      ))}
    </ul>
  )
}

function SubSection({ title, items, color }: { title: string; items: string[]; color?: string }) {
  return (
    <div className="mb-4 last:mb-0">
      <div className="mb-2 flex items-center gap-2">
        <ChevronRightIcon className="h-3.5 w-3.5 text-amber-400/60" />
        <span className="text-[12px] font-semibold text-amber-300/80">{title}</span>
      </div>
      <ItemList items={items} color={color} />
    </div>
  )
}

/* ═══════════════════════════════════════
   PROGRESS BAR
═══════════════════════════════════════ */
function ProgressRing({ pct }: { pct: number }) {
  const r = 28, circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  return (
    <svg width="72" height="72" className="-rotate-90">
      <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(0,200,83,0.08)" strokeWidth="5" />
      <circle
        cx="36" cy="36" r={r} fill="none"
        stroke="#00c853" strokeWidth="5"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        className="transition-all duration-700"
      />
    </svg>
  )
}

/* ═══════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════ */
export default function SupporterSyllabus() {
  const [tracked, setTracked] = useState<TrackState>(() =>
    Object.fromEntries(ALL_TRACK_KEYS.map(k => [k, false]))
  )

  const completedCount = Object.values(tracked).filter(Boolean).length
  const totalCount     = ALL_TRACK_KEYS.length
  const pct            = Math.round((completedCount / totalCount) * 100)

  function toggle(id: string) {
    setTracked(p => ({ ...p, [id]: !p[id] }))
  }

  return (
    <div className="min-h-screen bg-[#050f08] text-emerald-50">

      {/* ══════════════════════════════════════
          HERO HEADER
      ══════════════════════════════════════ */}
      <div className="relative overflow-hidden border-b border-emerald-500/10 bg-[#071310] px-6 py-8">
        {/* bg glow */}
        <div className="pointer-events-none absolute -top-20 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-emerald-500/6 blur-3xl" />

        <div className="relative mx-auto max-w-5xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            {/* Left — title */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="h-px w-6 bg-emerald-500/40" />
                <span className="font-mono text-[10px] tracking-[3px] text-emerald-500/50 uppercase">
                  বাংলাদেশ ইসলামী ছাত্রশিবির
                </span>
              </div>
              <h1 className="mb-2 text-[26px] font-bold leading-tight text-emerald-50 md:text-[32px]">
                সমর্থক সিলেবাস
              </h1>
              <p className="max-w-md text-[13px] leading-relaxed text-emerald-100/40">
                সমর্থক স্তরের সম্পূর্ণ পাঠ্যক্রম — কুরআন, হাদিস, তাহারাত, সংগঠন ও ইতিহাস
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["কুরআন পরিচিতি","হাদিস পরিচিতি","তাহারাত","সংগঠন","গুরুত্বপূর্ণ তারিখ"].map(t => (
                  <span key={t} className="rounded-full border border-emerald-500/15 bg-emerald-500/6 px-3 py-1 font-mono text-[10px] text-emerald-400/70">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — progress ring */}
            <div className="flex flex-shrink-0 flex-col items-center gap-4 rounded-2xl border border-emerald-500/15 bg-[#050f08] px-8 py-6">
              <div className="relative flex items-center justify-center">
                <ProgressRing pct={pct} />
                <div className="absolute text-center">
                  <div className="font-mono text-[18px] font-bold text-emerald-400">{pct}%</div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-[13px] font-semibold text-emerald-50">
                  {completedCount}/{totalCount} বিষয়
                </div>
                <div className="mt-0.5 font-mono text-[10px] text-emerald-500/45">সম্পন্ন হয়েছে</div>
              </div>
              {/* Mini stats */}
              <div className="flex gap-3 border-t border-emerald-500/10 pt-3">
                <div className="text-center">
                  <div className="font-mono text-[15px] font-bold text-amber-400">{totalCount - completedCount}</div>
                  <div className="font-mono text-[9px] text-white/25">বাকি</div>
                </div>
                <div className="w-px bg-emerald-500/10" />
                <div className="text-center">
                  <div className="font-mono text-[15px] font-bold text-emerald-400">{completedCount}</div>
                  <div className="font-mono text-[9px] text-white/25">সম্পন্ন</div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-6">
            <div className="mb-1.5 flex justify-between">
              <span className="font-mono text-[10px] text-emerald-500/40">সার্বিক অগ্রগতি</span>
              <span className="font-mono text-[10px] text-emerald-500/60">{pct}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-emerald-500/8">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          CONTENT GRID
      ══════════════════════════════════════ */}
      <div className="mx-auto max-w-5xl px-4 py-6 md:px-6">
        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">

          {/* ── LEFT COLUMN (main content) ── */}
          <div className="flex flex-col gap-4">

            {/* 1. আল-কুরআন পরিচিতি */}
            <SectionCard id="quran_stats" title="আল-কুরআন পরিচিতি" icon={BookOpenIcon} color="emerald" tracked={tracked["quran_stats"]} onToggle={toggle}>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[
                  { label: "পারা",     value: `${QURAN_DATA.para} টি` },
                  { label: "আয়াত",    value: QURAN_DATA.ayah },
                  { label: "সূরা",     value: `${QURAN_DATA.surah} টি` },
                  { label: "রুকু",     value: `${QURAN_DATA.ruku} টি` },
                  { label: "সাজদা",   value: `${QURAN_DATA.sajda} টি` },
                ].map(s => (
                  <div key={s.label} className="rounded-xl border border-emerald-500/12 bg-emerald-500/5 px-4 py-3 text-center">
                    <div className="font-mono text-[17px] font-bold text-emerald-400">{s.value}</div>
                    <div className="mt-0.5 font-mono text-[10px] text-emerald-100/35">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                {[
                  { label: "প্রথম সূরা",      value: QURAN_DATA.firstSurah },
                  { label: "শেষ সূরা",        value: QURAN_DATA.lastSurah },
                  { label: "প্রথম নাযিলকৃত আয়াত", value: QURAN_DATA.firstAyah },
                ].map(s => (
                  <div key={s.label} className="rounded-xl border border-amber-500/12 bg-amber-500/4 px-4 py-3">
                    <div className="mb-1 font-mono text-[9px] tracking-widest text-amber-400/50 uppercase">{s.label}</div>
                    <div className="text-[13px] font-semibold text-amber-300/90">{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Wahi method */}
              <div className="mt-4 rounded-xl border border-blue-500/12 bg-blue-500/4 px-4 py-3">
                <div className="mb-2 font-mono text-[10px] tracking-widest text-blue-400/60 uppercase">ওহী নিয়ের পদ্ধতি</div>
                <ul className="space-y-1.5">
                  {[
                    "সত্য স্বপ্নেরূপে",
                    "ঘণ্টাধ্বনির মতো",
                    "পর্দার অন্তরাল থেকে",
                    "মৌহিভূত করুণ ঘণ্টার ন্যায়",
                    "জিব্রাঈল (আঃ) নিজ আকৃতেত",
                    "জিব্রাঈল আদ মানুষের আকৃতিতে",
                    "হযরত দাহিয়াতুল কালবী (রা)",
                  ].map((m, i) => (
                    <li key={i} className="flex items-start gap-2 text-[12px] text-blue-100/55">
                      <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/15 font-mono text-[9px] text-blue-400">{i+1}</span>
                      {m}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Maki / Madani */}
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {[
                  { title: "মাক্কী সূরা", desc: "যে সমস্ত সূরা রাসূল (সাঃ) এর মক্কা জীবনে অর্থাৎ হিজরতের পূর্বে নাযিল হয়েছে সে সমস্ত সূরা মাক্কী সূরা বলা হয়।", color: "amber" },
                  { title: "মাদানী সূরা", desc: "যে সমস্ত সূরা রাসূল (সাঃ) এর মাদানী জীবনে অর্থাৎ হিজরতের পর নাযিল হয়েছে সে সমস্ত সূরা মাদানী সূরা বলা হয়।", color: "purple" },
                ].map(s => (
                  <div key={s.title} className={`rounded-xl border px-4 py-3 ${s.color === "amber" ? "border-amber-500/12 bg-amber-500/4" : "border-purple-500/12 bg-purple-500/4"}`}>
                    <div className={`mb-1.5 text-[12px] font-bold ${s.color === "amber" ? "text-amber-400" : "text-purple-400"}`}>{s.title}</div>
                    <p className={`text-[11px] leading-relaxed ${s.color === "amber" ? "text-amber-100/50" : "text-purple-100/50"}`}>{s.desc}</p>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* 2. হাদিস পরিচিতি */}
            <SectionCard id="hadith_kudsi" title="হাদিস কুদসী পরিচিতি" icon={BookMarkedIcon} color="blue" tracked={tracked["hadith_kudsi"]} onToggle={toggle}>
              <p className="mb-4 rounded-xl border border-blue-500/12 bg-blue-500/4 px-4 py-3 text-[13px] leading-relaxed text-blue-100/60">
                {HADITH_SECTIONS[0].desc}
              </p>
              <SubSection title="হাদিসের প্রকারঃ" items={HADITH_SECTIONS[1].items!} color="blue" />
            </SectionCard>

            {/* 3. তাহারাত */}
            <SectionCard id="taharah_wudu" title="অযু, গোসল ও সালাত" icon={HeartIcon} color="emerald" tracked={tracked["taharah_wudu"]} onToggle={toggle}>
              {TAHARAH_SECTIONS.map(s => (
                <SubSection key={s.title} title={s.title} items={s.items} />
              ))}
            </SectionCard>

            {/* 4. সংগঠন */}
            <SectionCard id="org_levels" title="সংগঠন পরিচিতি" icon={UsersIcon} color="amber" tracked={tracked["org_levels"]} onToggle={toggle}>
              {ORGANISATION_SECTIONS.map(s => (
                <SubSection key={s.title} title={s.title} items={s.items} color="amber" />
              ))}
            </SectionCard>

            {/* 5. সূরা ফাতিহার অর্থ */}
            <SectionCard id="surah_fatiha" title="সূরা ফাতিহার অর্থ" icon={ScrollTextIcon} color="purple" tracked={tracked["surah_fatiha"]} onToggle={toggle}>
              <div className="rounded-xl border border-purple-500/15 bg-purple-500/5 px-5 py-4">
                <div className="mb-3 text-center font-arabic text-xl text-purple-300/80 leading-loose">
                  بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                </div>
                <div className="space-y-2.5">
                  {SURAH_FATIHA_MEANINGS.map((m, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-purple-500/15 font-mono text-[10px] text-purple-400">{i+1}</span>
                      <span className="text-[13px] leading-relaxed text-purple-100/65">{m}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-3 rounded-xl border border-amber-500/12 bg-amber-500/4 px-4 py-3">
                <div className="font-mono text-[10px] tracking-widest text-amber-400/60 uppercase mb-1.5">বিদ্রঃ</div>
                <p className="text-[12px] text-amber-100/55 leading-relaxed">
                  ১২ টি সিরা বিস্মিল্লাহভেরে মুখস্তভেরে মুখস্থকরণ (সূরা আল আসর থেকে সূরা আন নাস পর্যন্ত)
                </p>
              </div>
            </SectionCard>

            {/* 6. পাঁচ দফা কর্মসূচি */}
            <SectionCard id="dawah_steps" title="পাঁচ দফা কর্মসূচি" icon={ZapIcon} color="rose" tracked={tracked["dawah_steps"]} onToggle={toggle}>
              <div className="space-y-3">
                {DAWAH_STEPS.map((d, i) => {
                  const clr: Record<string, string> = {
                    emerald: "border-emerald-500/20 bg-emerald-500/5",
                    blue:    "border-blue-500/20 bg-blue-500/5",
                    amber:   "border-amber-500/20 bg-amber-500/5",
                    purple:  "border-purple-500/20 bg-purple-500/5",
                    rose:    "border-rose-500/20 bg-rose-500/5",
                  }
                  const txt: Record<string, string> = {
                    emerald: "text-emerald-400", blue: "text-blue-400",
                    amber: "text-amber-400", purple: "text-purple-400", rose: "text-rose-400",
                  }
                  return (
                    <div key={i} className={`rounded-xl border px-4 py-3.5 ${clr[d.color]}`}>
                      <div className="mb-1 flex items-center gap-2">
                        <span className={`font-mono text-[10px] tracking-widest uppercase ${txt[d.color]}`}>{d.step}</span>
                        <span className={`text-[13px] font-bold ${txt[d.color]}`}>— {d.title}</span>
                      </div>
                      <p className="text-[12px] leading-relaxed text-white/45">{d.desc}</p>
                    </div>
                  )
                })}
              </div>
            </SectionCard>

          </div>

          {/* ── RIGHT COLUMN (sidebar) ── */}
          <div className="flex flex-col gap-4">

            {/* Important Dates */}
            <SectionCard id="dates_all" title="গুরুত্বপূর্ণ দিবস" icon={CalendarIcon} color="amber" tracked={tracked["dates_all"]} onToggle={toggle}>
              <div className="space-y-2">
                {IMPORTANT_DATES.map((d, i) => (
                  <div key={i} className="flex items-center justify-between gap-2 rounded-lg border border-amber-500/8 bg-amber-500/4 px-3 py-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]" />
                      <span className="truncate text-[12px] text-amber-100/70">{d.name}</span>
                    </div>
                    <span className="flex-shrink-0 font-mono text-[10px] text-amber-400/60">{d.date}</span>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* Leadership */}
            <SectionCard id="leadership" title="দায়িত্বশীল পরিচিতি" icon={ShieldIcon} color="blue" tracked={tracked["leadership"]} onToggle={toggle}>
              <div className="space-y-3">
                {/* Central */}
                <div className="rounded-xl border border-blue-500/12 bg-blue-500/4 px-4 py-3">
                  <div className="mb-2 font-mono text-[9px] tracking-[3px] text-blue-400/50 uppercase">কেন্দ্রীয় দায়িত্বশীল</div>
                  {LEADERSHIP.map((l, i) => (
                    <div key={i} className="flex items-center gap-2.5 mb-2 last:mb-0">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500/15 font-bold text-[12px] text-blue-400">
                        {l.name[0]}
                      </div>
                      <div>
                        <div className="text-[12px] font-semibold text-blue-100/80">{l.name}</div>
                        <div className="font-mono text-[9px] text-blue-400/50">{l.level}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Zila */}
                {[
                  { title: "জেলা দায়িত্বশীল", roles: ["জেলা সভাপতি", "জেলা সেক্রেটারি"] },
                  { title: "থানা দায়িত্বশীল", roles: ["থানা সভাপতি", "থানা সেক্রেটারি"] },
                ].map(g => (
                  <div key={g.title} className="rounded-xl border border-white/6 bg-white/2 px-4 py-3">
                    <div className="mb-2 font-mono text-[9px] tracking-[3px] text-white/30 uppercase">{g.title}</div>
                    {g.roles.map(r => (
                      <div key={r} className="mb-1.5 flex items-center gap-2 last:mb-0">
                        <div className="h-1.5 w-1.5 rounded-full bg-white/15" />
                        <span className="text-[12px] text-white/40">{r}: </span>
                        <span className="text-[12px] italic text-white/20">পূরণযোগ্য</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* Quick progress checklist */}
            <div className="rounded-xl border border-emerald-500/15 bg-[#071310] px-5 py-4">
              <div className="mb-3 flex items-center gap-2">
                <TrophyIcon className="h-4 w-4 text-amber-400" strokeWidth={1.8} />
                <span className="text-[12px] font-semibold text-emerald-50">দ্রুত চেকলিস্ট</span>
              </div>
              <div className="space-y-1.5">
                {ALL_TRACK_KEYS.map(k => {
                  const labels: Record<string, string> = {
                    quran_stats: "কুরআন পরিচিতি", hadith_kudsi: "হাদিস কুদসী",
                    hadith_types: "হাদিসের প্রকার", taharah_wudu: "অযু ও সালাত",
                    taharah_tayammum: "তায়াম্মুম", taharah_ghusl: "গোসল",
                    org_levels: "সংগঠনের স্তর", org_worker_conditions: "কর্মীর শর্ত",
                    org_worker_qualities: "কর্মীর গুণাবলী", org_worker_tasks: "কর্মীর কাজ",
                    surah_fatiha: "সূরা ফাতিহা", dawah_steps: "পাঁচ দফা",
                    dates_all: "গুরুত্বপূর্ণ তারিখ", leadership: "দায়িত্বশীল",
                  }
                  return (
                    <button
                      key={k}
                      onClick={() => toggle(k)}
                      className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left hover:bg-white/3 transition-colors"
                    >
                      <div className={`flex h-4.5 w-4.5 flex-shrink-0 items-center justify-center rounded border transition-all ${
                        tracked[k]
                          ? "border-emerald-500 bg-emerald-500/20"
                          : "border-white/15 bg-white/3"
                      }`}>
                        {tracked[k] && <CheckIcon className="h-2.5 w-2.5 text-emerald-400" />}
                      </div>
                      <span className={`text-[12px] transition-colors ${tracked[k] ? "text-emerald-400/70 line-through" : "text-white/45"}`}>
                        {labels[k]}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Memorization note */}
            <div className="rounded-xl border border-rose-500/12 bg-rose-500/4 px-4 py-4">
              <div className="mb-2 flex items-center gap-2">
                <StarIcon className="h-4 w-4 text-rose-400" strokeWidth={1.8} />
                <span className="text-[12px] font-semibold text-rose-300">মুখস্থ করার তালিকা</span>
              </div>
              <ul className="space-y-1.5">
                {[
                  "সূরা আল আসর থেকে সূরা আন নাস (১২ টি)",
                  "সূরা ফাতিহার সম্পূর্ণ অর্থ",
                  "অযু, গোসল, তায়াম্মুমের ফরজসমূহ",
                  "কর্মীর ৮টি কাজ",
                  "৫ দফা কর্মসূচি",
                ].map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-[11px] text-rose-100/55">
                    <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-rose-400/60" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
