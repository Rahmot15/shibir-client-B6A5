"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
  ArrowRightIcon,
  SearchIcon,
  ShieldCheckIcon,
  VideoIcon,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type VivaRole = "SUPPORTER" | "WORKER" | "ASSOCIATE"

type VivaCandidate = {
  id: string
  name: string
  role: VivaRole
  submittedAt: string
  examTrack: string
  passageTopic: string
  passageText: string
}

type ChatMessage = {
  id: string
  candidateId: string
  from: "candidate" | "admin"
  text: string
  type?: "text" | "meet"
  createdAt: string
  meetLink?: string
}

type MarkDraft = {
  recitation: number
  understanding: number
  delivery: number
  discipline: number
}

type PublishedMark = MarkDraft & {
  total: number
  publishedAt: string
}

const DEFAULT_MARK_DRAFT: MarkDraft = {
  recitation: 18,
  understanding: 17,
  delivery: 16,
  discipline: 19,
}

const CANDIDATES: VivaCandidate[] = [
  {
    id: "SUP-2301",
    name: "Abdullah Al Mamun",
    role: "SUPPORTER",
    submittedAt: "Today, 09:20",
    examTrack: "Supporter to Worker",
    passageTopic: "Surah Al-Mulk (1-5)",
    passageText:
      "আমি সূরা আল-মুলকের প্রথম পাঁচ আয়াত তেলাওয়াত করেছি এবং প্রতিটি আয়াতের অর্থ সংক্ষেপে লিখেছি। উচ্চারণে ক্বাফ-কাaf পার্থক্য ধরে রাখার চেষ্টা করেছি।",
  },
  {
    id: "WRK-1173",
    name: "Saifur Rahman",
    role: "WORKER",
    submittedAt: "Today, 10:05",
    examTrack: "Worker to Associate",
    passageTopic: "Hadith: Innamal A'malu Binniyat",
    passageText:
      "আমি হাদিসের শব্দার্থ, রাবি পরিচিতি এবং আমলের নিয়ত ভিত্তিক তিনটি বাস্তব উদাহরণ দিয়েছি। প্রয়োগভিত্তিক ব্যাখ্যা যুক্ত করেছি।",
  },
  {
    id: "ASC-4420",
    name: "Mahir Hasan",
    role: "ASSOCIATE",
    submittedAt: "Today, 10:38",
    examTrack: "Associate to Member",
    passageTopic: "Sangothon Nitimala: 5 Dafa",
    passageText:
      "আমি পাঁচ দফার ব্যাখ্যা, দাওয়াতি কাজের বাস্তব রূপরেখা এবং টিম দায়িত্ব বণ্টনের একটি সংক্ষিপ্ত পরিকল্পনা লিখেছি।",
  },
]

function roleTone(role: VivaRole) {
  if (role === "ASSOCIATE") return "text-cyan-300 border-cyan-500/25 bg-cyan-500/12"
  if (role === "WORKER") return "text-amber-300 border-amber-500/25 bg-amber-500/12"
  return "text-emerald-300 border-emerald-500/25 bg-emerald-500/12"
}

function formatRole(role: VivaRole) {
  if (role === "ASSOCIATE") return "Associate"
  if (role === "WORKER") return "Worker"
  return "Supporter"
}

function createInitialMessages() {
  const byRoleText: Record<VivaRole, string> = {
    SUPPORTER: "আসসালামু আলাইকুম স্যার, আমি Supporter → Worker viva এর জন্য প্রস্তুত আছি।",
    WORKER: "স্যার, Worker → Associate viva submission complete করেছি। Review করবেন ইনশাআল্লাহ।",
    ASSOCIATE: "স্যার, Associate → Member viva এর passage ও summary submit করেছি।",
  }

  return CANDIDATES.flatMap<ChatMessage>((candidate, index) => [
    {
      id: `init-c-${candidate.id}`,
      candidateId: candidate.id,
      from: "candidate",
      text: byRoleText[candidate.role],
      createdAt: `10:${12 + index * 2}`,
      type: "text",
    },
    {
      id: `init-a-${candidate.id}`,
      candidateId: candidate.id,
      from: "admin",
      text: "ওয়াআলাইকুম আসসালাম। Passage দেখছি, কিছুক্ষণের মধ্যে viva scheduling message পাবেন।",
      createdAt: `10:${13 + index * 2}`,
      type: "text",
    },
  ])
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  const first = parts[0]?.[0] ?? "A"
  const second = parts[1]?.[0] ?? "M"
  return `${first}${second}`.toUpperCase()
}

