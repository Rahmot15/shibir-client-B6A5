import {
  BookOpenIcon,
  BookMarkedIcon,
  CalendarDaysIcon,
  GraduationCapIcon,
  ShieldCheckIcon,
  SparklesIcon,
  HashIcon,
} from "lucide-react"
import WorkerSahayikaPdfViewer from "@/components/dashboard/Worker/WorkerSahayikaPdfViewer"

const quranStudyList = [
  "সূরা নাবা থেকে সূরা নাস (১-২০)",
  "সূরা আল ইমরান: ১০-২০ রুকু",
  "সূরা আত্তাওবা",
  "সূরা ইউনুস: ১১ রুকু",
  "সূরা আল নূর: ২৭-৩০",
  "সূরা নূন: শেষ রুকু",
  "সূরা আল আম্বাকুর: ১ম রুকু",
  "সূরা নূন হুছরাত: ১ম রুকু",
  "সূরা নাবা আলাকিয়া",
  "সূরা নাবা হাদিদ: শেষ রুকু",
  "সূরা আল হক",
  "সূরা নাবা মুজ্জাম্মিল",
  "সূরা নাবা মুদ্দাসসির: ১-৭",
  "সূরা নাবা ইনশিকাক",
  "সূরা নাবা বুরুজ",
  "সূরা নাবা গাশিয়া",
  "সূরা নাবালান লাইল",
  "সূরা নাবা নাযআত",
  "সূরা নাবা আছর",
  "সূরা নাবা ফজরাত",
]

const quranMemorizeGuide = [
  "সূরা আল ইমরান: ১-২০, ৫০-৫৭, ৭৮, ১৮৫",
  "সূরা আল হুজর: ২৬-২৮",
  "সূরা আল নূর: ২৭-৩০",
  "সূরা নূন: ৭৮",
  "সূরা মুমিনুন: ১-১১",
  "সূরা নাবা হুছরাত: শেষ রুকু",
]

const hadithStudy = [
  "এহইয়াউল হাদিস (১ম ও ২য় খণ্ড) — আবু গাফফার হাসান নদভী",
  "রাহে আমাল (২য় খণ্ড) — আল্লামা জালাল আহসান নদভী",
  "রিয়াযুস সালেহীন (১ম খণ্ড) — ইমাম মুহিউদ্দীন ইয়াহইয়া আন-নববী",
  "হাদিস শরীফ (১ম খণ্ড) — মাওলানা মুহাম্মাদ আবদুর রহিম",
]

const booksPartOne = [
  "কুরআন বুঝা সহজ — অধ্যাপক গোলাম আযম",
  "হাদিসের পরিচয় — নিজামুদ্দীন নদভী",
  "সংগঠন ও দায়িত্ববোধ",
  "চরিত্র গঠনের মৌলিক উপাদান",
  "কর্মপদ্ধতি",
  "আদর্শ কিভাবে প্রচার করতে হবে",
  "তাওহীদ রেসালাত ও আখিরাত",
  "ইসলাম পরিচিতি",
  "ইমানের হাকীকত",
  "মৃত্যু ঝঙ্কারের ওপারে",
  "নামাজ-রোজার হাকীকত",
  "যাকাতের হাকীকত",
  "ইকামাতে দ্বীন",
  "ইসলামী রাষ্ট্র ব্যবস্থা",
  "ইসলামী জীবনব্যবস্থা",
]

const booksPartTwo = [
  "শিক্ষাব্যবস্থায় ইসলামী রূপরেখা",
  "ইসলামের অর্থনৈতিক নীতিমালা",
  "পর্দা ও নারী",
  "ইসলামী আন্দোলনের নৈতিক ভিত্তি",
  "ইসলামী রাষ্ট্র কিভাবে প্রতিষ্ঠিত হয়",
  "সত্যের সাক্ষ্য",
  "ইসলামী আন্দোলনের সাফল্যের শর্তাবলী",
  "রসূলুল্লাহর বিপ্লবী জীবন",
  "ইসলামী আন্দোলনের কর্মীদের পারস্পরিক সম্পর্ক",
  "যুগে যুগে ইসলামী আন্দোলন",
  "আসসিরাতুন নববী (১ম ও ২য় খণ্ড)",
  "ইসলামী আন্দোলন ও সংগঠন",
  "আসার ফেকাহ (১ম ও ২য় খণ্ড)",
  "ক্যারিয়ার বিকশিত জীবনের দ্বার",
  "সত্যের ডাক ও সংগ্রাম",
]

const coreSubjects = [
  "তাজবিদ",
  "রিসালাত",
  "আখলাক",
  "বায়আত",
  "দাওয়াত",
  "সংগঠন",
  "প্রশিক্ষণ",
  "ইসলামী সমাজ বিনির্মাণ",
]

const specialDays = [
  { date: "৬ ফেব্রুয়ারী", name: "প্রতিষ্ঠাবার্ষিকী" },
  { date: "১১ মার্চ", name: "শহীদ দিবস" },
  { date: "৬ মে", name: "বালাকোট দিবস" },
  { date: "১১ মে", name: "কুরআন দিবস" },
  { date: "২৩ জুন", name: "পলাশী দিবস" },
  { date: "২৫ আগস্ট", name: "ইসলামী শিক্ষা দিবস" },
]

