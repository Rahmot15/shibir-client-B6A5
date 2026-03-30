"use client"

import { useState, useMemo, useCallback } from "react"
import { toast } from "sonner"
import {
  BookOpenIcon, BookMarkedIcon, LibraryIcon, GraduationCapIcon,
  UsersIcon, MoonIcon, DumbbellIcon, NewspaperIcon,
  MessageSquareIcon, RotateCcwIcon,
  TrendingUpIcon, SchoolIcon, SaveIcon,
  ChevronRightIcon, ChevronLeftIcon, FileTextIcon,
  TargetIcon, ActivityIcon, StarIcon, SendIcon,
  UserCheckIcon,
} from "lucide-react"

/* ═══════════════════════════════════════════════
   TYPES & CONSTANTS
═══════════════════════════════════════════════ */
const TOTAL_DAYS = 31
const DAYS = Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1)
const BN = ["০","১","২","৩","৪","৫","৬","৭","৮","৯"]
const toBn = (n: number | string) => String(n).replace(/\d/g, d => BN[+d])

/* Daily report numeric rows — image-matched simplified structure */
const NUM_ROWS = [
  { key: "quranAyah", label: "কুরআন", sub: "আয়াত", Icon: BookOpenIcon, color: "#4ade80", bg: "rgba(74,222,128,0.1)", border: "rgba(74,222,128,0.2)" },
  { key: "hadithCount", label: "হাদিস", sub: "সংখ্যা", Icon: BookMarkedIcon, color: "#6ee7b7", bg: "rgba(110,231,183,0.1)", border: "rgba(110,231,183,0.2)" },
  { key: "sahityaPage", label: "সাহিত্য", sub: "পৃষ্ঠা", Icon: LibraryIcon, color: "#a78bfa", bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.2)" },
  { key: "textbookHours", label: "পাঠ্যপুস্তক", sub: "ঘণ্টা", Icon: GraduationCapIcon, color: "#fbbf24", bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.2)" },
  { key: "namazJamaat", label: "নামাজ", sub: "জামায়াত", Icon: MoonIcon, color: "#818cf8", bg: "rgba(129,140,248,0.1)", border: "rgba(129,140,248,0.2)" },
  { key: "namazQaza", label: "নামাজ", sub: "কাজা", Icon: MoonIcon, color: "#6366f1", bg: "rgba(99,102,241,0.1)", border: "rgba(99,102,241,0.2)" },
  { key: "contactMember", label: "যোগাযোগ", sub: "সদস্য", Icon: UsersIcon, color: "#38bdf8", bg: "rgba(56,189,248,0.1)", border: "rgba(56,189,248,0.2)" },
  { key: "contactSathi", label: "যোগাযোগ", sub: "সাথী", Icon: UsersIcon, color: "#38bdf8", bg: "rgba(56,189,248,0.1)", border: "rgba(56,189,248,0.2)" },
  { key: "contactKormi", label: "যোগাযোগ", sub: "কর্মী", Icon: UsersIcon, color: "#38bdf8", bg: "rgba(56,189,248,0.1)", border: "rgba(56,189,248,0.2)" },
  { key: "contactSomorthok", label: "যোগাযোগ", sub: "সমর্থক", Icon: UsersIcon, color: "#38bdf8", bg: "rgba(56,189,248,0.1)", border: "rgba(56,189,248,0.2)" },
  { key: "contactBondhu", label: "যোগাযোগ", sub: "বন্ধু", Icon: UsersIcon, color: "#0ea5e9", bg: "rgba(14,165,233,0.1)", border: "rgba(14,165,233,0.2)" },
  { key: "contactMedhabi", label: "যোগাযোগ", sub: "মেধাবী ছাত্র", Icon: UsersIcon, color: "#0ea5e9", bg: "rgba(14,165,233,0.1)", border: "rgba(14,165,233,0.2)" },
  { key: "contactVortakangkhi", label: "যোগাযোগ", sub: "ভর্তাকাঙ্ক্ষী", Icon: UsersIcon, color: "#0ea5e9", bg: "rgba(14,165,233,0.1)", border: "rgba(14,165,233,0.2)" },
  { key: "contactMuharrama", label: "যোগাযোগ", sub: "মুহাররমা", Icon: UsersIcon, color: "#0ea5e9", bg: "rgba(14,165,233,0.1)", border: "rgba(14,165,233,0.2)" },
  { key: "distSahitya", label: "বিতরণ", sub: "সাহিত্য", Icon: SendIcon, color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)" },
  { key: "distMagazine", label: "বিতরণ", sub: "ম্যাগাজিন", Icon: SendIcon, color: "#fbbf24", bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.2)" },
  { key: "distStickerCard", label: "বিতরণ", sub: "স্টিকার/কার্ড", Icon: SendIcon, color: "#fcd34d", bg: "rgba(252,211,77,0.1)", border: "rgba(252,211,77,0.2)" },
  { key: "distUpohar", label: "বিতরণ", sub: "উপহার", Icon: SendIcon, color: "#fde68a", bg: "rgba(253,230,138,0.1)", border: "rgba(253,230,138,0.2)" },
  { key: "orgDawati", label: "সাংগঠনিক", sub: "দাওয়াতি কাজ", Icon: TargetIcon, color: "#fb923c", bg: "rgba(251,146,60,0.1)", border: "rgba(251,146,60,0.2)" },
  { key: "orgSangothonik", label: "সাংগঠনিক", sub: "অন্যান্য সাংগঠনিক কাজ", Icon: TargetIcon, color: "#f87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.2)" },
] as const

const CHK_ROWS = [
  { key: "class",     label: "ক্লাস উপস্থিতি",  Icon: SchoolIcon,        color: "#38bdf8" },
  { key: "sports",    label: "খেলাধুলা",          Icon: DumbbellIcon,      color: "#fb923c" },
  { key: "newspaper", label: "পত্রিকা পাঠ",       Icon: NewspaperIcon,     color: "#94a3b8" },
  { key: "selfcrit",  label: "আত্মসমালোচনা",      Icon: MessageSquareIcon, color: "#f472b6" },
] as const

type NumKey = (typeof NUM_ROWS)[number]["key"]
type ChkKey = (typeof CHK_ROWS)[number]["key"]
type NumData = Record<NumKey, Record<number, string>>
type ChkData = Record<ChkKey, Record<number, boolean>>

/* ── Plan fields (Step 1) ── */
type PlanData = {
  /* কুরআন */
  planQuranDays: string; planQuranAvgAyah: string; planQuranSurah: string; planQuranMukh: string
  /* হাদিস */
  planHadithDays: string; planHadithAvg: string; planHadithBk: string; planHadithMukh: string
  /* সাহিত্য */
  planSahityaPages: string; planSahityaIslamiName: string; planSahityaOtherName: string; planBookNote: string
  /* পাঠ্যপুস্তক */
  planTextbookDays: string; planTextbookHrs: string; planClassTotal: string; planClassUpst: string
  /* নামাজ */
  planNamazJamaat: string; planNamazNafl: string
  /* সাংগঠনিক */
  planOrgDays: string; planOrgHrs: string
  /* দাওয়াত */
  planDawahDays: string; planDawahHrs: string; planOtherOrgDays: string; planOtherOrgHrs: string
  /* যোগাযোগ */
  planContactSadasya: string; planContactSathi: string; planContactKormi: string; planContactSomorthok: string
  planContactBondhu: string; planContactTulacha: string; planContactMedhabi: string; planContactShikkhok: string
  planContactMuharar: string; planContactVaigi: string
  /* বিতরণ */
  planDistIslamiSahitya: string; planDistChhatra: string; planDistKishore: string; planDistEnglish: string; planDistYw: string
  planDistSticker: string; planDistPorichi: string; planDistUpohar: string; planDistClassKupon: string
  /* বৃদ্ধি */
  planGrowSadasya: string; planGrowSadasyaArthi: string; planGrowSathi: string; planGrowSathiArthi: string
  planGrowKormi: string; planGrowSomorthok: string; planGrowBodhu: string; planGrowTobakki: string
  /* বায়তুলমাল */
  planBaitulReceiveDate: string; planBaitulPersonal: string; planBaitulTotal: string
  planBaitulChhatroKonna: string; planBaitulTableBanko: string; planBaitulKolsiHari: string
  /* বিবিধ */
  planMisc: string
  planAdvice: string
  /* meta */
  name: string; institution: string; month: string; thana: string; zila: string; phone: string
}

