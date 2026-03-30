import {
  BookOpenIcon,
  BookMarkedIcon,
  CalendarDaysIcon,
  GraduationCapIcon,
  ShieldCheckIcon,
  SparklesIcon,
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
  "এহইয়াউল হাদিস (১ম ও ২য় খণ্ড) - আবু গাফফার হাসান নদভী",
  "রাহে আমাল (২য় খণ্ড) - আল্লামা জালাল আহসান নদভী",
  "রিয়াযুস সালেহীন (১ম খণ্ড) - ইমাম মুহিউদ্দীন ইয়াহইয়া আন-নববী",
  "হাদিস শরীফ (১ম খণ্ড) - মাওলানা মুহাম্মাদ আবদুর রহিম",
]

const booksPartOne = [
  "কুরআন বুঝা সহজ - অধ্যাপক গোলাম আযম",
  "হাদিসের পরিচয় - নিজামুদ্দীন নদভী",
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
  "প্রতিষ্ঠাবার্ষিকী - ৬ ফেব্রুয়ারী",
  "শহীদ দিবস - ১১ মার্চ",
  "বালাকোট দিবস - ৬ মে",
  "কুরআন দিবস - ১১ মে",
  "পলাশী দিবস - ২৩ জুন",
  "ইসলামী শিক্ষা দিবস - ২৫ আগস্ট",
]

function SectionTitle({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ElementType
  title: string
  subtitle?: string
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3 border-b border-emerald-500/20 pb-3">
      <div className="flex items-center gap-2.5">
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2">
          <Icon className="h-4 w-4 text-emerald-300" strokeWidth={1.8} />
        </div>
        <h2 className="text-sm font-bold tracking-[1.6px] text-emerald-100 uppercase">{title}</h2>
      </div>
      {subtitle ? <p className="text-[11px] text-emerald-300/80">{subtitle}</p> : null}
    </div>
  )
}

function ListGrid({ items, columns = 2 }: { items: string[]; columns?: 1 | 2 }) {
  return (
    <div className={columns === 2 ? "grid gap-2 md:grid-cols-2" : "grid gap-2"}>
      {items.map((item, index) => (
        <div
          key={item}
          className="rounded-xl border border-white/10 bg-white/3 px-3 py-2.5 text-sm text-emerald-50/95"
        >
          <span className="mr-2 text-emerald-300/80">{index + 1}.</span>
          {item}
        </div>
      ))}
    </div>
  )
}

export default function WorkerSyllabus() {
  const sahayikaPdfUrl = encodeURI("/সাথী সহায়িকা.pdf")

  return (
    <div className="min-h-screen bg-[#050f08] px-4 py-6 text-emerald-50 md:px-6">
      <div className="mx-auto max-w-7xl">
        <section className="relative overflow-hidden rounded-3xl border border-emerald-500/25 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.18),rgba(5,15,8,0.95)_45%)] p-6 md:p-8">
          <div className="absolute -top-14 -right-14 h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="absolute -bottom-12 -left-10 h-40 w-40 rounded-full bg-amber-300/10 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold tracking-[1.5px] text-emerald-300 uppercase">
                <SparklesIcon className="h-3.5 w-3.5" />
                Worker Dashboard
              </p>
              <h1 className="text-2xl font-extrabold tracking-tight text-emerald-50 md:text-3xl">সাথী সিলেবাস</h1>
              <p className="mt-2 max-w-2xl text-sm text-emerald-200/85 md:text-base">
                আপনার দেওয়া সিলেবাস কাঠামো অনুসরণ করে আধুনিক, সহজপাঠ্য এবং থিম-সামঞ্জস্যপূর্ণ ডিজাইন।
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center sm:grid-cols-4 md:min-w-105">
              {[
                { label: "কুরআন টপিক", value: "২০" },
                { label: "হাদিস বই", value: "৪" },
                { label: "পাঠ্যবই", value: "৩০" },
                { label: "মূল বিষয়", value: "৮" },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-emerald-500/25 bg-black/20 px-3 py-2">
                  <p className="text-xl font-bold text-emerald-300">{item.value}</p>
                  <p className="text-[11px] text-emerald-100/80">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <WorkerSahayikaPdfViewer pdfUrl={sahayikaPdfUrl} />

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-emerald-500/20 bg-linear-to-b from-emerald-500/10 to-white/2 p-5">
            <SectionTitle icon={BookOpenIcon} title="আল কুরআন অধ্যয়ন" subtitle="সিলেবাস ভিত্তিক পাঠ তালিকা" />
            <ListGrid items={quranStudyList} />
          </article>

          <article className="rounded-2xl border border-cyan-500/20 bg-linear-to-b from-cyan-500/10 to-white/2 p-5">
            <SectionTitle icon={ShieldCheckIcon} title="কুরআন মুখস্থ নির্দেশনা" subtitle="নির্বাচিত আয়াত/রুকু" />
            <ListGrid items={quranMemorizeGuide} columns={1} />
          </article>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-3">
          <article className="rounded-2xl border border-indigo-500/20 bg-linear-to-b from-indigo-500/10 to-white/2 p-5 xl:col-span-2">
            <SectionTitle icon={BookMarkedIcon} title="আল হাদিস অধ্যয়ন" subtitle="প্রস্তাবিত গ্রন্থসমূহ" />
            <ListGrid items={hadithStudy} columns={1} />
          </article>

          <article className="rounded-2xl border border-amber-500/20 bg-linear-to-b from-amber-500/10 to-white/2 p-5">
            <SectionTitle icon={CalendarDaysIcon} title="গুরুত্বপূর্ণ দিবস" subtitle="সাংগঠনিক দিনপঞ্জি" />
            <ListGrid items={specialDays} columns={1} />
          </article>
        </section>

        <section className="mt-6 rounded-2xl border border-fuchsia-500/20 bg-linear-to-b from-fuchsia-500/10 to-white/2 p-5">
          <SectionTitle icon={GraduationCapIcon} title="পাঠ্যবই ও ইসলামী আদর্শ" subtitle="মোট ৩০টি বই" />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-black/15 p-3">
              <p className="mb-3 text-xs font-semibold tracking-[1.5px] text-fuchsia-200 uppercase">১ম অংশ (১-১৫)</p>
              <ListGrid items={booksPartOne} columns={1} />
            </div>

            <div className="rounded-xl border border-white/10 bg-black/15 p-3">
              <p className="mb-3 text-xs font-semibold tracking-[1.5px] text-fuchsia-200 uppercase">২য় অংশ (১৬-৩০)</p>
              <ListGrid items={booksPartTwo} columns={1} />
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-sky-500/20 bg-linear-to-b from-sky-500/10 to-white/2 p-5">
          <SectionTitle icon={SparklesIcon} title="আয়াত ও হাদিস মুখস্থকরণ" subtitle="মূল বিষয়সমূহ" />
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {coreSubjects.map((subject) => (
              <div
                key={subject}
                className="rounded-xl border border-sky-300/20 bg-sky-500/10 px-3 py-2 text-sm text-sky-100"
              >
                {subject}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