export function AdminApproveVivaClient() {
  const [query, setQuery] = useState("")
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(CANDIDATES[0]?.id ?? "")
  const [messages, setMessages] = useState<ChatMessage[]>(() => createInitialMessages())
  const [composerText, setComposerText] = useState("")
  const [markDraftByCandidate, setMarkDraftByCandidate] = useState<Record<string, MarkDraft>>({})
  const [publishedMarks, setPublishedMarks] = useState<Record<string, PublishedMark>>({})
  const chatBoxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatBoxRef.current?.scrollTo({ top: chatBoxRef.current.scrollHeight, behavior: "smooth" })
  }, [selectedCandidateId, messages])

  const filteredCandidates = useMemo(() => {
    const q = query.trim().toLowerCase()

    return CANDIDATES.filter((candidate) => {
      const matchesQuery =
        q.length === 0 ||
        candidate.name.toLowerCase().includes(q) ||
        candidate.id.toLowerCase().includes(q) ||
        candidate.passageTopic.toLowerCase().includes(q)

      return matchesQuery
    })
  }, [query])

  const selectedCandidate = useMemo(
    () => CANDIDATES.find((candidate) => candidate.id === selectedCandidateId) ?? filteredCandidates[0] ?? null,
    [selectedCandidateId, filteredCandidates],
  )

  const candidateMessages = useMemo(
    () => messages.filter((item) => item.candidateId === selectedCandidate?.id),
    [messages, selectedCandidate?.id],
  )

  const unreadCounts = useMemo(() => {
    const result: Record<string, number> = {}

    for (const candidate of CANDIDATES) {
      const scoped = messages.filter((item) => item.candidateId === candidate.id)
      let lastAdminIndex = -1

      for (let i = scoped.length - 1; i >= 0; i -= 1) {
        if (scoped[i]?.from === "admin") {
          lastAdminIndex = i
          break
        }
      }

      result[candidate.id] = scoped.filter((_, i) => i > lastAdminIndex).filter((item) => item.from === "candidate").length
    }

    return result
  }, [messages])

  const currentMarkDraft = useMemo(() => {
    if (!selectedCandidate) return DEFAULT_MARK_DRAFT
    return markDraftByCandidate[selectedCandidate.id] ?? DEFAULT_MARK_DRAFT
  }, [markDraftByCandidate, selectedCandidate])

  const markTotal = useMemo(
    () => currentMarkDraft.recitation + currentMarkDraft.understanding + currentMarkDraft.delivery + currentMarkDraft.discipline,
    [currentMarkDraft],
  )

  const updateMarkField = (field: keyof MarkDraft, value: number) => {
    if (!selectedCandidate) return
    const next = Number.isFinite(value) ? value : 0
    const clamped = Math.max(0, Math.min(25, Math.round(next)))
    setMarkDraftByCandidate((prev) => ({
      ...prev,
      [selectedCandidate.id]: {
        ...(prev[selectedCandidate.id] ?? DEFAULT_MARK_DRAFT),
        [field]: clamped,
      },
    }))
  }

  const publishMark = () => {
    if (!selectedCandidate) return

    setPublishedMarks((prev) => ({
      ...prev,
      [selectedCandidate.id]: {
        ...currentMarkDraft,
        total: markTotal,
        publishedAt: "Now",
      },
    }))

    toast.success(`${selectedCandidate.name} এর mark published হয়েছে`)
  }

  const sendChatFromComposer = () => {
    if (!selectedCandidate) return

    const trimmed = composerText.trim()
    if (!trimmed) return

    const isMeetCommand = trimmed.startsWith("/meet ")
    const maybeLink = isMeetCommand ? trimmed.replace("/meet", "").trim() : ""

    if (isMeetCommand && (maybeLink.length < 8 || (!maybeLink.startsWith("http://") && !maybeLink.startsWith("https://")))) {
      toast.error("Meet link পাঠাতে /meet https://... format ব্যবহার করুন")
      return
    }

    const msg: ChatMessage = {
      id: `m-${Date.now()}`,
      candidateId: selectedCandidate.id,
      from: "admin",
      text: isMeetCommand ? "Viva meet link পাঠানো হয়েছে। নির্ধারিত সময়ে join করুন।" : trimmed,
      meetLink: isMeetCommand ? maybeLink : undefined,
      createdAt: "Now",
      type: isMeetCommand ? "meet" : "text",
    }

    setMessages((prev) => [...prev, msg])
    setComposerText("")

    if (isMeetCommand) {
      toast.success("Meet link sent in chat")
    }
  }

  return (
    <div className="min-h-screen bg-[#050f08] text-emerald-50">
      <section className="relative overflow-hidden border-b border-emerald-500/15 bg-[#071310] px-3 py-5 sm:px-4 md:px-8 md:py-6">
        <div className="pointer-events-none absolute -left-24 bottom-0 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-28 top-0 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold tracking-[1.2px] text-emerald-300 uppercase">
            <ShieldCheckIcon className="h-3.5 w-3.5" />
            Admin Viva Control
          </p>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">Approve Viva</h1>
              <p className="mt-1 text-xs text-emerald-100/70 sm:text-sm">Live conversation with candidates</p>
            </div>

            <div className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-200/85">
              {Object.values(unreadCounts).reduce((sum, count) => sum + count, 0)} unread
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-2 py-4 sm:px-4 sm:py-6 md:px-8">
        <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
          <aside className="rounded-2xl border border-emerald-500/15 bg-[#07130f]/85 p-3 backdrop-blur-md sm:p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-emerald-100">Exam Inbox</h2>
              <span className="rounded-full border border-emerald-500/30 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                {filteredCandidates.length} entries
              </span>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-emerald-300/55" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search candidate"
                  className="h-9 border-emerald-500/20 bg-[#081610] pl-8 text-sm placeholder:text-emerald-200/40"
                />
              </div>
            </div>

            <div className="mt-3 space-y-2 overflow-y-auto pr-1 lg:max-h-160">
              {filteredCandidates.map((candidate) => {
                const isActive = candidate.id === selectedCandidate?.id

                return (
                  <button
                    key={candidate.id}
                    type="button"
                    onClick={() => setSelectedCandidateId(candidate.id)}
                    className={`w-full rounded-xl border px-3 py-2 text-left transition ${
                      isActive
                        ? "border-emerald-400/45 bg-emerald-500/14"
                        : "border-emerald-500/15 bg-[#060f0c] hover:border-emerald-400/30 hover:bg-emerald-500/10"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="grid h-10 w-10 place-items-center rounded-full border border-emerald-500/25 bg-emerald-500/10 text-xs font-bold text-emerald-200">
                        {initials(candidate.name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-semibold text-emerald-100">{candidate.name}</p>
                          {unreadCounts[candidate.id] > 0 && (
                            <span className="rounded-full border border-amber-400/35 bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-200">
                              {unreadCounts[candidate.id]}
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-[11px] text-emerald-200/60">{candidate.id}</p>
                        <div className="mt-1 flex items-center gap-1.5">
                          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${roleTone(candidate.role)}`}>
                            {formatRole(candidate.role)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}

              {filteredCandidates.length === 0 && (
                <div className="rounded-xl border border-emerald-500/15 bg-[#060f0c] px-3 py-5 text-center">
                  <p className="text-xs text-emerald-200/60">No candidate found</p>
                </div>
              )}
            </div>
          </aside>

          <section className="flex min-h-[74vh] flex-col rounded-2xl border border-emerald-500/15 bg-[#07130f]/85 p-2.5 backdrop-blur-md sm:p-3">
            {selectedCandidate ? (
              <>
                <div className="mb-2 flex items-center gap-2 rounded-xl border border-emerald-500/15 bg-[#091712] px-3 py-2.5">
                  <div className="grid h-10 w-10 place-items-center rounded-full border border-emerald-500/25 bg-emerald-500/10 text-xs font-bold text-emerald-200">
                    {initials(selectedCandidate.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-emerald-100">{selectedCandidate.name}</p>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${roleTone(selectedCandidate.role)}`}>
                        {formatRole(selectedCandidate.role)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid flex-1 gap-3 lg:grid-cols-[minmax(0,1fr)_280px]">
                  <div className="flex min-h-[60vh] flex-col rounded-xl border border-emerald-500/15 bg-[#050f0b] p-3">
                    <div
                      ref={chatBoxRef}
                      className="flex-1 space-y-2 overflow-auto pr-1"
                      style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(16,185,129,0.2) transparent" }}
                    >
                      {candidateMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.from === "candidate" ? "justify-start" : "justify-end"}`}
                        >
                          <div className="max-w-[86%]">
                            <div className={`rounded-2xl border px-3 py-2.5 ${
                              msg.from === "candidate"
                                ? "rounded-bl-sm border-white/8 bg-[#0d2018] text-emerald-100"
                                : "rounded-br-sm border-cyan-500/35 bg-cyan-500/12 text-cyan-100"
                            }`}>
                              <p className="text-xs leading-relaxed">{msg.text}</p>
                              {msg.meetLink && (
                                <a
                                  href={msg.meetLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="mt-2 flex items-center gap-2 rounded-lg border border-blue-400/35 bg-blue-500/12 px-2.5 py-2 text-xs font-semibold text-blue-200 hover:bg-blue-500/20"
                                >
                                  <VideoIcon className="h-3.5 w-3.5" />
                                  Join Google Meet
                                  <ArrowRightIcon className="ml-auto h-3.5 w-3.5" />
                                </a>
                              )}
                            </div>
                            <p className={`mt-1 text-[10px] ${msg.from === "candidate" ? "text-white/35" : "text-cyan-200/65"}`}>
                              {msg.from === "admin" ? "Admin" : selectedCandidate.name} · {msg.createdAt}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 border-t border-emerald-500/10 pt-3">
                      <textarea
                        value={composerText}
                        onChange={(event) => setComposerText(event.target.value)}
                        placeholder="Type a message"
                        className="min-h-20 w-full rounded-xl border border-emerald-500/20 bg-[#081610] px-3 py-2 text-sm text-emerald-100 outline-none placeholder:text-emerald-200/40"
                      />

                      <div className="mt-2 flex justify-end">
                        <Button onClick={sendChatFromComposer} className="h-9 bg-emerald-500 px-5 text-emerald-950 hover:bg-emerald-400">
                          Send Message
                        </Button>
                      </div>
                    </div>
                  </div>

                  <aside className="rounded-xl border border-emerald-500/15 bg-[#050f0b] p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-xs font-semibold tracking-wide text-emerald-200">Viva Marking</p>
                      <span className="rounded-md border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-300">
                        Total {markTotal}/100
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      <label className="block text-[11px] text-emerald-200/80">
                        Recitation (0-25)
                        <Input
                          type="number"
                          min={0}
                          max={25}
                          value={currentMarkDraft.recitation}
                          onChange={(event) => updateMarkField("recitation", Number(event.target.value))}
                          className="mt-1 h-8 border-emerald-500/20 bg-[#081610] text-sm"
                        />
                      </label>

                      <label className="block text-[11px] text-emerald-200/80">
                        Understanding (0-25)
                        <Input
                          type="number"
                          min={0}
                          max={25}
                          value={currentMarkDraft.understanding}
                          onChange={(event) => updateMarkField("understanding", Number(event.target.value))}
                          className="mt-1 h-8 border-emerald-500/20 bg-[#081610] text-sm"
                        />
                      </label>

                      <label className="block text-[11px] text-emerald-200/80">
                        Delivery (0-25)
                        <Input
                          type="number"
                          min={0}
                          max={25}
                          value={currentMarkDraft.delivery}
                          onChange={(event) => updateMarkField("delivery", Number(event.target.value))}
                          className="mt-1 h-8 border-emerald-500/20 bg-[#081610] text-sm"
                        />
                      </label>

                      <label className="block text-[11px] text-emerald-200/80">
                        Discipline (0-25)
                        <Input
                          type="number"
                          min={0}
                          max={25}
                          value={currentMarkDraft.discipline}
                          onChange={(event) => updateMarkField("discipline", Number(event.target.value))}
                          className="mt-1 h-8 border-emerald-500/20 bg-[#081610] text-sm"
                        />
                      </label>
                    </div>

                    <Button onClick={publishMark} className="mt-3 h-9 w-full bg-cyan-500 text-cyan-950 hover:bg-cyan-400">
                      Publish Mark
                    </Button>

                    {selectedCandidate && publishedMarks[selectedCandidate.id] && (
                      <div className="mt-3 rounded-lg border border-emerald-500/20 bg-emerald-500/8 px-2.5 py-2">
                        <p className="text-[11px] text-emerald-200/70">Published score</p>
                        <p className="text-sm font-semibold text-emerald-100">
                          {publishedMarks[selectedCandidate.id].total}/100
                        </p>
                      </div>
                    )}
                  </aside>
                </div>
              </>
            ) : (
              <div className="rounded-xl border border-emerald-500/15 bg-[#050f0b] p-8 text-center text-sm text-emerald-200/70">
                Select a candidate to review passage and start chat.
              </div>
            )}
          </section>
        </div>
      </section>
    </div>
  )
}
