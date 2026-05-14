'use client';

import { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  ChevronDownIcon,
  BookOpenIcon,
  BookMarkedIcon,
  TrophyIcon,
  LayersIcon,
  TargetIcon,
} from 'lucide-react';

/* ─── types ──────────────────────────────────────────────────── */

type SyllabusModule = {
  id: number;
  title: string;
  focus: string[];
  books: string[];
};

/* ─── data ───────────────────────────────────────────────────── */

const syllabusModules: SyllabusModule[] = [
  {
    id: 1,
    title: "আল কুরআন",
    focus: [
      "নাজিল, সংকলন, তাজবিদ এবং বিষয়ভিত্তিক অধ্যয়ন",
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
      "হাদিসের আদব, কুদসি হাদিস, শামায়েল এবং বিভ্রান্তি নিরসন",
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
    books: ["আসরারে খুদী", "রুমুযে বেখুদী", "ইসলামে ধর্মীয় চিন্তার পুনর্গঠন"],
  },
  {
    id: 4,
    title: "ইসলামের সমাজবিধান",
    focus: [
      "পরিবার, আত্মীয়তা, প্রতিবেশ, নারী অধিকার ও সামাজিক ন্যায়",
      "সামাজিক পরিবর্তনের নীতি ও ইসলামী সমাজ গঠনের কর্মধারা",
      "বাংলাদেশের সামাজিক কাঠামো এবং ইসলামী সমাজদর্শনের প্রয়োগ",
    ],
    books: ["ইসলামের দৃষ্টিতে সমাজ", "Family Life in Islam", "ইসলাম ও সামাজিক সুবিচার"],
  },
  {
    id: 5,
    title: "ইসলামী আন্দোলন ও দাওয়াত",
    focus: [
      "দাওয়াতি কাজের পদ্ধতি, বিভ্রান্তি ও সংশোধন",
      "সংগঠন পরিচালনা, নেতৃত্ব ও কর্মশক্তি উন্নয়ন",
      "বিশ্ব প্রেক্ষাপটে ইসলামী আন্দোলনের অভিজ্ঞতা",
    ],
    books: ["ইসলামী আন্দোলন সাফল্য ও বিভ্রান্তি", "ইসলামী দাওয়াত ও তার দাবি"],
  },
  {
    id: 6,
    title: "ইসলামী অর্থনীতি",
    focus: [
      "উৎপাদন, বণ্টন, বিনিয়োগ, ভোগ ও রাষ্ট্রের ভূমিকা",
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
      "অমুসলিম অধিকার, বৈদেশিক সম্পর্ক এবং মাকাসিদুশ শারিয়াহ",
    ],
    books: ["ইসলামী রাষ্ট্রব্যবস্থা", "খেলাফত ও রাজতন্ত্র", "ইসলামী রাষ্ট্র ও সংবিধান"],
  },
  {
    id: 8,
    title: "ইসলামী শিক্ষাব্যবস্থা",
    focus: [
      "শিক্ষার উদ্দেশ্য, দ্বিমুখী শিক্ষাব্যবস্থার সংকট ও প্রতিকার",
      "কারিগরি, বিজ্ঞান, নারী ও শিশু শিক্ষার ইসলামী রূপরেখা",
      "শিক্ষা পুনর্গঠন ও বাস্তবায়ন পদ্ধতি",
    ],
    books: ["ইসলামী শিক্ষাব্যবস্থার মূলনীতি", "জ্ঞানের ইসলামীকরণ"],
  },
  {
    id: 9,
    title: "তুলনামূলক অধ্যয়ন",
    focus: [
      "ধর্মীয় মতবাদ: হিন্দু, খ্রিষ্ট, বৌদ্ধ, ইহুদি, জরথুস্ত্র, কাদিয়ানী ইত্যাদি",
      "অন্যান্য মতবাদ: জাতীয়তাবাদ, বস্তুবাদ, উদারনীতি, ধর্মনিরপেক্ষতা",
      "ইসলামের সাথে তুলনামূলক বিশ্লেষণ",
    ],
    books: ["ইসলাম ও জাতীয়তাবাদ", "ধর্মনিরপেক্ষ মতবাদ", "History of Western Philosophy"],
  },
  {
    id: 10,
    title: "ইসলাম ও বিজ্ঞান",
    focus: [
      "বিজ্ঞান বিষয়ে ইসলামী দৃষ্টিভঙ্গি",
      "কুরআনে বৈজ্ঞানিক নিদর্শন এবং মুসলিম অবদান",
      "বিজ্ঞানের সীমাবদ্ধতা ও মূল্যবোধের প্রশ্ন",
    ],
    books: ["কুরআনে বিজ্ঞান", "বাইবেল কোরআন ও বিজ্ঞান"],
  },
  {
    id: 11,
    title: "বিশ্ব সাহিত্য: ইসলামী পরিপ্রেক্ষিত",
    focus: [
      "সাহিত্যের মূল্যায়ন, জীবন-সাহিত্য সম্পর্ক",
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
      "দ্বান্দ্বিক জড়বাদ, শ্রেণিসংগ্রাম ও উদ্বৃত্ত মূল্য তত্ত্ব",
      "মুসলিম বিশ্বে সমাজতান্ত্রিক প্রভাব ও প্রতিক্রিয়া",
    ],
    books: ["কমিউনিস্ট ইশতেহার", "Marxism or Islam", "সমাজতন্ত্র বনাম ইসলাম"],
  },
  {
    id: 13,
    title: "বাংলাদেশের সমাজ ও সংস্কৃতি",
    focus: [
      "ঐতিহাসিক পটভূমি, ইসলামের আগমন ও সামাজিক পরিবর্তন",
      "বংশ-বর্ণ, সাম্প্রদায়িকতা, আধুনিকতা ও শ্রেণিসংঘাত",
      "ইসলামী মূল্যবোধভিত্তিক পুনর্গঠনের সমস্যা-সম্ভাবনা",
    ],
    books: ["বাংলাদেশের কালচার", "বাংলাদেশে ইসলাম", "আমাদের জাতিসত্তার বিকাশধারা"],
  },
  {
    id: 14,
    title: "বাংলাদেশের সাহিত্য ও সাংস্কৃতিক আন্দোলন",
    focus: [
      "প্রাচীন-মধ্যযুগ থেকে আধুনিক সাহিত্যধারা",
      "ইসলাম, জাতীয়তাবাদ, ধর্মনিরপেক্ষতা ও সমাজতন্ত্রের সাংস্কৃতিক দ্বন্দ্ব",
      "গণমাধ্যমের প্রভাব ও আদর্শিক সাহিত্য নির্মাণ",
    ],
    books: ["বাংলা সাহিত্যের ইতিবৃত্ত", "মুসলিম মানস ও বাংলা সাহিত্য"],
  },
  {
    id: 15,
    title: "বাংলাদেশের রাজনীতি ও গতিধারা",
    focus: [
      "ঐতিহাসিক ধারা: ভাষা আন্দোলন, ছয় দফা, স্বাধীনতা",
      "আদর্শিক শক্তি, দলীয় রাজনীতি ও রাষ্ট্রীয় চরিত্র বিশ্লেষণ",
      "বাংলাদেশের রাজনৈতিক ভবিষ্যৎ নিয়ে পর্যালোচনা",
    ],
    books: ["আমার দেখা রাজনীতির পঞ্চাশ বছর", "একশ বছরের রাজনীতি"],
  },
  {
    id: 16,
    title: "সমসাময়িক সামাজিক সমস্যা ও সমাধান",
    focus: [
      "দারিদ্র্য, দুর্নীতি, কুসংস্কার, শিশুশ্রমসহ মূল সামাজিক সংকট",
      "সমস্যার কারণ, নীতিগত সমাধান ও কর্মসূচি",
      "সরকার, সামাজিক সংগঠন ও ইসলামী দৃষ্টিকোণ",
    ],
    books: ["Contemporary Social Problems", "বাংলাদেশে এনজিও"],
  },
  {
    id: 17,
    title: "বর্তমান দুনিয়ার ইসলামী আন্দোলন",
    focus: [
      "খিলাফত-পরবর্তী বিশ্বে ইসলামী আন্দোলনের বিকাশ",
      "ইখওয়ান, জামায়াতে ইসলামীসহ বিভিন্ন দেশের অভিজ্ঞতা",
      "আন্তর্জাতিক ইসলামী সংগঠন, সংকট ও ভবিষ্যৎ",
    ],
    books: ["জামায়াতে ইসলামীর কার্যবিবরণী", "Priorities of the Islamic Movement"],
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
      "জাতীয় শক্তি, ক্ষমতার ভারসাম্য, যৌথ নিরাপত্তা",
      "NATO, ASEAN, SAARC, OIC, WTOসহ জোট ও প্রতিষ্ঠান",
      "পররাষ্ট্রনীতি, ভূরাজনীতি ও সমসাময়িক বৈশ্বিক সংকট",
    ],
    books: ["আন্তর্জাতিক রাজনীতি", "International Relations", "Politics Among Nations"],
  },
  {
    id: 20,
    title: "আকাইদ",
    focus: [
      "ঈমানের মূল ভিত্তি: তাওহীদ, রিসালাত, আখিরাত, তাকদির",
      "শিরক, বিদআত, ভ্রান্ত মতবাদ ও সংশোধন",
      "আকিদাগত দৃঢ়তা গঠনে রেফারেন্সভিত্তিক অধ্যয়ন",
    ],
    books: ["ইসলামী আকীদা", "তাওহীদ রিসালাত ও আখেরাত", "কোরআনের চারটি মৌলিক পরিভাষা"],
  },
  {
    id: 21,
    title: "মাসআলা-মাসায়েল",
    focus: [
      "তাহারাত, অযু, গোসল, ইবাদত ও মুয়ামালাত",
      "দৈনন্দিন জীবনে শরিয়তের বিধান প্রয়োগ",
      "ক্লাসিক ও সমকালীন ফিকহি রেফারেন্স পাঠ",
    ],
    books: ["আসান ফিকাহ", "ইসলামে হালাল হারামের বিধান", "রাসায়েল ও মাসায়েল"],
  },
  {
    id: 22,
    title: "ফিকাহ ও ইসলামী আইন",
    focus: [
      "ফিকাহর বিকাশ, ইজতিহাদ এবং উসুল",
      "পাশ্চাত্য আইন বনাম ইসলামী আইনের তুলনা",
      "সমসাময়িক আইনগত সমস্যা সমাধানের কাঠামো",
    ],
    books: ["ইসলামী আইন বনাম মানব রচিত আইন", "ইসলামী উসুলে ফিকাহ"],
  },
  {
    id: 23,
    title: "ক্যারিয়ার ও দক্ষতা",
    focus: [
      "একাডেমিক উৎকর্ষ, ক্যারিয়ার পরিকল্পনা ও গবেষণা দক্ষতা",
      "আইটি, ভাষা, উদ্যোক্তা ও বাস্তব কারিগরি দক্ষতা",
      "ভবিষ্যৎ সমাজ-রাষ্ট্রে নেতৃত্বের প্রস্তুতি",
    ],
    books: ["ক্যারিয়ার বিকশিত জীবনের দ্বার", "Road to Higher Study"],
  },
];