function initPlan(): PlanData {
  return Object.fromEntries([
    "planQuranDays","planQuranAvgAyah","planQuranSurah","planQuranMukh",
    "planHadithDays","planHadithAvg","planHadithBk","planHadithMukh",
    "planSahityaPages","planSahityaIslamiName","planSahityaOtherName","planBookNote",
    "planTextbookDays","planTextbookHrs","planClassTotal","planClassUpst",
    "planNamazJamaat","planNamazNafl",
    "planOrgDays","planOrgHrs","planDawahDays","planDawahHrs","planOtherOrgDays","planOtherOrgHrs",
    "planContactSadasya","planContactSathi","planContactKormi","planContactSomorthok",
    "planContactBondhu","planContactTulacha","planContactMedhabi","planContactShikkhok",
    "planContactMuharar","planContactVaigi",
    "planDistIslamiSahitya","planDistChhatra","planDistKishore","planDistEnglish","planDistYw",
    "planDistSticker","planDistPorichi","planDistUpohar","planDistClassKupon",
    "planGrowSadasya","planGrowSadasyaArthi","planGrowSathi","planGrowSathiArthi",
    "planGrowKormi","planGrowSomorthok","planGrowBodhu","planGrowTobakki",
    "planBaitulReceiveDate","planBaitulPersonal","planBaitulTotal",
    "planBaitulChhatroKonna","planBaitulTableBanko","planBaitulKolsiHari",
    "planMisc","planAdvice","name","institution","month","thana","zila","phone",
  ].map(k => [k, ""])) as PlanData
}

function initNum(): NumData {
  const o = {} as NumData
  NUM_ROWS.forEach(r => { o[r.key] = {}; DAYS.forEach(d => (o[r.key][d] = "")) })
  return o
}
function initChk(): ChkData {
  const o = {} as ChkData
  CHK_ROWS.forEach(r => { o[r.key] = {}; DAYS.forEach(d => (o[r.key][d] = false)) })
  return o
}

function calcAvg(vals: Record<number, string>): string {
  const nums = DAYS.map(d => vals[d]).filter(v => v !== "" && !isNaN(+v)).map(Number)
  if (!nums.length) return "—"
  const a = nums.reduce((s, v) => s + v, 0) / nums.length
  const r = Math.round(a * 10) / 10
  return toBn(Number.isInteger(r) ? r : r.toFixed(1))
}
function calcTotal(vals: Record<number, string>): string {
  const nums = DAYS.map(d => vals[d]).filter(v => v !== "" && !isNaN(+v)).map(Number)
  if (!nums.length) return "—"
  return toBn(nums.reduce((s, v) => s + v, 0))
}
function calcChkDays(vals: Record<number, boolean>): string {
  const c = DAYS.filter(d => vals[d]).length
  return c === 0 ? "—" : toBn(c)
}

/* ═══════════════════════════════════════════════
   SMALL SHARED COMPONENTS
═══════════════════════════════════════════════ */

function SectionTitle({ children, icon: Icon, color = "emerald" }: {
  children: React.ReactNode; icon?: React.ElementType; color?: string
}) {
  const clr: Record<string, string> = {
    emerald: "text-emerald-400 border-emerald-500/25",
    amber:   "text-amber-400 border-amber-500/25",
    blue:    "text-blue-400 border-blue-500/25",
    purple:  "text-purple-400 border-purple-500/25",
    rose:    "text-rose-400 border-rose-500/25",
  }
  return (
    <div className={`flex items-center gap-2 border-b pb-2 mb-3 ${clr[color]}`}>
      {Icon && <Icon className={`h-3.5 w-3.5 ${clr[color].split(" ")[0]}`} strokeWidth={1.8} />}
      <span className={`text-[11px] font-bold tracking-[2.5px] uppercase font-mono ${clr[color].split(" ")[0]}`}>{children}</span>
    </div>
  )
}

function PlanInput({ label, value, onChange, placeholder = "...", type = "text", half = false }: {
  label: string; value: string; onChange: (v: string) => void
  placeholder?: string; type?: string; half?: boolean
}) {
  return (
    <div className={`flex flex-col gap-1 ${half ? "" : ""}`}>
      <label className="text-[10px] text-white/35 font-mono">{label}</label>
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-8 rounded-lg border border-white/8 bg-white/3 px-2.5 text-[12px] text-emerald-50 placeholder-white/15 outline-none focus:border-emerald-500/35 focus:bg-white/5 transition-all font-mono"
      />
    </div>
  )
}

