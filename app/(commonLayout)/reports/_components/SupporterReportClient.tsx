"use client";

import { useCallback, useMemo, useState } from "react";
import {
  Award,
  BookMarked,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Dumbbell,
  GraduationCap,
  Heart,
  History,
  Library,
  MessageSquare,
  Moon,
  Newspaper,
  RotateCcw,
  School,
  Send,
  Star,
  Sun,
  Sunset,
  Trash2,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";

const TOTAL_DAYS = 31;

const NUM_ROWS = [
  {
    key: "quran",
    label: "কুরআন পাঠ",
    Icon: BookOpen,
    unit: "আয়াত",
    step: "1",
    colorClass: "text-emerald-400",
    bgClass: "bg-[rgba(74,222,128,0.08)]",
    borderClass: "border-[rgba(74,222,128,0.2)]",
    iconBgClass: "bg-[rgba(74,222,128,0.14)]",
  },
  {
    key: "hadith",
    label: "হাদিস পাঠ",
    Icon: BookMarked,
    unit: "টি",
    step: "1",
    colorClass: "text-emerald-300",
    bgClass: "bg-[rgba(52,211,153,0.08)]",
    borderClass: "border-[rgba(52,211,153,0.2)]",
    iconBgClass: "bg-[rgba(52,211,153,0.14)]",
  },
  {
    key: "islamic",
    label: "ইসলামী বই পড়া",
    Icon: Library,
    unit: "পৃষ্ঠা",
    step: "1",
    colorClass: "text-emerald-200",
    bgClass: "bg-[rgba(110,231,183,0.08)]",
    borderClass: "border-[rgba(110,231,183,0.2)]",
    iconBgClass: "bg-[rgba(110,231,183,0.14)]",
  },
  {
    key: "textbook",
    label: "পাঠ্যপুস্তক",
    Icon: GraduationCap,
    unit: "ঘণ্টা",
    step: "0.1",
    colorClass: "text-amber-300",
    bgClass: "bg-[rgba(251,191,36,0.08)]",
    borderClass: "border-[rgba(251,191,36,0.2)]",
    iconBgClass: "bg-[rgba(251,191,36,0.14)]",
  },
  {
    key: "friends",
    label: "বন্ধু যোগাযোগ",
    Icon: Users,
    unit: "জন",
    step: "1",
    colorClass: "text-amber-400",
    bgClass: "bg-[rgba(245,158,11,0.08)]",
    borderClass: "border-[rgba(245,158,11,0.2)]",
    iconBgClass: "bg-[rgba(245,158,11,0.14)]",
  },
  {
    key: "goodwork",
    label: "ভালো কাজ",
    Icon: Heart,
    unit: "ঘণ্টা",
    step: "0.1",
    colorClass: "text-orange-400",
    bgClass: "bg-[rgba(251,146,60,0.08)]",
    borderClass: "border-[rgba(251,146,60,0.2)]",
    iconBgClass: "bg-[rgba(251,146,60,0.14)]",
  },
  {
    key: "namazJamaat",
    label: "নামাজ (জামাআত)",
    Icon: Star,
    unit: "ওয়াক্ত",
    step: "1",
    colorClass: "text-violet-300",
    bgClass: "bg-[rgba(167,139,250,0.08)]",
    borderClass: "border-[rgba(167,139,250,0.2)]",
    iconBgClass: "bg-[rgba(167,139,250,0.14)]",
  },
  {
    key: "namazQaza",
    label: "নামাজ (কাজা)",
    Icon: Moon,
    unit: "ওয়াক্ত",
    step: "1",
    colorClass: "text-purple-300",
    bgClass: "bg-[rgba(192,132,252,0.08)]",
    borderClass: "border-[rgba(192,132,252,0.2)]",
    iconBgClass: "bg-[rgba(192,132,252,0.14)]",
  },
] as const;

const CHK_ROWS = [
  {
    key: "class",
    label: "ক্লাসে উপস্থিতি",
    Icon: School,
    colorClass: "text-sky-400",
    bgClass: "bg-[rgba(56,189,248,0.08)]",
    borderClass: "border-[rgba(56,189,248,0.2)]",
  },
  {
    key: "selfcrit",
    label: "আত্ম-সমালোচনা",
    Icon: Zap,
    colorClass: "text-pink-400",
    bgClass: "bg-[rgba(244,114,182,0.08)]",
    borderClass: "border-[rgba(244,114,182,0.2)]",
  },
  {
    key: "sports",
    label: "খেলাধুলা",
    Icon: Dumbbell,
    colorClass: "text-orange-400",
    bgClass: "bg-[rgba(251,146,60,0.08)]",
    borderClass: "border-[rgba(251,146,60,0.2)]",
  },
  {
    key: "newspaper",
    label: "পত্রিকা পাঠ",
    Icon: Newspaper,
    colorClass: "text-slate-400",
    bgClass: "bg-[rgba(148,163,184,0.08)]",
    borderClass: "border-[rgba(148,163,184,0.2)]",
  },
] as const;

const WEEK_RANGES = [
  { label: "সপ্তাহ ১", days: [0, 1, 2, 3, 4, 5, 6, 7] },
  { label: "সপ্তাহ ২", days: [8, 9, 10, 11, 12, 13, 14, 15] },
  { label: "সপ্তাহ ৩", days: [16, 17, 18, 19, 20, 21, 22, 23] },
  { label: "সপ্তাহ ৪", days: [24, 25, 26, 27, 28, 29, 30] },
];

type NumKey = (typeof NUM_ROWS)[number]["key"];
type ChkKey = (typeof CHK_ROWS)[number]["key"];
type NumData = Record<NumKey, Record<number, string>>;
type ChkData = Record<ChkKey, Record<number, boolean>>;
type ReportRecord = {
  id: number;
  month: string;
  name: string;
  school: string;
  submittedAt: string;
  numData: NumData;
  chkData: ChkData;
};
type AdviceEntry = { id: number; text: string; createdAt: string };

const BN_D = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
const toBn = (n: number | string) => String(n).replace(/\d/g, (d) => BN_D[+d]);

function calcAvg(vals: Record<number, string>): string {
  const nums = Object.values(vals)
    .filter((v) => v !== "" && !isNaN(Number(v)))
    .map(Number);
  if (!nums.length) return "—";
  const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
  const r = Math.round(avg * 10) / 10;
  return toBn(Number.isInteger(r) ? r.toString() : r.toFixed(1));
}

function calcCount(vals: Record<number, boolean>): string {
  const c = Object.values(vals).filter(Boolean).length;
  return c === 0 ? "—" : toBn(c);
}

function initNum(): NumData {
  const o = {} as NumData;
  NUM_ROWS.forEach((r) => {
    o[r.key] = {};
    for (let d = 0; d < TOTAL_DAYS; d++) o[r.key][d] = "";
  });
  return o;
}

function initChk(): ChkData {
  const o = {} as ChkData;
  CHK_ROWS.forEach((r) => {
    o[r.key] = {};
    for (let d = 0; d < TOTAL_DAYS; d++) o[r.key][d] = false;
  });
  return o;
}

function cloneNum(d: NumData): NumData {
  const o = {} as NumData;
  NUM_ROWS.forEach((r) => {
    o[r.key] = { ...d[r.key] };
  });
  return o;
}

function cloneChk(d: ChkData): ChkData {
  const o = {} as ChkData;
  CHK_ROWS.forEach((r) => {
    o[r.key] = { ...d[r.key] };
  });
  return o;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function buildMockHistory(): ReportRecord[] {
  const feb = initNum();
  feb.quran[0] = "12";
  feb.hadith[0] = "2";
  const febC = initChk();
  febC.class[0] = true;
  febC.selfcrit[1] = true;

  const jan = initNum();
  jan.quran[2] = "10";
  jan.goodwork[2] = "1.5";
  const janC = initChk();
  janC.class[2] = true;
  janC.newspaper[3] = true;

  return [
    { id: 1, month: "2026-02", name: "সমর্থক-১", school: "ঢাকা কলেজ", submittedAt: "2026-03-02", numData: feb, chkData: febC },
    { id: 2, month: "2026-01", name: "সমর্থক-১", school: "ঢাকা কলেজ", submittedAt: "2026-02-01", numData: jan, chkData: janC },
  ];
}

function Chk({
  checked,
  onChange,
  colorClass,
}: {
  checked: boolean;
  onChange: () => void;
  colorClass: string;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`h-5 w-5 rounded-[6px] border p-0 transition-all flex items-center justify-center ${
        checked ? `${colorClass} border-current bg-current/20 shadow-[0_0_10px_rgba(0,0,0,0.25)]` : "border-white/15 bg-[rgba(5,15,8,0.5)] text-white/20"
      }`}
    >
      {checked && (
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
          <path d="M1.5 6L4.5 9L10.5 3" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}

function DayProgress({ numData, chkData, day }: { numData: NumData; chkData: ChkData; day: number }) {
  const numFilled = NUM_ROWS.filter((r) => numData[r.key][day] !== "").length;
  const chkFilled = CHK_ROWS.filter((r) => chkData[r.key][day]).length;
  const pct = Math.round(((numFilled + chkFilled) / (NUM_ROWS.length + CHK_ROWS.length)) * 100);

  return (
    <div className="flex items-center gap-2">
      <div className="h-[3px] flex-1 rounded bg-white/10 overflow-hidden">
        <div className="h-full rounded bg-linear-to-r from-[#00c853] to-[#4ade80] transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="min-w-7 text-[10px] font-mono text-[#e8f5e955]">{toBn(pct)}%</span>
    </div>
  );
}

function SummaryGrid({ numAvg, chkTotals }: { numAvg: Record<NumKey, string>; chkTotals: Record<ChkKey, string> }) {
  return (
    <div className="rounded-xl border border-[rgba(200,162,39,0.15)] bg-[rgba(8,20,12,0.9)] p-4">
      <div className="mb-3.5 flex items-center gap-1.5">
        <TrendingUp size={12} color="rgba(200,162,39,0.7)" strokeWidth={1.8} />
        <span className="font-mono text-[9px] uppercase tracking-[3px] text-[rgba(200,162,39,0.6)]">মাসিক সারসংক্ষেপ (গড়)</span>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-2">
        {NUM_ROWS.map((r) => (
          <div key={r.key} className={`relative overflow-hidden rounded-lg border p-[10px_10px_8px] ${r.bgClass} ${r.borderClass}`}>
            <div className={`absolute left-0 right-0 top-0 h-0.5 bg-linear-to-r from-transparent via-current to-transparent opacity-60 ${r.colorClass}`} />
            <div className="mb-1.5 flex items-center gap-1.5">
              <r.Icon size={11} className={r.colorClass} strokeWidth={1.8} />
              <span className="text-[10px] leading-[1.3] text-[#e8f5e975]">{r.label}</span>
            </div>
            <div className={`font-mono text-[20px] leading-none font-bold ${r.colorClass}`}>{numAvg[r.key]}</div>
            <div className="mt-0.5 font-mono text-[9px] text-[#e8f5e933]">গড় / {r.unit}</div>
          </div>
        ))}

        {CHK_ROWS.map((r) => (
          <div key={r.key} className={`relative overflow-hidden rounded-lg border p-[10px_10px_8px] ${r.bgClass} ${r.borderClass}`}>
            <div className={`absolute left-0 right-0 top-0 h-0.5 bg-linear-to-r from-transparent via-current to-transparent opacity-60 ${r.colorClass}`} />
            <div className="mb-1.5 flex items-center gap-1.5">
              <r.Icon size={11} className={r.colorClass} strokeWidth={1.8} />
              <span className="text-[10px] leading-[1.3] text-[#e8f5e975]">{r.label}</span>
            </div>
            <div className={`font-mono text-[20px] leading-none font-bold ${r.colorClass}`}>{chkTotals[r.key]}</div>
            <div className="mt-0.5 font-mono text-[9px] text-[#e8f5e933]">দিন / {toBn(TOTAL_DAYS)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function THead({ days }: { days: number[] }) {
  return (
    <thead>
      <tr>
        <th className="min-w-40 border-b border-r border-[rgba(0,200,83,0.08)] bg-[rgba(0,200,83,0.04)] px-3.5 py-2.5 text-left font-mono text-[9px] uppercase tracking-[2px] text-[rgba(0,200,83,0.55)]">বিষয়</th>
        {days.map((d) => (
          <th key={d} className="min-w-[34px] border-b border-r border-[rgba(0,200,83,0.06)] bg-[rgba(0,200,83,0.04)] px-0.5 py-2.5 text-center font-mono text-[11px] text-[rgba(232,245,233,0.45)]">
            {toBn(d + 1)}
          </th>
        ))}
        <th className="min-w-[50px] border-b border-l border-[rgba(200,162,39,0.15)] bg-[rgba(200,162,39,0.04)] px-1.5 py-2 text-center font-mono text-[9px] text-[#c8a227]">
          গড়/মোট
        </th>
      </tr>
    </thead>
  );
}

function TabletView({
  numData,
  chkData,
  setNum,
  toggleChk,
  numAvg,
  chkTotals,
}: {
  numData: NumData;
  chkData: ChkData;
  setNum: (r: NumKey, d: number, v: string) => void;
  toggleChk: (r: ChkKey, d: number) => void;
  numAvg: Record<NumKey, string>;
  chkTotals: Record<ChkKey, string>;
}) {
  const [week, setWeek] = useState(0);
  const days = WEEK_RANGES[week].days;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-1.5">
        {WEEK_RANGES.map((w, i) => (
          <button
            key={w.label}
            type="button"
            onClick={() => setWeek(i)}
            className={`flex-1 rounded-lg px-1.5 py-2.5 font-mono text-[12px] transition-all ${
              week === i
                ? "border border-[rgba(0,200,83,0.5)] bg-[rgba(0,200,83,0.1)] text-[#00c853] font-bold"
                : "border border-[rgba(0,200,83,0.12)] bg-[rgba(8,20,12,0.7)] text-[rgba(232,245,233,0.35)]"
            }`}
          >
            {w.label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-[10px] border border-[rgba(0,200,83,0.15)] bg-[rgba(8,20,12,0.9)]">
        <div className="h-0.5 bg-linear-to-r from-transparent via-[#00c853] via-50% to-transparent" />
        <div className="overflow-x-auto">
          <table className="min-w-[480px] w-full border-collapse">
            <THead days={days} />
            <tbody>
              {NUM_ROWS.map((r, ri) => (
                <tr key={r.key} className={ri % 2 === 0 ? "bg-transparent" : "bg-black/15"}>
                  <td className="border-b border-r border-[rgba(0,200,83,0.08)] px-3.5 py-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`h-[26px] w-[26px] shrink-0 rounded-md border flex items-center justify-center ${r.borderClass} ${r.bgClass}`}>
                        <r.Icon size={12} className={r.colorClass} strokeWidth={1.8} />
                      </div>
                      <div>
                        <div className="text-[12px] text-[#f0fff4]">{r.label}</div>
                        <div className="font-mono text-[9px] text-[#e8f5e938]">{r.unit}</div>
                      </div>
                    </div>
                  </td>

                  {days.map((d) => (
                    <td key={d} className="border-b border-r border-[rgba(0,200,83,0.05)] px-0.5 py-0.5">
                      <input
                        type="number"
                        min="0"
                        step={r.step}
                        value={numData[r.key][d]}
                        onChange={(e) => setNum(r.key, d, e.target.value)}
                        placeholder="—"
                        className={`h-7 w-full rounded border border-[rgba(0,200,83,0.1)] bg-[rgba(0,200,83,0.04)] text-center font-mono text-[11px] font-semibold outline-none ${r.colorClass}`}
                      />
                    </td>
                  ))}

                  <td className={`border-b border-l border-[rgba(200,162,39,0.1)] px-1.5 py-1 text-center font-mono text-[12px] font-bold ${r.colorClass}`}>
                    {numAvg[r.key]}
                  </td>
                </tr>
              ))}

              <tr>
                <td colSpan={days.length + 2} className="h-0.5 bg-[rgba(200,162,39,0.1)] p-0" />
              </tr>

              {CHK_ROWS.map((r, ri) => (
                <tr key={r.key} className={ri % 2 === 0 ? "bg-[rgba(200,162,39,0.02)]" : "bg-transparent"}>
                  <td className="border-b border-r border-[rgba(0,200,83,0.08)] px-3.5 py-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`h-[26px] w-[26px] shrink-0 rounded-md border flex items-center justify-center ${r.borderClass} ${r.bgClass}`}>
                        <r.Icon size={12} className={r.colorClass} strokeWidth={1.8} />
                      </div>
                      <div className="text-[12px] text-[#f0fff4]">{r.label}</div>
                    </div>
                  </td>

                  {days.map((d) => (
                    <td key={d} className="border-b border-r border-[rgba(0,200,83,0.05)] px-0.5 py-0.5 text-center">
                      <div className="flex justify-center">
                        <Chk checked={chkData[r.key][d]} onChange={() => toggleChk(r.key, d)} colorClass={r.colorClass} />
                      </div>
                    </td>
                  ))}

                  <td className={`border-b border-l border-[rgba(200,162,39,0.1)] px-1.5 py-1 text-center font-mono text-[12px] font-bold ${r.colorClass}`}>
                    {chkTotals[r.key]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <SummaryGrid numAvg={numAvg} chkTotals={chkTotals} />
    </div>
  );
}

export default function SupporterReportClient() {
  const [numData, setNumData] = useState<NumData>(initNum);
  const [chkData, setChkData] = useState<ChkData>(initChk);
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [month, setMonth] = useState("");
  const [advice, setAdvice] = useState("");
  const [activeDay, setActiveDay] = useState(0);
  const [reportSaved, setReportSaved] = useState(false);
  const [adviceSaved, setAdviceSaved] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [reports, setReports] = useState<ReportRecord[]>(buildMockHistory);
  const [adviceList, setAdviceList] = useState<AdviceEntry[]>([
    { id: 1, text: "এই মাসে বন্ধু যোগাযোগ আরও নিয়মিত করুন।", createdAt: "2026-03-10" },
    { id: 2, text: "সকালের রুটিন ধরে রাখতে প্রতি রাতে প্ল্যান লিখে রাখুন।", createdAt: "2026-03-18" },
  ]);

  const setNum = useCallback((row: NumKey, day: number, val: string) => {
    if (val !== "" && (isNaN(Number(val)) || Number(val) < 0)) return;
    setNumData((p) => ({ ...p, [row]: { ...p[row], [day]: val } }));
  }, []);

  const toggleChk = useCallback((row: ChkKey, day: number) => {
    setChkData((p) => ({ ...p, [row]: { ...p[row], [day]: !p[row][day] } }));
  }, []);

  const numAvg = useMemo(
    () => Object.fromEntries(NUM_ROWS.map((r) => [r.key, calcAvg(numData[r.key])])) as Record<NumKey, string>,
    [numData]
  );

  const chkTotals = useMemo(
    () => Object.fromEntries(CHK_ROWS.map((r) => [r.key, calcCount(chkData[r.key])])) as Record<ChkKey, string>,
    [chkData]
  );

  const overallPct = useMemo(() => {
    let filled = 0;
    const total = (NUM_ROWS.length + CHK_ROWS.length) * TOTAL_DAYS;
    NUM_ROWS.forEach((r) => {
      Object.values(numData[r.key]).forEach((v) => {
        if (v !== "") filled++;
      });
    });
    CHK_ROWS.forEach((r) => {
      Object.values(chkData[r.key]).forEach((v) => {
        if (v) filled++;
      });
    });
    return Math.round((filled / total) * 100);
  }, [numData, chkData]);

  function reset() {
    setNumData(initNum());
    setChkData(initChk());
    setName("");
    setSchool("");
    setMonth("");
    setAdvice("");
    setActiveDay(0);
    setReportSaved(false);
    setAdviceSaved(false);
    setEditingId(null);
  }

  function handleReportSave() {
    const payload: ReportRecord = {
      id: editingId ?? Date.now(),
      month,
      name,
      school,
      submittedAt: todayISO(),
      numData: cloneNum(numData),
      chkData: cloneChk(chkData),
    };

    if (editingId) setReports((p) => p.map((x) => (x.id === editingId ? payload : x)));
    else {
      setReports((p) => [payload, ...p]);
      setEditingId(payload.id);
    }

    setReportSaved(true);
    setTimeout(() => setReportSaved(false), 3000);
  }

  function handleAdviceSave() {
    if (!advice.trim()) return;
    setAdviceList((p) => [{ id: Date.now(), text: advice.trim(), createdAt: todayISO() }, ...p]);
    setAdvice("");
    setAdviceSaved(true);
    setTimeout(() => setAdviceSaved(false), 3000);
  }

  function openRecord(r: ReportRecord) {
    setEditingId(r.id);
    setName(r.name);
    setSchool(r.school);
    setMonth(r.month);
    setNumData(cloneNum(r.numData));
    setChkData(cloneChk(r.chkData));
    setActiveDay(0);
    setShowHistory(false);
  }

  function deleteReport() {
    if (!editingId) return;
    setReports((p) => p.filter((x) => x.id !== editingId));
    reset();
  }

  const prevDay = () => setActiveDay((d) => Math.max(0, d - 1));
  const nextDay = () => setActiveDay((d) => Math.min(TOTAL_DAYS - 1, d + 1));

  return (
    <main className="min-h-screen bg-[#050f08] px-[clamp(10px,3vw,24px)] pb-12 pt-[72px]">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-3">
        <header className="overflow-hidden rounded-[14px] border border-[rgba(0,200,83,0.14)] bg-[rgba(8,22,14,0.95)] shadow-[0_8px_40px_rgba(0,0,0,0.4)]">
          <div className="h-0.5 bg-linear-to-r from-transparent via-[#00c853] via-40% to-transparent" />

          <div className="flex items-center justify-between gap-3 px-5 pb-3 pt-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[rgba(0,200,83,0.3)] bg-[rgba(0,200,83,0.06)] shadow-[0_0_16px_rgba(0,200,83,0.15)]">
                <Moon size={18} color="#00c853" strokeWidth={1.6} />
              </div>
              <div>
                <div className="mb-0.5 flex items-center gap-1.5">
                  <TrendingUp size={10} color="rgba(0,200,83,0.55)" />
                  <span className="font-mono text-[9px] uppercase tracking-[3px] text-[rgba(0,200,83,0.55)]">সমর্থক মাসিক প্রতিবেদন</span>
                </div>
                <h1 className="m-0 text-[clamp(17px,3vw,24px)] font-bold leading-[1.2] text-[#f0fff4]">সমর্থক আমলনামা</h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-full border border-[rgba(0,200,83,0.2)] bg-[rgba(0,200,83,0.06)] px-3 py-1.5">
                <Award size={11} color="#00c853" strokeWidth={1.8} />
                <span className="font-mono text-[11px] font-semibold text-[#00c853]">{toBn(overallPct)}%</span>
              </div>

              <button
                type="button"
                onClick={() => setShowHistory((p) => !p)}
                className="flex items-center gap-1.5 rounded-lg border border-[rgba(200,162,39,0.28)] bg-[rgba(200,162,39,0.07)] px-3.5 py-1.5 font-mono text-[11px] tracking-wide text-[#c8a227]"
              >
                <History size={13} strokeWidth={1.8} />
                হিস্ট্রি
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2.5 px-5 pb-3.5 md:grid-cols-2">
            <div className="rounded-[10px] border border-[rgba(0,200,83,0.1)] bg-[rgba(0,200,83,0.04)] p-[10px_14px]">
              <div className="mb-2 flex items-center gap-1.5">
                <Sun size={12} color="#4ade80" strokeWidth={1.8} />
                <span className="font-mono text-[9px] uppercase tracking-[2px] text-[#4ade80]">সকাল</span>
              </div>
              {["ফজরের ঘুম থেকে উঠতে পেরেছি কি?", "আজকের কাজগুলো বুঝে নিয়েছি কি?", "ক্লাসের প্রস্তুতি নিতে পেরেছি কি?"].map((q) => (
                <p key={q} className="mb-0.5 border-l border-[rgba(74,222,128,0.2)] pl-1.5 text-[11px] leading-[1.8] text-[rgba(232,245,233,0.42)]">
                  {q}
                </p>
              ))}
            </div>

            <div className="rounded-[10px] border border-[rgba(200,162,39,0.12)] bg-[rgba(200,162,39,0.04)] p-[10px_14px]">
              <div className="mb-2 flex items-center gap-1.5">
                <Sunset size={12} color="#fbbf24" strokeWidth={1.8} />
                <span className="font-mono text-[9px] uppercase tracking-[2px] text-[#fbbf24]">রাত</span>
              </div>
              {["আজকের নামাজ জামায়াতে হয়েছে কি?", "আব্বা-আম্মার কথামতো কাজ করেছি কি?", "গতকালের চেয়ে ভালো কাজ করেছি কি?"].map((q) => (
                <p key={q} className="mb-0.5 border-l border-[rgba(251,191,36,0.2)] pl-1.5 text-[11px] leading-[1.8] text-[rgba(232,245,233,0.42)]">
                  {q}
                </p>
              ))}
            </div>
          </div>

          <div className="meta-grid grid grid-cols-1 gap-2.5 px-5 pb-[18px] sm:grid-cols-[1fr_1.4fr_160px]">
            <div className="flex flex-col gap-1">
              <label className="font-mono text-[10px] tracking-wide text-[rgba(200,162,39,0.65)]">নামঃ</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="নাম লিখুন"
                className="w-full rounded-[7px] border border-[rgba(200,162,39,0.18)] bg-[rgba(5,15,8,0.8)] px-3 py-2 text-[13px] text-[#f0fff4] outline-none transition-colors focus:border-[rgba(200,162,39,0.5)]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-mono text-[10px] tracking-wide text-[rgba(200,162,39,0.65)]">শিক্ষাপ্রতিষ্ঠানঃ</label>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="প্রতিষ্ঠানের নাম"
                className="w-full rounded-[7px] border border-[rgba(200,162,39,0.18)] bg-[rgba(5,15,8,0.8)] px-3 py-2 text-[13px] text-[#f0fff4] outline-none transition-colors focus:border-[rgba(200,162,39,0.5)]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-mono text-[10px] tracking-wide text-[rgba(200,162,39,0.65)]">মাস ও বছরঃ</label>
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="[color-scheme:dark] w-full rounded-[7px] border border-[rgba(200,162,39,0.18)] bg-[rgba(5,15,8,0.8)] px-3 py-2 text-[13px] text-[#f0fff4] outline-none transition-colors focus:border-[rgba(200,162,39,0.5)]"
              />
            </div>
          </div>
        </header>

        <div className="flex flex-col gap-3 sm:hidden">
          <div className="rounded-xl border border-[rgba(0,200,83,0.14)] bg-[rgba(8,22,14,0.95)] p-[12px_14px]">
            <div className="day-scroll-hide mb-2.5 flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {Array.from({ length: TOTAL_DAYS }, (_, i) => {
                const hasData = NUM_ROWS.some((r) => numData[r.key][i] !== "") || CHK_ROWS.some((r) => chkData[r.key][i]);
                const active = activeDay === i;

                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveDay(i)}
                    className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-mono text-[12px] transition-all ${
                      active
                        ? "border-[1.5px] border-[#00c853] bg-[rgba(0,200,83,0.18)] text-[#00c853] font-bold"
                        : hasData
                          ? "border border-[rgba(0,200,83,0.35)] bg-[rgba(0,200,83,0.06)] text-[rgba(0,200,83,0.7)]"
                          : "border border-[rgba(0,200,83,0.1)] bg-[rgba(8,22,14,0.6)] text-[rgba(232,245,233,0.3)]"
                    }`}
                  >
                    {toBn(i + 1)}
                    {hasData && !active && <span className="absolute right-[3px] top-[3px] h-1 w-1 rounded-full bg-[#00c853]" />}
                  </button>
                );
              })}
            </div>

            <div className="mt-1 flex items-center gap-2">
              <button
                type="button"
                onClick={prevDay}
                disabled={activeDay === 0}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[7px] border border-[rgba(0,200,83,0.15)] bg-[rgba(0,200,83,0.05)] text-[rgba(0,200,83,0.7)] disabled:cursor-not-allowed disabled:text-[rgba(232,245,233,0.15)]"
              >
                <ChevronLeft size={14} strokeWidth={2} />
              </button>

              <div className="flex-1">
                <div className="mb-1.5 flex items-center gap-2">
                  <div className="h-2 w-2 shrink-0 rounded-full bg-[#00c853] shadow-[0_0_8px_rgba(0,200,83,0.6)]" />
                  <span className="font-mono text-[14px] font-bold text-[#00c853]">{toBn(activeDay + 1)} তারিখ</span>
                  <div className="ml-auto flex items-center gap-1">
                    <Calendar size={10} color="rgba(200,162,39,0.4)" />
                    <span className="font-mono text-[9px] text-[rgba(232,245,233,0.25)]">{month || "মাস নির্বাচন করুন"}</span>
                  </div>
                </div>
                <DayProgress numData={numData} chkData={chkData} day={activeDay} />
              </div>

              <button
                type="button"
                onClick={nextDay}
                disabled={activeDay === TOTAL_DAYS - 1}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[7px] border border-[rgba(0,200,83,0.15)] bg-[rgba(0,200,83,0.05)] text-[rgba(0,200,83,0.7)] disabled:cursor-not-allowed disabled:text-[rgba(232,245,233,0.15)]"
              >
                <ChevronRight size={14} strokeWidth={2} />
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-[rgba(0,200,83,0.14)] bg-[rgba(8,22,14,0.95)]">
            <div className="h-0.5 bg-linear-to-r from-transparent via-[#00c853] via-50% to-transparent" />

            <div className="p-[14px_14px_8px]">
              <div className="mb-2.5 font-mono text-[9px] uppercase tracking-[2.5px] text-[rgba(0,200,83,0.4)]">আমলের পরিমাণ</div>
              <div className="flex flex-col gap-1.5">
                {NUM_ROWS.map((r) => (
                  <div key={r.key} className={`flex items-center gap-2.5 rounded-[10px] border p-[10px_12px] transition-all ${r.bgClass} ${r.borderClass}`}>
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${r.borderClass} ${r.iconBgClass}`}>
                      <r.Icon size={14} className={r.colorClass} strokeWidth={1.8} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-medium text-[#f0fff4]">{r.label}</div>
                      <div className="font-mono text-[10px] text-[rgba(232,245,233,0.28)]">{r.unit}</div>
                    </div>
                    <input
                      type="number"
                      min="0"
                      step={r.step}
                      value={numData[r.key][activeDay]}
                      onChange={(e) => setNum(r.key, activeDay, e.target.value)}
                      placeholder="০"
                      className={`h-10 w-16 shrink-0 rounded-lg border bg-[rgba(5,12,8,0.6)] text-center font-mono text-[16px] font-bold outline-none ${r.colorClass} ${r.borderClass}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="mx-3.5 my-1 h-px bg-linear-to-r from-transparent via-[rgba(200,162,39,0.2)] to-transparent" />

            <div className="p-[8px_14px_14px]">
              <div className="mb-2.5 font-mono text-[9px] uppercase tracking-[2.5px] text-[rgba(200,162,39,0.4)]">দৈনিক কার্যক্রম</div>
              <div className="grid grid-cols-2 gap-2">
                {CHK_ROWS.map((r) => {
                  const checked = chkData[r.key][activeDay];
                  return (
                    <button
                      key={r.key}
                      type="button"
                      onClick={() => toggleChk(r.key, activeDay)}
                      className={`flex flex-col items-center gap-1.5 rounded-[10px] p-[12px_10px] transition-all ${
                        checked
                          ? `border-[1.5px] ${r.borderClass} ${r.bgClass} shadow-[0_0_16px_rgba(0,0,0,0.25)]`
                          : `border-[1.5px] ${r.borderClass} bg-[rgba(8,22,14,0.5)]`
                      }`}
                    >
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-[10px] border ${
                          checked ? `${r.borderClass} ${r.bgClass}` : "border-white/10 bg-white/5"
                        }`}
                      >
                        <r.Icon size={16} className={checked ? r.colorClass : "text-white/35"} strokeWidth={1.8} />
                      </div>
                      <span className={`text-center text-[11px] leading-[1.3] ${checked ? `${r.colorClass} font-semibold` : "text-white/40"}`}>
                        {r.label}
                      </span>
                      {checked && (
                        <div className={`flex h-4 w-4 items-center justify-center rounded-full ${r.colorClass.replace("text-", "bg-")}`}>
                          <svg width="9" height="9" viewBox="0 0 12 12" fill="none" className="text-[#050f08]">
                            <path d="M1.5 6L4.5 9L10.5 3" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <SummaryGrid numAvg={numAvg} chkTotals={chkTotals} />
        </div>

        <div className="hidden sm:block xl:hidden">
          <TabletView numData={numData} chkData={chkData} setNum={setNum} toggleChk={toggleChk} numAvg={numAvg} chkTotals={chkTotals} />
        </div>

        <div className="hidden xl:block">
          <div className="mb-3 overflow-hidden rounded-xl border border-[rgba(0,200,83,0.15)] bg-[rgba(8,22,14,0.95)]">
            <div className="h-0.5 bg-linear-to-r from-transparent via-[#00c853] via-40% to-transparent" />
            <div className="overflow-x-auto">
              <table className="min-w-[900px] w-full border-collapse">
                <THead days={Array.from({ length: TOTAL_DAYS }, (_, i) => i)} />
                <tbody>
                  {NUM_ROWS.map((r, ri) => (
                    <tr key={r.key} className={ri % 2 === 0 ? "bg-transparent" : "bg-black/12"}>
                      <td className="whitespace-nowrap border-b border-r border-[rgba(0,200,83,0.08)] px-3.5 py-1.5">
                        <div className="flex items-center gap-2">
                          <div className={`flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[7px] border ${r.borderClass} ${r.bgClass}`}>
                            <r.Icon size={12} className={r.colorClass} strokeWidth={1.8} />
                          </div>
                          <div>
                            <div className="text-[12px] text-[#f0fff4]">{r.label}</div>
                            <div className="font-mono text-[9px] text-[rgba(232,245,233,0.22)]">{r.unit}</div>
                          </div>
                        </div>
                      </td>

                      {Array.from({ length: TOTAL_DAYS }, (_, i) => (
                        <td key={i} className="border-b border-r border-[rgba(0,200,83,0.05)] px-0.5 py-0.5">
                          <input
                            type="number"
                            min="0"
                            step={r.step}
                            value={numData[r.key][i]}
                            onChange={(e) => setNum(r.key, i, e.target.value)}
                            placeholder="—"
                            className={`h-[26px] min-w-7 w-full rounded border border-[rgba(0,200,83,0.08)] bg-[rgba(0,200,83,0.03)] text-center font-mono text-[11px] font-semibold outline-none ${r.colorClass}`}
                          />
                        </td>
                      ))}

                      <td className={`whitespace-nowrap border-b border-l border-[rgba(200,162,39,0.1)] px-1.5 py-1 text-center font-mono text-[12px] font-bold ${r.colorClass}`}>
                        {numAvg[r.key]}
                      </td>
                    </tr>
                  ))}

                  <tr>
                    <td colSpan={TOTAL_DAYS + 2} className="h-0.5 bg-[rgba(200,162,39,0.1)] p-0" />
                  </tr>

                  {CHK_ROWS.map((r, ri) => (
                    <tr key={r.key} className={ri % 2 === 0 ? "bg-[rgba(200,162,39,0.02)]" : "bg-transparent"}>
                      <td className="whitespace-nowrap border-b border-r border-[rgba(0,200,83,0.08)] px-3.5 py-1.5">
                        <div className="flex items-center gap-2">
                          <div className={`flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[7px] border ${r.borderClass} ${r.bgClass}`}>
                            <r.Icon size={12} className={r.colorClass} strokeWidth={1.8} />
                          </div>
                          <div className="text-[12px] text-[#f0fff4]">{r.label}</div>
                        </div>
                      </td>

                      {Array.from({ length: TOTAL_DAYS }, (_, i) => (
                        <td key={i} className="border-b border-r border-[rgba(0,200,83,0.05)] px-0.5 py-0.5 text-center">
                          <div className="flex justify-center">
                            <Chk checked={chkData[r.key][i]} onChange={() => toggleChk(r.key, i)} colorClass={r.colorClass} />
                          </div>
                        </td>
                      ))}

                      <td className={`border-b border-l border-[rgba(200,162,39,0.1)] px-1.5 py-1 text-center font-mono text-[12px] font-bold ${r.colorClass}`}>
                        {chkTotals[r.key]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <SummaryGrid numAvg={numAvg} chkTotals={chkTotals} />
        </div>

        <div className="overflow-hidden rounded-xl border border-[rgba(0,200,83,0.13)] bg-[rgba(8,22,14,0.95)]">
          <div className="h-0.5 bg-linear-to-r from-transparent via-[rgba(200,162,39,0.6)] to-transparent" />
          <div className="p-[16px_18px]">
            <div className="mb-3 flex items-center gap-1.5">
              <MessageSquare size={14} color="#c8a227" strokeWidth={1.8} />
              <span className="font-mono text-[10px] uppercase tracking-[2.5px] text-[rgba(200,162,39,0.7)]">পরামর্শ</span>
            </div>
            <textarea
              value={advice}
              onChange={(e) => setAdvice(e.target.value)}
              placeholder="দায়িত্বশীল হিসেবে এখানে পরামর্শ লিখুন..."
              rows={4}
              className="min-h-[90px] w-full resize-y rounded-[10px] border border-[rgba(200,162,39,0.18)] bg-[rgba(5,12,8,0.7)] p-[12px_14px] text-[13px] leading-[1.75] text-[#f0fff4] outline-none transition-colors focus:border-[rgba(200,162,39,0.5)]"
            />

            <div className="mt-2.5 flex justify-end">
              <button
                type="button"
                onClick={handleAdviceSave}
                className={`flex items-center gap-1.5 rounded-lg px-5 py-2 font-mono text-[11px] font-semibold uppercase tracking-[1.5px] transition-all ${
                  adviceSaved
                    ? "border border-[#c8a227] bg-[rgba(200,162,39,0.16)] text-[#c8a227]"
                    : "border border-[rgba(200,162,39,0.32)] bg-[rgba(200,162,39,0.1)] text-[#e3cb72]"
                }`}
              >
                {adviceSaved ? (
                  <>
                    <CheckCircle2 size={13} strokeWidth={2} /> পরামর্শ সেভ হয়েছে
                  </>
                ) : (
                  <>
                    <Send size={12} strokeWidth={2} /> পরামর্শ সেভ করুন
                  </>
                )}
              </button>
            </div>

            {adviceList.length > 0 && (
              <div className="mt-3.5 rounded-[10px] border border-[rgba(200,162,39,0.14)] bg-[rgba(5,12,8,0.5)] p-3">
                <div className="mb-2.5 font-mono text-[9px] uppercase tracking-[2.5px] text-[rgba(200,162,39,0.55)]">সেভ করা পরামর্শসমূহ</div>
                <div className="flex flex-col gap-2">
                  {adviceList.map((e) => (
                    <div key={e.id} className="rounded-lg border border-[rgba(0,200,83,0.1)] bg-[rgba(0,200,83,0.03)] px-3 py-2">
                      <div className="mb-1 flex items-center gap-1 font-mono text-[9px] text-[rgba(200,162,39,0.65)]">
                        <Clock size={9} color="rgba(200,162,39,0.5)" />
                        {e.createdAt}
                      </div>
                      <p className="text-[12px] leading-[1.65] text-[rgba(232,245,233,0.82)]">{e.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-2.5">
          {editingId && (
            <button
              type="button"
              onClick={deleteReport}
              className="flex items-center gap-1.5 rounded-lg border border-[rgba(255,120,120,0.3)] px-[18px] py-[9px] font-mono text-[12px] tracking-wide text-[rgba(255,160,160,0.85)]"
            >
              <Trash2 size={13} strokeWidth={2} /> রিপোর্ট ডিলিট
            </button>
          )}

          <button
            type="button"
            onClick={reset}
            className="flex items-center gap-1.5 rounded-lg border border-[rgba(232,245,233,0.1)] px-5 py-[9px] font-mono text-[12px] tracking-wide text-[rgba(232,245,233,0.38)]"
          >
            <RotateCcw size={13} strokeWidth={2} /> রিসেট
          </button>

          <button
            type="button"
            onClick={handleReportSave}
            className={`flex items-center gap-2 rounded-lg px-7 py-[9px] font-mono text-[12px] font-bold uppercase tracking-[2px] transition-all ${
              reportSaved
                ? "border border-[#00c853] bg-[rgba(0,200,83,0.14)] text-[#00c853]"
                : "border border-transparent bg-[#00c853] text-[#050f08] shadow-[0_0_20px_rgba(0,200,83,0.3)]"
            }`}
          >
            {reportSaved ? (
              <>
                <CheckCircle2 size={14} strokeWidth={2} /> রিপোর্ট সেভ হয়েছে
              </>
            ) : (
              <>
                <Send size={13} strokeWidth={2} /> {editingId ? "রিপোর্ট আপডেট" : "রিপোর্ট সেভ"}
              </>
            )}
          </button>
        </div>
      </div>

      {showHistory && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close"
            onClick={() => setShowHistory(false)}
            className="absolute inset-0 cursor-pointer border-none bg-black/60"
          />

          <aside className="absolute right-0 top-0 flex h-full w-full max-w-[420px] flex-col border-l border-[rgba(200,162,39,0.18)] bg-[rgba(6,16,10,0.98)] shadow-[-8px_0_32px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-2 border-b border-[rgba(200,162,39,0.14)] px-4 py-3.5">
              <History size={15} color="#c8a227" strokeWidth={1.8} />
              <span className="font-mono text-[11px] uppercase tracking-[2.5px] text-[rgba(200,162,39,0.9)]">রিপোর্ট হিস্ট্রি</span>
              <button
                type="button"
                onClick={() => setShowHistory(false)}
                className="ml-auto flex h-7 w-7 items-center justify-center rounded-md border border-[rgba(232,245,233,0.15)] bg-[rgba(232,245,233,0.04)] text-[rgba(232,245,233,0.7)]"
              >
                <X size={13} />
              </button>
            </div>

            <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-3">
              {reports.length === 0 && <p className="p-2 font-mono text-[12px] text-[rgba(232,245,233,0.35)]">কোনো রিপোর্ট হিস্ট্রি নেই</p>}

              {reports.map((item) => {
                const hasData = NUM_ROWS.some((r) => Object.values(item.numData[r.key]).some((v) => v !== ""));
                const chkTotal = CHK_ROWS.reduce((acc, r) => acc + Object.values(item.chkData[r.key]).filter(Boolean).length, 0);
                const active = editingId === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => openRecord(item)}
                    className={`w-full rounded-[10px] p-[12px_14px] text-left transition-all ${
                      active
                        ? "border border-[rgba(0,200,83,0.45)] bg-[rgba(0,200,83,0.08)]"
                        : "border border-[rgba(0,200,83,0.15)] bg-[rgba(0,200,83,0.04)]"
                    }`}
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-[13px] font-semibold text-[#f0fff4]">{item.month}</span>
                      <span className="font-mono text-[10px] text-[rgba(200,162,39,0.75)]">{item.submittedAt}</span>
                    </div>
                    <div className="mb-0.5 text-[12px] text-[rgba(232,245,233,0.65)]">{item.name || "নাম নেই"}</div>
                    <div className="mb-1.5 text-[11px] text-[rgba(232,245,233,0.38)]">{item.school || "প্রতিষ্ঠান নেই"}</div>
                    <div className="flex gap-1.5">
                      <span className="rounded px-1.5 py-0.5 font-mono text-[10px] text-[rgba(0,200,83,0.8)] bg-[rgba(0,200,83,0.08)]">
                        ডাটা: {hasData ? "আছে" : "নেই"}
                      </span>
                      <span className="rounded px-1.5 py-0.5 font-mono text-[10px] text-[rgba(200,162,39,0.8)] bg-[rgba(200,162,39,0.08)]">
                        চেক: {toBn(chkTotal)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}
