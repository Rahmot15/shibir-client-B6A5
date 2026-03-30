"use client"

import { useEffect, useRef, useState } from "react"
import {
  AlertCircleIcon,
  ArrowRightIcon,
  BadgeCheckIcon,
  BookOpenIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClipboardListIcon,
  MessageSquareIcon,
  MoonIcon,
  RefreshCwIcon,
  SendIcon,
  ShieldCheckIcon,
  StarIcon,
  TimerIcon,
  TrophyIcon,
  UserIcon,
  VideoIcon,
  XCircleIcon,
} from "lucide-react"

type Question = {
  id: number
  category: string
  question: string
  options: string[]
  correct: number
  explanation: string
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    category: "কুরআন পরিচিতি",
    question: "পবিত্র কুরআনে মোট কতটি সূরা আছে?",
    options: ["১১২ টি", "১১৩ টি", "১১৪ টি", "১১৫ টি"],
    correct: 2,
    explanation: "পবিত্র কুরআনে মোট ১১৪ টি সূরা রয়েছে।",
  },
  {
    id: 2,
    category: "কুরআন পরিচিতি",
    question: "কুরআনে মোট কতটি পারা আছে?",
    options: ["২৮ টি", "২৯ টি", "৩০ টি", "৩২ টি"],
    correct: 2,
    explanation: "পবিত্র কুরআনে মোট ৩০ টি পারা রয়েছে।",
  },
  {
    id: 3,
    category: "কুরআন পরিচিতি",
    question: "কুরআনের প্রথম সূরার নাম কী?",
    options: ["সূরা নাস", "সূরা ফাতিহা", "সূরা বাকারা", "সূরা আলাক"],
    correct: 1,
    explanation: "কুরআনের প্রথম সূরা হলো সূরা আল-ফাতিহা।",
  },
  {
    id: 4,
    category: "কুরআন পরিচিতি",
    question: "কুরআনের প্রথম নাযিলকৃত আয়াত কোন সূরার?",
    options: ["সূরা মুদ্দাসসির", "সূরা বাকারা", "সূরা ফাতিহা", "সূরা আলাক"],
    correct: 3,
    explanation: "সূরা আলাকের ১-৫ আয়াত সর্বপ্রথম নাযিল হয়।",
  },
  {
    id: 5,
    category: "কুরআন পরিচিতি",
    question: "কুরআনে মোট রুকু কতটি?",
    options: ["৫২০ টি", "৫৩০ টি", "৫৪০ টি", "৫৫০ টি"],
    correct: 2,
    explanation: "কুরআনে মোট ৫৪০ টি রুকু রয়েছে।",
  },
  {
    id: 6,
    category: "হাদিস পরিচিতি",
    question: "হাদিস কুদসী বলতে কী বোঝায়?",
    options: [
      "রাসূলের নিজস্ব বক্তব্য",
      "সাহাবীদের বর্ণনা",
      "মূল বক্তব্য আল্লাহর, রাসূল নিজ ভাষায় বর্ণনা করেছেন",
      "ইমামদের মতামত",
    ],
    correct: 2,
    explanation: "যে হাদিসের মূল বক্তব্য আল্লাহর, কিন্তু ভাষা রাসূলের (সা.) - সেটি হাদিস কুদসী।",
  },
  {
    id: 7,
    category: "হাদিস পরিচিতি",
    question: "কওলী হাদিস কাকে বলে?",
    options: ["রাসূলের কাজ", "রাসূলের কথা", "রাসূলের মৌন সম্মতি", "সাহাবীদের কাজ"],
    correct: 1,
    explanation: "রাসূল (সা.) এর কথাকে কওলী হাদিস বলে।",
  },
  {
    id: 8,
    category: "হাদিস পরিচিতি",
    question: "তাকরীরী হাদিস কী?",
    options: ["রাসূলের কথা", "রাসূলের কাজ", "রাসূলের মৌন সম্মতি", "তাবেঈনের বর্ণনা"],
    correct: 2,
    explanation: "রাসূল (সা.) এর মৌন সম্মতিকেই তাকরীরী হাদিস বলা হয়।",
  },
  {
    id: 9,
    category: "তাহারাত",
    question: "অযুর ফরজ কয়টি?",
    options: ["৩টি", "৪টি", "৫টি", "৬টি"],
    correct: 1,
    explanation: "অযুর ফরজ ৪টি।",
  },
  {
    id: 10,
    category: "তাহারাত",
    question: "তায়াম্মুমের ফরজ কয়টি?",
    options: ["২টি", "৩টি", "৪টি", "৫টি"],
    correct: 1,
    explanation: "তায়াম্মুমের ফরজ ৩টি।",
  },
  {
    id: 11,
    category: "তাহারাত",
    question: "গোসলের ফরজ কয়টি?",
    options: ["২টি", "৩টি", "৪টি", "৫টি"],
    correct: 1,
    explanation: "গোসলের ফরজ ৩টি।",
  },
  {
    id: 12,
    category: "সংগঠন",
    question: "সাংগঠনিক স্তর কয়টি?",
    options: ["৩টি", "৪টি", "৫টি", "৬টি"],
    correct: 1,
    explanation: "সাংগঠনিক স্তর ৪টি: সমর্থক, কর্মী, সাথী, সদস্য।",
  },
  {
    id: 13,
    category: "সংগঠন",
    question: "কর্মী হওয়ার শর্ত কয়টি?",
    options: ["২টি", "৩টি", "৪টি", "৫টি"],
    correct: 2,
    explanation: "কর্মী হওয়ার শর্ত ৪টি।",
  },
  {
    id: 14,
    category: "সংগঠন",
    question: "সক্রিয় কর্মীর গুণাবলী কয়টি?",
    options: ["৬টি", "৭টি", "৮টি", "৯টি"],
    correct: 2,
    explanation: "সক্রিয় কর্মীর গুণাবলী ৮টি।",
  },
  {
    id: 15,
    category: "সংগঠন",
    question: "কর্মীর কাজ কয়টি?",
    options: ["৬টি", "৭টি", "৮টি", "৯টি"],
    correct: 2,
    explanation: "সিলেবাস অনুযায়ী কর্মীর কাজ ৮টি।",
  },
  {
    id: 16,
    category: "গুরুত্বপূর্ণ দিবস",
    question: "প্রতিষ্ঠাবার্ষিকী কবে পালিত হয়?",
    options: ["৬ ফেব্রুয়ারী", "১১ মার্চ", "৬ মে", "২৩ জুন"],
    correct: 0,
    explanation: "প্রতিষ্ঠাবার্ষিকী ৬ ফেব্রুয়ারী পালিত হয়।",
  },
  {
    id: 17,
    category: "গুরুত্বপূর্ণ দিবস",
    question: "শহীদ দিবস কবে?",
    options: ["১১ মার্চ", "৬ মে", "২৫ আগস্ট", "৬ ডিসেম্বর"],
    correct: 0,
    explanation: "শহীদ দিবস ১১ মার্চ।",
  },
  {
    id: 18,
    category: "পাঁচ দফা",
    question: "পাঁচ দফার প্রথম দফা কোনটি?",
    options: ["সংগঠন", "প্রশিক্ষণ", "দাওয়াত", "ইসলামী সমাজবিনির্মাণ"],
    correct: 2,
    explanation: "পাঁচ দফার প্রথম দফা হলো দাওয়াত।",
  },
  {
    id: 19,
    category: "মুখস্থকরণ",
    question: "সূরা ফাতিহায় মোট কয়টি আয়াত আছে?",
    options: ["৫টি", "৬টি", "৭টি", "৮টি"],
    correct: 2,
    explanation: "সূরা ফাতিহায় ৭টি আয়াত রয়েছে।",
  },
  {
    id: 20,
    category: "মুখস্থকরণ",
    question: "আয়াত ও হাদিস মুখস্থকরণের ন্যূনতম বিষয় সংখ্যা কত?",
    options: ["৬টি", "৮টি", "১০টি", "১২টি"],
    correct: 1,
    explanation: "সিলেবাসে মুখস্থকরণের জন্য ৮টি মূল বিষয় উল্লেখ আছে।",
  },
]

