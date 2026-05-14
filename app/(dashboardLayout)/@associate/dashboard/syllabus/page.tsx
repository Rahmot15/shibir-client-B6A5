import {
  BookOpenIcon,
  BookMarkedIcon,
  CalendarDaysIcon,
  GraduationCapIcon,
  ShieldCheckIcon,
  SparklesIcon,
  ArrowRightIcon,
} from "lucide-react"
import AssociateSyllabusViewer from "@/components/dashboard/Associate/AssociateSyllabusViewer"

/* ─── data ─────────────────────────────────────────────────── */

const quranStudyList = [
  "সূরা ফাতিহা সম্পূর্ণ",
  "সূরা বাকারা (নির্বাচিত অংশ)",
  "সূরা আলে ইমরান (নির্বাচিত অংশ)",
  "সূরা নিসা (নির্বাচিত অংশ)",
  "সূরা মায়েদা (নির্বাচিত অংশ)",
  "সূরা আনআম (নির্বাচিত অংশ)",
  "সূরা তাওবা (নির্বাচিত অংশ)",
  "সূরা হুদ (নির্বাচিত অংশ)",
  "সূরা নাহল (নির্বাচিত অংশ)",
  "সূরা মারিয়াম",
  "সূরা আল হাজ্জ (নির্বাচিত অংশ)",
  "সূরা আল নূর",
  "সূরা ফুরকান",
  "সূরা শুয়ারা (নির্বাচিত অংশ)",
  "সূরা নামল",
  "সূরা কাসাস (নির্বাচিত অংশ)",
  "সূরা রুম",
  "সূরা লুকমান",
  "সূরা সাজদা",
  "সূরা আয়েত (আহকাম) সম্পূর্ণ",
]

const quranMemorizeGuide = [
  "সূরা ফাতিহা সম্পূর্ণ",
  "সূরা বাকারা: ১-৩০, ৯৮, ১৫০-১৫২",
  "সূরা ইউসুফ: ১-৫",
  "সূরা নাহল: ১-৫",
  "সূরা মারিয়াম: ১-১১",
  "সূরা ইয়াসীন: ১-৫",
  "সূরা গাফির: ১-৫",
  "সূরা আহকাম সম্পূর্ণ",
]

const hadithStudy = [
  { title: "রিয়াজুস সালেহীন", author: "ইমাম নববী", note: "১ম অংশ" },
  { title: "সহীহ আল বুখারী", author: "ইমাম বুখারী", note: "নির্বাচিত বাব" },
  { title: "সহীহ মুসলিম", author: "ইমাম মুসলিম", note: "নির্বাচিত বাব" },
  { title: "সুনান আত-তিরমিযী", author: "ইমাম তিরমিযী", note: "নির্বাচিত বাব" },
]

const books = [
  "কুরআন বোঝার সহজ উপায় — আবু তালিব মুহাম্মাদ",
  "হাদিস পরিচয় — মাওলানা নিজামুদ্দীন",
  "ইসলামের রাজনৈতিক ভিত্তি",
  "নৈতিক চেতনা গঠনের মূল বিষয়",
  "সংগঠন পদ্ধতি",
  "ইসলামী দ্বীন প্রচারের নীতিমালা",
  "তাওহীদ, রিসালাত এবং আখিরাত",
  "ইসলাম পরিচিতি ও অনুশীলন",
  "বিশ্বাসের সারমর্ম এবং গুরুত্ব",
  "মরণোত্তর জীবন ও দায়বদ্ধতা",
  "নামাজ ও রোজার প্রকৃত তৎপর্য",
  "জাকাত ও দাতব্যের আধ্যাত্মিক দিক",
  "দীন প্রতিষ্ঠায় কর্মসূচি",
  "ইসলামী রাষ্ট্রব্যবস্থার রূপরেখা",
  "ইসলামের জীবনব্যবস্থা",
  "শিক্ষাক্ষেত্রে ইসলামী পদ্ধতি",
  "অর্থনৈতিক নীতিমালা ও সামাজিক ন্যায়বিচার",
  "নারী ও পরিবার ব্যবস্থা",
  "ইসলামী আন্দোলনের নৈতিক ভিত্তি",
  "ইসলামী রাষ্ট্র প্রতিষ্ঠার কৌশল",
  "সত্যের সাক্ষ্য ও আধ্যাত্মিক বিকাশ",
  "ইসলামী আন্দোলনের সফলতার শর্তাবলী",
  "নবীজির বৈপ্লবিক জীবনী",
  "ইসলামী সংগঠনের পারস্পরিক সম্পর্ক",
  "বিভিন্ন যুগে ইসলামী আন্দোলন",
  "সীরাতুন নববী (সম্পূর্ণ জীবনী)",
  "ইসলামী সংগঠন ও ব্যবস্থা",
  "ফিকহ এবং আইনের মূলনীতি",
  "আত্মোন্নয়ন ও ক্যারিয়ার পরিকল্পনা",
  "সত্যের সংগ্রাম ও ত্যাগের মর্যাদা",
]