function Chk({ checked, onChange, color = "#00c853", size = 20 }: {
  checked: boolean; onChange: () => void; color?: string; size?: number
}) {
  return (
    <button onClick={onChange} style={{
      width: size, height: size,
      borderRadius: Math.round(size * 0.24),
      border: `1.5px solid ${checked ? color : "rgba(255,255,255,0.1)"}`,
      background: checked ? `${color}20` : "rgba(5,15,8,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center",
      cursor: "pointer", transition: "all .15s", flexShrink: 0, padding: 0,
      boxShadow: checked ? `0 0 8px ${color}30` : "none",
      margin: "0 auto",
    }}>
      {checked && (
        <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 12 12" fill="none">
          <path d="M1.5 6L4.5 9L10.5 3" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  )
}

/* ═══════════════════════════════════════════════
   STEP 1 — MONTHLY PLAN
═══════════════════════════════════════════════ */
function Step1Plan({ plan, setPlan }: {
  plan: PlanData
  setPlan: (p: PlanData) => void
}) {
  const set = (k: keyof PlanData) => (v: string) => setPlan({ ...plan, [k]: v })

  function savePlan() {
    toast.success("মাসিক পরিকল্পনা সংরক্ষিত হয়েছে!", {
      description: "আপনি যেকোনো সময় রিপোর্ট ফর্মে যেতে পারবেন।",
      duration: 4000,
    })
  }

  return (
    <div className="space-y-5">

      {/* Meta */}
      <div className="rounded-2xl border border-emerald-500/14 bg-[#071310] overflow-hidden">
        <div className="h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
        <div className="p-5">
          <SectionTitle icon={UserCheckIcon} color="emerald">পরিচিতি</SectionTitle>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <PlanInput label="নামঃ"              value={plan.name}        onChange={set("name")}        placeholder="আপনার নাম" />
            <PlanInput label="শিক্ষাপ্রতিষ্ঠানঃ" value={plan.institution} onChange={set("institution")} placeholder="প্রতিষ্ঠানের নাম" />
            <PlanInput label="মাসঃ"              value={plan.month}       onChange={set("month")}       placeholder="মাস/বছর" type="month" />
            <PlanInput label="থানাঃ"             value={plan.thana}       onChange={set("thana")}       placeholder="থানা" />
            <PlanInput label="জেলাঃ"             value={plan.zila}        onChange={set("zila")}        placeholder="জেলা" />
            <PlanInput label="মোবাইলঃ"           value={plan.phone}       onChange={set("phone")}       placeholder="০১৭..." type="tel" />
          </div>
        </div>
      </div>

      {/* কুরআন */}
      <div className="rounded-2xl border border-emerald-500/14 bg-[#071310] overflow-hidden">
        <div className="h-0.5 bg-gradient-to-r from-transparent via-[#4ade80] to-transparent" />
        <div className="p-5">
          <SectionTitle icon={BookOpenIcon} color="emerald">কুরআন অধ্যয়ন পরিকল্পনা</SectionTitle>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <PlanInput label="মোট দিন"     value={plan.planQuranDays}    onChange={set("planQuranDays")}    type="number" />
            <PlanInput label="গড় আয়াত"   value={plan.planQuranAvgAyah} onChange={set("planQuranAvgAyah")} type="number" />
            <PlanInput label="সূরার নাম"   value={plan.planQuranSurah}   onChange={set("planQuranSurah")} />
            <PlanInput label="মুখস্থ আয়াত/সূরা" value={plan.planQuranMukh} onChange={set("planQuranMukh")} />
          </div>
        </div>
      </div>

      {/* হাদিস */}
      <div className="rounded-2xl border border-blue-500/12 bg-[#071310] overflow-hidden">
        <div className="h-0.5 bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" />
        <div className="p-5">
          <SectionTitle icon={BookMarkedIcon} color="blue">হাদিস অধ্যয়ন পরিকল্পনা</SectionTitle>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <PlanInput label="মোট দিন"     value={plan.planHadithDays} onChange={set("planHadithDays")} type="number" />
            <PlanInput label="গড় হাদিস"   value={plan.planHadithAvg}  onChange={set("planHadithAvg")}  type="number" />
            <PlanInput label="গ্রন্থ/বিষয়" value={plan.planHadithBk}  onChange={set("planHadithBk")} />
            <PlanInput label="মুখস্থ"       value={plan.planHadithMukh} onChange={set("planHadithMukh")} />
          </div>
        </div>
      </div>

      {/* সাহিত্য */}
      <div className="rounded-2xl border border-purple-500/12 bg-[#071310] overflow-hidden">
        <div className="h-0.5 bg-gradient-to-r from-transparent via-purple-400/60 to-transparent" />
        <div className="p-5">
          <SectionTitle icon={LibraryIcon} color="purple">সাহিত্য অধ্যয়ন পরিকল্পনা</SectionTitle>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <PlanInput label="মোট পৃষ্ঠা (ইসলামী)" value={plan.planSahityaPages}      onChange={set("planSahityaPages")}      type="number" />
            <PlanInput label="ইসলামী বইয়ের নাম"   value={plan.planSahityaIslamiName} onChange={set("planSahityaIslamiName")} />
            <PlanInput label="অন্যান্য বইয়ের নাম"  value={plan.planSahityaOtherName} onChange={set("planSahityaOtherName")} />
            <PlanInput label="বই/নোট"             value={plan.planBookNote}           onChange={set("planBookNote")} />
          </div>
        </div>
      </div>

      {/* পাঠ্যপুস্তক ও ক্লাস */}
      <div className="rounded-2xl border border-amber-500/12 bg-[#071310] overflow-hidden">
        <div className="h-0.5 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
        <div className="p-5">
          <SectionTitle icon={GraduationCapIcon} color="amber">পাঠ্যপুস্তক ও ক্লাস</SectionTitle>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <PlanInput label="মোট দিন"       value={plan.planTextbookDays} onChange={set("planTextbookDays")} type="number" />
            <PlanInput label="গড় ঘণ্টা"     value={plan.planTextbookHrs}  onChange={set("planTextbookHrs")}  type="number" />
            <PlanInput label="মোট ক্লাস"    value={plan.planClassTotal}   onChange={set("planClassTotal")}   type="number" />
            <PlanInput label="উপস্থিত ক্লাস" value={plan.planClassUpst}   onChange={set("planClassUpst")}   type="number" />
          </div>
        </div>
      </div>

      {/* নামাজ */}
      <div className="rounded-2xl border border-indigo-500/12 bg-[#071310] overflow-hidden">
        <div className="h-0.5 bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent" />
        <div className="p-5">
          <SectionTitle icon={MoonIcon} color="purple">নামাজ পরিকল্পনা</SectionTitle>
          <div className="grid grid-cols-2 gap-3">
            <PlanInput label="প্রতি ওয়াক্ত জামাআতে আদায় করা হবে (লক্ষ্য)" value={plan.planNamazJamaat} onChange={set("planNamazJamaat")} />
            <PlanInput label="কিছু নফল নামাজ/ইবাদত আদায় করা হবে (লক্ষ্য)"  value={plan.planNamazNafl}   onChange={set("planNamazNafl")} />
          </div>
        </div>
      </div>

      {/* সাংগঠনিক দায়িত্ব */}
      <div className="rounded-2xl border border-rose-500/12 bg-[#071310] overflow-hidden">
        <div className="h-0.5 bg-gradient-to-r from-transparent via-rose-400/60 to-transparent" />
        <div className="p-5">
          <SectionTitle icon={TargetIcon} color="rose">সাংগঠনিক দায়িত্ব পালন</SectionTitle>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <PlanInput label="মোট দিন"       value={plan.planOrgDays}       onChange={set("planOrgDays")}       type="number" />
            <PlanInput label="গড় ঘণ্টা"     value={plan.planOrgHrs}        onChange={set("planOrgHrs")}        type="number" />
            <PlanInput label="দাওয়াতি (দিন)" value={plan.planDawahDays}     onChange={set("planDawahDays")}     type="number" />
            <PlanInput label="দাওয়াতি (ঘণ্টা)" value={plan.planDawahHrs}   onChange={set("planDawahHrs")}      type="number" />
            <PlanInput label="অন্যান্য (দিন)" value={plan.planOtherOrgDays} onChange={set("planOtherOrgDays")}  type="number" />
            <PlanInput label="অন্যান্য (ঘণ্টা)" value={plan.planOtherOrgHrs} onChange={set("planOtherOrgHrs")} type="number" />
          </div>
        </div>
      </div>

      {/* যোগাযোগ */}
      <div className="rounded-2xl border border-emerald-500/12 bg-[#071310] overflow-hidden">
        <div className="h-0.5 bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />
        <div className="p-5">
          <SectionTitle icon={UsersIcon} color="emerald">যোগাযোগ পরিকল্পনা</SectionTitle>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {[
              { label: "সদস্য",     key: "planContactSadasya"   as keyof PlanData },
              { label: "সাথী",      key: "planContactSathi"     as keyof PlanData },
              { label: "কর্মী",     key: "planContactKormi"     as keyof PlanData },
              { label: "সমর্থক",   key: "planContactSomorthok" as keyof PlanData },
              { label: "বন্ধু",    key: "planContactBondhu"    as keyof PlanData },
              { label: "তুলাচা",   key: "planContactTulacha"   as keyof PlanData },
              { label: "মেধাবী ছাত্র", key: "planContactMedhabi" as keyof PlanData },
              { label: "শিক্ষক",   key: "planContactShikkhok"  as keyof PlanData },
              { label: "মুহাররা",  key: "planContactMuharar"   as keyof PlanData },
              { label: "ভি.আই.পি", key: "planContactVaigi"     as keyof PlanData },
            ].map(f => (
              <PlanInput key={f.key} label={f.label} value={plan[f.key]} onChange={set(f.key)} type="number" placeholder="০" />
            ))}
          </div>
        </div>
      </div>

      {/* বিতরণ */}
      <div className="rounded-2xl border border-amber-500/12 bg-[#071310] overflow-hidden">
        <div className="h-0.5 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
        <div className="p-5">
          <SectionTitle icon={SendIcon} color="amber">বিতরণ পরিকল্পনা</SectionTitle>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "ইসলামী সাহিত্য", key: "planDistIslamiSahitya" as keyof PlanData },
              { label: "ছাত্রসংবাদ",     key: "planDistChhatra"       as keyof PlanData },
              { label: "কিশোর পত্রিকা", key: "planDistKishore"        as keyof PlanData },
              { label: "ইংরেজি পত্রিকা", key: "planDistEnglish"       as keyof PlanData },
              { label: "Y.W.",            key: "planDistYw"             as keyof PlanData },
              { label: "স্টিকার/কার্ড", key: "planDistSticker"         as keyof PlanData },
              { label: "পরিচিতি",         key: "planDistPorichi"        as keyof PlanData },
              { label: "উপহার/মেসেজ",   key: "planDistUpohar"          as keyof PlanData },
              { label: "ক্লাস কুপন",    key: "planDistClassKupon"      as keyof PlanData },
            ].map(f => (
              <PlanInput key={f.key} label={f.label} value={plan[f.key]} onChange={set(f.key)} type="number" placeholder="০" />
            ))}
          </div>
        </div>
      </div>

      {/* বৃদ্ধি */}
      <div className="rounded-2xl border border-teal-500/12 bg-[#071310] overflow-hidden">
        <div className="h-0.5 bg-gradient-to-r from-transparent via-teal-400/40 to-transparent" />
        <div className="p-5">
          <SectionTitle icon={TrendingUpIcon} color="emerald">বৃদ্ধির পরিকল্পনা</SectionTitle>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "সদস্য",          key: "planGrowSadasya"     as keyof PlanData },
              { label: "কর্মী",          key: "planGrowKormi"        as keyof PlanData },
              { label: "সদস্যার্থী",    key: "planGrowSadasyaArthi" as keyof PlanData },
              { label: "সমর্থক",        key: "planGrowSomorthok"    as keyof PlanData },
              { label: "সাথী",          key: "planGrowSathi"         as keyof PlanData },
              { label: "বধু",           key: "planGrowBodhu"         as keyof PlanData },
              { label: "সাথীর্থী",     key: "planGrowSathiArthi"   as keyof PlanData },
              { label: "তভাকাক্কী",    key: "planGrowTobakki"       as keyof PlanData },
            ].map(f => (
              <PlanInput key={f.key} label={f.label} value={plan[f.key]} onChange={set(f.key)} type="number" placeholder="০" />
            ))}
          </div>
        </div>
      </div>

      {/* বায়তুলমাল */}
      <div className="rounded-2xl border border-yellow-500/12 bg-[#071310] overflow-hidden">
        <div className="h-0.5 bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent" />
        <div className="p-5">
          <SectionTitle icon={StarIcon} color="amber">বায়তুলমাল</SectionTitle>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <PlanInput label="পরিশোধের তারিখ" value={plan.planBaitulReceiveDate} onChange={set("planBaitulReceiveDate")} />
            <PlanInput label="ব্যক্তিগত বৃদ্ধি (টাকা)" value={plan.planBaitulPersonal} onChange={set("planBaitulPersonal")} type="number" />
            <PlanInput label="মোট বৃদ্ধি (টাকা)"       value={plan.planBaitulTotal}    onChange={set("planBaitulTotal")}    type="number" />
            <PlanInput label="ছাত্রকণ্যা (টাকা)"       value={plan.planBaitulChhatroKonna} onChange={set("planBaitulChhatroKonna")} type="number" />
            <PlanInput label="টেবিল ব্যাংক (টাকা)"     value={plan.planBaitulTableBanko}   onChange={set("planBaitulTableBanko")}   type="number" />
            <PlanInput label="কলসি/হাঁড়ি (টি)"         value={plan.planBaitulKolsiHari}     onChange={set("planBaitulKolsiHari")}     type="number" />
          </div>
        </div>
      </div>

      {/* বিবিধ */}
      <div className="rounded-2xl border border-white/6 bg-[#071310] p-5">
        <SectionTitle icon={MessageSquareIcon} color="emerald">বিবিধ পরিকল্পনা</SectionTitle>
        <textarea
          value={plan.planMisc} onChange={e => setPlan({ ...plan, planMisc: e.target.value })}
          rows={3} placeholder="আত্মসমালোচনা, শরীরচর্চা, পত্রিকা পাঠ, আত্মীয়-স্বজন যোগাযোগ, গ্রুপ দাওয়াতি কাজ..."
          className="w-full resize-y rounded-xl border border-white/8 bg-white/3 px-3 py-2.5 text-[12px] text-emerald-50 placeholder-white/15 outline-none focus:border-emerald-500/30 transition-all leading-relaxed"
        />

        <div className="mt-4">
          <label className="mb-1 block text-[10px] text-white/35 font-mono">পরামর্শ</label>
          <textarea
            value={plan.planAdvice}
            onChange={e => setPlan({ ...plan, planAdvice: e.target.value })}
            rows={3}
            placeholder="এই মাসের পরিকল্পনা বাস্তবায়নে নিজের জন্য নির্দেশনা/পরামর্শ লিখুন..."
            className="w-full resize-y rounded-xl border border-amber-500/15 bg-amber-500/4 px-3 py-2.5 text-[12px] text-white/70 placeholder-white/20 outline-none focus:border-amber-500/35 transition-all leading-relaxed"
          />
        </div>
      </div>

      {/* Save + Next */}
      <div className="flex justify-end gap-3">
        <button onClick={savePlan}
          className="flex items-center gap-2 rounded-xl border border-emerald-500 bg-emerald-500 px-6 py-2.5 text-[13px] font-bold text-[#050f08] hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(0,200,83,0.25)]">
          <SaveIcon className="h-4 w-4" strokeWidth={2} />
          পরিকল্পনা সংরক্ষণ করুন
        </button>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   STEP 2 — DAILY REPORT TABLE
