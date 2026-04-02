"use client"

import { useState, useRef, useEffect } from "react"
import {
  ClipboardListIcon, MessageSquareIcon, CheckCircleIcon,
  XCircleIcon, ChevronRightIcon, TimerIcon, TrophyIcon,
  VideoIcon, SendIcon, UserIcon, ShieldCheckIcon,
  AlertCircleIcon, StarIcon, MoonIcon, BookOpenIcon,
  ArrowRightIcon, RefreshCwIcon,
  BadgeCheckIcon, ChevronLeftIcon,
} from "lucide-react"

/* ═══════════════════════════════════════════════════
   QUESTION BANK — Supporter → Kormi
   Syllabus-based: Quran, Hadith, Taharah, Sangathan
═══════════════════════════════════════════════════ */
const QUESTIONS = [
  // ── কুরআন ──
  {
    id: 1, category: "কুরআন পরিচিতি",
    question: "পবিত্র কুরআনে মোট কতটি সূরা আছে?",
    options: ["১০০ টি", "১১২ টি", "১১৪ টি", "১১৬ টি"],
    correct: 2,
    explanation: "পবিত্র কুরআনে মোট ১১৪ টি সূরা রয়েছে।",
  },
  {
    id: 2, category: "কুরআন পরিচিতি",
    question: "কুরআনে কতটি পারা আছে?",
    options: ["২৮ টি", "২৯ টি", "৩০ টি", "৩২ টি"],
    correct: 2,
    explanation: "পবিত্র কুরআনে মোট ৩০ টি পারা রয়েছে।",
  },
  {
    id: 3, category: "কুরআন পরিচিতি",
    question: "কুরআনের প্রথম নাযিলকৃত আয়াত কোন সূরার?",
    options: ["সূরা ফাতিহা", "সূরা বাকারা", "সূরা আলাক", "সূরা মুদ্দাচ্ছির"],
    correct: 2,
    explanation: "সূরা আলাকের ১-৫ নম্বর আয়াত সর্বপ্রথম নাযিল হয়।",
  },
  {
    id: 4, category: "কুরআন পরিচিতি",
    question: "কুরআনের প্রথম সূরার নাম কী?",
    options: ["সূরা বাকারা", "সূরা আলাক", "সূরা ফাতিহা", "সূরা নাস"],
    correct: 2,
    explanation: "কুরআনের প্রথম সূরা হলো সূরা আল-ফাতিহা।",
  },
  {
    id: 5, category: "কুরআন পরিচিতি",
    question: "মাক্কী সূরা কাকে বলে?",
    options: [
      "মদিনায় নাযিল হওয়া সূরা",
      "হিজরতের পূর্বে নাযিল হওয়া সূরা",
      "মক্কায় পড়া হয় এমন সূরা",
      "মক্কায় শুধু তেলাওয়াত করা সূরা",
    ],
    correct: 1,
    explanation: "রাসূল (সাঃ) এর হিজরতের পূর্বে যে সূরাগুলো নাযিল হয়েছে সেগুলোকে মাক্কী সূরা বলে।",
  },
  // ── হাদিস ──
  {
    id: 6, category: "হাদিস পরিচিতি",
    question: "হাদিস কুদসী কাকে বলে?",
    options: [
      "রাসূলের (সাঃ) নিজের কথা",
      "যে হাদিসের মূল বক্তব্য আল্লাহর, রাসূল নিজ ভাষায় বর্ণনা করেছেন",
      "সাহাবীদের হাদিস",
      "তাবেঈনদের বর্ণনা",
    ],
    correct: 1,
    explanation: "যে হাদিসের মূল বক্তব্য আল্লাহর, মহানবী (সাঃ) কে জানিয়েছেন এবং তিনি নিজ ভাষায় বর্ণনা করেছেন তাকে হাদিস কুদসী বলে।",
  },
  {
    id: 7, category: "হাদিস পরিচিতি",
    question: "কওলী হাদিস কী?",
    options: ["রাসূলের কাজ", "রাসূলের কথা", "রাসূলের মৌন সম্মতি", "সাহাবীদের আমল"],
    correct: 1,
    explanation: "রাসূল (সাঃ) এর কথাকে কওলী হাদিস বলে।",
  },
  {
    id: 8, category: "হাদিস পরিচিতি",
    question: "তাকরীরী হাদিস বলতে কী বোঝায়?",
    options: ["রাসূলের কথা", "রাসূলের কাজ", "রাসূলের মৌন সম্মতি", "রাসূলের উপদেশ"],
    correct: 2,
    explanation: "রাসূল (সাঃ) এর মৌন সম্মতিকে তাকরীরী হাদিস বলে।",
  },
  // ── তাহারাত ──
  {
    id: 9, category: "অযু ও তাহারাত",
    question: "অযুর ফরজ কয়টি?",
    options: ["২টি", "৩টি", "৪টি", "৫টি"],
    correct: 2,
    explanation: "অযুর ফরজ ৪টি: মুখমণ্ডল ধোয়া, দুই হাত কনুইসহ ধোয়া, মাথা মাসেহ করা এবং দুই পা টাখনুসহ ধোয়া।",
  },
  {
    id: 10, category: "অযু ও তাহারাত",
    question: "তায়াম্মুমের ফরজ কয়টি?",
    options: ["২টি", "৩টি", "৪টি", "৫টি"],
    correct: 1,
    explanation: "তায়াম্মুমের ফরজ ৩টি: নিয়ত করা, মুখমণ্ডল মাসেহ করা, দুই হাত কনুইসহ মাসেহ করা।",
  },
  {
    id: 11, category: "অযু ও তাহারাত",
    question: "গোসলের ফরজ কয়টি?",
    options: ["২টি", "৩টি", "৪টি", "৬টি"],
    correct: 1,
    explanation: "গোসলের ফরজ ৩টি: কুলি করা, নাকে পানি দেওয়া এবং সমস্ত শরীর ধোয়া।",
  },
  // ── সংগঠন ──
  {
    id: 12, category: "সংগঠন পরিচিতি",
    question: "ছাত্রশিবিরের সাংগঠনিক স্তর কয়টি?",
    options: ["২টি", "৩টি", "৪টি", "৫টি"],
    correct: 2,
    explanation: "ছাত্রশিবিরের সাংগঠনিক স্তর ৪টি: সমর্থক, কর্মী, সাথী এবং সদস্য।",
  },
  {
    id: 13, category: "সংগঠন পরিচিতি",
    question: "কর্মী হওয়ার শর্ত কয়টি?",
    options: ["২টি", "৩টি", "৪টি", "৫টি"],
    correct: 2,
    explanation: "কর্মী হওয়ার শর্ত ৪টি: দাওয়াতী কাজ করা, প্রোগ্রামে উপস্থিত থাকা, রিপোর্ট রাখা এবং বাইতুলমাল আমানত দেওয়া।",
  },
  {
    id: 14, category: "সংগঠন পরিচিতি",
    question: "বাংলাদেশ ইসলামী ছাত্রশিবির কত সালে প্রতিষ্ঠিত হয়?",
    options: ["১৯৭৫ সালে", "১৯৭৭ সালে", "১৯৮০ সালে", "১৯৮২ সালে"],
    correct: 1,
    explanation: "বাংলাদেশ ইসলামী ছাত্রশিবির ১৯৭৭ সালের ৬ ফেব্রুয়ারি ঢাকা বিশ্ববিদ্যালয়ের কেন্দ্রীয় মসজিদে প্রতিষ্ঠিত হয়।",
  },
  {
    id: 15, category: "সংগঠন পরিচিতি",
    question: "ছাত্রশিবিরের প্রতিষ্ঠাতা সভাপতি কে ছিলেন?",
    options: ["ইজাজুল ইসলাম", "মুজুকুল ইসলাম", "মীর কাসেম আলী", "শফিকুর রহমান"],
    correct: 2,
    explanation: "মীর কাসেম আলী ছাত্রশিবিরের প্রতিষ্ঠাতা সভাপতি ছিলেন।",
  },
  {
    id: 16, category: "সূরা ফাতিহা",
    question: "সূরা ফাতিহায় মোট কয়টি আয়াত আছে?",
    options: ["৫টি", "৬টি", "৭টি", "৮টি"],
    correct: 2,
    explanation: "সূরা ফাতিহায় মোট ৭টি আয়াত রয়েছে।",
  },
  {
    id: 17, category: "পাঁচ দফা",
    question: "ছাত্রশিবিরের পাঁচ দফার প্রথম দফা কোনটি?",
    options: ["সংগঠন", "প্রশিক্ষণ", "দাওয়াত", "ইসলামী সমাজবিনির্মাণ"],
    correct: 2,
    explanation: "পাঁচ দফার প্রথম দফা হলো দাওয়াত — তরুণ ছাত্র সমাজের কাছে ইসলামের আহবান পৌঁছে দেওয়া।",
  },
  {
    id: 18, category: "গুরুত্বপূর্ণ তারিখ",
    question: "শহীদ দিবস কত তারিখে পালিত হয়?",
    options: ["৬ ফেব্রুয়ারী", "১১ মার্চ", "৬ মে", "২৩ জুন"],
    correct: 1,
    explanation: "১১ মার্চ ১৯৮২ সালে শহীদ হওয়া সদস্যদের স্মরণে প্রতি বছর ১১ মার্চ শহীদ দিবস পালিত হয়।",
  },
  {
    id: 19, category: "কুরআন পরিচিতি",
    question: "কুরআনে মোট রুকু কতটি?",
    options: ["৪৫০ টি", "৪৮০ টি", "৫১০ টি", "৫৪০ টি"],
    correct: 3,
    explanation: "কুরআনে মোট ৫৪০ টি রুকু রয়েছে।",
  },
  {
    id: 20, category: "সংগঠন পরিচিতি",
    question: "সক্রিয় কর্মীর গুণাবলী কয়টি?",
    options: ["৫টি", "৬টি", "৭টি", "৮টি"],
    correct: 3,
    explanation: "সক্রিয় কর্মীর গুণাবলী ৮টি।",
  },
]

