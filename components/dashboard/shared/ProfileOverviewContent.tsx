"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import {
  BadgeCheckIcon, BookOpenIcon,
  FileTextIcon, MailIcon, NotebookPenIcon,
  ShieldIcon, UserRoundIcon, TrendingUpIcon,
  CalendarIcon, ActivityIcon, SparklesIcon,
  ChevronRightIcon, StarIcon, ZapIcon,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getMe, type UserData }                  from "@/lib/authService"
import { noteService, type Note }                from "@/lib/noteService"
import { getMyWorkerReportHistory, type WorkerReportHistoryItem } from "@/lib/workerReportService"

/* ══════════════════════════════════════════
   HELPERS
══════════════════════════════════════════ */
function initials(name: string) {
  return name.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase()
}

function roleLabel(role: string) {
  const map: Record<string, string> = {
    ADMIN: "অ্যাডমিন", ASSOCIATE: "অ্যাসোসিয়েট",
    WORKER: "কর্মী", MEMBER: "সদস্য", SUPPORTER: "সমর্থক",
  }
  return map[role] ?? role
}

function roleMeta(role: string): { color: string; bg: string; border: string; glow: string } {
  const map: Record<string, ReturnType<typeof roleMeta>> = {
    ADMIN:     { color:"#f472b6", bg:"rgba(244,114,182,0.08)", border:"rgba(244,114,182,0.22)", glow:"rgba(244,114,182,0.12)" },
    ASSOCIATE: { color:"#a78bfa", bg:"rgba(167,139,250,0.08)", border:"rgba(167,139,250,0.22)", glow:"rgba(167,139,250,0.12)" },
    WORKER:    { color:"#4ade80", bg:"rgba(74,222,128,0.08)",  border:"rgba(74,222,128,0.22)",  glow:"rgba(74,222,128,0.12)"  },
    MEMBER:    { color:"#60a5fa", bg:"rgba(96,165,250,0.08)",  border:"rgba(96,165,250,0.22)",  glow:"rgba(96,165,250,0.12)"  },
    SUPPORTER: { color:"#fbbf24", bg:"rgba(251,191,36,0.08)",  border:"rgba(251,191,36,0.22)",  glow:"rgba(251,191,36,0.12)"  },
  }
  return map[role] ?? map.MEMBER
}

function quickLinksForRole(role: string) {
  if (role === "ADMIN") return [
    { href:"/dashboard/overview",     label:"Overview",      icon:UserRoundIcon,  color:"#4ade80" },
    { href:"/dashboard/manage-users", label:"ব্যবহারকারী",  icon:ShieldIcon,     color:"#f472b6" },
    { href:"/dashboard/note",         label:"নোটস",          icon:NotebookPenIcon,color:"#a78bfa" },
  ]
  if (role === "SUPPORTER") return [
    { href:"/dashboard/overview", label:"Overview",  icon:UserRoundIcon,  color:"#4ade80" },
    { href:"/dashboard/report",   label:"রিপোর্ট",   icon:FileTextIcon,   color:"#fbbf24" },
    { href:"/dashboard/syllabus", label:"সিলেবাস",   icon:BookOpenIcon,   color:"#60a5fa" },
  ]
  return [
    { href:"/dashboard/overview", label:"Overview", icon:UserRoundIcon,  color:"#4ade80" },
    { href:"/dashboard/note",     label:"নোটস",     icon:NotebookPenIcon,color:"#a78bfa" },
    { href:"/dashboard/syllabus", label:"সিলেবাস",  icon:BookOpenIcon,   color:"#60a5fa" },
  ]
}