═══════════════════════════════════════════════ */
function Step2Report({ numData, chkData, setNum, toggleChk }: {
  numData: NumData; chkData: ChkData
  setNum: (k: NumKey, d: number, v: string) => void
  toggleChk: (k: ChkKey, d: number) => void
}) {
  const [activeDay, setActiveDay] = useState(1)

  const pick = (k: NumKey) => NUM_ROWS.find(r => r.key === k)!
  const BASIC_ROWS: NumKey[] = ["quranAyah", "hadithCount", "sahityaPage", "textbookHours"]
  const NAMAZ_ROWS: NumKey[] = ["namazJamaat", "namazQaza"]
  const CONTACT_TOP: NumKey[] = ["contactMember", "contactSathi", "contactKormi", "contactSomorthok"]
  const CONTACT_BOTTOM: NumKey[] = ["contactBondhu", "contactMedhabi", "contactVortakangkhi", "contactMuharrama"]
  const DIST_ROWS: NumKey[] = ["distSahitya", "distMagazine", "distStickerCard", "distUpohar"]
  const ORG_ROWS: NumKey[] = ["orgDawati", "orgSangothonik"]

  function saveDay() {
    toast.success(`${toBn(activeDay)} তারিখের রিপোর্ট সংরক্ষিত!`, { duration: 2500 })
  }

  function submitReport() {
    toast.success("মাসিক রিপোর্ট সংরক্ষিত হয়েছে!", {
      description: "এক নজরে রিপোর্ট ট্যাব থেকে সারাংশ দেখুন।",
      duration: 3500,
    })
  }

  const dayFilled = (d: number) =>
    NUM_ROWS.some(r => numData[r.key][d] !== "") ||
    CHK_ROWS.some(r => chkData[r.key][d])

  return (
    <div className="space-y-4">

      {/* ── MOBILE/TABLET: day card view ── */}
      <div className="lg:hidden space-y-4">

        {/* Day scroller */}
        <div className="rounded-2xl border border-emerald-500/14 bg-[#071310] p-4">
          <div className="flex gap-1.5 overflow-x-auto pb-3" style={{ scrollbarWidth: "none" }}>
            {DAYS.map(d => (
              <button key={d} onClick={() => setActiveDay(d)} style={{
                flexShrink: 0, width: 36, height: 36, borderRadius: 8,
                border: activeDay === d ? "1.5px solid #00c853" : dayFilled(d) ? "1px solid rgba(0,200,83,0.35)" : "1px solid rgba(255,255,255,0.08)",
                background: activeDay === d ? "rgba(0,200,83,0.16)" : dayFilled(d) ? "rgba(0,200,83,0.06)" : "rgba(8,22,14,0.5)",
                color: activeDay === d ? "#00c853" : dayFilled(d) ? "rgba(0,200,83,0.65)" : "rgba(232,245,233,0.25)",
                fontSize: 12, fontWeight: activeDay === d ? 700 : 400,
                cursor: "pointer", fontFamily: "monospace",
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative",
              }}>
                {toBn(d)}
                {dayFilled(d) && activeDay !== d && (
                  <span style={{ position: "absolute", top: 3, right: 3, width: 4, height: 4, borderRadius: "50%", background: "#00c853" }} />
                )}
              </button>
            ))}
          </div>

          {/* day nav */}
          <div className="flex items-center gap-2 mt-1">
            <button onClick={() => setActiveDay(d => Math.max(1, d - 1))} disabled={activeDay === 1}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/8 bg-white/3 text-white/30 disabled:opacity-20 hover:border-white/15 hover:text-white/60 transition-all">
              <ChevronLeftIcon className="h-3.5 w-3.5" />
            </button>
            <div className="flex-1 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(0,200,83,0.6)]" />
              <span className="font-mono text-[14px] font-bold text-emerald-300">{toBn(activeDay)} তারিখ</span>
            </div>
            <button onClick={saveDay}
              className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-semibold text-emerald-400 hover:bg-emerald-500/18 transition-all">
              <SaveIcon className="h-3 w-3" strokeWidth={2} />
              সেভ
            </button>
            <button onClick={() => setActiveDay(d => Math.min(31, d + 1))} disabled={activeDay === 31}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/8 bg-white/3 text-white/30 disabled:opacity-20 hover:border-white/15 hover:text-white/60 transition-all">
              <ChevronRightIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Core numeric rows */}
        <div className="rounded-2xl border border-emerald-500/12 bg-[#071310] overflow-hidden">
          <div className="h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
          <div className="p-4 space-y-2">
            <div className="mb-3 text-[9px] tracking-[2.5px] text-emerald-500/40 uppercase font-mono">মূল রিপোর্ট ফরম</div>
            {BASIC_ROWS.map(key => {
              const r = pick(key)
              return (
              <div key={r.key} className="flex items-center gap-3 rounded-xl px-3 py-2.5" style={{ background: r.bg, border: `1px solid ${r.border}` }}>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0" style={{ background: `${r.color}18`, border: `1px solid ${r.color}44` }}>
                  <r.Icon className="h-3.5 w-3.5" style={{ color: r.color }} strokeWidth={1.8} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] text-white/75 font-medium">{r.label}</div>
                  <div className="text-[9px] font-mono" style={{ color: r.color + "99" }}>{r.sub}</div>
                </div>
                <input
                  type="number" min="0" step="1"
                  value={numData[r.key][activeDay]}
                  onChange={e => setNum(r.key, activeDay, e.target.value)}
                  placeholder="০"
                  className="w-16 h-9 text-center rounded-lg text-[15px] font-bold font-mono outline-none transition-all"
                  style={{
                    background: "rgba(5,12,8,0.6)", border: `1.5px solid ${r.border}`,
                    color: r.color, flexShrink: 0,
                  }}
                  onFocus={e => (e.target.style.borderColor = r.color)}
                  onBlur={e => (e.target.style.borderColor = r.border)}
                />
              </div>
              )
            })}
          </div>
        </div>

        {/* নামাজ */}
        <div className="rounded-2xl border border-indigo-500/14 bg-[#071310] overflow-hidden">
          <div className="h-0.5 bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent" />
          <div className="p-4">
            <SectionTitle icon={MoonIcon} color="purple">নামাজ (১ সারি × ২ ঘর)</SectionTitle>
            <div className="grid grid-cols-2 gap-2">
              {NAMAZ_ROWS.map((key) => {
                const r = pick(key)
                return (
                  <div key={key} className="rounded-lg border border-indigo-500/20 bg-indigo-500/8 p-2.5">
                    <div className="mb-1 text-[10px] text-white/50">{r.sub}</div>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={numData[key][activeDay]}
                      onChange={e => setNum(key, activeDay, e.target.value)}
                      className="h-8 w-full rounded border border-indigo-500/25 bg-[#050f08] px-2 text-center text-[13px] font-mono text-indigo-200 outline-none"
                      placeholder="০"
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* যোগাযোগ */}
        <div className="rounded-2xl border border-sky-500/14 bg-[#071310] overflow-hidden">
          <div className="h-0.5 bg-gradient-to-r from-transparent via-sky-400/60 to-transparent" />
          <div className="p-4">
            <SectionTitle icon={UsersIcon} color="blue">যোগাযোগ (২ সারি × ৪ ঘর)</SectionTitle>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {CONTACT_TOP.map((key) => {
                  const r = pick(key)
                  return (
                    <div key={key} className="rounded-lg border border-sky-500/20 bg-sky-500/8 p-2">
                      <div className="mb-1 text-[10px] text-white/50">{r.sub}</div>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={numData[key][activeDay]}
                        onChange={e => setNum(key, activeDay, e.target.value)}
                        className="h-8 w-full rounded border border-sky-500/25 bg-[#050f08] px-2 text-center text-[13px] font-mono text-sky-200 outline-none"
                        placeholder="০"
                      />
                    </div>
                  )
                })}
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {CONTACT_BOTTOM.map((key) => {
                  const r = pick(key)
                  return (
                    <div key={key} className="rounded-lg border border-cyan-500/20 bg-cyan-500/8 p-2">
                      <div className="mb-1 text-[10px] text-white/50">{r.sub}</div>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={numData[key][activeDay]}
                        onChange={e => setNum(key, activeDay, e.target.value)}
                        className="h-8 w-full rounded border border-cyan-500/25 bg-[#050f08] px-2 text-center text-[13px] font-mono text-cyan-200 outline-none"
                        placeholder="০"
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* বিতরণ */}
        <div className="rounded-2xl border border-amber-500/14 bg-[#071310] overflow-hidden">
          <div className="h-0.5 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
          <div className="p-4">
            <SectionTitle icon={SendIcon} color="amber">বিতরণ (১ সারি × ৪ ঘর)</SectionTitle>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {DIST_ROWS.map((key) => {
                const r = pick(key)
                return (
                  <div key={key} className="rounded-lg border border-amber-500/20 bg-amber-500/8 p-2">
                    <div className="mb-1 text-[10px] text-white/50">{r.sub}</div>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={numData[key][activeDay]}
                      onChange={e => setNum(key, activeDay, e.target.value)}
                      className="h-8 w-full rounded border border-amber-500/25 bg-[#050f08] px-2 text-center text-[13px] font-mono text-amber-100 outline-none"
                      placeholder="০"
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* সাংগঠনিক */}
        <div className="rounded-2xl border border-rose-500/14 bg-[#071310] overflow-hidden">
          <div className="h-0.5 bg-gradient-to-r from-transparent via-rose-400/60 to-transparent" />
          <div className="p-4">
            <SectionTitle icon={TargetIcon} color="rose">সাংগঠনিক দায়িত্ব পালন</SectionTitle>
            <div className="grid grid-cols-2 gap-2">
              {ORG_ROWS.map((key) => {
                const r = pick(key)
                return (
                  <div key={key} className="rounded-lg border border-rose-500/20 bg-rose-500/8 p-2.5">
                    <div className="mb-1 text-[10px] text-white/50">{r.sub}</div>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={numData[key][activeDay]}
                      onChange={e => setNum(key, activeDay, e.target.value)}
                      className="h-8 w-full rounded border border-rose-500/25 bg-[#050f08] px-2 text-center text-[13px] font-mono text-rose-200 outline-none"
                      placeholder="০"
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Checkbox rows — card style */}
        <div className="rounded-2xl border border-amber-500/10 bg-[#071310] overflow-hidden">
          <div className="h-0.5 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
          <div className="p-4">
            <div className="mb-3 text-[9px] tracking-[2.5px] text-amber-500/40 uppercase font-mono">দৈনিক কার্যক্রম</div>
            <div className="grid grid-cols-2 gap-2">
              {CHK_ROWS.map(r => {
                const checked = chkData[r.key][activeDay]
                return (
                  <button key={r.key} onClick={() => toggleChk(r.key, activeDay)}
                    className="flex flex-col items-center gap-2 rounded-xl border py-3 px-2 transition-all cursor-pointer"
                    style={{
                      border: `1.5px solid ${checked ? r.color : "rgba(255,255,255,0.07)"}`,
                      background: checked ? `${r.color}14` : "rgba(8,22,14,0.4)",
                      boxShadow: checked ? `0 0 14px ${r.color}18` : "none",
                    }}>
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl transition-all" style={{
                      background: checked ? `${r.color}20` : "rgba(255,255,255,0.04)",
                      border: `1px solid ${checked ? r.color + "55" : "rgba(255,255,255,0.07)"}`,
                    }}>
                      <r.Icon className="h-4 w-4" style={{ color: checked ? r.color : "rgba(232,245,233,0.25)" }} strokeWidth={1.8} />
                    </div>
                    <span className="text-[11px] text-center leading-tight" style={{ color: checked ? r.color : "rgba(232,245,233,0.35)", fontWeight: checked ? 600 : 400 }}>
                      {r.label}
                    </span>
                    {checked && (
                      <div className="flex h-4 w-4 items-center justify-center rounded-full" style={{ background: r.color }}>
                        <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                          <path d="M1.5 6L4.5 9L10.5 3" stroke="#050f08" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── DESKTOP: full table ── */}
      <div className="hidden lg:block space-y-3">
        <div className="rounded-2xl border border-emerald-500/14 bg-[#071310] overflow-hidden">
          <div className="h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
          <div className="overflow-x-auto">
            <table className="w-full border-collapse" style={{ minWidth: 1560 }}>
              <thead>
                <tr>
                  <th className="sticky left-0 bg-[#071310] px-2 py-1.5 text-left text-[9px] text-emerald-400/70 font-mono border-b border-r border-emerald-500/10 min-w-10">তারিখ</th>
                  <th className="px-1 py-1.5 text-center text-[9px] text-emerald-300/70 border-b border-r border-white/8 min-w-14">কুরআন (আয়াত)</th>
                  <th className="px-1 py-1.5 text-center text-[9px] text-emerald-300/70 border-b border-r border-white/8 min-w-14">হাদিস (সংখ্যা)</th>
                  <th className="px-1 py-1.5 text-center text-[9px] text-emerald-300/70 border-b border-r border-white/8 min-w-14">সাহিত্য (পৃষ্ঠা)</th>
                  <th className="px-1 py-1.5 text-center text-[9px] text-amber-300/70 border-b border-r border-white/8 min-w-16">পাঠ্যপুস্তক (ঘণ্টা)</th>
                  <th colSpan={2} className="px-1 py-1.5 text-center text-[9px] text-indigo-300/80 border-b border-r border-white/8">নামাজ</th>
                  <th colSpan={4} className="px-1 py-1.5 text-center text-[9px] text-sky-300/80 border-b border-r border-white/8">যোগাযোগ (সারি ১)</th>
                  <th colSpan={4} className="px-1 py-1.5 text-center text-[9px] text-cyan-300/80 border-b border-r border-white/8">যোগাযোগ (সারি ২)</th>
                  <th colSpan={4} className="px-1 py-1.5 text-center text-[9px] text-amber-300/80 border-b border-r border-white/8">বিতরণ</th>
                  <th colSpan={2} className="px-1 py-1.5 text-center text-[9px] text-rose-300/80 border-b border-r border-white/8">সাংগঠনিক</th>
                  <th className="px-1 py-1.5 text-center text-[9px] text-slate-300/80 border-b border-r border-white/8">ক্লাস</th>
                  <th className="px-1 py-1.5 text-center text-[9px] text-slate-300/80 border-b border-r border-white/8">খেলা</th>
                  <th className="px-1 py-1.5 text-center text-[9px] text-slate-300/80 border-b border-r border-white/8">পত্রিকা</th>
                  <th className="px-1 py-1.5 text-center text-[9px] text-slate-300/80 border-b border-white/8">আত্ম-সমালোচনা</th>
                </tr>
                <tr className="bg-black/15">
                  <th className="sticky left-0 bg-[#071310] border-b border-r border-emerald-500/10" />
                  <th className="border-b border-r border-white/8" />
                  <th className="border-b border-r border-white/8" />
                  <th className="border-b border-r border-white/8" />
                  <th className="border-b border-r border-white/8" />
                  {NAMAZ_ROWS.map((k) => <th key={k} className="px-1 py-1.5 text-[9px] text-white/45 border-b border-r border-white/8">{pick(k).sub}</th>)}
                  {CONTACT_TOP.map((k) => <th key={k} className="px-1 py-1.5 text-[9px] text-white/45 border-b border-r border-white/8">{pick(k).sub}</th>)}
                  {CONTACT_BOTTOM.map((k) => <th key={k} className="px-1 py-1.5 text-[9px] text-white/45 border-b border-r border-white/8">{pick(k).sub}</th>)}
                  {DIST_ROWS.map((k) => <th key={k} className="px-1 py-1.5 text-[9px] text-white/45 border-b border-r border-white/8">{pick(k).sub}</th>)}
                  {ORG_ROWS.map((k) => <th key={k} className="px-1 py-1.5 text-[9px] text-white/45 border-b border-r border-white/8">{pick(k).sub}</th>)}
                  <th className="border-b border-r border-white/8" />
                  <th className="border-b border-r border-white/8" />
                  <th className="border-b border-r border-white/8" />
                  <th className="border-b border-white/8" />
                </tr>
              </thead>
              <tbody>
                {DAYS.map((d, i) => (
                  <tr key={d} className={i % 2 === 0 ? "" : "bg-black/10"}>
                    <td className="sticky left-0 bg-[#071310] px-1.5 py-1 border-b border-r border-white/8 text-center font-mono text-[10px] text-emerald-300">{toBn(d)}</td>
                    {BASIC_ROWS.map((k) => {
                      const r = pick(k)
                      return (
                        <td key={k} className="px-0.5 py-0.5 border-b border-r border-white/8">
                          <input type="number" min="0" step={k === "textbookHours" ? "0.1" : "1"} value={numData[k][d]} onChange={e => setNum(k, d, e.target.value)} className="h-6 w-full rounded border border-white/10 bg-white/5 px-1 text-center text-[10px] font-mono outline-none" style={{ color: r.color }} placeholder="০" />
                        </td>
                      )
                    })}
                    {NAMAZ_ROWS.map((k) => (
                      <td key={k} className="px-0.5 py-0.5 border-b border-r border-white/8"><input type="number" min="0" step="1" value={numData[k][d]} onChange={e => setNum(k, d, e.target.value)} className="h-6 w-full rounded border border-indigo-500/25 bg-indigo-500/8 px-1 text-center text-[10px] font-mono text-indigo-100 outline-none" placeholder="০" /></td>
                    ))}
                    {CONTACT_TOP.map((k) => (
                      <td key={k} className="px-0.5 py-0.5 border-b border-r border-white/8"><input type="number" min="0" step="1" value={numData[k][d]} onChange={e => setNum(k, d, e.target.value)} className="h-6 w-full rounded border border-sky-500/25 bg-sky-500/8 px-1 text-center text-[10px] font-mono text-sky-100 outline-none" placeholder="০" /></td>
                    ))}
                    {CONTACT_BOTTOM.map((k) => (
                      <td key={k} className="px-0.5 py-0.5 border-b border-r border-white/8"><input type="number" min="0" step="1" value={numData[k][d]} onChange={e => setNum(k, d, e.target.value)} className="h-6 w-full rounded border border-cyan-500/25 bg-cyan-500/8 px-1 text-center text-[10px] font-mono text-cyan-100 outline-none" placeholder="০" /></td>
                    ))}
                    {DIST_ROWS.map((k) => (
                      <td key={k} className="px-0.5 py-0.5 border-b border-r border-white/8"><input type="number" min="0" step="1" value={numData[k][d]} onChange={e => setNum(k, d, e.target.value)} className="h-6 w-full rounded border border-amber-500/25 bg-amber-500/8 px-1 text-center text-[10px] font-mono text-amber-100 outline-none" placeholder="০" /></td>
                    ))}
                    {ORG_ROWS.map((k) => (
                      <td key={k} className="px-0.5 py-0.5 border-b border-r border-white/8"><input type="number" min="0" step="0.1" value={numData[k][d]} onChange={e => setNum(k, d, e.target.value)} className="h-6 w-full rounded border border-rose-500/25 bg-rose-500/8 px-1 text-center text-[10px] font-mono text-rose-100 outline-none" placeholder="০" /></td>
                    ))}
                    <td className="border-b border-r border-white/8 text-center"><Chk checked={chkData.class[d]} onChange={() => toggleChk("class", d)} color="#38bdf8" size={18} /></td>
                    <td className="border-b border-r border-white/8 text-center"><Chk checked={chkData.sports[d]} onChange={() => toggleChk("sports", d)} color="#fb923c" size={18} /></td>
                    <td className="border-b border-r border-white/8 text-center"><Chk checked={chkData.newspaper[d]} onChange={() => toggleChk("newspaper", d)} color="#94a3b8" size={18} /></td>
                    <td className="border-b border-white/8 text-center"><Chk checked={chkData.selfcrit[d]} onChange={() => toggleChk("selfcrit", d)} color="#f472b6" size={18} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <button onClick={submitReport}
          className="flex items-center gap-2 rounded-xl border border-emerald-500 bg-emerald-500 px-6 py-2.5 text-[13px] font-bold text-[#050f08] hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(0,200,83,0.25)]">
          <SendIcon className="h-4 w-4" strokeWidth={2} />
          রিপোর্ট সংরক্ষণ করুন
        </button>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   STEP 3 — MONTHLY SUMMARY (auto averages)
═══════════════════════════════════════════════ */
function Step3Summary({ plan, numData, chkData, onPrev, onReset }: {
  plan: PlanData; numData: NumData; chkData: ChkData
  onPrev: () => void; onReset: () => void
}) {
  const numAvg   = useMemo(() => Object.fromEntries(NUM_ROWS.map(r => [r.key, calcAvg(numData[r.key])])) as Record<NumKey, string>, [numData])
  const numTotal = useMemo(() => Object.fromEntries(NUM_ROWS.map(r => [r.key, calcTotal(numData[r.key])])) as Record<NumKey, string>, [numData])
  const chkDays  = useMemo(() => Object.fromEntries(CHK_ROWS.map(r => [r.key, calcChkDays(chkData[r.key])])) as Record<ChkKey, string>, [chkData])

  const filledDays = DAYS.filter(d => NUM_ROWS.some(r => numData[r.key][d] !== "") || CHK_ROWS.some(r => chkData[r.key][d])).length
  const overallPct = Math.round((filledDays / TOTAL_DAYS) * 100)

  function printReport() {
    toast.success("রিপোর্ট প্রিন্ট হচ্ছে...", { duration: 2500 })
    setTimeout(() => window.print(), 300)
  }

  return (
    <div className="space-y-5">

      {/* Hero */}
      <div className="relative rounded-2xl border border-emerald-500/18 bg-[#071310] overflow-hidden p-6">
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-1 font-mono text-[9px] tracking-[3px] text-emerald-500/40 uppercase">মাসিক সারসংক্ষেপ</div>
            <h2 className="text-[20px] font-bold text-emerald-50">{plan.name || "কর্মী"} — {plan.month || "এই মাস"}</h2>
            <p className="text-[12px] text-white/35 mt-0.5">{plan.institution || ""} {plan.thana ? `· ${plan.thana}` : ""}</p>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-emerald-500/12 bg-[#050f08] p-4">
            {/* Progress ring */}
            <div className="relative">
              <svg width="64" height="64" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(0,200,83,0.08)" strokeWidth="5" />
                <circle cx="32" cy="32" r="26" fill="none" stroke="#00c853" strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={`${(overallPct / 100) * 2 * Math.PI * 26} ${2 * Math.PI * 26}`}
                  style={{ transition: "stroke-dasharray .7s ease" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-mono text-[14px] font-bold text-emerald-400">{overallPct}%</span>
              </div>
            </div>
            <div>
              <div className="text-[13px] font-semibold text-white/70">{toBn(filledDays)}/{toBn(TOTAL_DAYS)} দিন</div>
              <div className="font-mono text-[10px] text-white/25">রিপোর্ট পূরণ</div>
            </div>
          </div>
        </div>
      </div>

      {/* Auto averages grid */}
      <div className="rounded-2xl border border-emerald-500/12 bg-[#071310] overflow-hidden">
        <div className="h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
        <div className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUpIcon className="h-4 w-4 text-emerald-400" strokeWidth={1.8} />
            <span className="text-[13px] font-semibold text-emerald-50">আমলের গড় (স্বয়ংক্রিয়)</span>
            <span className="ml-auto rounded-full border border-emerald-500/15 bg-emerald-500/8 px-2 py-0.5 font-mono text-[9px] text-emerald-400/60">Auto calculated</span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {NUM_ROWS.map(r => (
              <div key={r.key} className="relative rounded-xl px-3 py-3 overflow-hidden" style={{ background: r.bg, border: `1px solid ${r.border}` }}>
                <div className="absolute inset-x-0 top-0 h-0.5" style={{ background: `linear-gradient(to right, transparent, ${r.color}, transparent)`, opacity: 0.5 }} />
                <div className="flex items-center gap-2 mb-2">
                  <r.Icon className="h-3.5 w-3.5" style={{ color: r.color }} strokeWidth={1.8} />
                  <span className="text-[10px] text-white/45 leading-tight">{r.label} ({r.sub})</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <div className="font-mono text-[20px] font-bold leading-none" style={{ color: r.color }}>{numAvg[r.key]}</div>
                  <div className="font-mono text-[9px] text-white/20">গড়</div>
                </div>
                <div className="mt-1 font-mono text-[9px] text-white/18">মোট: {numTotal[r.key]}</div>

                {/* Plan vs actual */}
                {(r.key === "quranAyah" && plan.planQuranAvgAyah) && (
                  <div className="mt-1.5 text-[9px] font-mono text-white/20">
                    লক্ষ্য: {plan.planQuranAvgAyah}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Checkbox summary */}
      <div className="rounded-2xl border border-amber-500/12 bg-[#071310] overflow-hidden">
        <div className="h-0.5 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
        <div className="p-5">
          <div className="mb-3 font-mono text-[9px] tracking-[3px] text-amber-500/40 uppercase">দৈনিক কার্যক্রম সারসংক্ষেপ</div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {CHK_ROWS.map(r => (
              <div key={r.key} className="rounded-xl border px-3 py-3 text-center" style={{ background: r.color + "10", border: `1px solid ${r.color}30` }}>
                <r.Icon className="h-5 w-5 mx-auto mb-2" style={{ color: r.color }} strokeWidth={1.8} />
                <div className="font-mono text-[22px] font-bold" style={{ color: r.color }}>{chkDays[r.key]}</div>
                <div className="text-[10px] text-white/35 mt-0.5">{r.label}</div>
                <div className="font-mono text-[9px] text-white/18">দিন / {toBn(TOTAL_DAYS)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Plan vs actual comparison */}
      <div className="rounded-2xl border border-blue-500/12 bg-[#071310] overflow-hidden">
        <div className="h-0.5 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />
        <div className="p-5">
          <div className="mb-3 flex items-center gap-2">
            <ActivityIcon className="h-4 w-4 text-blue-400" strokeWidth={1.8} />
            <span className="text-[13px] font-semibold text-emerald-50">পরিকল্পনা বনাম বাস্তব</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="py-2 pr-4 text-left text-[10px] text-white/35 font-mono">বিষয়</th>
                  <th className="py-2 px-3 text-center text-[10px] text-amber-400/60 font-mono">পরিকল্পনা</th>
                  <th className="py-2 px-3 text-center text-[10px] text-emerald-400/60 font-mono">বাস্তব (গড়)</th>
                  <th className="py-2 pl-3 text-center text-[10px] text-white/25 font-mono">অগ্রগতি</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "কুরআন (আয়াত)", actual: numAvg["quranAyah"], plan: plan.planQuranAvgAyah },
                  { label: "হাদিস (সংখ্যা)", actual: numAvg["hadithCount"], plan: plan.planHadithAvg },
                  { label: "সাহিত্য (পৃষ্ঠা)", actual: numAvg["sahityaPage"], plan: plan.planSahityaPages },
                  { label: "পাঠ্যপুস্তক (ঘণ্টা)", actual: numAvg["textbookHours"], plan: plan.planTextbookHrs },
                  { label: "দাওয়াতি কাজ", actual: numAvg["orgDawati"], plan: plan.planDawahHrs },
                  { label: "অন্যান্য সাংগঠনিক কাজ", actual: numAvg["orgSangothonik"], plan: plan.planOtherOrgHrs },
                  { label: "যোগাযোগ (সদস্য)", actual: numAvg["contactMember"], plan: plan.planContactSadasya },
                  { label: "যোগাযোগ (সাথী)", actual: numAvg["contactSathi"], plan: plan.planContactSathi },
                ].map(row => {
                  const planNum = parseFloat(row.plan || "0")
                  const actualNum = parseFloat(row.actual.replace(/[^0-9.]/g, "") || "0")
                  const pct = planNum > 0 ? Math.min(100, Math.round((actualNum / planNum) * 100)) : 0
                  return (
                    <tr key={row.label} className="border-b border-white/4">
                      <td className="py-2.5 pr-4 text-[12px] text-white/55">{row.label}</td>
                      <td className="py-2.5 px-3 text-center font-mono text-[12px] text-amber-400/70">{row.plan || "—"}</td>
                      <td className="py-2.5 px-3 text-center font-mono text-[12px] text-emerald-400">{row.actual}</td>
                      <td className="py-2.5 pl-3">
                        {planNum > 0 ? (
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 rounded-full bg-white/6 overflow-hidden">
                              <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: pct >= 80 ? "#4ade80" : pct >= 50 ? "#fbbf24" : "#f87171" }} />
                            </div>
                            <span className="font-mono text-[10px] text-white/30 min-w-[28px] text-right">{pct}%</span>
                          </div>
                        ) : <span className="text-[10px] text-white/15 font-mono">—</span>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Advice box */}
      <div className="rounded-2xl border border-white/6 bg-[#071310] overflow-hidden">
        <div className="h-0.5 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
        <div className="p-5">
          <div className="mb-2 flex items-center gap-2">
            <MessageSquareIcon className="h-4 w-4 text-amber-400/60" strokeWidth={1.8} />
            <span className="font-mono text-[10px] tracking-[2.5px] text-amber-400/50 uppercase">দায়িত্বশীলের পরামর্শ ও স্বাক্ষর</span>
          </div>
          <textarea rows={3} placeholder="দায়িত্বশীল এখানে পরামর্শ লিখবেন..."
            defaultValue={plan.planAdvice}
            className="w-full resize-y rounded-xl border border-amber-500/15 bg-amber-500/4 px-3 py-2.5 text-[12px] text-white/60 placeholder-white/15 outline-none focus:border-amber-500/30 transition-all leading-relaxed" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-between">
        <button onClick={onPrev}
          className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/3 px-4 py-2.5 text-[12px] text-white/40 hover:border-white/15 hover:text-white/65 transition-all">
          <ChevronLeftIcon className="h-4 w-4" />
          রিপোর্টে ফিরুন
        </button>
        <div className="flex gap-2">
          <button onClick={printReport}
            className="flex items-center gap-2 rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-2.5 text-[12px] font-semibold text-blue-400 hover:bg-blue-500/18 transition-all">
            <FileTextIcon className="h-4 w-4" strokeWidth={2} />
            প্রিন্ট
          </button>
          <button onClick={() => { toast.success("নতুন মাসের রিপোর্ট শুরু হচ্ছে!", { duration: 3000 }); onReset() }}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/4 px-4 py-2.5 text-[12px] text-white/50 hover:border-white/18 hover:text-white/70 transition-all">
            <RotateCcwIcon className="h-4 w-4" strokeWidth={2} />
            নতুন মাস
          </button>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════ */
export default function WorkerReport() {
  const [activeTab, setActiveTab] = useState<"plan" | "report" | "overview">("report")
  const [plan, setPlan]       = useState<PlanData>(initPlan)
  const [numData, setNumData] = useState<NumData>(initNum)
  const [chkData, setChkData] = useState<ChkData>(initChk)
  const isReportTab = activeTab === "report"

  const setNum = useCallback((key: NumKey, day: number, val: string) => {
    if (val !== "" && (isNaN(+val) || +val < 0)) return
    setNumData(p => ({ ...p, [key]: { ...p[key], [day]: val } }))
  }, [])

  const toggleChk = useCallback((key: ChkKey, day: number) => {
    setChkData(p => ({ ...p, [key]: { ...p[key], [day]: !p[key][day] } }))
  }, [])

  function resetAll() {
    setPlan(initPlan())
    setNumData(initNum())
    setChkData(initChk())
    setActiveTab("plan")
  }

  return (
    <div className="min-h-screen bg-[#050f08]">

      {/* Page header */}
      <div className="sticky top-0 z-10 border-b border-emerald-500/10 bg-[#050f08]/95 backdrop-blur-md px-4 py-3 md:px-8">
        <div className={`mx-auto ${isReportTab ? "max-w-none" : "max-w-4xl"}`}>
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-emerald-500/25 bg-emerald-500/10">
                <FileTextIcon className="h-4 w-4 text-emerald-400" strokeWidth={1.8} />
              </div>
              <div>
                <div className="text-[13px] font-bold text-emerald-50">কর্মী মাসিক রিপোর্ট</div>
                <div className="font-mono text-[9px] text-white/25">বাংলাদেশ ইসলামী ছাত্রশিবির</div>
              </div>
            </div>
            {plan.month && (
              <span className="rounded-full border border-amber-500/20 bg-amber-500/8 px-3 py-1 font-mono text-[10px] text-amber-400/70">
                {plan.month}
              </span>
            )}
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("plan")}
              className={`rounded-lg border px-2 py-2 text-[11px] font-semibold transition-all ${
                activeTab === "plan"
                  ? "border-emerald-500/45 bg-emerald-500/15 text-emerald-300"
                  : "border-white/10 bg-white/3 text-white/45 hover:text-white/70"
              }`}
            >
              পরিকল্পনা
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("report")}
              className={`rounded-lg border px-2 py-2 text-[11px] font-semibold transition-all ${
                activeTab === "report"
                  ? "border-emerald-500/45 bg-emerald-500/15 text-emerald-300"
                  : "border-white/10 bg-white/3 text-white/45 hover:text-white/70"
              }`}
            >
              রিপোর্ট ফর্ম
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`rounded-lg border px-2 py-2 text-[11px] font-semibold transition-all ${
                activeTab === "overview"
                  ? "border-emerald-500/45 bg-emerald-500/15 text-emerald-300"
                  : "border-white/10 bg-white/3 text-white/45 hover:text-white/70"
              }`}
            >
              একনজরে রিপোর্ট
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={isReportTab ? "mx-auto w-full max-w-none px-4 py-5 md:px-8" : "mx-auto max-w-4xl px-4 py-5 md:px-8"}>
        {activeTab === "plan" && <Step1Plan plan={plan} setPlan={setPlan} />}
        {activeTab === "report" && <Step2Report numData={numData} chkData={chkData} setNum={setNum} toggleChk={toggleChk} />}
        {activeTab === "overview" && (
          <Step3Summary
            plan={plan}
            numData={numData}
            chkData={chkData}
            onPrev={() => setActiveTab("report")}
            onReset={resetAll}
          />
        )}
      </div>
    </div>
  )
}