const PASS_MARK = 70
const EXAM_TIME = 20 * 60 // 20 minutes in seconds

/* ═══════════════════════════════════════
   CHAT MESSAGES (mock)
═══════════════════════════════════════ */
type Msg = { id: number; from: "user" | "examiner"; text: string; time: string; meetLink?: string }

const INITIAL_MSGS: Msg[] = [
  {
    id: 1, from: "examiner",
    text: "আস্সালামু আলাইকুম! আমি আপনার ভাইভা পরীক্ষক। আপনার লিখিত পরীক্ষায় ফলাফল ভালো হয়েছে। ভাইভার জন্য প্রস্তুত তো?",
    time: "10:32",
  },
  {
    id: 2, from: "user",
    text: "ওয়া আলাইকুম আস্সালাম! জি, আলহামদুলিল্লাহ, প্রস্তুত আছি।",
    time: "10:34",
  },
  {
    id: 3, from: "examiner",
    text: "বেশ ভালো। নিচের লিঙ্কে ক্লিক করে Google Meet এ যোগ দিন। ভাইভা শুরু হবে ইনশাআল্লাহ।",
    time: "10:35",
    meetLink: "https://meet.google.com/abc-defg-hij",
  },
]

/* ═══════════════════════════════════════
   TYPES
═══════════════════════════════════════ */
type ExamPhase = "landing" | "mcq_running" | "mcq_result" | "viva_chat"

