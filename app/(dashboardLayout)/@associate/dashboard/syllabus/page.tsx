import {
  BookOpenIcon,
  BookMarkedIcon,
  CalendarDaysIcon,
  GraduationCapIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "lucide-react"
import AssociateSyllabusViewer from "@/components/dashboard/Associate/AssociateSyllabusViewer"

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
  "রিয়াজুস সালেহীন - ইমাম নববী (১ম অংশ)",
  "সহীহ আল বুখারী - নির্বাচিত বাব",
  "সহীহ মুসলিম - নির্বাচিত বাব",
  "সুনান আত-তিরমিযী - নির্বাচিত বাব",
]

const booksPartOne = [
  "কুরআন বোঝার সহজ উপায় - আবু তালিব মুহাম্মাদ",
  "হাদিস পরিচয় - মাওলানা নিজামুদ্দীন",
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
]

const booksPartTwo = [
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
  "প্রতিষ্ঠাবার্ষিকী - ৬ ফেব্রুয়ারী",
  "শহীদ দিবস - ১১ মার্চ",
  "বালাকোট দিবস - ৬ মে",
  "কুরআন দিবস - ১১ মে",
  "পলাশী দিবস - ২৩ জুন",
  "ঈদ পালন - শাওয়াল ১ ও জিলহজ্জ ১০",
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

export default function AssociateSyllabus() {
  const syllabusUrl = encodeURI("/সদস্য সহায়িকা 20233.pdf")

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
                Associate Dashboard
              </p>
              <h1 className="text-2xl font-extrabold tracking-tight text-emerald-50 md:text-3xl">সদস্য সহায়িকা</h1>
              <p className="mt-2 max-w-2xl text-sm text-emerald-200/85 md:text-base">
                প্রশিক্ষণ কর্মসূচি এবং শিক্ষা উপকরণের সম্পূর্ণ পথপ্রদর্শক।
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

        <AssociateSyllabusViewer pdfUrl={syllabusUrl} />

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-emerald-500/20 bg-linear-to-b from-emerald-500/10 to-white/2 p-5">
            <SectionTitle icon={BookOpenIcon} title="আল কুরআন অধ্যয়ন" subtitle="সিলেবাস ভিত্তিক পাঠ তালিকা" />
            <ListGrid items={quranStudyList} />
          </article>

          <article className="rounded-2xl border border-cyan-500/20 bg-linear-to-b from-cyan-500/10 to-white/2 p-5">
            <SectionTitle icon={ShieldCheckIcon} title="কুরআন মুখস্থ নির্দেশনা" subtitle="নির্বাচিত আয়াত/সূরা" />
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
          <SectionTitle icon={SparklesIcon} title="মূল বিষয়সূচী" subtitle="আয়াত ও হাদিস মুখস্থকরণ" />
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