const coreSubjects = [
  "কুরআন তাজবীদ",
  "রিসালাত শিক্ষা",
  "চরিত্র উন্নয়ন",
  "ইসলামী বায়আত",
  "প্রচার পদ্ধতি",
  "সংগঠন নীতিমালা",
  "প্রশিক্ষণ কর্মসূচি",
  "সামাজিক দায়বদ্ধতা",
]

const specialDays = [
  { date: "৬ ফেব্রুয়ারী", label: "প্রতিষ্ঠাবার্ষিকী" },
  { date: "১১ মার্চ", label: "শহীদ দিবস" },
  { date: "৬ মে", label: "বালাকোট দিবস" },
  { date: "১১ মে", label: "কুরআন দিবস" },
  { date: "২৩ জুন", label: "পলাশী দিবস" },
  { date: "শাওয়াল ১", label: "ঈদুল ফিতর" },
]

/* ─── design tokens ─────────────────────────────────────────── */

const accent = {
  emerald: {
    line: "bg-emerald-400/35",
    label: "text-emerald-400",
    tag: "border-emerald-500/25 bg-emerald-500/8 text-emerald-200/80 hover:bg-emerald-500/15 hover:text-emerald-100",
    num: "text-emerald-500/45",
  },
  cyan: {
    line: "bg-cyan-400/35",
    label: "text-cyan-400",
    tag: "border-cyan-500/25 bg-cyan-500/8 text-cyan-200/80 hover:bg-cyan-500/15 hover:text-cyan-100",
    num: "text-cyan-500/45",
  },
  indigo: {
    line: "bg-indigo-400/35",
    label: "text-indigo-400",
    tag: "border-indigo-500/25 bg-indigo-500/8 text-indigo-200/80 hover:bg-indigo-500/15 hover:text-indigo-100",
    num: "text-indigo-500/45",
  },
  amber: {
    line: "bg-amber-400/35",
    label: "text-amber-400",
    tag: "border-amber-500/25 bg-amber-500/8 text-amber-200/80 hover:bg-amber-500/15 hover:text-amber-100",
    num: "text-amber-500/45",
  },
  fuchsia: {
    line: "bg-fuchsia-400/35",
    label: "text-fuchsia-400",
    tag: "border-fuchsia-500/25 bg-fuchsia-500/8 text-fuchsia-200/80 hover:bg-fuchsia-500/15 hover:text-fuchsia-100",
    num: "text-fuchsia-500/45",
  },
  sky: {
    line: "bg-sky-400/35",
    label: "text-sky-400",
    tag: "border-sky-500/25 bg-sky-500/8 text-sky-200/80 hover:bg-sky-500/15 hover:text-sky-100",
    num: "text-sky-500/45",
  },
} as const

type AccentKey = keyof typeof accent

/* ─── atoms ─────────────────────────────────────────────────── */

function SectionDivider({
  icon: Icon,
  label,
  index,
  count,
  color,
}: {
  icon: React.ElementType
  label: string
  index: string
  count?: number
  color: AccentKey
}) {
  const c = accent[color]
  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <span className={`shrink-0 font-mono text-[10px] font-black tabular-nums ${c.label} opacity-40`}>
        {index}
      </span>
      <div className={`h-px flex-1 ${c.line} opacity-60`} />
      <div className="flex shrink-0 items-center gap-2">
        <Icon className={`h-3.5 w-3.5 ${c.label}`} strokeWidth={2} />
        <span className={`text-[10px] font-bold uppercase tracking-[2px] sm:tracking-[2.5px] ${c.label}`}>
          {label}
        </span>
        {count !== undefined && (
          <span className={`rounded-full border px-1.5 py-px font-mono text-[9px] font-bold ${c.tag}`}>
            {count}
          </span>
        )}
      </div>
      <div className={`h-px flex-1 ${c.line} opacity-60`} />
    </div>
  )
}