const STORAGE_KEY = 'member-syllabus-progress-v2';

/* ─── helpers ────────────────────────────────────────────────── */

function loadSaved(): Set<number> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as number[]);
  } catch {
    return new Set();
  }
}

function saveProgress(set: Set<number>) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(set)));
  } catch { /* ignore */ }
}

/* ─── sub-components ─────────────────────────────────────────── */

function ProgressRing({ pct }: { pct: number }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <svg width="88" height="88" viewBox="0 0 88 88" className="shrink-0 -rotate-90">
      <circle cx="44" cy="44" r={r} fill="none" stroke="rgba(16,185,129,0.10)" strokeWidth="6" />
      <circle
        cx="44" cy="44" r={r}
        fill="none"
        stroke="rgb(52,211,153)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        className="transition-all duration-500"
      />
    </svg>
  );
}

function ModuleRow({
  module,
  completed,
  expanded,
  onToggleComplete,
  onToggleExpand,
}: {
  module: SyllabusModule;
  completed: boolean;
  expanded: boolean;
  onToggleComplete: () => void;
  onToggleExpand: () => void;
}) {
  const idStr = String(module.id).padStart(2, '0');

  return (
    <div
      className={`border-b border-white/[0.05] transition-colors last:border-0 ${
        completed ? 'opacity-60' : ''
      }`}
    >
      {/* row header */}
      <div className="flex items-center gap-3 py-3 sm:gap-4 sm:py-3.5">
        {/* check button */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleComplete(); }}
          className="shrink-0 rounded-full p-0.5 transition-colors hover:bg-emerald-500/10"
          aria-label={completed ? 'Mark incomplete' : 'Mark complete'}
        >
          {completed
            ? <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            : <Circle className="h-5 w-5 text-white/20" />}
        </button>

        {/* id */}
        <span className="shrink-0 font-mono text-[11px] font-black tabular-nums text-emerald-500/40 sm:text-[12px]">
          {idStr}
        </span>

        {/* title — click to expand */}
        <button
          onClick={onToggleExpand}
          className="flex flex-1 items-center justify-between gap-2 text-left"
        >
          <span
            className={`text-[13px] font-semibold leading-snug sm:text-sm ${
              completed ? 'line-through text-white/35' : 'text-white/82'
            }`}
          >
            {module.title}
          </span>
          <ChevronDownIcon
            className={`h-4 w-4 shrink-0 text-white/20 transition-transform duration-200 ${
              expanded ? 'rotate-180 text-emerald-400/50' : ''
            }`}
          />
        </button>
      </div>

      {/* expanded content */}
      {expanded && (
        <div className="mb-4 grid grid-cols-1 gap-3 pl-8 sm:grid-cols-2 sm:pl-14">
          {/* focus */}
          <div>
            <div className="mb-2 flex items-center gap-1.5">
              <TargetIcon className="h-3 w-3 text-emerald-400/50" strokeWidth={2} />
              <span className="font-mono text-[9px] font-bold uppercase tracking-[2px] text-emerald-400/45">
                Study Focus
              </span>
            </div>
            <div className="space-y-1.5">
              {module.focus.map((f, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="mt-[3px] shrink-0 font-mono text-[9px] font-black text-emerald-500/30 tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="text-[12px] leading-snug text-white/55">{f}</p>
                </div>
              ))}
            </div>
          </div>

          {/* books */}
          <div>
            <div className="mb-2 flex items-center gap-1.5">
              <BookOpenIcon className="h-3 w-3 text-indigo-400/50" strokeWidth={2} />
              <span className="font-mono text-[9px] font-bold uppercase tracking-[2px] text-indigo-400/45">
                Reference Books
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {module.books.map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center gap-1 rounded-full border border-indigo-500/20 bg-indigo-500/6 px-2.5 py-1 text-[11px] text-indigo-200/65"
                >
                  <BookMarkedIcon className="h-2.5 w-2.5 shrink-0 text-indigo-400/40" strokeWidth={2} />
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── page ───────────────────────────────────────────────────── */

export default function MemberSyllabus() {
  const [completed, setCompleted] = useState<Set<number>>(loadSaved);
  const [expanded, setExpanded] = useState<Set<number>>(new Set(syllabusModules.map((m) => m.id)));

  const toggle = (id: number) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      saveProgress(next);
      return next;
    });
  };

  const toggleExpand = (id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const pct = Math.round((completed.size / syllabusModules.length) * 100);
  const remaining = syllabusModules.length - completed.size;

  return (
    <div className="min-h-screen bg-[#060e09] text-emerald-50">

      <div className="relative mx-auto max-w-4xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">

        {/* ── Hero ── */}
        <header className="mb-10">
          <div className="mb-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-emerald-500/20" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[3px] text-emerald-500/45">
              Member Dashboard
            </span>
            <div className="h-px flex-1 bg-emerald-500/20" />
          </div>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-[30px] font-black leading-none tracking-tight text-white sm:text-[42px]">
                উচ্চতর
                <span className="ml-2 text-emerald-400">সিলেবাস</span>
              </h1>
              <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-white/38">
                সম্পূর্ণ পাঠ-রোডম্যাপ — প্রতিটি মডিউল পড়ে চেক করুন।
              </p>
            </div>

            {/* progress ring + stats */}
            <div className="flex items-center gap-5">
              <div className="relative flex items-center justify-center">
                <ProgressRing pct={pct} />
                <div className="absolute flex flex-col items-center">
                  <span className="font-mono text-[18px] font-black leading-none text-emerald-400">{pct}%</span>
                  <span className="font-mono text-[8px] text-white/25">done</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div>
                  <p className="font-mono text-[22px] font-black leading-none text-emerald-400">{completed.size}</p>
                  <p className="text-[9px] text-white/28">সম্পন্ন</p>
                </div>
                <div>
                  <p className="font-mono text-[22px] font-black leading-none text-white/50">{remaining}</p>
                  <p className="text-[9px] text-white/28">বাকি</p>
                </div>
              </div>
            </div>
          </div>

          {/* progress bar */}
          <div className="mt-6">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="font-mono text-[10px] text-white/22">অগ্রগতি</span>
              <span className="font-mono text-[10px] text-emerald-400/50">
                {completed.size} / {syllabusModules.length}
              </span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-300 transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </header>

        {/* ── Module list ── */}
        <section>
          {/* section divider */}
          <div className="mb-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-emerald-500/20" />
            <div className="flex items-center gap-2">
              <LayersIcon className="h-3.5 w-3.5 text-emerald-400" strokeWidth={2} />
              <span className="text-[10px] font-bold uppercase tracking-[2.5px] text-emerald-400">
                মডিউল তালিকা
              </span>
              <span className="rounded-full border border-emerald-500/25 bg-emerald-500/8 px-1.5 py-px font-mono text-[9px] font-bold text-emerald-400/60">
                {syllabusModules.length}
              </span>
            </div>
            <div className="h-px flex-1 bg-emerald-500/20" />
          </div>

          {/* quick actions */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-widest text-white/20">
              সব মডিউল
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setExpanded(new Set(syllabusModules.map((m) => m.id)))}
                className="rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-1.5 text-[11px] text-white/35 transition-colors hover:bg-white/[0.06] hover:text-white/55"
              >
                সব খুলুন
              </button>
              <button
                onClick={() => setExpanded(new Set())}
                className="rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-1.5 text-[11px] text-white/35 transition-colors hover:bg-white/[0.06] hover:text-white/55"
              >
                সব বন্ধ করুন
              </button>
            </div>
          </div>

          {/* modules */}
          <div>
            {syllabusModules.map((module) => (
              <ModuleRow
                key={module.id}
                module={module}
                completed={completed.has(module.id)}
                expanded={expanded.has(module.id)}
                onToggleComplete={() => toggle(module.id)}
                onToggleExpand={() => toggleExpand(module.id)}
              />
            ))}
          </div>
        </section>

        {/* congratulations state */}
        {pct === 100 && (
          <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-emerald-500/25 bg-emerald-500/5 py-8 text-center">
            <TrophyIcon className="h-10 w-10 text-emerald-400" strokeWidth={1.5} />
            <p className="text-[15px] font-bold text-emerald-300">আলহামদুলিল্লাহ! সম্পূর্ণ সিলেবাস সম্পন্ন।</p>
            <p className="text-[12px] text-white/30">সকল ২৩টি মডিউল চেক করা হয়েছে।</p>
          </div>
        )}

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
