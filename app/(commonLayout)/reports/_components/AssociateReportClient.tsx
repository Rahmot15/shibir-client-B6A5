"use client";

import { useState, useMemo, useCallback } from "react";
import {
  BookOpen, BookMarked, Library, GraduationCap,
  Users, Heart, Moon, Dumbbell, Newspaper,
  MessageSquare, Send, RotateCcw, CheckCircle2,
  TrendingUp, Calendar, School, Sun, Sunset,
} from "lucide-react";

/* ══════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════ */

const TOTAL_DAYS = 31;

const NUMERIC_ROWS = [
  { key: "quran", label: "কুরআন পাঠ", icon: BookOpen, unit: "আয়াত", gold: false, step: "1" },
  { key: "hadith", label: "হাদিস পাঠ", icon: BookMarked, unit: "টি", gold: false, step: "1" },
  { key: "islamic", label: "ইসলামী বই পড়া", icon: Library, unit: "পৃষ্ঠা", gold: false, step: "1" },
  { key: "textbook", label: "পাঠ্যপুস্তক", icon: GraduationCap, unit: "ঘণ্টা", gold: true, step: "0.1" },
  { key: "friends", label: "বন্ধু যোগাযোগ", icon: Users, unit: "জন", gold: true, step: "1" },
  { key: "goodwork", label: "ভালো কাজ", icon: Heart, unit: "ঘণ্টা", gold: true, step: "0.1" },
  { key: "namazJamaat", label: "নামাজ (জামাআত)", icon: Moon, unit: "ওয়াক্ত", gold: false, step: "1" },
  { key: "namazQaza", label: "নামাজ (কাজা)", icon: Moon, unit: "ওয়াক্ত", gold: true, step: "1" },
] as const;

const CHECK_ROWS = [
  { key: "class", label: "ক্লাসে উপস্থিতি", icon: School, gold: false },
  { key: "selfcrit", label: "আত্ম-সমালোচনা", icon: MessageSquare, gold: true },
  { key: "sports", label: "খেলাধুলা", icon: Dumbbell, gold: true },
  { key: "newspaper", label: "পত্রিকা পাঠ", icon: Newspaper, gold: true },
] as const;

const WEEK_RANGES = [
  { label: "সপ্তাহ ১", days: [0, 1, 2, 3, 4, 5, 6, 7] },
  { label: "সপ্তাহ ২", days: [8, 9, 10, 11, 12, 13, 14, 15] },
  { label: "সপ্তাহ ৩", days: [16, 17, 18, 19, 20, 21, 22, 23] },
  { label: "সপ্তাহ ৪", days: [24, 25, 26, 27, 28, 29, 30] },
];

type NumKey = (typeof NUMERIC_ROWS)[number]["key"];
type ChkKey = (typeof CHECK_ROWS)[number]["key"];
type NumData = Record<NumKey, Record<number, string>>;
type ChkData = Record<ChkKey, Record<number, boolean>>;

/* ══════════════════════════════════════════
   HELPERS
══════════════════════════════════════════ */

const BN = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const toBn = (n: number | string) => String(n).replace(/\d/g, (d) => BN[+d]);

function calcAverage(vals: Record<number, string>): string {
  const nums = Object.values(vals)
    .filter((v) => v !== "" && !isNaN(Number(v)))
    .map(Number);
  if (!nums.length) return "—";
  const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
  const rounded = Number.isInteger(avg) ? avg.toString() : avg.toFixed(2).replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
  return toBn(rounded);
}

function calcCount(vals: Record<number, boolean>): string {
  const c = Object.values(vals).filter(Boolean).length;
  return c === 0 ? "—" : toBn(c);
}

function initNum(): NumData {
  const obj = {} as NumData;
  NUMERIC_ROWS.forEach((r) => {
    obj[r.key] = {};
    for (let d = 0; d < TOTAL_DAYS; d++) obj[r.key][d] = "";
  });
  return obj;
}