function PillList({ items, color }: { items: string[]; color: AccentKey }) {
  const c = accent[color]
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, i) => (
        <span
          key={item}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] transition-colors ${c.tag}`}
        >
          <span className={`font-mono text-[9px] font-bold tabular-nums ${c.num}`}>
            {String(i + 1).padStart(2, "0")}
          </span>
          {item}
        </span>
      ))}
    </div>
  )
}

function InlineList({ items, color, startIndex = 1 }: { items: string[]; color: AccentKey; startIndex?: number }) {
  const c = accent[color]
  return (
    <div className="divide-y divide-white/[0.04]">
      {items.map((item, i) => (
        <div key={item} className="flex items-baseline gap-3 py-2.5 first:pt-0 last:pb-0">
          <span className={`shrink-0 font-mono text-[10px] font-bold tabular-nums ${c.num}`}>
            {String(i + startIndex).padStart(2, "0")}
          </span>
          <span className="text-[13px] leading-snug text-white/68">{item}</span>
        </div>
      ))}
    </div>
  )
}

function HadithRow({
  index,
  title,
  author,
  note,
  color,
}: {
  index: number
  title: string
  author: string
  note: string
  color: AccentKey
}) {
  const c = accent[color]
  return (
    <div className="flex items-start gap-4 border-b border-white/[0.04] py-4 last:border-0 last:pb-0 first:pt-0">
      <span className={`mt-0.5 shrink-0 font-mono text-[11px] font-black tabular-nums ${c.num}`}>
        {String(index).padStart(2, "0")}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-semibold text-white/85">{title}</p>
        <p className="mt-0.5 text-[11px] text-white/32">{author}</p>
      </div>
      <span className={`shrink-0 rounded-full border px-2.5 py-1 font-mono text-[9px] font-semibold ${c.tag}`}>
        {note}
      </span>
    </div>
  )
}

function DayRow({ date, label, color }: { date: string; label: string; color: AccentKey }) {
  const c = accent[color]
  return (
    <div className="flex items-center gap-3 border-b border-white/[0.04] py-3 last:border-0 last:pb-0 first:pt-0">
      <span className={`shrink-0 rounded-lg border px-2.5 py-1 font-mono text-[10px] font-bold ${c.tag}`}>
        {date}
      </span>
      <ArrowRightIcon className={`h-3 w-3 shrink-0 ${c.label} opacity-35`} />
      <span className="text-[13px] text-white/65">{label}</span>
    </div>
  )
}

/* ─── page ──────────────────────────────────────────────────── */

export default function AssociateSyllabus() {
  const syllabusUrl = encodeURI("/সদস্য সহায়িকা 20233.pdf")

  return (
    <div className="min-h-screen bg-[#060e09] text-emerald-50">
      {/* grid texture */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,transparent,transparent 47px,rgba(255,255,255,1) 47px,rgba(255,255,255,1) 48px)," +
            "repeating-linear-gradient(90deg,transparent,transparent 47px,rgba(255,255,255,1) 47px,rgba(255,255,255,1) 48px)",
        }}
      />

      <div className="relative mx-auto max-w-4xl px-1 pb-12 pt-6 sm:px-6 sm:pb-16 sm:pt-8 lg:px-8">

        {/* ── Hero ── */}
        <header className="mb-12">
          <div className="mb-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-emerald-500/20" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[3px] text-emerald-500/45">
              Associate Dashboard
            </span>
            <div className="h-px flex-1 bg-emerald-500/20" />
          </div>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-[32px] font-black leading-none tracking-tight text-white sm:text-[44px]">
                সদস্য
                <span className="ml-2 sm:ml-3 text-emerald-400">সিলেবাস</span>
              </h1>
              <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-white/38">
                প্রশিক্ষণ কর্মসূচি ও শিক্ষা উপকরণের সম্পূর্ণ পথপ্রদর্শক।
              </p>
            </div>

            <div className="flex gap-5">
              {[
                { n: "২০", l: "কুরআন", color: "text-emerald-400" },
                { n: "৪", l: "হাদিস", color: "text-indigo-400" },
                { n: "৩০", l: "বই", color: "text-fuchsia-400" },
                { n: "৮", l: "বিষয়", color: "text-sky-400" },
              ].map((s) => (
                <div key={s.l} className="flex flex-col items-center">
                  <span className={`font-mono text-[24px] font-black leading-none sm:text-[30px] ${s.color}`}>
                    {s.n}
                  </span>
                  <span className="mt-1 text-[9px] text-white/28">{s.l}</span>
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* PDF Viewer */}
        <AssociateSyllabusViewer pdfUrl={syllabusUrl} />

        {/* ── Sections ── */}
        <div className="mt-14 space-y-12">

          {/* 01 — Quran Study */}
          <section>
            <SectionDivider icon={BookOpenIcon} label="আল কুরআন অধ্যয়ন" index="০১" count={20} color="emerald" />
            <p className="mb-4 mt-5 text-[10px] uppercase tracking-widest text-white/22">
              সিলেবাস ভিত্তিক পাঠ তালিকা
            </p>
            <PillList items={quranStudyList} color="emerald" />
          </section>

          {/* 02 — Quran Memorize */}
          <section>
            <SectionDivider icon={ShieldCheckIcon} label="কুরআন মুখস্থ নির্দেশনা" index="০২" count={8} color="cyan" />
            <p className="mb-4 mt-5 text-[10px] uppercase tracking-widest text-white/22">
              নির্বাচিত আয়াত / সূরা
            </p>
            <PillList items={quranMemorizeGuide} color="cyan" />
          </section>

          {/* 03 — Hadith */}
          <section>
            <SectionDivider icon={BookMarkedIcon} label="আল হাদিস অধ্যয়ন" index="০৩" count={4} color="indigo" />
            <p className="mb-4 mt-5 text-[10px] uppercase tracking-widest text-white/22">
              প্রস্তাবিত গ্রন্থসমূহ
            </p>
            <div>
              {hadithStudy.map((h, i) => (
                <HadithRow key={h.title} index={i + 1} {...h} color="indigo" />
              ))}
            </div>
          </section>

          {/* 04 — Books */}
          <section>
            <SectionDivider icon={GraduationCapIcon} label="পাঠ্যবই ও ইসলামী আদর্শ" index="০৪" count={30} color="fuchsia" />
            <p className="mb-5 mt-5 text-[10px] uppercase tracking-widest text-white/22">মোট ৩০টি বই</p>
            {/* two-column on sm+ */}
            <div className="grid grid-cols-1 gap-x-10 sm:grid-cols-2">
              <div>
                <p className="mb-3 font-mono text-[9px] uppercase tracking-[2px] text-fuchsia-400/35">
                  ১ম অংশ · ০১–১৫
                </p>
                <InlineList items={books.slice(0, 15)} color="fuchsia" startIndex={1} />
              </div>
              <div className="mt-6 sm:mt-0">
                <p className="mb-3 font-mono text-[9px] uppercase tracking-[2px] text-fuchsia-400/35">
                  ২য় অংশ · ১৬–৩০
                </p>
                <InlineList items={books.slice(15)} color="fuchsia" startIndex={16} />
              </div>
            </div>
          </section>

          {/* 05 + 06 — days & core side by side on lg */}
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">

            <section>
              <SectionDivider icon={CalendarDaysIcon} label="গুরুত্বপূর্ণ দিবস" index="০৫" count={6} color="amber" />
              <p className="mb-4 mt-5 text-[10px] uppercase tracking-widest text-white/22">
                সাংগঠনিক দিনপঞ্জি
              </p>
              {specialDays.map((d) => (
                <DayRow key={d.label} {...d} color="amber" />
              ))}
            </section>

            <section>
              <SectionDivider icon={SparklesIcon} label="মূল বিষয়সূচী" index="০৬" count={8} color="sky" />
              <p className="mb-4 mt-5 text-[10px] uppercase tracking-widest text-white/22">
                আয়াত ও হাদিস মুখস্থকরণ
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {coreSubjects.map((s, i) => (
                  <div
                    key={s}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${accent.sky.tag}`}
                  >
                    <span className={`shrink-0 font-mono text-[9px] font-black tabular-nums ${accent.sky.num}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[13px] font-medium">{s}</span>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </div>

        {/* footer */}
        <div className="mt-16 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/[0.05]" />
          <span className="font-mono text-[9px] uppercase tracking-[3px] text-white/14">সদস্য · Associate</span>
          <div className="h-px flex-1 bg-white/[0.05]" />
        </div>

      </div>
    </div>
  )
}