/* ══════════════════════════════════════════
   STAT CARD
══════════════════════════════════════════ */
function StatCard({ label, value, icon: Icon, color, loading }: {
  label: string; value: number | string; icon: React.ElementType
  color: string; loading: boolean
}) {
  return (
    <div className="relative flex flex-col gap-3 overflow-hidden rounded-2xl border p-4 transition-all duration-300 hover:scale-[1.02]"
      style={{ borderColor:`${color}22`, background:`${color}07` }}>
      {/* glow blob */}
      <div className="pointer-events-none absolute -right-4 -top-4 h-16 w-16 rounded-full blur-2xl"
        style={{ background:`${color}20` }}/>
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border"
          style={{ borderColor:`${color}30`, background:`${color}15` }}>
          <Icon className="h-4 w-4" style={{ color }} strokeWidth={1.8}/>
        </div>
        <TrendingUpIcon className="h-3.5 w-3.5 opacity-30" style={{ color }} strokeWidth={1.8}/>
      </div>
      <div>
        <p className="font-mono text-[11px] tracking-widest uppercase" style={{ color:`${color}70` }}>{label}</p>
        <p className="mt-0.5 text-[26px] font-bold leading-none" style={{ color }}>
          {loading ? (
            <span className="inline-block h-7 w-8 animate-pulse rounded-md" style={{ background:`${color}15` }}/>
          ) : value}
        </p>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export function ProfileOverviewContent() {
  const [me,            setMe]            = useState<UserData | null>(null)
  const [notes,         setNotes]         = useState<Note[]>([])
  const [reportHistory, setReportHistory] = useState<WorkerReportHistoryItem[]>([])
  const [loading,       setLoading]       = useState(true)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        setLoading(true)
        const meRes = await getMe()
        let noteRows: Note[] = []
        let historyRows: WorkerReportHistoryItem[] = []
        try { noteRows = await noteService.getAllNotes() } catch { noteRows = [] }
        try {
          const r = await getMyWorkerReportHistory()
          historyRows = r.success && r.data ? r.data : []
        } catch { historyRows = [] }
        if (!mounted) return
        setMe(meRes.success && meRes.data ? meRes.data : null)
        setNotes(noteRows)
        setReportHistory(historyRows)
      } finally { if (mounted) setLoading(false) }
    }
    void load()
    return () => { mounted = false }
  }, [])

  const weekNotes = useMemo(() => {
    const ago = Date.now() - 7 * 24 * 60 * 60 * 1000
    return notes.filter(n => new Date(n.createdAt).getTime() >= ago).length
  }, [notes])

  const role      = me?.role ?? "MEMBER"
  const rm        = roleMeta(role)
  const quickLinks= quickLinksForRole(role)

  const joinDate = useMemo(() => {
    if (!me?.createdAt) return null
    return new Date(me.createdAt).toLocaleDateString("bn-BD", { year:"numeric", month:"long" })
  }, [me])

  return (
    <div className="min-h-screen space-y-5 bg-[#050f08] text-emerald-50">

      {/* ══════════════════════════════════════
          HERO — avatar + name + stats
      ══════════════════════════════════════ */}
      <section className="relative overflow-hidden rounded-2xl border border-white/6 bg-[#071310]">
        {/* animated gradient bg */}
        <div className="pointer-events-none absolute inset-0"
          style={{ background:`radial-gradient(ellipse 60% 50% at 15% 50%, ${rm.glow}, transparent)` }}/>
        <div className="pointer-events-none absolute inset-0"
          style={{ background:"radial-gradient(ellipse 50% 80% at 85% 20%, rgba(0,200,83,0.06), transparent)" }}/>

        {/* top accent */}
        <div className="h-0.5 w-full" style={{ background:`linear-gradient(to right, transparent, ${rm.color}55, rgba(0,200,83,0.4), transparent)` }}/>

        <div className="relative p-5 md:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            {/* Left — avatar + info */}
            <div className="flex items-center gap-4 md:gap-5">
              {/* Avatar with ring */}
              <div className="relative shrink-0">
                <div className="absolute -inset-1 rounded-2xl opacity-60 blur-sm"
                  style={{ background:`linear-gradient(135deg,${rm.color},rgba(0,200,83,0.6))` }}/>
                <Avatar className="relative h-16 w-16 rounded-2xl ring-2 md:h-20 md:w-20"
                  style={{ "--tw-ring-color":rm.border } as React.CSSProperties}>
                  <AvatarImage src={me?.image || ""} alt={me?.name || "Profile"}/>
                  <AvatarFallback className="rounded-2xl text-base font-bold"
                    style={{ background:rm.bg, color:rm.color }}>
                    {initials(me?.name || "U")}
                  </AvatarFallback>
                </Avatar>
                {/* Online indicator */}
                <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-[#071310] bg-emerald-400 shadow-[0_0_8px_rgba(74,222,128,0.7)]"/>
              </div>

              <div>
                {/* Role badge */}
                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-[2px] uppercase"
                  style={{ borderColor:rm.border, background:rm.bg, color:rm.color }}>
                  <BadgeCheckIcon className="h-3 w-3" strokeWidth={2.5}/>
                  {roleLabel(role)}
                </div>

                <h1 className="text-[22px] font-bold leading-tight text-emerald-50 md:text-[26px]">
                  {loading ? (
                    <span className="inline-block h-7 w-40 animate-pulse rounded-lg bg-white/5"/>
                  ) : (me?.name || "ব্যবহারকারী")}
                </h1>

                <div className="mt-1.5 flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1.5 text-[12px] text-white/35">
                    <MailIcon className="h-3.5 w-3.5" strokeWidth={1.8}/>
                    <span className="font-mono">{me?.email || "—"}</span>
                  </div>
                  {joinDate && (
                    <div className="flex items-center gap-1.5 text-[12px] text-white/25">
                      <CalendarIcon className="h-3.5 w-3.5" strokeWidth={1.8}/>
                      <span className="font-mono">যোগ: {joinDate}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right — activity indicator */}
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/12 bg-emerald-500/5 px-4 py-2.5">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(74,222,128,0.8)] animate-pulse"/>
              <span className="text-[11px] font-mono text-emerald-400/70">অ্যাকাউন্ট সক্রিয়</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          STATS ROW
      ══════════════════════════════════════ */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="ভূমিকা"       value={roleLabel(role)}       icon={ShieldIcon}     color={rm.color}  loading={loading}/>
        <StatCard label="নোট"           value={notes.length}          icon={NotebookPenIcon} color="#a78bfa"   loading={loading}/>
        <StatCard label="রিপোর্ট"       value={reportHistory.length}  icon={FileTextIcon}   color="#60a5fa"   loading={loading}/>
        <StatCard label="এই সপ্তাহে"   value={weekNotes}             icon={ZapIcon}         color="#fbbf24"   loading={loading}/>
      </div>

      {/* ══════════════════════════════════════
          BOTTOM GRID — account info + quick links
      ══════════════════════════════════════ */}
      <div className="grid gap-4 lg:grid-cols-2">

        {/* Account details */}
        <div className="rounded-2xl border border-white/6 bg-[#071310] overflow-hidden">
          <div className="border-b border-white/5 px-5 py-4">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-[13px] font-semibold text-emerald-50">
                <UserRoundIcon className="h-4 w-4 text-emerald-400/70" strokeWidth={1.8}/>
                অ্যাকাউন্ট তথ্য
              </h2>
              <span className="flex items-center gap-1 rounded-full border border-emerald-500/18 bg-emerald-500/7 px-2.5 py-0.5 text-[9px] font-mono text-emerald-400/60 uppercase tracking-widest">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"/>
                Active
              </span>
            </div>
          </div>

          <div className="p-5 space-y-2.5">
            {[
              { label:"ইমেইল",       value: me?.email || "—",     icon: MailIcon,        color:"#60a5fa" },
              { label:"ভূমিকা",      value: roleLabel(role),        icon: ShieldIcon,      color: rm.color },
              { label:"অ্যাকাউন্ট", value: "সক্রিয়",              icon: ActivityIcon,    color:"#4ade80" },
              { label:"যোগদান",      value: joinDate || "—",        icon: CalendarIcon,    color:"#fbbf24" },
            ].map(row => (
              <div key={row.label} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/2 px-3.5 py-2.5 transition-colors hover:border-white/10 hover:bg-white/3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border"
                  style={{ borderColor:`${row.color}25`, background:`${row.color}10` }}>
                  <row.icon className="h-3.5 w-3.5" style={{ color:row.color }} strokeWidth={1.8}/>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-[9px] tracking-widest uppercase text-white/25">{row.label}</p>
                  <p className="truncate text-[13px] text-white/70 font-medium">{row.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick access */}
        <div className="rounded-2xl border border-white/6 bg-[#071310] overflow-hidden">
          <div className="border-b border-white/5 px-5 py-4">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-[13px] font-semibold text-emerald-50">
                <SparklesIcon className="h-4 w-4 text-amber-400/70" strokeWidth={1.8}/>
                দ্রুত যোগাযোগ
              </h2>
            </div>
          </div>

          <div className="p-5 space-y-2.5">
            {quickLinks.map(item => (
              <Link key={item.href} href={item.href}
                className="group flex items-center gap-3 rounded-xl border border-white/5 bg-white/2 px-3.5 py-3 transition-all duration-200 hover:border-white/10 hover:bg-white/4 hover:shadow-[0_0_20px_rgba(0,0,0,0.3)]">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-all group-hover:scale-105"
                  style={{ borderColor:`${item.color}28`, background:`${item.color}10` }}>
                  <item.icon className="h-4 w-4 transition-colors" style={{ color:item.color }} strokeWidth={1.8}/>
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-semibold text-white/65 transition-colors group-hover:text-white/90">
                    {item.label}
                  </p>
                </div>
                <ChevronRightIcon className="h-4 w-4 text-white/15 transition-all group-hover:translate-x-0.5 group-hover:text-white/40" strokeWidth={2}/>
              </Link>
            ))}

            {/* decorative bottom card */}
            <div className="mt-4 rounded-xl border border-emerald-500/10 bg-linear-to-br from-emerald-500/5 to-transparent p-4 text-center">
              <StarIcon className="mx-auto mb-2 h-5 w-5 text-amber-400/50" strokeWidth={1.6}/>
              <p className="text-[11px] text-white/25 leading-relaxed">
                আপনার অ্যাকাউন্ট সম্পর্কিত যেকোনো সাহায্যের জন্য<br/>
                <span className="text-emerald-400/50">support@shibir.org.bd</span>-এ যোগাযোগ করুন
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