function initChk(): ChkData {
  const obj = {} as ChkData;
  CHECK_ROWS.forEach((r) => {
    obj[r.key] = {};
    for (let d = 0; d < TOTAL_DAYS; d++) obj[r.key][d] = false;
  });
  return obj;
}

/* ══════════════════════════════════════════
   CHECKBOX COMPONENT
══════════════════════════════════════════ */

function Checkbox({
  checked,
  onChange,
  size = 22,
}: {
  checked: boolean;
  onChange: () => void;
  size?: number;
}) {
  const borderColor = checked ? "border-[#00c853]" : "border-[rgba(0,200,83,0.22)]";
  const bgColor = checked ? "bg-[rgba(0,200,83,0.14)]" : "bg-[rgba(5,15,8,0.6)]";

  return (
    <button
      onClick={onChange}
      className={`flex items-center justify-center cursor-pointer transition-all flex-shrink-0 p-0 rounded ${borderColor} ${bgColor}`}
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.22),
        border: `1.5px solid ${checked ? "#00c853" : "rgba(0,200,83,0.22)"}`,
      }}
    >
      {checked && (
        <svg width={size * 0.54} height={size * 0.54} viewBox="0 0 12 12" fill="none">
          <path
            d="M1.5 6L4.5 9L10.5 3"
            stroke="#00c853"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}

/* ══════════════════════════════════════════
   SUMMARY GRID
══════════════════════════════════════════ */

function SummaryGrid({
  numAverages,
  chkTotals,
}: {
  numAverages: Record<NumKey, string>;
  chkTotals: Record<ChkKey, string>;
}) {
  return (
    <div className="bg-[rgba(10,26,14,0.85)] border border-[rgba(200,162,39,0.14)] rounded-[10px] p-[14px_16px]">
      <div className="flex items-center gap-1.5 text-[9px] tracking-widest text-[rgba(200,162,39,0.6)] uppercase font-mono mb-3">
        <TrendingUp size={11} color="rgba(200,162,39,0.6)" strokeWidth={1.8} />
        মাসিক সারসংক্ষেপ
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-2">
        {NUMERIC_ROWS.map((r) => (
          <div
            key={r.key}
            className={`p-[10px_11px] rounded ${
              r.gold
                ? "bg-[rgba(200,162,39,0.04)] border border-[rgba(200,162,39,0.12)]"
                : "bg-[rgba(0,200,83,0.04)] border border-[rgba(0,200,83,0.1)]"
            }`}
          >
            <div className="flex items-center gap-1 text-[10px] text-[rgba(232,245,233,0.38)] mb-1.25">
              <r.icon
                size={10}
                color={r.gold ? "rgba(200,162,39,0.55)" : "rgba(0,200,83,0.55)"}
                strokeWidth={1.8}
              />
              {r.label}
            </div>
            <div
              className="text-[19px] font-bold font-mono"
              style={{ color: r.gold ? "#c8a227" : "#00c853" }}
            >
              {numAverages[r.key]}
            </div>
            <div className="text-[9px] text-[rgba(232,245,233,0.22)] font-mono mt-0.5">
              গড় / {r.unit}
            </div>
          </div>
        ))}
        {CHECK_ROWS.map((r) => (
          <div key={r.key} className="p-[10px_11px] rounded bg-[rgba(200,162,39,0.04)] border border-[rgba(200,162,39,0.12)]">
            <div className="flex items-center gap-1 text-[10px] text-[rgba(232,245,233,0.38)] mb-1.25">
              <r.icon size={10} color="rgba(200,162,39,0.55)" strokeWidth={1.8} />
              {r.label}
            </div>
            <div className="text-[19px] font-bold font-mono text-[#c8a227]">{chkTotals[r.key]}</div>
            <div className="text-[9px] text-[rgba(232,245,233,0.22)] font-mono mt-0.5">
              দিন / {toBn(TOTAL_DAYS)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   TABLET VIEW
══════════════════════════════════════════ */

function TabletView({
  numData,
  chkData,
  setNum,
  toggleChk,
  numAverages,
  chkTotals,
}: {
  numData: NumData;
  chkData: ChkData;
  setNum: (r: NumKey, d: number, v: string) => void;
  toggleChk: (r: ChkKey, d: number) => void;
  numAverages: Record<NumKey, string>;
  chkTotals: Record<ChkKey, string>;
}) {
  const [week, setWeek] = useState(0);
  const days = WEEK_RANGES[week].days;

  return (
    <div className="flex flex-col gap-3">
      {/* Week tabs */}
      <div className="flex gap-1.5">
        {WEEK_RANGES.map((w, i) => (
          <button
            key={i}
            onClick={() => setWeek(i)}
            className={`flex-1 px-1 py-2.25 rounded cursor-pointer transition-all font-mono text-[12px] ${
              week === i
                ? "border border-[rgba(0,200,83,0.5)] bg-[rgba(0,200,83,0.1)] text-[#00c853] font-bold"
                : "border border-[rgba(0,200,83,0.13)] bg-[rgba(10,26,14,0.7)] text-[rgba(232,245,233,0.4)]"
            }`}
          >
            {w.label}
            <span className="text-[10px] opacity-60 ml-1">
              ({toBn(days[0] + 1)}–{toBn(days[days.length - 1] + 1)})
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[rgba(10,26,14,0.9)] border border-[rgba(0,200,83,0.15)] rounded-[10px] overflow-hidden">
        <div className="h-0.5 bg-gradient-to-r from-transparent via-[#00c853] to-transparent" />
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="px-3.5 py-2.5 text-left text-[9px] tracking-widest uppercase text-[rgba(0,200,83,0.55)] font-mono bg-[rgba(0,200,83,0.04)] border-b border-r border-[rgba(0,200,83,0.12)] border-[rgba(0,200,83,0.08)] min-w-[140px]">
                  বিষয়
                </th>
                {days.map((d) => (
                  <th
                    key={d}
                    className="px-0.5 py-2.5 text-center text-[11px] text-[rgba(232,245,233,0.5)] font-mono bg-[rgba(0,200,83,0.04)] border-b border-r border-[rgba(0,200,83,0.12)] border-[rgba(0,200,83,0.06)] min-w-[34px]"
                  >
                    {toBn(d + 1)}
                  </th>
                ))}
                <th className="px-1.25 py-2.5 text-center text-[10px] text-[#c8a227] font-mono bg-[rgba(0,200,83,0.04)] border-b border-l border-[rgba(0,200,83,0.12)] border-[rgba(200,162,39,0.15)] min-w-[48px]">
                  গড়/মোট
                </th>
              </tr>
            </thead>
            <tbody>
              {NUMERIC_ROWS.map((r, ri) => (
                <tr key={r.key} className={ri % 2 ? "bg-[rgba(0,200,83,0.018)]" : "bg-transparent"}>
                  <td className="px-3.5 py-1.75 border-b border-r border-[rgba(0,200,83,0.06)] border-[rgba(0,200,83,0.08)]">
                    <div className="flex items-center gap-1.75">
                      <r.icon size={10} color={r.gold ? "rgba(200,162,39,0.55)" : "rgba(0,200,83,0.55)"} strokeWidth={1.8} />
                      <div>
                        <div className="text-[12px] text-[#f0fff4]">{r.label}</div>
                        <div className="text-[9px] text-[rgba(232,245,233,0.28)] font-mono">{r.unit}</div>
                      </div>
                    </div>
                  </td>
                  {days.map((d) => (
                    <td
                      key={d}
                      className="px-0.5 py-0.75 border-b border-r border-[rgba(0,200,83,0.06)]"
                    >
                      <input
                        type="number"
                        min="0"
                        step={r.step ?? "1"}
                        value={numData[r.key][d]}
                        onChange={(e) => setNum(r.key, d, e.target.value)}
                        placeholder="০"
                        className="w-full h-7 text-center bg-[rgba(0,200,83,0.04)] border border-[rgba(0,200,83,0.1)] rounded text-[#00c853] text-[11px] font-semibold outline-none font-mono"
                      />
                    </td>
                  ))}
                  <td className="px-1.25 py-0.75 text-center text-[12px] font-bold text-[#00c853] font-mono border-l border-b border-[rgba(200,162,39,0.12)] border-[rgba(0,200,83,0.06)]">
                    {numAverages[r.key]}
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan={days.length + 2} className="h-0.5 bg-[rgba(200,162,39,0.12)] p-0 border-none" />
              </tr>
              {CHECK_ROWS.map((r, ri) => (
                <tr key={r.key} className={ri % 2 ? "bg-[rgba(200,162,39,0.018)]" : "bg-transparent"}>
                  <td className="px-3.5 py-1.75 border-b border-r border-[rgba(0,200,83,0.06)] border-[rgba(0,200,83,0.08)]">
                    <div className="flex items-center gap-1.75">
                      <r.icon size={10} color="rgba(200,162,39,0.55)" strokeWidth={1.8} />
                      <div>
                        <div className="text-[12px] text-[#f0fff4]">{r.label}</div>
                      </div>
                    </div>
                  </td>
                  {days.map((d) => (
                    <td key={d} className="px-0.5 py-0.75 border-b border-r border-[rgba(0,200,83,0.06)]">
                      <div className="flex items-center justify-center">
                        <Checkbox checked={chkData[r.key][d]} onChange={() => toggleChk(r.key, d)} size={20} />
                      </div>
                    </td>
                  ))}
                  <td className="px-1.25 py-0.75 text-center text-[12px] font-bold text-[#c8a227] font-mono border-l border-b border-[rgba(200,162,39,0.12)] border-[rgba(0,200,83,0.06)]">
                    {chkTotals[r.key]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SummaryGrid numAverages={numAverages} chkTotals={chkTotals} />
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */

export default function AssociateReportClient() {
  const [numData, setNumData] = useState<NumData>(initNum);
  const [chkData, setChkData] = useState<ChkData>(initChk);
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [month, setMonth] = useState("");
  const [advice, setAdvice] = useState("");
  const [activeDay, setActiveDay] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const setNum = useCallback((row: NumKey, day: number, val: string) => {
    if (val !== "" && (isNaN(Number(val)) || Number(val) < 0)) return;
    setNumData((p) => ({ ...p, [row]: { ...p[row], [day]: val } }));
  }, []);

  const toggleChk = useCallback((row: ChkKey, day: number) => {
    setChkData((p) => ({ ...p, [row]: { ...p[row], [day]: !p[row][day] } }));
  }, []);

  const numAverages = useMemo(
    () =>
      Object.fromEntries(NUMERIC_ROWS.map((r) => [r.key, calcAverage(numData[r.key])])) as Record<
        NumKey,
        string
      >,
    [numData]
  );

  const chkTotals = useMemo(
    () =>
      Object.fromEntries(CHECK_ROWS.map((r) => [r.key, calcCount(chkData[r.key])])) as Record<
        ChkKey,
        string
      >,
    [chkData]
  );

  function reset() {
    setNumData(initNum());
    setChkData(initChk());
    setName("");
    setSchool("");
    setMonth("");
    setAdvice("");
    setActiveDay(0);
    setSubmitted(false);
  }

  function handleSubmit() {
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  }

  return (
    <main className="min-h-screen  px-[clamp(10px,3vw,28px)]  font-sans md:mt-20 mt-16">
      {/* ══ HEADER ══ */}
      <div className="max-w-[1400px] mx-auto mb-3.5">
        <header className="bg-[rgba(10,26,14,0.92)] border border-[rgba(0,200,83,0.15)] rounded-[12px] overflow-hidden">
          {/* Top accent */}
          <div className="h-0.5 bg-gradient-to-r from-transparent via-[#00c853] to-transparent" />

          {/* Title row */}
          <div className="flex items-center gap-3 px-5 pt-3.5 pb-2">
            <div className="w-[34px] h-[34px] rounded-full border border-[rgba(0,200,83,0.28)] flex items-center justify-center flex-shrink-0">
              <Moon size={17} color="#00c853" strokeWidth={1.8} />
            </div>
            <div>
              <div className="flex items-center gap-1.25 text-[9px] tracking-widest text-[rgba(0,200,83,0.55)] uppercase font-mono mb-0.5">
                <TrendingUp size={10} color="#00c853" />
                <span>সহযোগী মাসিক প্রতিবেদন</span>
              </div>
              <h1 className="text-[clamp(17px,3.2vw,24px)] font-bold text-[#f0fff4] m-0 leading-[1.2]">
                সহযোগী আমলনামা
              </h1>
            </div>
          </div>

          {/* Questions */}
          <div className="grid grid-cols-2 gap-2.5 px-5 py-3">
            <div className="bg-[rgba(0,200,83,0.03)] border border-[rgba(0,200,83,0.08)] rounded-[8px] p-[10px_12px]">
              <div className="flex items-center gap-1.25 text-[9px] tracking-widest uppercase font-mono mb-1.75" style={{ color: "rgba(0,200,83,0.65)" }}>
                <Sun size={11} color="rgba(0,200,83,0.65)" strokeWidth={1.8} />
                সকাল
              </div>
              {[
                "ফজরের ঘুম থেকে উঠতে পেরেছি কি?",
                "আজকের কাজগুলো বুঝে নিয়েছি কি?",
                "ক্লাসের প্রস্তুতি নিতে পেরেছি কি?",
              ].map((q) => (
                <p key={q} className="text-[11px] text-[rgba(232,245,233,0.42)] leading-[1.75]">
                  {q}
                </p>
              ))}
            </div>
            <div className="bg-[rgba(200,162,39,0.03)] border border-[rgba(200,162,39,0.1)] rounded-[8px] p-[10px_12px]">
              <div className="flex items-center gap-1.25 text-[9px] tracking-widest uppercase font-mono mb-1.75" style={{ color: "rgba(200,162,39,0.65)" }}>
                <Sunset size={11} color="rgba(200,162,39,0.65)" strokeWidth={1.8} />
                রাত
              </div>
              {[
                "আজকের নামাজ জামায়াতে হয়েছে কি?",
                "আব্বা-আম্মার কথামতো কাজ করেছি কি?",
                "গতকালের চেয়ে ভালো কাজ করেছি কি?",
              ].map((q) => (
                <p key={q} className="text-[11px] text-[rgba(232,245,233,0.42)] leading-[1.75]">
                  {q}
                </p>
              ))}
            </div>
          </div>

          {/* Meta fields */}
          <div className="grid grid-cols-3 gap-2.5 px-5 pb-4">
            {[
              { label: "নামঃ", val: name, set: setName, ph: "নাম লিখুন" },
              { label: "শিক্ষাপ্রতিষ্ঠানঃ", val: school, set: setSchool, ph: "প্রতিষ্ঠানের নাম" },
              { label: "মাসঃ", val: month, set: setMonth, ph: "মাস" },
            ].map((f) => (
              <div key={f.label} className="flex flex-col gap-1">
                <label className="text-[10px] text-[rgba(200,162,39,0.65)] font-mono tracking-widest">
                  {f.label}
                </label>
                <input
                  type="text"
                  value={f.val}
                  onChange={(e) => f.set(e.target.value)}
                  placeholder={f.ph}
                  className="bg-[rgba(5,15,8,0.8)] border border-[rgba(200,162,39,0.2)] rounded px-2.5 py-1.75 text-[#f0fff4] text-[12px] outline-none w-full transition-colors focus:border-[rgba(200,162,39,0.5)]"
                />
              </div>
            ))}
          </div>
        </header>
      </div>

      {/* ══ BODY ══ */}
      <div className="max-w-[1400px] mx-auto flex flex-col gap-3">
        {/* ── MOBILE (hidden md:) ── */}
        <div className="md:hidden flex flex-col gap-3">
          {/* Day pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {Array.from({ length: TOTAL_DAYS }, (_, i) => (
              <button
                key={i}
                onClick={() => setActiveDay(i)}
                className={`flex-shrink-0 w-10 h-10 rounded transition-all text-[13px] font-mono ${
                  activeDay === i
                    ? "border border-[rgba(0,200,83,0.6)] bg-[rgba(0,200,83,0.13)] text-[#00c853] font-bold"
                    : "border border-[rgba(0,200,83,0.13)] bg-[rgba(10,26,14,0.7)] text-[rgba(232,245,233,0.4)]"
                }`}
              >
                {toBn(i + 1)}
              </button>
            ))}
          </div>

          {/* Day card */}
          <div className="bg-[rgba(10,26,14,0.9)] border border-[rgba(0,200,83,0.15)] rounded-[10px] overflow-hidden">
            <div className="h-0.5 bg-gradient-to-r from-transparent via-[#00c853] to-transparent" />
            <div className="px-4 py-2.75 border-b border-[rgba(0,200,83,0.08)] flex items-center gap-2">
              <div className="w-1.75 h-1.75 rounded-full bg-[#00c853] shadow-[0_0_7px_rgba(0,200,83,0.5)] flex-shrink-0" />
              <span className="text-[15px] font-bold text-[#00c853] font-mono">{toBn(activeDay + 1)} তারিখ</span>
              <div className="ml-auto flex items-center gap-1.25">
                <Calendar size={11} color="rgba(200,162,39,0.45)" />
                <span className="text-[10px] text-[rgba(232,245,233,0.28)] font-mono">
                  {toBn(new Date().getFullYear())}
                </span>
              </div>
            </div>
            <div className="p-3">
              {NUMERIC_ROWS.map((r) => (
                <div
                  key={r.key}
                  className={`flex items-center justify-between p-[10px_12px] rounded gap-2.5 mb-2 ${
                    r.gold
                      ? "bg-[rgba(200,162,39,0.03)] border border-[rgba(200,162,39,0.1)]"
                      : "bg-[rgba(0,200,83,0.03)] border border-[rgba(0,200,83,0.1)]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <r.icon
                      size={11}
                      color={r.gold ? "rgba(200,162,39,0.55)" : "rgba(0,200,83,0.55)"}
                      strokeWidth={1.8}
                    />
                    <div>
                      <div className="text-[13px] text-[#f0fff4]">{r.label}</div>
                      <div className="text-[10px] text-[rgba(232,245,233,0.28)] font-mono">{r.unit}</div>
                    </div>
                  </div>
                  <input
                    type="number"
                    min="0"
                    step={r.step ?? "1"}
                    value={numData[r.key][activeDay]}
                    onChange={(e) => setNum(r.key, activeDay, e.target.value)}
                    placeholder="০"
                    className="w-[62px] h-[38px] text-center bg-[rgba(0,200,83,0.06)] border border-[rgba(0,200,83,0.2)] rounded text-[#00c853] text-[15px] font-bold outline-none flex-shrink-0 font-mono"
                  />
                </div>
              ))}

              <div className="h-px bg-[rgba(200,162,39,0.12)] my-1" />

              {CHECK_ROWS.map((r) => (
                <div
                  key={r.key}
                  className={`flex items-center justify-between p-[10px_12px] rounded gap-2.5 mb-2 ${
                    r.gold
                      ? "bg-[rgba(200,162,39,0.03)] border border-[rgba(200,162,39,0.1)]"
                      : "bg-[rgba(0,200,83,0.03)] border border-[rgba(0,200,83,0.1)]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <r.icon
                      size={11}
                      color={r.gold ? "rgba(200,162,39,0.55)" : "rgba(0,200,83,0.55)"}
                      strokeWidth={1.8}
                    />
                    <div className="text-[13px] text-[#f0fff4]">{r.label}</div>
                  </div>
                  <Checkbox
                    checked={chkData[r.key][activeDay]}
                    onChange={() => toggleChk(r.key, activeDay)}
                    size={28}
                  />
                </div>
              ))}
            </div>
          </div>

          <SummaryGrid numAverages={numAverages} chkTotals={chkTotals} />
        </div>

        {/* ── TABLET (hidden md:block xl:hidden) ── */}
        <div className="hidden md:block xl:hidden">
          <TabletView
            numData={numData}
            chkData={chkData}
            setNum={setNum}
            toggleChk={toggleChk}
            numAverages={numAverages}
            chkTotals={chkTotals}
          />
        </div>

        {/* ── DESKTOP (hidden xl:block) ── */}
        <div className="hidden xl:block">
          <div className="bg-[rgba(10,26,14,0.9)] border border-[rgba(0,200,83,0.15)] rounded-[10px] overflow-hidden mb-3">
            <div className="h-0.5 bg-gradient-to-r from-transparent via-[#00c853] to-transparent" />
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[900px]">
                <thead>
                  <tr>
                    <th className="px-3.5 py-2.5 text-left text-[9px] tracking-widest uppercase text-[rgba(0,200,83,0.55)] font-mono bg-[rgba(0,200,83,0.04)] border-b border-r border-[rgba(0,200,83,0.12)] border-[rgba(0,200,83,0.08)] min-w-[155px]">
                      বিষয়
                    </th>
                    {Array.from({ length: TOTAL_DAYS }, (_, i) => (
                      <th
                        key={i}
                        className="px-0.5 py-2.5 text-center text-[11px] text-[rgba(232,245,233,0.5)] font-mono bg-[rgba(0,200,83,0.04)] border-b border-r border-[rgba(0,200,83,0.12)] border-[rgba(0,200,83,0.06)] min-w-[34px]"
                      >
                        {toBn(i + 1)}
                      </th>
                    ))}
                    <th className="px-1.25 py-2.5 text-center text-[10px] text-[#c8a227] font-mono bg-[rgba(0,200,83,0.04)] border-b border-l border-[rgba(0,200,83,0.12)] border-[rgba(200,162,39,0.15)] min-w-[48px]">
                      গড়/মোট
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {NUMERIC_ROWS.map((r, ri) => (
                    <tr key={r.key} className={ri % 2 ? "bg-[rgba(0,200,83,0.018)]" : "bg-transparent"}>
                      <td className="px-3.5 py-1.75 border-b border-r border-[rgba(0,200,83,0.06)] border-[rgba(0,200,83,0.08)]">
                        <div className="flex items-center gap-1.75">
                          <r.icon
                            size={10}
                            color={r.gold ? "rgba(200,162,39,0.55)" : "rgba(0,200,83,0.55)"}
                            strokeWidth={1.8}
                          />
                          <div>
                            <div className="text-[12px] text-[#f0fff4]">{r.label}</div>
                            <div className="text-[9px] text-[rgba(232,245,233,0.28)] font-mono">{r.unit}</div>
                          </div>
                        </div>
                      </td>
                      {Array.from({ length: TOTAL_DAYS }, (_, i) => (
                        <td key={i} className="px-0.5 py-0.75 border-b border-r border-[rgba(0,200,83,0.06)]">
                          <input
                            type="number"
                            min="0"
                            step={r.step ?? "1"}
                            value={numData[r.key][i]}
                            onChange={(e) => setNum(r.key, i, e.target.value)}
                            placeholder="০"
                            className="w-full h-7 text-center bg-[rgba(0,200,83,0.04)] border border-[rgba(0,200,83,0.1)] rounded text-[#00c853] text-[11px] font-semibold outline-none font-mono"
                          />
                        </td>
                      ))}
                      <td className="px-1.25 py-0.75 text-center text-[12px] font-bold text-[#00c853] font-mono border-l border-b border-[rgba(200,162,39,0.12)] border-[rgba(0,200,83,0.06)]">
                        {numAverages[r.key]}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={TOTAL_DAYS + 2} className="h-0.5 bg-[rgba(200,162,39,0.12)] p-0 border-none" />
                  </tr>
                  {CHECK_ROWS.map((r, ri) => (
                    <tr key={r.key} className={ri % 2 ? "bg-[rgba(200,162,39,0.018)]" : "bg-transparent"}>
                      <td className="px-3.5 py-1.75 border-b border-r border-[rgba(0,200,83,0.06)] border-[rgba(0,200,83,0.08)]">
                        <div className="flex items-center gap-1.75">
                          <r.icon size={10} color="rgba(200,162,39,0.55)" strokeWidth={1.8} />
                          <div>
                            <div className="text-[12px] text-[#f0fff4]">{r.label}</div>
                          </div>
                        </div>
                      </td>
                      {Array.from({ length: TOTAL_DAYS }, (_, i) => (
                        <td
                          key={i}
                          className="px-0.5 py-0.75 border-b border-r border-[rgba(0,200,83,0.06)]"
                        >
                          <div className="flex items-center justify-center">
                            <Checkbox
                              checked={chkData[r.key][i]}
                              onChange={() => toggleChk(r.key, i)}
                              size={20}
                            />
                          </div>
                        </td>
                      ))}
                      <td className="px-1.25 py-0.75 text-center text-[12px] font-bold text-[#c8a227] font-mono border-l border-b border-[rgba(200,162,39,0.12)] border-[rgba(0,200,83,0.06)]">
                        {chkTotals[r.key]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <SummaryGrid numAverages={numAverages} chkTotals={chkTotals} />
        </div>

        {/* ── ADVICE ── */}
        <div className="bg-[rgba(10,26,14,0.85)] border border-[rgba(0,200,83,0.14)] rounded-[10px] overflow-hidden">
          <div className="h-0.5 bg-gradient-to-r from-transparent via-[rgba(200,162,39,0.6)] to-transparent" />
          <div className="p-[14px_18px]">
            <div className="flex items-center gap-1.75 text-[9px] tracking-widest uppercase text-[rgba(200,162,39,0.7)] font-mono mb-2.5">
              <MessageSquare size={12} strokeWidth={1.8} />
              পরামর্শ
            </div>
            <textarea
              value={advice}
              onChange={(e) => setAdvice(e.target.value)}
              placeholder="দায়িত্বশীল হিসেবে এখানে পরামর্শ লিখুন..."
              rows={4}
              className="w-full bg-[rgba(5,15,8,0.7)] border border-[rgba(200,162,39,0.2)] rounded-2 p-[10px_12px] text-[#f0fff4] text-[13px] leading-[1.7] outline-none transition-colors focus:border-[rgba(200,162,39,0.5)] resize-vertical min-h-[88px]"
            />
          </div>
        </div>

        {/* ── ACTIONS ── */}
        <div className="flex gap-2.5 flex-wrap justify-end">
          <button
            onClick={reset}
            className="flex items-center gap-1.75 px-5 py-2.25 rounded bg-transparent border border-[rgba(232,245,233,0.12)] text-[rgba(232,245,233,0.4)] text-[12px] tracking-widest cursor-pointer transition-all hover:border-[rgba(232,245,233,0.3)] hover:text-[#f0fff4] font-mono"
          >
            <RotateCcw size={13} strokeWidth={2} />
            রিসেট
          </button>
          <button
            onClick={handleSubmit}
            className={`flex items-center gap-2 px-7 py-2.25 rounded text-[12px] font-bold tracking-widest uppercase cursor-pointer transition-all font-mono ${
              submitted
                ? "bg-[rgba(0,200,83,0.14)] border border-[#00c853] text-[#00c853]"
                : "bg-[#00c853] border border-transparent text-[#050f08] shadow-[0_0_18px_rgba(0,200,83,0.25)] hover:bg-[#00e676]"
            }`}
          >
            {submitted ? (
              <>
                <CheckCircle2 size={14} strokeWidth={2} /> জমা হয়েছে!
              </>
            ) : (
              <>
                <Send size={13} strokeWidth={2} /> রিপোর্ট জমা দিন
              </>
            )}
          </button>
        </div>
      </div>
    </main>
  );
}