/* ───────────────────────── small atoms ───────────────────────── */

function Badge({ children, color = "emerald" }: { children: React.ReactNode; color?: string }) {
  const palette: Record<string, string> = {
    emerald: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    cyan: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
    indigo: "border-indigo-500/30 bg-indigo-500/10 text-indigo-300",
    amber: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    fuchsia: "border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-300",
    sky: "border-sky-500/30 bg-sky-500/10 text-sky-300",
  }
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold tracking-wider uppercase ${palette[color] ?? palette.emerald}`}
    >
      {children}
    </span>
  )
}

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  color = "emerald",
  count,
}: {
  icon: React.ElementType
  title: string
  subtitle?: string
  color?: string
  count?: number
}) {
  const accent: Record<string, string> = {
    emerald: "text-emerald-400 bg-emerald-500/12 border-emerald-500/25",
    cyan: "text-cyan-400 bg-cyan-500/12 border-cyan-500/25",
    indigo: "text-indigo-400 bg-indigo-500/12 border-indigo-500/25",
    amber: "text-amber-400 bg-amber-500/12 border-amber-500/25",
    fuchsia: "text-fuchsia-400 bg-fuchsia-500/12 border-fuchsia-500/25",
    sky: "text-sky-400 bg-sky-500/12 border-sky-500/25",
  }
  const divider: Record<string, string> = {
    emerald: "bg-emerald-500/20",
    cyan: "bg-cyan-500/20",
    indigo: "bg-indigo-500/20",
    amber: "bg-amber-500/20",
    fuchsia: "bg-fuchsia-500/20",
    sky: "bg-sky-500/20",
  }
  const cls = accent[color] ?? accent.emerald

  return (
    <div className="mb-5">
      <div className="mb-4 flex items-start gap-3">
        <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${cls}`}>
          <Icon className="h-4 w-4" strokeWidth={1.8} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-sm font-bold tracking-wide text-white/90">{title}</h2>
            {count !== undefined && (
              <span className={`rounded-full border px-2 py-px font-mono text-[9px] font-bold ${cls}`}>{count}</span>
            )}
          </div>
          {subtitle && <p className="mt-0.5 text-[11px] text-white/35">{subtitle}</p>}
        </div>
      </div>
      <div className={`h-px w-full ${divider[color] ?? divider.emerald}`} />
    </div>
  )
}

/* numbered list row */
function ListRow({ index, text, color = "emerald" }: { index: number; text: string; color?: string }) {
  const num: Record<string, string> = {
    emerald: "text-emerald-500/60",
    cyan: "text-cyan-500/60",
    indigo: "text-indigo-500/60",
    amber: "text-amber-500/60",
    fuchsia: "text-fuchsia-500/60",
    sky: "text-sky-500/60",
  }
  return (
    <div className="flex items-start gap-2.5 rounded-lg border border-white/[0.05] bg-white/[0.025] px-3 py-2.5 transition-colors hover:bg-white/[0.04]">
      <span className={`mt-px shrink-0 font-mono text-[11px] font-bold tabular-nums ${num[color] ?? num.emerald}`}>
        {String(index).padStart(2, "0")}
      </span>
      <span className="text-[13px] leading-snug text-white/75">{text}</span>
    </div>
  )
}

function TwoColList({ items, color = "emerald" }: { items: string[]; color?: string }) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {items.map((item, i) => (
        <ListRow key={item} index={i + 1} text={item} color={color} />
      ))}
    </div>
  )
}

function SingleColList({ items, color = "emerald" }: { items: string[]; color?: string }) {
  return (
    <div className="grid grid-cols-1 gap-2">
      {items.map((item, i) => (
        <ListRow key={item} index={i + 1} text={item} color={color} />
      ))}
    </div>
  )
}