const PASS_MARK = 70
const EXAM_TIME = 20 * 60

type Msg = { id: number; from: "user" | "examiner"; text: string; time: string; meetLink?: string }

type ExamPhase = "landing" | "mcq_running" | "mcq_result" | "viva_chat"

const INITIAL_MSGS: Msg[] = [
  {
    id: 1,
    from: "examiner",
    text: "আস্সালামু আলাইকুম। আপনি কর্মী সিলেবাসের লিখিত পরীক্ষায় ভালো করেছেন। সংক্ষিপ্ত ভাইভা দেওয়ার জন্য প্রস্তুত আছেন?",
    time: "10:15",
  },
  {
    id: 2,
    from: "user",
    text: "জি, আলহামদুলিল্লাহ। প্রস্তুত আছি।",
    time: "10:16",
  },
  {
    id: 3,
    from: "examiner",
    text: "চমৎকার। নিচের লিঙ্কে যোগ দিন, ইনশাআল্লাহ ভাইভা শুরু করব।",
    time: "10:17",
    meetLink: "https://meet.google.com/abc-defg-hij",
  },
]

function useTimer(initial: number, active: boolean, onEnd: () => void) {
  const [seconds, setSeconds] = useState(initial)
  const ref = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!active) {
      return
    }

    ref.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          if (ref.current) {
            clearInterval(ref.current)
          }
          onEnd()
          return 0
        }

        return s - 1
      })
    }, 1000)

    return () => {
      if (ref.current) {
        clearInterval(ref.current)
      }
    }
  }, [active, onEnd])

  return seconds
}

