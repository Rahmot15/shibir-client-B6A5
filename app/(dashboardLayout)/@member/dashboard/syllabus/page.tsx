'use client';

import { useState } from 'react';
import { CheckCircle2, Circle, Award } from 'lucide-react';

type SyllabusModule = {
  id: number;
  title: string;
  focus: string[];
  books: string[];
};

const STORAGE_KEY = 'syllabus_progress';

const syllabusModules: SyllabusModule[] = [
  {
    id: 1,
    title: "আল কুরআন",
    focus: [
      "নাজিল, সংকলন, তাজবিদ এবং বিষয়ভিত্তিক অধ্যয়ন",
      "দারস প্রস্তুতি ও গুরুত্বপূর্ণ অংশ মুখস্থ",
      "তাফসির, উলুমুল কুরআন, কুরআনের ভাষা ও গবেষণা নির্দেশনা",
    ],
    books: ["তাফহীমুল কুরআন", "ফি জিলালিল কুরআন", "ইবনে কাসীর", "মা'আরেফুল কুরআন"],
  },
  {
    id: 2,
    title: "আল হাদিস",
    focus: [
      "মৌলিক হাদিস গ্রন্থসমূহ থেকে পাঠ পরিকল্পনা",
      "হাদিসের আদব, কুদসি হাদিস, শামায়েল এবং বিভ্রান্তি নিরসন",
      "দৈনন্দিন জীবনের জন্য হাদিসভিত্তিক আচরণ চর্চা",
    ],
    books: ["বুখারী", "মুসলিম", "তিরমিজি", "আল আদাবুল মুফরাদ"],
  },
  {
    id: 3,
    title: "ইসলামী দর্শন",
    focus: [
      "আত্মশুদ্ধি, তাওহীদ, ইতিহাস-দর্শন এবং নৈতিক চিন্তা",
      "আধুনিক চিন্তার সংকট ও ইজতিহাদ",
      "ইসলামী দৃষ্টিকোণ থেকে মানুষ, সমাজ ও সভ্যতার দর্শন",
    ],
    books: ["আসরারে খুদী", "রুমুযে বেখুদী", "ইসলামে ধর্মীয় চিন্তার পুনর্গঠন"],
  },
  {
    id: 4,
    title: "ইসলামের সমাজবিধান",
    focus: [
      "পরিবার, আত্মীয়তা, প্রতিবেশ, নারী অধিকার ও সামাজিক ন্যায়",
      "সামাজিক পরিবর্তনের নীতি ও ইসলামী সমাজ গঠনের কর্মধারা",
      "বাংলাদেশের সামাজিক কাঠামো এবং ইসলামী সমাজদর্শনের প্রয়োগ",
    ],
    books: ["ইসলামের দৃষ্টিতে সমাজ", "Family Life in Islam", "ইসলাম ও সামাজিক সুবিচার"],
  },
  {
    id: 5,
    title: "ইসলামী আন্দোলন ও দাওয়াত",
    focus: [
      "দাওয়াতি কাজের পদ্ধতি, বিভ্রান্তি ও সংশোধন",
      "সংগঠন পরিচালনা, নেতৃত্ব ও কর্মশক্তি উন্নয়ন",
      "বিশ্ব প্রেক্ষাপটে ইসলামী আন্দোলনের অভিজ্ঞতা",
    ],
    books: ["ইসলামী আন্দোলন সাফল্য ও বিভ্রান্তি", "ইসলামী দাওয়াত ও তার দাবি"],
  },
  {
    id: 6,
    title: "ইসলামী অর্থনীতি",
    focus: [
      "উৎপাদন, বণ্টন, বিনিয়োগ, ভোগ ও রাষ্ট্রের ভূমিকা",
      "জাকাত, সুদ, ব্যাংক-বীমা ও শ্রম-পুঁজি প্রশ্ন",
      "বাংলাদেশ ও মুসলিম বিশ্বের অর্থনৈতিক সমস্যা-সম্ভাবনা",
    ],
    books: ["ইসলামী অর্থনীতি", "ইসলামের অর্থনীতি", "সুদ ও আধুনিক ব্যাংকিং"],
  },
  {
    id: 7,
    title: "ইসলামের রাজনৈতিক ব্যবস্থা",
    focus: [
      "রাষ্ট্র, সার্বভৌমত্ব, শাসনতন্ত্র, নির্বাচন ও মৌলিক অধিকার",
      "দলপ্রথা, পার্লামেন্ট, বিচার ও প্রশাসনের ভারসাম্য",
      "অমুসলিম অধিকার, বৈদেশিক সম্পর্ক এবং মাকাসিদুশ শারিয়াহ",
    ],
    books: ["ইসলামী রাষ্ট্রব্যবস্থা", "খেলাফত ও রাজতন্ত্র", "ইসলামী রাষ্ট্র ও সংবিধান"],
  },
  {
    id: 8,
    title: "ইসলামী শিক্ষাব্যবস্থা",
    focus: [
      "শিক্ষার উদ্দেশ্য, দ্বিমুখী শিক্ষাব্যবস্থার সংকট ও প্রতিকার",
      "কারিগরি, বিজ্ঞান, নারী ও শিশু শিক্ষার ইসলামী রূপরেখা",
      "শিক্ষা পুনর্গঠন ও বাস্তবায়ন পদ্ধতি",
    ],
    books: ["ইসলামী শিক্ষাব্যবস্থার মূলনীতি", "জ্ঞানের ইসলামীকরণ"],
  },
  {
    id: 9,
    title: "তুলনামূলক অধ্যয়ন",
    focus: [
      "ধর্মীয় মতবাদ: হিন্দু, খ্রিষ্ট, বৌদ্ধ, ইহুদি, জরথুস্ত্র, কাদিয়ানী ইত্যাদি",
      "অন্যান্য মতবাদ: জাতীয়তাবাদ, বস্তুবাদ, উদারনীতি, ধর্মনিরপেক্ষতা",
      "ইসলামের সাথে তুলনামূলক বিশ্লেষণ",
    ],
    books: ["ইসলাম ও জাতীয়তাবাদ", "ধর্মনিরপেক্ষ মতবাদ", "History of Western Philosophy"],
  },
  {
    id: 10,
    title: "ইসলাম ও বিজ্ঞান",
    focus: [
      "বিজ্ঞান বিষয়ে ইসলামী দৃষ্টিভঙ্গি",
      "কুরআনে বৈজ্ঞানিক নিদর্শন এবং মুসলিম অবদান",
      "বিজ্ঞানের সীমাবদ্ধতা ও মূল্যবোধের প্রশ্ন",
    ],
    books: ["কুরআনে বিজ্ঞান", "বাইবেল কোরআন ও বিজ্ঞান"],
  },
  {
    id: 11,
    title: "বিশ্ব সাহিত্য: ইসলামী পরিপ্রেক্ষিত",
    focus: [
      "সাহিত্যের মূল্যায়ন, জীবন-সাহিত্য সম্পর্ক",
      "ইসলামী সাহিত্য, মানবিক মূল্যবোধ ও বাংলা সাহিত্য",
      "বিশ্বখ্যাত কবি-সাহিত্যিকদের পরিচিতি ও তুলনা",
    ],
    books: ["সমাজ সংস্কৃতি সাহিত্য", "মক্কার পথ", "বিশ্ব সাহিত্য"],
  },
  {
    id: 12,
    title: "সমাজতন্ত্র",
    focus: [
      "মার্ক্সবাদ, লেনিনবাদ, সমাজতন্ত্রের বিভিন্ন রূপ",
      "দ্বান্দ্বিক জড়বাদ, শ্রেণিসংগ্রাম ও উদ্বৃত্ত মূল্য তত্ত্ব",
      "মুসলিম বিশ্বে সমাজতান্ত্রিক প্রভাব ও প্রতিক্রিয়া",
    ],
    books: ["কমিউনিস্ট ইশতেহার", "Marxism or Islam", "সমাজতন্ত্র বনাম ইসলাম"],
  },
  {
    id: 13,
    title: "বাংলাদেশের সমাজ ও সংস্কৃতি",
    focus: [
      "ঐতিহাসিক পটভূমি, ইসলামের আগমন ও সামাজিক পরিবর্তন",
      "বংশ-বর্ণ, সাম্প্রদায়িকতা, আধুনিকতা ও শ্রেণিসংঘাত",
      "ইসলামী মূল্যবোধভিত্তিক পুনর্গঠনের সমস্যা-সম্ভাবনা",
    ],
    books: ["বাংলাদেশের কালচার", "বাংলাদেশে ইসলাম", "আমাদের জাতিসত্তার বিকাশধারা"],
  },
  {
    id: 14,
    title: "বাংলাদেশের সাহিত্য ও সাংস্কৃতিক আন্দোলন",
    focus: [
      "প্রাচীন-মধ্যযুগ থেকে আধুনিক সাহিত্যধারা",
      "ইসলাম, জাতীয়তাবাদ, ধর্মনিরপেক্ষতা ও সমাজতন্ত্রের সাংস্কৃতিক দ্বন্দ্ব",
      "গণমাধ্যমের প্রভাব ও আদর্শিক সাহিত্য নির্মাণ",
    ],
    books: ["বাংলা সাহিত্যের ইতিবৃত্ত", "মুসলিম মানস ও বাংলা সাহিত্য"],
  },
  {
    id: 15,
    title: "বাংলাদেশের রাজনীতি ও গতিধারা",
    focus: [
      "ঐতিহাসিক ধারা: ভাষা আন্দোলন, ছয় দফা, স্বাধীনতা",
      "আদর্শিক শক্তি, দলীয় রাজনীতি ও রাষ্ট্রীয় চরিত্র বিশ্লেষণ",
      "বাংলাদেশের রাজনৈতিক ভবিষ্যৎ নিয়ে পর্যালোচনা",
    ],
    books: ["আমার দেখা রাজনীতির পঞ্চাশ বছর", "একশ বছরের রাজনীতি"],
  },
  {
    id: 16,
    title: "সমসাময়িক সামাজিক সমস্যা ও সমাধান",
    focus: [
      "দারিদ্র্য, দুর্নীতি, কুসংস্কার, শিশুশ্রমসহ মূল সামাজিক সংকট",
      "সমস্যার কারণ, নীতিগত সমাধান ও কর্মসূচি",
      "সরকার, সামাজিক সংগঠন ও ইসলামী দৃষ্টিকোণ",
    ],
    books: ["Contemporary Social Problems", "বাংলাদেশে এনজিও"],
  },
  {
    id: 17,
    title: "বর্তমান দুনিয়ার ইসলামী আন্দোলন",
    focus: [
      "খিলাফত-পরবর্তী বিশ্বে ইসলামী আন্দোলনের বিকাশ",
      "ইখওয়ান, জামায়াতে ইসলামীসহ বিভিন্ন দেশের অভিজ্ঞতা",
      "আন্তর্জাতিক ইসলামী সংগঠন, সংকট ও ভবিষ্যৎ",
    ],
    books: ["জামায়াতে ইসলামীর কার্যবিবরণী", "Priorities of the Islamic Movement"],
  },
  {
    id: 18,
    title: "মুসলিম বিশ্ব",
    focus: [
      "মুসলিম বিশ্বের জনসংখ্যা, সম্পদ, রাজনীতি ও অর্থনীতি",
      "ফিলিস্তিন, কাশ্মীর, আরাকানসহ সংকটপূর্ণ অঞ্চলসমূহ",
      "মুসলিম বিশ্ব ও বিশ্বরাজনীতি, আধুনিকীকরণ ও ভবিষ্যৎ",
    ],
    books: ["Basic Information of Muslim World", "U.N. Yearbook"],
  },
  {
    id: 19,
    title: "আন্তর্জাতিক রাজনীতি",
    focus: [
      "জাতীয় শক্তি, ক্ষমতার ভারসাম্য, যৌথ নিরাপত্তা",
      "NATO, ASEAN, SAARC, OIC, WTOসহ জোট ও প্রতিষ্ঠান",
      "পররাষ্ট্রনীতি, ভূরাজনীতি ও সমসাময়িক বৈশ্বিক সংকট",
    ],
    books: ["আন্তর্জাতিক রাজনীতি", "International Relations", "Politics Among Nations"],
  },
  {
    id: 20,
    title: "আকাইদ",
    focus: [
      "ঈমানের মূল ভিত্তি: তাওহীদ, রিসালাত, আখিরাত, তাকদির",
      "শিরক, বিদআত, ভ্রান্ত মতবাদ ও সংশোধন",
      "আকিদাগত দৃঢ়তা গঠনে রেফারেন্সভিত্তিক অধ্যয়ন",
    ],
    books: ["ইসলামী আকীদা", "তাওহীদ রিসালাত ও আখেরাত", "কোরআনের চারটি মৌলিক পরিভাষা"],
  },
  {
    id: 21,
    title: "মাসআলা-মাসায়েল",
    focus: [
      "তাহারাত, অযু, গোসল, ইবাদত ও মুয়ামালাত",
      "দৈনন্দিন জীবনে শরিয়তের বিধান প্রয়োগ",
      "ক্লাসিক ও সমকালীন ফিকহি রেফারেন্স পাঠ",
    ],
    books: ["আসান ফিকাহ", "ইসলামে হালাল হারামের বিধান", "রাসায়েল ও মাসায়েল"],
  },
  {
    id: 22,
    title: "ফিকাহ ও ইসলামী আইন",
    focus: [
      "ফিকাহর বিকাশ, ইজতিহাদ এবং উসুল",
      "পাশ্চাত্য আইন বনাম ইসলামী আইনের তুলনা",
      "সমসাময়িক আইনগত সমস্যা সমাধানের কাঠামো",
    ],
    books: ["ইসলামী আইন বনাম মানব রচিত আইন", "ইসলামী উসুলে ফিকাহ"],
  },
  {
    id: 23,
    title: "ক্যারিয়ার ও দক্ষতা",
    focus: [
      "একাডেমিক উৎকর্ষ, ক্যারিয়ার পরিকল্পনা ও গবেষণা দক্ষতা",
      "আইটি, ভাষা, উদ্যোক্তা ও বাস্তব কারিগরি দক্ষতা",
      "ভবিষ্যৎ সমাজ-রাষ্ট্রে নেতৃত্বের প্রস্তুতি",
    ],
    books: ["ক্যারিয়ার বিকশিত জীবনের দ্বার", "Road to Higher Study"],
  },
];