/* card wrapper */
function Card({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`rounded-2xl border border-white/[0.08] bg-[#0a1810]/80 p-5 backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  )
}

/* ─────────────────────────── page ─────────────────────────────── */

export default function WorkerSyllabus() {
  const sahayikaPdfUrl = encodeURI("/সাথী সহায়িকা.pdf")

  const stats = [
    { label: "কুরআন টপিক", value: "২০" },
    { label: "হাদিস বই", value: "৪" },
    { label: "পাঠ্যবই", value: "৩০" },
    { label: "মূল বিষয়", value: "৮" },
  ]

  return (
    <div className="min-h-screen bg-[#060e09] px-4 pb-12 pt-6 text-emerald-50 sm:px-6 lg:px-8">

      <div className="relative mx-auto max-w-5xl">

        {/* ── Hero ── */}
        <header className="mb-8 overflow-hidden rounded-3xl border border-emerald-500/20 bg-[#0b1a10]">
          {/* top accent line */}
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />

          <div className="relative px-5 py-7 sm:px-8 sm:py-8">
            {/* decorative glow blobs */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-teal-400/8 blur-3xl" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <Badge color="emerald">Worker Syllabus</Badge>
                <h1 className="mt-3 text-[26px] font-extrabold leading-tight tracking-tight text-white sm:text-[32px]">
                  সাথী সিলেবাস
                </h1>
                <p className="mt-2 max-w-lg text-[13px] leading-relaxed text-white/45 sm:text-sm">
                  কর্মী পর্যায়ের সম্পূর্ণ পাঠ্যক্রম — কুরআন, হাদিস, পাঠ্যবই এবং মূল বিষয়সমূহ।
                </p>
              </div>

              {/* stat chips */}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:min-w-[320px]">
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className="flex flex-col items-center rounded-xl border border-emerald-500/15 bg-black/25 px-3 py-3 text-center"
                  >
                    <span className="font-mono text-[22px] font-black leading-none text-emerald-400">{s.value}</span>
                    <span className="mt-1 text-[10px] font-medium text-white/35">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* ── PDF viewer ── */}
        <WorkerSahayikaPdfViewer pdfUrl={sahayikaPdfUrl} />

        {/* ── Quran Study + Memorize ── */}
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-5">
          {/* study — wider */}
          <Card className="lg:col-span-3">
            <SectionHeader
              icon={BookOpenIcon}
              title="আল কুরআন অধ্যয়ন"
              subtitle="সিলেবাস ভিত্তিক পাঠ তালিকা"
              color="emerald"
              count={20}
            />
            <TwoColList items={quranStudyList} color="emerald" />
          </Card>

          {/* memorize — narrower */}
          <Card className="lg:col-span-2">
            <SectionHeader
              icon={ShieldCheckIcon}
              title="কুরআন মুখস্থ নির্দেশনা"
              subtitle="নির্বাচিত আয়াত / রুকু"
              color="cyan"
              count={6}
            />
            <SingleColList items={quranMemorizeGuide} color="cyan" />
          </Card>
        </div>

        {/* ── Hadith + Special Days ── */}
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-5">
          {/* hadith — wider */}
          <Card className="md:col-span-3">
            <SectionHeader
              icon={BookMarkedIcon}
              title="আল হাদিস অধ্যয়ন"
              subtitle="প্রস্তাবিত গ্রন্থসমূহ"
              color="indigo"
              count={4}
            />
            <SingleColList items={hadithStudy} color="indigo" />
          </Card>

          {/* special days — narrower */}
          <Card className="md:col-span-2">
            <SectionHeader
              icon={CalendarDaysIcon}
              title="গুরুত্বপূর্ণ দিবস"
              subtitle="সাংগঠনিক দিনপঞ্জি"
              color="amber"
              count={6}
            />
            <div className="grid grid-cols-1 gap-2">
              {specialDays.map((d) => (
                <div
                  key={d.name}
                  className="flex items-center gap-3 rounded-lg border border-white/[0.05] bg-white/[0.025] px-3 py-2.5 hover:bg-white/[0.04] transition-colors"
                >
                  <span className="shrink-0 rounded-md border border-amber-500/25 bg-amber-500/10 px-2.5 py-1 font-mono text-[10px] font-bold text-amber-400 tabular-nums">
                    {d.date}
                  </span>
                  <span className="text-[13px] text-white/70">{d.name}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* ── Books ── */}
        <Card className="mt-4">
          <SectionHeader
            icon={GraduationCapIcon}
            title="পাঠ্যবই ও ইসলামী আদর্শ"
            subtitle="মোট ৩০টি বই"
            color="fuchsia"
            count={30}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="mb-3 font-mono text-[10px] font-semibold tracking-[1.8px] text-fuchsia-400/60 uppercase">
                ১ম অংশ · ০১–১৫
              </p>
              <SingleColList items={booksPartOne} color="fuchsia" />
            </div>
            <div>
              <p className="mb-3 font-mono text-[10px] font-semibold tracking-[1.8px] text-fuchsia-400/60 uppercase">
                ২য় অংশ · ১৬–৩০
              </p>
              <SingleColList items={booksPartTwo} color="fuchsia" />
            </div>
          </div>
        </Card>

        {/* ── Core subjects ── */}
        <Card className="mt-4">
          <SectionHeader
            icon={SparklesIcon}
            title="আয়াত ও হাদিস মুখস্থকরণ"
            subtitle="মূল বিষয়সমূহ"
            color="sky"
            count={8}
          />
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {coreSubjects.map((subject, i) => (
              <div
                key={subject}
                className="group relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-sky-500/15 bg-sky-500/5 px-3 py-4 text-center transition-all hover:border-sky-500/30 hover:bg-sky-500/10"
              >
                {/* faint index */}
                <span className="absolute right-2 top-1.5 font-mono text-[9px] font-bold text-sky-500/20 group-hover:text-sky-500/35">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <HashIcon className="mb-2 h-3.5 w-3.5 text-sky-500/40" strokeWidth={2} />
                <span className="text-[13px] font-semibold text-sky-100/85">{subject}</span>
              </div>
            ))}
          </div>
        </Card>

      </div>
    </div>
  )
}