/* ═══════════════════════════════════════
   TIMER HOOK
═══════════════════════════════════════ */
function useTimer(initial: number, active: boolean, onEnd: () => void) {
  const [seconds, setSeconds] = useState(initial)
  const ref = useRef<ReturnType<typeof setInterval> | null>(null)
  useEffect(() => {
    if (!active) return
    ref.current = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) { clearInterval(ref.current!); onEnd(); return 0 }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(ref.current!)
  }, [active, onEnd])
  return seconds
}

/* ═══════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════ */
export default function SupporterExamPage() {
  const [phase, setPhase]           = useState<ExamPhase>("landing")
  const [current, setCurrent]       = useState(0)
  const [answers, setAnswers]       = useState<(number | null)[]>(Array(QUESTIONS.length).fill(null))
  const [showExplanation, setShow]  = useState(false)
  const [msgs, setMsgs]             = useState<Msg[]>(INITIAL_MSGS)
  const [chatInput, setChatInput]   = useState("")
  const chatRef                     = useRef<HTMLDivElement>(null)

  const submitExam = () => {
    setPhase("mcq_result")
  }

  const timerActive = phase === "mcq_running"
  const timeLeft    = useTimer(EXAM_TIME, timerActive, () => submitExam())

  const score = answers.filter((a, i) => a === QUESTIONS[i].correct).length
  const pct   = Math.round((score / QUESTIONS.length) * 100)
  const passed = pct >= PASS_MARK

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0")
  const ss = String(timeLeft % 60).padStart(2, "0")
  const timerUrgent = timeLeft < 120

  function startExam() {
    setCurrent(0)
    setAnswers(Array(QUESTIONS.length).fill(null))
    setPhase("mcq_running")
  }

  function selectAnswer(idx: number) {
    if (answers[current] !== null) return
    setAnswers(p => { const n = [...p]; n[current] = idx; return n })
    setShow(true)
  }

  function nextQ() {
    setShow(false)
    if (current < QUESTIONS.length - 1) setCurrent(c => c + 1)
    else submitExam()
  }

  function prevQ() {
    setShow(false)
    if (current > 0) setCurrent(c => c - 1)
  }

  function sendMsg() {
    if (!chatInput.trim()) return
    const newMsg: Msg = {
      id: msgs.length + 1, from: "user",
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit" }),
    }
    setMsgs(p => [...p, newMsg])
    setChatInput("")
    setTimeout(() => chatRef.current?.scrollTo({ top: 9999, behavior: "smooth" }), 100)
  }

  /* ─── LANDING ─── */
  if (phase === "landing") return <LandingPage onStartMCQ={startExam} onGoChat={() => setPhase("viva_chat")} />

  /* ─── MCQ RUNNING ─── */
  if (phase === "mcq_running") {
    const q = QUESTIONS[current]
    const answered = answers[current]
    const answeredCount = answers.filter(a => a !== null).length

    return (
      <div className="min-h-screen bg-[#050f08] px-4 py-6 md:px-8">
        <div className="mx-auto max-w-2xl">

          {/* Top bar */}
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <ClipboardListIcon className="h-4 w-4 text-emerald-400" strokeWidth={1.8} />
              </div>
              <span className="text-[13px] font-semibold text-emerald-50">লিখিত পরীক্ষা</span>
            </div>
            <div className={`flex items-center gap-2 rounded-xl border px-4 py-2 font-mono text-[15px] font-bold transition-colors ${timerUrgent ? "border-red-500/40 bg-red-500/10 text-red-400" : "border-emerald-500/20 bg-emerald-500/6 text-emerald-400"}`}>
              <TimerIcon className="h-4 w-4" strokeWidth={1.8} />
              {mm}:{ss}
            </div>
          </div>

          {/* Progress dots */}
          <div className="mb-6 flex flex-wrap gap-1.5">
            {QUESTIONS.map((_, i) => (
              <button key={i} onClick={() => { setShow(false); setCurrent(i) }}
                className={`h-2 rounded-full transition-all ${
                  i === current ? "w-6 bg-emerald-400" :
                  answers[i] !== null ? (answers[i] === QUESTIONS[i].correct ? "w-2 bg-emerald-500/60" : "w-2 bg-red-500/60") :
                  "w-2 bg-white/10"
                }`} />
            ))}
          </div>

          <div className="mb-3 flex items-center justify-between">
            <span className="rounded-full border border-emerald-500/15 bg-emerald-500/8 px-3 py-1 font-mono text-[10px] tracking-widest text-emerald-400/70 uppercase">
              {q.category}
            </span>
            <span className="font-mono text-[11px] text-white/30">{answeredCount}/{QUESTIONS.length} উত্তর দেওয়া হয়েছে</span>
          </div>

          {/* Question card */}
          <div className="mb-4 rounded-2xl border border-emerald-500/15 bg-[#071310] p-6">
            <div className="mb-1 font-mono text-[11px] text-white/25">প্রশ্ন {current + 1}/{QUESTIONS.length}</div>
            <h2 className="text-[17px] font-semibold leading-relaxed text-emerald-50">{q.question}</h2>
          </div>

          {/* Options */}
          <div className="mb-4 grid gap-2.5">
            {q.options.map((opt, i) => {
              let cls = "border-white/8 bg-white/3 text-white/55 hover:border-emerald-500/30 hover:bg-emerald-500/6 hover:text-white/80"
              if (answered !== null) {
                if (i === q.correct) cls = "border-emerald-500/50 bg-emerald-500/12 text-emerald-300"
                else if (i === answered && i !== q.correct) cls = "border-red-500/50 bg-red-500/10 text-red-400"
                else cls = "border-white/5 bg-white/2 text-white/25"
              }
              return (
                <button key={i} onClick={() => selectAnswer(i)}
                  disabled={answered !== null}
                  className={`flex items-center gap-3 rounded-xl border px-5 py-3.5 text-left transition-all duration-200 ${cls}`}>
                  <span className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border text-[11px] font-bold font-mono transition-all ${
                    answered !== null && i === q.correct ? "border-emerald-500 bg-emerald-500/20 text-emerald-400" :
                    answered !== null && i === answered && i !== q.correct ? "border-red-500 bg-red-500/20 text-red-400" :
                    "border-white/15 text-white/30"
                  }`}>
                    {["ক","খ","গ","ঘ"][i]}
                  </span>
                  <span className="text-[14px] leading-relaxed">{opt}</span>
                  {answered !== null && i === q.correct && <CheckCircleIcon className="ml-auto h-4 w-4 flex-shrink-0 text-emerald-400" />}
                  {answered !== null && i === answered && i !== q.correct && <XCircleIcon className="ml-auto h-4 w-4 flex-shrink-0 text-red-400" />}
                </button>
              )
            })}
          </div>

          {/* Explanation */}
          {showExplanation && answered !== null && (
            <div className={`mb-4 rounded-xl border px-4 py-3 text-[13px] leading-relaxed ${
              answered === q.correct
                ? "border-emerald-500/20 bg-emerald-500/6 text-emerald-300/80"
                : "border-amber-500/20 bg-amber-500/6 text-amber-300/80"
            }`}>
              <span className="font-semibold">{answered === q.correct ? "✓ সঠিক! " : "✗ ভুল। "}</span>
              {q.explanation}
            </div>
          )}

          {/* Nav buttons */}
          <div className="flex gap-2">
            <button onClick={prevQ} disabled={current === 0}
              className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/3 px-4 py-2.5 text-[13px] text-white/40 disabled:opacity-30 hover:border-white/15 hover:text-white/60 transition-all">
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            <button onClick={nextQ}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-6 py-2.5 text-[13px] font-semibold text-emerald-400 hover:bg-emerald-500/16 transition-all">
              {current === QUESTIONS.length - 1 ? "পরীক্ষা শেষ করুন" : "পরবর্তী প্রশ্ন"}
              <ChevronRightIcon className="h-4 w-4" />
            </button>
            {current === QUESTIONS.length - 1 && (
              <button onClick={submitExam}
                className="flex items-center gap-2 rounded-xl border border-emerald-500 bg-emerald-500 px-5 py-2.5 text-[13px] font-bold text-[#050f08] hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(0,200,83,0.3)]">
                জমা দিন
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  /* ─── MCQ RESULT ─── */
  if (phase === "mcq_result") {
    const cats = [...new Set(QUESTIONS.map(q => q.category))]
    return (
      <div className="min-h-screen bg-[#050f08] px-4 py-8 md:px-8">
        <div className="mx-auto max-w-2xl">

          {/* Result card */}
          <div className={`relative mb-6 overflow-hidden rounded-2xl border p-8 text-center ${
            passed ? "border-emerald-500/25 bg-[#071a10]" : "border-red-500/20 bg-[#140808]"
          }`}>
            <div className={`absolute inset-x-0 top-0 h-1 ${passed ? "bg-gradient-to-r from-transparent via-emerald-500 to-transparent" : "bg-gradient-to-r from-transparent via-red-500/60 to-transparent"}`} />
            <div className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border-4 ${
              passed ? "border-emerald-500/40 bg-emerald-500/10" : "border-red-500/30 bg-red-500/8"
            }`}>
              {passed
                ? <TrophyIcon className="h-9 w-9 text-emerald-400" strokeWidth={1.6} />
                : <XCircleIcon className="h-9 w-9 text-red-400" strokeWidth={1.6} />
              }
            </div>
            <h2 className={`mb-1 text-[26px] font-bold ${passed ? "text-emerald-300" : "text-red-300"}`}>
              {passed ? "আলহামদুলিল্লাহ! উত্তীর্ণ" : "দুঃখিত, অনুত্তীর্ণ"}
            </h2>
            <p className="mb-6 text-[13px] text-white/40">
              {passed ? "ভাইভার জন্য আবেদন করুন" : `${PASS_MARK}% পেতে হবে। আবার চেষ্টা করুন`}
            </p>

            {/* Score circle */}
            <div className="mx-auto mb-6 flex h-28 w-28 flex-col items-center justify-center rounded-full border-4 border-dashed border-white/10">
              <div className={`font-mono text-[32px] font-bold leading-none ${passed ? "text-emerald-400" : "text-red-400"}`}>{pct}%</div>
              <div className="font-mono text-[10px] text-white/30">স্কোর</div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "সঠিক", val: score,                color: "text-emerald-400" },
                { label: "ভুল",  val: QUESTIONS.length - score, color: "text-red-400" },
                { label: "মোট",  val: QUESTIONS.length,    color: "text-white/60" },
              ].map(s => (
                <div key={s.label} className="rounded-xl border border-white/6 bg-white/3 py-3">
                  <div className={`font-mono text-[22px] font-bold ${s.color}`}>{s.val}</div>
                  <div className="font-mono text-[10px] text-white/30">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Category breakdown */}
          <div className="mb-6 rounded-2xl border border-white/6 bg-[#071310] p-5">
            <h3 className="mb-4 text-[13px] font-semibold text-white/60">বিষয়ভিত্তিক ফলাফল</h3>
            {cats.map(cat => {
              const qs = QUESTIONS.filter(q => q.category === cat)
              const correct = qs.filter((q) => answers[QUESTIONS.indexOf(q)] === q.correct).length
              const total = qs.length
              const cpct = Math.round((correct / total) * 100)
              return (
                <div key={cat} className="mb-3 last:mb-0">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-[12px] text-white/50">{cat}</span>
                    <span className={`font-mono text-[11px] font-semibold ${cpct >= 70 ? "text-emerald-400" : "text-red-400"}`}>{correct}/{total}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/6">
                    <div className={`h-full rounded-full transition-all ${cpct >= 70 ? "bg-emerald-500" : "bg-red-500/70"}`} style={{ width: `${cpct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button onClick={() => { setPhase("landing") }}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/8 bg-white/3 py-3 text-[13px] text-white/45 hover:border-white/15 hover:text-white/65 transition-all">
              <RefreshCwIcon className="h-4 w-4" />
              {passed ? "হোমে ফিরুন" : "আবার চেষ্টা করুন"}
            </button>
            {passed && (
              <button onClick={() => setPhase("viva_chat")}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-500 bg-emerald-500 py-3 text-[13px] font-bold text-[#050f08] hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(0,200,83,0.3)]">
                <VideoIcon className="h-4 w-4" />
                ভাইভার জন্য আবেদন
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  /* ─── VIVA CHAT ─── */
  if (phase === "viva_chat") {
    return (
      <div className="flex h-screen flex-col bg-[#050f08]">
        {/* Chat header */}
        <div className="flex items-center gap-3 border-b border-emerald-500/10 bg-[#071310] px-5 py-3.5">
          <button onClick={() => setPhase("landing")} className="flex h-8 w-8 items-center justify-center rounded-lg text-white/30 hover:bg-white/5 hover:text-white/60 transition-colors">
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-emerald-500/25 bg-emerald-500/10">
            <UserIcon className="h-4 w-4 text-emerald-400" strokeWidth={1.8} />
          </div>
          <div className="flex-1">
            <div className="text-[13px] font-semibold text-emerald-50">পরীক্ষক</div>
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(0,200,83,0.8)]" />
              <span className="font-mono text-[10px] text-emerald-400/60">অনলাইন</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg border border-amber-500/20 bg-amber-500/6 px-3 py-1.5">
            <VideoIcon className="h-3.5 w-3.5 text-amber-400" strokeWidth={1.8} />
            <span className="font-mono text-[10px] text-amber-400">ভাইভা চ্যাট</span>
          </div>
        </div>

        {/* Messages */}
        <div ref={chatRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-4"
          style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(0,200,83,0.15) transparent" }}>
          {msgs.map(m => (
            <div key={m.id} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
              {m.from === "examiner" && (
                <div className="mr-2 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-emerald-500/25 bg-emerald-500/10 self-end">
                  <UserIcon className="h-3.5 w-3.5 text-emerald-400" />
                </div>
              )}
              <div className={`max-w-[78%] rounded-2xl px-4 py-2.5 ${
                m.from === "user"
                  ? "rounded-br-sm bg-emerald-500/15 border border-emerald-500/20"
                  : "rounded-bl-sm bg-[#0d2018] border border-white/6"
              }`}>
                <p className="text-[13px] leading-relaxed text-white/85">{m.text}</p>
                {m.meetLink && (
                  <a href={m.meetLink} target="_blank" rel="noopener noreferrer"
                    className="mt-3 flex items-center gap-2.5 rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-2.5 hover:bg-blue-500/18 transition-colors">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500/20">
                      <VideoIcon className="h-4 w-4 text-blue-400" strokeWidth={1.8} />
                    </div>
                    <div>
                      <div className="text-[12px] font-semibold text-blue-300">Google Meet — ভাইভায় যোগ দিন</div>
                      <div className="font-mono text-[10px] text-blue-400/50">{m.meetLink}</div>
                    </div>
                    <ArrowRightIcon className="ml-auto h-4 w-4 text-blue-400/60" />
                  </a>
                )}
                <div className={`mt-1 text-right font-mono text-[9px] ${m.from === "user" ? "text-emerald-400/40" : "text-white/20"}`}>{m.time}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Viva status card */}
        <div className="mx-4 mb-3 rounded-xl border border-amber-500/15 bg-amber-500/5 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <BadgeCheckIcon className="h-4 w-4 text-amber-400" strokeWidth={1.8} />
            <div className="flex-1">
              <div className="text-[12px] font-semibold text-amber-300">লিখিত পরীক্ষায় উত্তীর্ণ</div>
              <div className="font-mono text-[10px] text-amber-400/50">ভাইভায় ৭০%+ পেলে কর্মী পদে উন্নীত হবেন</div>
            </div>
            <div className="rounded-lg border border-amber-500/25 bg-amber-500/10 px-2.5 py-1 font-mono text-[11px] font-bold text-amber-400">
              {pct}%
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-emerald-500/8 bg-[#071310] px-4 py-3">
          <div className="flex items-center gap-2.5">
            <input
              type="text" value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMsg()}
              placeholder="বার্তা লিখুন..."
              className="flex-1 rounded-xl border border-white/8 bg-white/4 px-4 py-2.5 text-[13px] text-emerald-50 placeholder-white/20 outline-none focus:border-emerald-500/30 focus:bg-white/5 transition-all"
            />
            <button onClick={sendMsg}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/12 text-emerald-400 hover:bg-emerald-500/20 transition-all disabled:opacity-30"
              disabled={!chatInput.trim()}>
              <SendIcon className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}

/* ═══════════════════════════════════════
   LANDING PAGE
═══════════════════════════════════════ */
function LandingPage({ onStartMCQ, onGoChat }: { onStartMCQ: () => void; onGoChat: () => void }) {
  return (
    <div className="min-h-screen bg-[#050f08] px-4 py-8 md:px-8">
      <div className="mx-auto max-w-3xl">

        {/* Hero */}
        <div className="relative mb-8 overflow-hidden rounded-2xl border border-emerald-500/15 bg-[#071310] p-8">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-500/4 blur-3xl pointer-events-none" />

          <div className="relative">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/25 bg-emerald-500/10">
                <MoonIcon className="h-6 w-6 text-emerald-400" strokeWidth={1.6} />
              </div>
              <div>
                <div className="font-mono text-[10px] tracking-[3px] text-emerald-500/40 uppercase">বাংলাদেশ ইসলামী ছাত্রশিবির</div>
                <h1 className="text-[22px] font-bold text-emerald-50">সমর্থক → কর্মী পদোন্নতি পরীক্ষা</h1>
              </div>
            </div>
            <p className="mb-6 max-w-lg text-[13px] leading-relaxed text-white/45">
              সমর্থক থেকে কর্মী পদে উন্নীত হতে দুটি ধাপ সম্পন্ন করতে হবে।
              প্রথমে লিখিত পরীক্ষায় ৭০% বা তার বেশি পেতে হবে, তারপর পরীক্ষকের সাথে ভাইভায় অংশ নিতে হবে।
            </p>

            {/* Steps */}
            <div className="flex items-center gap-2">
              {[
                { n: "১", label: "লিখিত পরীক্ষা", sub: "৭০%+ পাস" },
                { n: "→" },
                { n: "২", label: "ভাইভা পরীক্ষা", sub: "Meet interview" },
                { n: "→" },
                { n: "✓", label: "কর্মী", sub: "পদোন্নতি" },
              ].map((s, i) =>
                "label" in s ? (
                  <div key={i} className="flex items-center gap-1.5 rounded-xl border border-emerald-500/12 bg-emerald-500/5 px-3 py-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 font-mono text-[10px] text-emerald-400">{s.n}</span>
                    <div>
                      <div className="text-[11px] font-semibold text-white/70">{s.label}</div>
                      <div className="font-mono text-[9px] text-white/25">{s.sub}</div>
                    </div>
                  </div>
                ) : (
                  <ArrowRightIcon key={i} className="h-4 w-4 flex-shrink-0 text-white/15" />
                )
              )}
            </div>
          </div>
        </div>

        {/* Two exam cards */}
        <div className="grid gap-4 md:grid-cols-2">

          {/* MCQ Card */}
          <div className="flex flex-col rounded-2xl border border-emerald-500/15 bg-[#071310] overflow-hidden">
            <div className="h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
            <div className="flex flex-1 flex-col p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
                  <ClipboardListIcon className="h-5 w-5 text-emerald-400" strokeWidth={1.8} />
                </div>
                <div>
                  <h2 className="text-[15px] font-bold text-emerald-50">লিখিত পরীক্ষা</h2>
                  <span className="rounded-full border border-emerald-500/15 bg-emerald-500/8 px-2 py-0.5 font-mono text-[9px] text-emerald-400/70">ধাপ ১</span>
                </div>
              </div>

              <div className="mb-5 space-y-2.5">
                {[
                  { icon: BookOpenIcon,  label: "সিলেবাসভিত্তিক MCQ",  val: `${QUESTIONS.length} টি প্রশ্ন` },
                  { icon: TimerIcon,     label: "সময়সীমা",             val: "২০ মিনিট" },
                  { icon: StarIcon,      label: "পাস মার্ক",           val: `${PASS_MARK}%` },
                  { icon: BookOpenIcon,  label: "বিষয়",                val: "কুরআন, হাদিস, তাহারাত, সংগঠন" },
                ].map(r => (
                  <div key={r.label} className="flex items-center justify-between rounded-lg border border-white/5 bg-white/2 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <r.icon className="h-3.5 w-3.5 text-emerald-500/50" strokeWidth={1.8} />
                      <span className="text-[12px] text-white/45">{r.label}</span>
                    </div>
                    <span className="font-mono text-[11px] text-emerald-400/80">{r.val}</span>
                  </div>
                ))}
              </div>

              <button onClick={onStartMCQ}
                className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500 bg-emerald-500 py-3 font-bold text-[13px] text-[#050f08] hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(0,200,83,0.25)]">
                পরীক্ষা শুরু করুন
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Viva Card */}
          <div className="flex flex-col rounded-2xl border border-amber-500/15 bg-[#0f0f07] overflow-hidden">
            <div className="h-0.5 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
            <div className="flex flex-1 flex-col p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10">
                  <VideoIcon className="h-5 w-5 text-amber-400" strokeWidth={1.8} />
                </div>
                <div>
                  <h2 className="text-[15px] font-bold text-amber-100">ভাইভা পরীক্ষা</h2>
                  <span className="rounded-full border border-amber-500/15 bg-amber-500/8 px-2 py-0.5 font-mono text-[9px] text-amber-400/70">ধাপ ২</span>
                </div>
              </div>

              <div className="mb-5 space-y-2.5">
                {[
                  { icon: MessageSquareIcon, label: "পদ্ধতি",     val: "চ্যাট + Meet লিঙ্ক" },
                  { icon: VideoIcon,         label: "মাধ্যম",     val: "Google Meet" },
                  { icon: StarIcon,          label: "পাস মার্ক", val: "৭০%+" },
                  { icon: ShieldCheckIcon,   label: "পরিণতি",    val: "কর্মী পদে উন্নীত" },
                ].map(r => (
                  <div key={r.label} className="flex items-center justify-between rounded-lg border border-white/5 bg-white/2 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <r.icon className="h-3.5 w-3.5 text-amber-500/50" strokeWidth={1.8} />
                      <span className="text-[12px] text-white/45">{r.label}</span>
                    </div>
                    <span className="font-mono text-[11px] text-amber-400/80">{r.val}</span>
                  </div>
                ))}
              </div>

              <div className="mb-4 rounded-xl border border-amber-500/12 bg-amber-500/5 px-4 py-3">
                <div className="flex items-start gap-2">
                  <AlertCircleIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-400/70" strokeWidth={1.8} />
                  <p className="text-[11px] leading-relaxed text-amber-200/45">
                    পরীক্ষক চ্যাটে Meet লিঙ্ক পাঠাবেন। ভিডিও ইন্টারভিউতে ৭০%+ পেলে Admin আপনাকে কর্মী পদে উন্নীত করবেন।
                  </p>
                </div>
              </div>

              <button onClick={onGoChat}
                className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 py-3 font-bold text-[13px] text-amber-400 hover:bg-amber-500/18 transition-all">
                <MessageSquareIcon className="h-4 w-4" strokeWidth={2} />
                পরীক্ষকের সাথে কথা বলুন
              </button>
            </div>
          </div>
        </div>

        {/* Promotion flow info */}
        <div className="mt-4 rounded-2xl border border-white/6 bg-[#071310] p-5">
          <div className="mb-3 flex items-center gap-2">
            <ShieldCheckIcon className="h-4 w-4 text-emerald-400/60" strokeWidth={1.8} />
            <span className="text-[12px] font-semibold text-white/50">পদোন্নতি প্রক্রিয়া</span>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            {[
              { step: "০১", title: "লিখিত পরীক্ষা",   desc: "সিলেবাসভিত্তিক MCQ — ৭০%+ পাস", color: "emerald" },
              { step: "০২", title: "ভাইভা পরীক্ষা",   desc: "পরীক্ষকের সাথে Meet ইন্টারভিউ", color: "amber" },
              { step: "০৩", title: "Admin অনুমোদন",   desc: "Admin পাস করলে কর্মী পদ নিশ্চিত", color: "blue" },
            ].map(s => {
              const clr: Record<string, string> = {
                emerald: "border-emerald-500/12 bg-emerald-500/4 text-emerald-400",
                amber:   "border-amber-500/12 bg-amber-500/4 text-amber-400",
                blue:    "border-blue-500/12 bg-blue-500/4 text-blue-400",
              }
              return (
                <div key={s.step} className={`rounded-xl border px-4 py-3 ${clr[s.color]}`}>
                  <div className="mb-1 font-mono text-[9px] tracking-[3px] opacity-60 uppercase">{s.step}</div>
                  <div className="mb-1 text-[12px] font-bold">{s.title}</div>
                  <p className="text-[11px] leading-relaxed opacity-55">{s.desc}</p>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