export default function MemberSyllabus() {
  const [completedModules, setCompletedModules] = useState<Set<number>>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          return new Set(JSON.parse(stored));
        } catch (e) {
          console.error('Failed to load progress:', e);
        }
      }
    }
    return new Set();
  });

  const toggleModuleCompletion = (id: number) => {
    const updated = new Set(completedModules);
    if (updated.has(id)) {
      updated.delete(id);
    } else {
      updated.add(id);
    }
    setCompletedModules(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(updated)));
  };

  const progressPercentage = Math.round((completedModules.size / syllabusModules.length) * 100);

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,#032b22_0%,#031711_45%,#020b09_100%)] px-3 py-4 text-emerald-50 sm:px-4 sm:py-6 lg:px-6 lg:py-8">
      <section className="mx-auto w-full max-w-7xl space-y-4 sm:space-y-6">
        <header className="rounded-2xl border border-emerald-500/25 bg-emerald-950/50 p-4 shadow-[0_0_0_1px_rgba(16,185,129,0.12)] backdrop-blur sm:p-6">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300/80">
              Member Dashboard
            </p>
            <h1 className="text-2xl font-semibold leading-tight text-emerald-50 sm:text-3xl">
              Higher Syllabus
            </h1>
            <p className="max-w-4xl text-sm text-emerald-100/75 sm:text-base">
              উচ্চতর সিলেবাসের পূর্ণাঙ্গ বিষয়ভিত্তিক পাঠ-রোডম্যাপ। প্রতিটি মডিউল পড়ার পর চেকমার্ক করুন।
            </p>
          </div>
        </header>

        <section className="rounded-2xl border border-emerald-500/25 bg-emerald-950/50 p-4 sm:p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-base font-semibold text-emerald-100 sm:text-lg">
                <Award className="h-5 w-5 text-emerald-400" />
                আপনার অগ্রগতি
              </h2>
              <span className="text-2xl font-bold text-emerald-400">{progressPercentage}%</span>
            </div>
            <div className="space-y-1">
              <div className="h-3 overflow-hidden rounded-full bg-emerald-950/60 ring-1 ring-emerald-500/20">
                <div
                  className="h-full bg-linear-to-r from-emerald-500 to-emerald-400 transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <p className="text-xs text-emerald-300/80">
                {completedModules.size} of {syllabusModules.length} modules completed
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <article className="rounded-xl border border-emerald-500/25 bg-emerald-950/40 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-emerald-300/80">মোট মডিউল</p>
            <p className="mt-2 text-2xl font-semibold text-emerald-50">{syllabusModules.length}</p>
          </article>
          <article className="rounded-xl border border-emerald-500/25 bg-emerald-950/40 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-emerald-300/80">সম্পন্ন</p>
            <p className="mt-2 text-2xl font-semibold text-emerald-400">{completedModules.size}</p>
          </article>
          <article className="rounded-xl border border-emerald-500/25 bg-emerald-950/40 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-emerald-300/80">অবশিষ্ট</p>
            <p className="mt-2 text-2xl font-semibold text-emerald-300">
              {syllabusModules.length - completedModules.size}
            </p>
          </article>
          <article className="rounded-xl border border-emerald-500/25 bg-emerald-950/40 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-emerald-300/80">সম্পূর্ণতা</p>
            <p className="mt-2 text-2xl font-semibold text-emerald-50">{progressPercentage}%</p>
          </article>
        </section>

        <section className="rounded-2xl border border-emerald-500/25 bg-emerald-950/35 p-3 sm:p-4 lg:p-5">
          <h2 className="text-base font-semibold text-emerald-100 sm:text-lg">মডিউল তালিকা</h2>
          <div className="mt-4 grid gap-3">
            {syllabusModules.map((module) => (
              <details
                key={module.id}
                className="group rounded-xl border border-emerald-500/20 bg-[#02110d] p-3 sm:p-4"
              >
                <summary className="cursor-pointer list-none text-sm font-semibold text-emerald-100 sm:text-base">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleModuleCompletion(module.id);
                      }}
                      className="shrink-0 rounded-full p-0.5 hover:bg-emerald-500/10 transition-colors"
                    >
                      {completedModules.has(module.id) ? (
                        <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                      ) : (
                        <Circle className="h-6 w-6 text-emerald-500/40" />
                      )}
                    </button>
                    <span
                      className={`inline-flex min-w-10 items-center justify-center rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300 ${
                        completedModules.has(module.id) ? 'bg-emerald-500/20' : ''
                      }`}
                    >
                      {module.id}
                    </span>
                    <span className={completedModules.has(module.id) ? 'line-through text-emerald-300/60' : ''}>
                      {module.title}
                    </span>
                  </div>
                </summary>

                <div className="mt-3 grid gap-3 lg:grid-cols-2">
                  <div className="rounded-lg border border-emerald-500/15 bg-emerald-900/20 p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-300/80">
                      Study Focus
                    </p>
                    <ul className="mt-2 space-y-1.5 text-sm text-emerald-100/85">
                      {module.focus.map((item) => (
                        <li key={item} className="rounded-md bg-emerald-950/50 px-2.5 py-1.5">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-lg border border-emerald-500/15 bg-emerald-900/20 p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-300/80">
                      Reference Books
                    </p>
                    <ul className="mt-2 space-y-1.5 text-sm text-emerald-100/85">
                      {module.books.map((book) => (
                        <li key={book} className="rounded-md bg-emerald-950/50 px-2.5 py-1.5">
                          {book}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