export default function WorkerExamClient() {
  const [phase, setPhase] = useState<ExamPhase>("landing")
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>(Array(QUESTIONS.length).fill(null))
  const [showExplanation, setShowExplanation] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>(INITIAL_MSGS)
  const [chatInput, setChatInput] = useState("")
  const chatRef = useRef<HTMLDivElement>(null)

  const submitExam = () => setPhase("mcq_result")
  const timerActive = phase === "mcq_running"
  const timeLeft = useTimer(EXAM_TIME, timerActive, submitExam)

  const score = answers.filter((answer, index) => answer === QUESTIONS[index].correct).length
  const pct = Math.round((score / QUESTIONS.length) * 100)
  const passed = pct >= PASS_MARK

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0")
  const ss = String(timeLeft % 60).padStart(2, "0")
  const timerUrgent = timeLeft < 120

  const startExam = () => {
    setCurrent(0)
    setAnswers(Array(QUESTIONS.length).fill(null))
    setShowExplanation(false)
    setPhase("mcq_running")
  }

  const selectAnswer = (idx: number) => {
    if (answers[current] !== null) {
      return
    }

    setAnswers((prev) => {
      const next = [...prev]
      next[current] = idx
      return next
    })
    setShowExplanation(true)
  }

  const nextQ = () => {
    setShowExplanation(false)
    if (current < QUESTIONS.length - 1) {
      setCurrent((c) => c + 1)
      return
    }

    submitExam()
  }

  const prevQ = () => {
    setShowExplanation(false)
    if (current > 0) {
      setCurrent((c) => c - 1)
    }
  }

  const sendMsg = () => {
    if (!chatInput.trim()) {
      return
    }

    const newMsg: Msg = {
      id: msgs.length + 1,
      from: "user",
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit" }),
    }

    setMsgs((prev) => [...prev, newMsg])
    setChatInput("")
    setTimeout(() => chatRef.current?.scrollTo({ top: 9999, behavior: "smooth" }), 100)
  }

  if (phase === "landing") {
    return <LandingPage onStartMCQ={startExam} onGoChat={() => setPhase("viva_chat")} />
  }

  if (phase === "mcq_running") {
    const q = QUESTIONS[current]
    const answered = answers[current]
    const answeredCount = answers.filter((a) => a !== null).length

    return (
      <div className="min-h-screen bg-[#050f08] px-4 py-6 md:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10">
                <ClipboardListIcon className="h-4 w-4 text-emerald-400" strokeWidth={1.8} />
              </div>
              <span className="text-[13px] font-semibold text-emerald-50">কর্মী সিলেবাস পরীক্ষা</span>
            </div>

            <div
              className={`flex items-center gap-2 rounded-xl border px-4 py-2 font-mono text-[15px] font-bold transition-colors ${
                timerUrgent
                  ? "border-red-500/40 bg-red-500/10 text-red-400"
                  : "border-emerald-500/20 bg-emerald-500/6 text-emerald-400"
              }`}
            >
              <TimerIcon className="h-4 w-4" strokeWidth={1.8} />
              {mm}:{ss}
            </div>
          </div>

          <div className="mb-6 flex flex-wrap gap-1.5">
            {QUESTIONS.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setShowExplanation(false)
                  setCurrent(i)
                }}
                className={`h-2 rounded-full transition-all ${
                  i === current
                    ? "w-6 bg-emerald-400"
                    : answers[i] !== null
                      ? answers[i] === QUESTIONS[i].correct
                        ? "w-2 bg-emerald-500/60"
                        : "w-2 bg-red-500/60"
                      : "w-2 bg-white/10"
                }`}
              />
            ))}
          </div>

          <div className="mb-3 flex items-center justify-between">
            <span className="rounded-full border border-emerald-500/15 bg-emerald-500/8 px-3 py-1 font-mono text-[10px] tracking-widest text-emerald-400/70 uppercase">
              {q.category}
            </span>
            <span className="font-mono text-[11px] text-white/30">
              {answeredCount}/{QUESTIONS.length} উত্তর দেওয়া হয়েছে
            </span>
          </div>

          <div className="mb-4 rounded-2xl border border-emerald-500/15 bg-[#071310] p-6">
            <div className="mb-1 font-mono text-[11px] text-white/25">
              প্রশ্ন {current + 1}/{QUESTIONS.length}
            </div>
            <h2 className="text-[17px] leading-relaxed font-semibold text-emerald-50">{q.question}</h2>
          </div>

          <div className="mb-4 grid gap-2.5">
            {q.options.map((opt, i) => {
              let cls =
                "border-white/8 bg-white/3 text-white/55 hover:border-emerald-500/30 hover:bg-emerald-500/6 hover:text-white/80"

              if (answered !== null) {
                if (i === q.correct) {
                  cls = "border-emerald-500/50 bg-emerald-500/12 text-emerald-300"
                } else if (i === answered && i !== q.correct) {
                  cls = "border-red-500/50 bg-red-500/10 text-red-400"
                } else {
                  cls = "border-white/5 bg-white/2 text-white/25"
                }
              }

              return (
                <button
                  key={i}
                  onClick={() => selectAnswer(i)}
                  disabled={answered !== null}
                  className={`flex items-center gap-3 rounded-xl border px-5 py-3.5 text-left transition-all duration-200 ${cls}`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border font-mono text-[11px] font-bold transition-all ${
                      answered !== null && i === q.correct
                        ? "border-emerald-500 bg-emerald-500/20 text-emerald-400"
                        : answered !== null && i === answered && i !== q.correct
                          ? "border-red-500 bg-red-500/20 text-red-400"
                          : "border-white/15 text-white/30"
                    }`}
                  >
                    {["ক", "খ", "গ", "ঘ"][i]}
                  </span>
                  <span className="text-[14px] leading-relaxed">{opt}</span>
                  {answered !== null && i === q.correct ? (
                    <CheckCircleIcon className="ml-auto h-4 w-4 shrink-0 text-emerald-400" />
                  ) : null}
                  {answered !== null && i === answered && i !== q.correct ? (
                    <XCircleIcon className="ml-auto h-4 w-4 shrink-0 text-red-400" />
                  ) : null}
                </button>
              )
            })}
          </div>

          {showExplanation && answered !== null ? (
            <div
              className={`mb-4 rounded-xl border px-4 py-3 text-[13px] leading-relaxed ${
                answered === q.correct
                  ? "border-emerald-500/20 bg-emerald-500/6 text-emerald-300/80"
                  : "border-amber-500/20 bg-amber-500/6 text-amber-300/80"
              }`}
            >
              <span className="font-semibold">{answered === q.correct ? "✓ সঠিক! " : "✗ ভুল। "}</span>
              {q.explanation}
            </div>
          ) : null}

          <div className="flex gap-2">
            <button
              onClick={prevQ}
              disabled={current === 0}
              className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/3 px-4 py-2.5 text-[13px] text-white/40 transition-all hover:border-white/15 hover:text-white/60 disabled:opacity-30"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>

            <button
              onClick={nextQ}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-6 py-2.5 text-[13px] font-semibold text-emerald-400 transition-all hover:bg-emerald-500/16"
            >
              {current === QUESTIONS.length - 1 ? "পরীক্ষা শেষ করুন" : "পরবর্তী প্রশ্ন"}
              <ChevronRightIcon className="h-4 w-4" />
            </button>

            {current === QUESTIONS.length - 1 ? (
              <button
                onClick={submitExam}
                className="flex items-center gap-2 rounded-xl border border-emerald-500 bg-emerald-500 px-5 py-2.5 text-[13px] font-bold text-[#050f08] shadow-[0_0_20px_rgba(0,200,83,0.3)] transition-all hover:bg-emerald-400"
              >
                জমা দিন
              </button>
            ) : null}
          </div>
        </div>
      </div>
    )
  }

  if (phase === "mcq_result") {
    const categories = [...new Set(QUESTIONS.map((q) => q.category))]

    return (
      <div className="min-h-screen bg-[#050f08] px-4 py-8 md:px-8">
        <div className="mx-auto max-w-2xl">
          <div
            className={`relative mb-6 overflow-hidden rounded-2xl border p-8 text-center ${
              passed ? "border-emerald-500/25 bg-[#071a10]" : "border-red-500/20 bg-[#140808]"
            }`}
          >
            <div
              className={`absolute inset-x-0 top-0 h-1 ${
                passed
                  ? "bg-gradient-to-r from-transparent via-emerald-500 to-transparent"
                  : "bg-gradient-to-r from-transparent via-red-500/60 to-transparent"
              }`}
            />

            <div
              className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border-4 ${
                passed ? "border-emerald-500/40 bg-emerald-500/10" : "border-red-500/30 bg-red-500/8"
              }`}
            >
              {passed ? (
                <TrophyIcon className="h-9 w-9 text-emerald-400" strokeWidth={1.6} />
              ) : (
                <XCircleIcon className="h-9 w-9 text-red-400" strokeWidth={1.6} />
              )}
            </div>

            <h2 className={`mb-1 text-[26px] font-bold ${passed ? "text-emerald-300" : "text-red-300"}`}>
              {passed ? "আলহামদুলিল্লাহ! উত্তীর্ণ" : "দুঃখিত, অনুত্তীর্ণ"}
            </h2>
            <p className="mb-6 text-[13px] text-white/40">
              {passed ? "মৌখিক মূল্যায়নে অংশ নিতে পারেন" : `${PASS_MARK}% পেতে হবে। আবার চেষ্টা করুন`}
            </p>

            <div className="mx-auto mb-6 flex h-28 w-28 flex-col items-center justify-center rounded-full border-4 border-dashed border-white/10">
              <div className={`font-mono text-[32px] leading-none font-bold ${passed ? "text-emerald-400" : "text-red-400"}`}>
                {pct}%
              </div>
              <div className="font-mono text-[10px] text-white/30">স্কোর</div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "সঠিক", val: score, color: "text-emerald-400" },
                { label: "ভুল", val: QUESTIONS.length - score, color: "text-red-400" },
                { label: "মোট", val: QUESTIONS.length, color: "text-white/60" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-white/6 bg-white/3 py-3">
                  <div className={`font-mono text-[22px] font-bold ${s.color}`}>{s.val}</div>
                  <div className="font-mono text-[10px] text-white/30">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6 rounded-2xl border border-white/6 bg-[#071310] p-5">
            <h3 className="mb-4 text-[13px] font-semibold text-white/60">বিষয়ভিত্তিক ফলাফল</h3>
            {categories.map((category) => {
              const categoryQuestions = QUESTIONS.filter((q) => q.category === category)
              const correct = categoryQuestions.filter(
                (q) => answers[QUESTIONS.indexOf(q)] === q.correct,
              ).length
              const total = categoryQuestions.length
              const categoryPct = Math.round((correct / total) * 100)

              return (
                <div key={category} className="mb-3 last:mb-0">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-[12px] text-white/50">{category}</span>
                    <span
                      className={`font-mono text-[11px] font-semibold ${
                        categoryPct >= 70 ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {correct}/{total}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/6">
                    <div
                      className={`h-full rounded-full transition-all ${
                        categoryPct >= 70 ? "bg-emerald-500" : "bg-red-500/70"
                      }`}
                      style={{ width: `${categoryPct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setPhase("landing")}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/8 bg-white/3 py-3 text-[13px] text-white/45 transition-all hover:border-white/15 hover:text-white/65"
            >
              <RefreshCwIcon className="h-4 w-4" />
              {passed ? "হোমে ফিরুন" : "আবার চেষ্টা করুন"}
            </button>

            {passed ? (
              <button
                onClick={() => setPhase("viva_chat")}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-500 bg-emerald-500 py-3 text-[13px] font-bold text-[#050f08] shadow-[0_0_20px_rgba(0,200,83,0.3)] transition-all hover:bg-emerald-400"
              >
                <VideoIcon className="h-4 w-4" />
                মৌখিক মূল্যায়ন
              </button>
            ) : null}
          </div>
        </div>
      </div>
    )
  }

  if (phase === "viva_chat") {
    return (
      <div className="flex h-screen flex-col bg-[#050f08]">
        <div className="flex items-center gap-3 border-b border-emerald-500/10 bg-[#071310] px-5 py-3.5">
          <button
            onClick={() => setPhase("landing")}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/30 transition-colors hover:bg-white/5 hover:text-white/60"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-500/25 bg-emerald-500/10">
            <UserIcon className="h-4 w-4 text-emerald-400" strokeWidth={1.8} />
          </div>
          <div className="flex-1">
            <div className="text-[13px] font-semibold text-emerald-50">মূল্যায়নকারী</div>
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(0,200,83,0.8)]" />
              <span className="font-mono text-[10px] text-emerald-400/60">অনলাইন</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg border border-amber-500/20 bg-amber-500/6 px-3 py-1.5">
            <VideoIcon className="h-3.5 w-3.5 text-amber-400" strokeWidth={1.8} />
            <span className="font-mono text-[10px] text-amber-400">মৌখিক ধাপ</span>
          </div>
        </div>

        <div
          ref={chatRef}
          className="flex-1 space-y-4 overflow-y-auto px-4 py-5"
          style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(0,200,83,0.15) transparent" }}
        >
          {msgs.map((m) => (
            <div key={m.id} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
              {m.from === "examiner" ? (
                <div className="mr-2 flex h-7 w-7 shrink-0 self-end items-center justify-center rounded-full border border-emerald-500/25 bg-emerald-500/10">
                  <UserIcon className="h-3.5 w-3.5 text-emerald-400" />
                </div>
              ) : null}

              <div
                className={`max-w-[78%] rounded-2xl px-4 py-2.5 ${
                  m.from === "user"
                    ? "rounded-br-sm border border-emerald-500/20 bg-emerald-500/15"
                    : "rounded-bl-sm border border-white/6 bg-[#0d2018]"
                }`}
              >
                <p className="text-[13px] leading-relaxed text-white/85">{m.text}</p>

                {m.meetLink ? (
                  <a
                    href={m.meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex items-center gap-2.5 rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-2.5 transition-colors hover:bg-blue-500/18"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/20">
                      <VideoIcon className="h-4 w-4 text-blue-400" strokeWidth={1.8} />
                    </div>
                    <div>
                      <div className="text-[12px] font-semibold text-blue-300">Google Meet এ যোগ দিন</div>
                      <div className="font-mono text-[10px] text-blue-400/50">{m.meetLink}</div>
                    </div>
                    <ArrowRightIcon className="ml-auto h-4 w-4 text-blue-400/60" />
                  </a>
                ) : null}

                <div
                  className={`mt-1 text-right font-mono text-[9px] ${
                    m.from === "user" ? "text-emerald-400/40" : "text-white/20"
                  }`}
                >
                  {m.time}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mx-4 mb-3 rounded-xl border border-amber-500/15 bg-amber-500/5 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <BadgeCheckIcon className="h-4 w-4 text-amber-400" strokeWidth={1.8} />
            <div className="flex-1">
              <div className="text-[12px] font-semibold text-amber-300">লিখিত পরীক্ষায় উত্তীর্ণ</div>
              <div className="font-mono text-[10px] text-amber-400/50">পরবর্তী ধাপ: মৌখিক মূল্যায়ন</div>
            </div>
            <div className="rounded-lg border border-amber-500/25 bg-amber-500/10 px-2.5 py-1 font-mono text-[11px] font-bold text-amber-400">
              {pct}%
            </div>
          </div>
        </div>

        <div className="border-t border-emerald-500/8 bg-[#071310] px-4 py-3">
          <div className="flex items-center gap-2.5">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMsg()}
              placeholder="বার্তা লিখুন..."
              className="flex-1 rounded-xl border border-white/8 bg-white/4 px-4 py-2.5 text-[13px] text-emerald-50 placeholder-white/20 outline-none transition-all focus:border-emerald-500/30 focus:bg-white/5"
            />
            <button
              onClick={sendMsg}
              disabled={!chatInput.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/12 text-emerald-400 transition-all hover:bg-emerald-500/20 disabled:opacity-30"
            >
              <SendIcon className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}

function LandingPage({ onStartMCQ, onGoChat }: { onStartMCQ: () => void; onGoChat: () => void }) {
  return (
    <div className="min-h-screen bg-[#050f08] px-4 py-8 md:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="relative mb-8 overflow-hidden rounded-2xl border border-emerald-500/15 bg-[#071310] p-8">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
          <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-emerald-500/4 blur-3xl" />

          <div className="relative">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/25 bg-emerald-500/10">
                <MoonIcon className="h-6 w-6 text-emerald-400" strokeWidth={1.6} />
              </div>
              <div>
                <div className="font-mono text-[10px] tracking-[3px] text-emerald-500/40 uppercase">বাংলাদেশ ইসলামী ছাত্রশিবির</div>
                <h1 className="text-[22px] font-bold text-emerald-50">কর্মী সিলেবাস মূল্যায়ন পরীক্ষা</h1>
              </div>
            </div>

            <p className="mb-6 max-w-lg text-[13px] leading-relaxed text-white/45">
              সাথী সিলেবাসভিত্তিক এই পরীক্ষায় প্রথমে লিখিত MCQ ধাপ সম্পন্ন করতে হবে। উত্তীর্ণ হলে মৌখিক ধাপে অংশ নেওয়া যাবে।
            </p>

            <div className="flex items-center gap-2">
              {[
                { n: "১", label: "লিখিত পরীক্ষা", sub: "MCQ, ২০ প্রশ্ন" },
                { n: "→" },
                { n: "২", label: "মৌখিক ধাপ", sub: "চ্যাট + Meet" },
                { n: "→" },
                { n: "✓", label: "উত্তীর্ণ", sub: "পরবর্তী মূল্যায়ন" },
              ].map((s, i) =>
                "label" in s ? (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 rounded-xl border border-emerald-500/12 bg-emerald-500/5 px-3 py-2"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 font-mono text-[10px] text-emerald-400">
                      {s.n}
                    </span>
                    <div>
                      <div className="text-[11px] font-semibold text-white/70">{s.label}</div>
                      <div className="font-mono text-[9px] text-white/25">{s.sub}</div>
                    </div>
                  </div>
                ) : (
                  <ArrowRightIcon key={i} className="h-4 w-4 shrink-0 text-white/15" />
                ),
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col overflow-hidden rounded-2xl border border-emerald-500/15 bg-[#071310]">
            <div className="h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
            <div className="flex flex-1 flex-col p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
                  <ClipboardListIcon className="h-5 w-5 text-emerald-400" strokeWidth={1.8} />
                </div>
                <div>
                  <h2 className="text-[15px] font-bold text-emerald-50">লিখিত পরীক্ষা</h2>
                  <span className="rounded-full border border-emerald-500/15 bg-emerald-500/8 px-2 py-0.5 font-mono text-[9px] text-emerald-400/70">
                    ধাপ ১
                  </span>
                </div>
              </div>

              <div className="mb-5 space-y-2.5">
                {[
                  { icon: BookOpenIcon, label: "সিলেবাসভিত্তিক MCQ", val: `${QUESTIONS.length} টি প্রশ্ন` },
                  { icon: TimerIcon, label: "সময়সীমা", val: "২০ মিনিট" },
                  { icon: StarIcon, label: "পাস মার্ক", val: `${PASS_MARK}%` },
                  { icon: ShieldCheckIcon, label: "বিষয়", val: "কুরআন, হাদিস, তাহারাত, সংগঠন" },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between rounded-lg border border-white/5 bg-white/2 px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <row.icon className="h-3.5 w-3.5 text-emerald-500/50" strokeWidth={1.8} />
                      <span className="text-[12px] text-white/45">{row.label}</span>
                    </div>
                    <span className="font-mono text-[11px] text-emerald-400/80">{row.val}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={onStartMCQ}
                className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500 bg-emerald-500 py-3 text-[13px] font-bold text-[#050f08] shadow-[0_0_20px_rgba(0,200,83,0.25)] transition-all hover:bg-emerald-400"
              >
                পরীক্ষা শুরু করুন
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-col overflow-hidden rounded-2xl border border-amber-500/15 bg-[#0f0f07]">
            <div className="h-0.5 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
            <div className="flex flex-1 flex-col p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10">
                  <VideoIcon className="h-5 w-5 text-amber-400" strokeWidth={1.8} />
                </div>
                <div>
                  <h2 className="text-[15px] font-bold text-amber-100">মৌখিক ধাপ</h2>
                  <span className="rounded-full border border-amber-500/15 bg-amber-500/8 px-2 py-0.5 font-mono text-[9px] text-amber-400/70">
                    ধাপ ২
                  </span>
                </div>
              </div>

              <div className="mb-5 space-y-2.5">
                {[
                  { icon: MessageSquareIcon, label: "পদ্ধতি", val: "চ্যাট + Meet লিংক" },
                  { icon: VideoIcon, label: "মাধ্যম", val: "Google Meet" },
                  { icon: StarIcon, label: "পাস মার্ক", val: "৭০%+" },
                  { icon: ShieldCheckIcon, label: "উদ্দেশ্য", val: "সিলেবাস মূল্যায়ন" },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between rounded-lg border border-white/5 bg-white/2 px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <row.icon className="h-3.5 w-3.5 text-amber-500/50" strokeWidth={1.8} />
                      <span className="text-[12px] text-white/45">{row.label}</span>
                    </div>
                    <span className="font-mono text-[11px] text-amber-400/80">{row.val}</span>
                  </div>
                ))}
              </div>

              <div className="mb-4 rounded-xl border border-amber-500/12 bg-amber-500/5 px-4 py-3">
                <div className="flex items-start gap-2">
                  <AlertCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-amber-400/70" strokeWidth={1.8} />
                  <p className="text-[11px] leading-relaxed text-amber-200/45">
                    লিখিত ধাপে ৭০%+ পেলে মৌখিক ধাপে প্রশ্নোত্তর হবে। ভাইভা সম্পন্ন হলে পরবর্তী সিদ্ধান্ত নির্ধারিত হবে।
                  </p>
                </div>
              </div>

              <button
                onClick={onGoChat}
                className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 py-3 text-[13px] font-bold text-amber-400 transition-all hover:bg-amber-500/18"
              >
                <MessageSquareIcon className="h-4 w-4" strokeWidth={2} />
                মৌখিক চ্যাট খুলুন
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-white/6 bg-[#071310] p-5">
          <div className="mb-3 flex items-center gap-2">
            <ShieldCheckIcon className="h-4 w-4 text-emerald-400/60" strokeWidth={1.8} />
            <span className="text-[12px] font-semibold text-white/50">মূল্যায়ন ধাপ</span>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            {[
              { step: "০১", title: "লিখিত পরীক্ষা", desc: "কর্মী সিলেবাসভিত্তিক MCQ" },
              { step: "০২", title: "মৌখিক ধাপ", desc: "প্রশ্নোত্তর ও যাচাই" },
              { step: "০৩", title: "ফাইনাল সিদ্ধান্ত", desc: "সার্বিক মূল্যায়ন সম্পন্ন" },
            ].map((item) => (
              <div key={item.step} className="rounded-xl border border-emerald-500/12 bg-emerald-500/4 px-4 py-3 text-emerald-300">
                <div className="mb-1 font-mono text-[9px] tracking-[3px] opacity-60 uppercase">{item.step}</div>
                <div className="mb-1 text-[12px] font-bold">{item.title}</div>
                <p className="text-[11px] leading-relaxed opacity-60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
