"use client"

import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"
import {
  BadgeCheckIcon, BookOpenIcon, FileTextIcon, MailIcon,
  NotebookPenIcon, ShieldIcon, UserRoundIcon,
  CalendarIcon, ActivityIcon, ChevronRightIcon,
  PencilIcon, KeyRoundIcon, CheckIcon, XIcon,
  EyeIcon, EyeOffIcon, CameraIcon, Loader2Icon, ZapIcon,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getMe, type UserData }                  from "@/lib/authService"
import { noteService, type Note }                from "@/lib/noteService"
import { getMyWorkerReportHistory, type WorkerReportHistoryItem } from "@/lib/workerReportService"

/* ─────────── helpers ─────────── */
function initials(name: string) {
  return name.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase()
}
function roleLabel(role: string) {
  const m: Record<string,string> = { ADMIN:"অ্যাডমিন", ASSOCIATE:"অ্যাসোসিয়েট", WORKER:"কর্মী", MEMBER:"সদস্য", SUPPORTER:"সমর্থক" }
  return m[role] ?? role
}
function roleMeta(role: string) {
  const m: Record<string,{color:string;dim:string}> = {
    ADMIN:     { color:"#f472b6", dim:"rgba(244,114,182,0.15)" },
    ASSOCIATE: { color:"#a78bfa", dim:"rgba(167,139,250,0.15)" },
    WORKER:    { color:"#34d399", dim:"rgba(52,211,153,0.15)"  },
    MEMBER:    { color:"#60a5fa", dim:"rgba(96,165,250,0.15)"  },
    SUPPORTER: { color:"#fbbf24", dim:"rgba(251,191,36,0.15)"  },
  }
  return m[role] ?? m.MEMBER
}
function quickLinksForRole(role: string) {
  if (role === "ADMIN") return [
    { href:"/dashboard/overview",     label:"Overview",      icon:UserRoundIcon,   color:"#34d399" },
    { href:"/dashboard/manage-users", label:"ব্যবহারকারী",  icon:ShieldIcon,      color:"#f472b6" },
    { href:"/dashboard/note",         label:"নোটস",          icon:NotebookPenIcon, color:"#a78bfa" },
  ]
  if (role === "SUPPORTER") return [
    { href:"/dashboard/overview", label:"Overview", icon:UserRoundIcon,  color:"#34d399" },
    { href:"/dashboard/report",   label:"রিপোর্ট",  icon:FileTextIcon,   color:"#fbbf24" },
    { href:"/dashboard/syllabus", label:"সিলেবাস",  icon:BookOpenIcon,   color:"#60a5fa" },
  ]
  return [
    { href:"/dashboard/overview", label:"Overview", icon:UserRoundIcon,  color:"#34d399" },
    { href:"/dashboard/note",     label:"নোটস",     icon:NotebookPenIcon,color:"#a78bfa" },
    { href:"/dashboard/syllabus", label:"সিলেবাস",  icon:BookOpenIcon,   color:"#60a5fa" },
  ]
}

/* ─────────── tiny helpers ─────────── */
const Skeleton = ({ w, h = "h-3.5" }: { w: string; h?: string }) => (
  <div className={`${h} ${w} animate-pulse rounded-md bg-white/[0.06]`} />
)

function PwField({ label, val, set, show, toggle, accent }: {
  label:string; val:string; set:(v:string)=>void; show:boolean; toggle:()=>void; accent:string
}) {
  return (
    <div className="group">
      <p className="mb-1 text-[10px] text-white/30 tracking-wider">{label}</p>
      <div className="relative">
        <input type={show ? "text" : "password"} value={val} onChange={e=>set(e.target.value)}
          placeholder="••••••••"
          className="w-full rounded-lg border border-white/[0.07] bg-white/[0.04] px-3 py-2 text-[13px] text-white/70 outline-none pr-9 transition-colors placeholder:text-white/15"
          style={{ caretColor: accent }}
          onFocus={e=>e.currentTarget.style.borderColor=`${accent}50`}
          onBlur={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.07)"}
        />
        <button onClick={toggle} tabIndex={-1}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors">
          {show ? <EyeOffIcon size={13} strokeWidth={2}/> : <EyeIcon size={13} strokeWidth={2}/>}
        </button>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   MAIN
───────────────────────────────────────── */
export function ProfileOverviewContent() {
  const [me,            setMe]            = useState<UserData|null>(null)
  const [notes,         setNotes]         = useState<Note[]>([])
  const [reportHistory, setReportHistory] = useState<WorkerReportHistoryItem[]>([])
  const [pageLoading,   setPageLoading]   = useState(true)

  /* ── inline name edit ── */
  const [editingName, setEditingName] = useState(false)
  const [nameVal,     setNameVal]     = useState("")
  const [nameBusy,    setNameBusy]    = useState(false)
  const nameRef = useRef<HTMLInputElement>(null)

  /* ── image ── */
  const [imgPreview, setImgPreview] = useState<string|null>(null)
  const [imgBusy,    setImgBusy]    = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  /* ── password ── */
  const [oldPw,       setOldPw]       = useState("")
  const [newPw,       setNewPw]       = useState("")
  const [confirmPw,   setConfirmPw]   = useState("")
  const [showOld,     setShowOld]     = useState(false)
  const [showNew,     setShowNew]     = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [pwBusy,      setPwBusy]      = useState(false)
  const [pwMsg,       setPwMsg]       = useState<{type:"ok"|"err";text:string}|null>(null)

  useEffect(()=>{
    let ok = true
    ;(async()=>{
      setPageLoading(true)
      const meRes = await getMe()
      let nr: Note[] = []; let hr: WorkerReportHistoryItem[] = []
      try { nr = await noteService.getAllNotes() } catch {}
      try { const r = await getMyWorkerReportHistory(); hr = r.success && r.data ? r.data : [] } catch {}
      if (!ok) return
      const user = meRes.success && meRes.data ? meRes.data : null
      setMe(user); setNotes(nr); setReportHistory(hr)
      setNameVal(user?.name || "")
      setPageLoading(false)
    })()
    return ()=>{ ok=false }
  },[])

  const weekNotes = useMemo(()=>{
    const ago = new Date()
    ago.setDate(ago.getDate() - 7)
    const cutoff = ago.getTime()
    return notes.filter(n=>new Date(n.createdAt).getTime()>=cutoff).length
  },[notes])

  const role       = me?.role ?? "MEMBER"
  const rm         = roleMeta(role)
  const quickLinks = quickLinksForRole(role)
  const joinDate   = useMemo(()=>
    me?.createdAt ? new Date(me.createdAt).toLocaleDateString("bn-BD",{year:"numeric",month:"long"}) : null
  ,[me])

  const avatarSrc = imgPreview || me?.image || ""

  /* handlers */
  const startEditName = ()=>{ setEditingName(true); setTimeout(()=>nameRef.current?.focus(),50) }
  const cancelEditName = ()=>{ setEditingName(false); setNameVal(me?.name||"") }
  const saveName = async()=>{
    if (!nameVal.trim()) return
    setNameBusy(true)
    await new Promise(r=>setTimeout(r,900)) // TODO: real API
    setNameBusy(false); setEditingName(false)
  }

  const onImagePick = (e:React.ChangeEvent<HTMLInputElement>)=>{
    const f=e.target.files?.[0]; if(!f) return
    const fr=new FileReader(); fr.onload=ev=>setImgPreview(ev.target?.result as string); fr.readAsDataURL(f)
  }
  const saveImage = async()=>{
    setImgBusy(true)
    await new Promise(r=>setTimeout(r,1100)) // TODO: real API
    setImgBusy(false)
  }

  const savePw = async()=>{
    setPwMsg(null)
    if (!oldPw||!newPw||!confirmPw) { setPwMsg({type:"err",text:"সব ঘর পূরণ করুন।"}); return }
    if (newPw!==confirmPw)          { setPwMsg({type:"err",text:"পাসওয়ার্ড মিলছে না।"}); return }
    if (newPw.length<6)             { setPwMsg({type:"err",text:"কমপক্ষে ৬ অক্ষর দিন।"}); return }
    setPwBusy(true)
    await new Promise(r=>setTimeout(r,1200)) // TODO: real API
    setPwBusy(false); setOldPw(""); setNewPw(""); setConfirmPw("")
    setPwMsg({type:"ok",text:"পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে।"})
    setTimeout(()=>setPwMsg(null),3000)
  }

  const pwStr = !newPw ? 0 : newPw.length<4 ? 1 : newPw.length<7 ? 2 : newPw.length<10 ? 3 : 4

  return (
    <div className="min-h-screen bg-[#060e09] text-white/80" style={{ fontFamily:"'DM Sans',sans-serif" }}>

      {/* top rule */}
      <div className="h-px w-full" style={{ background:`linear-gradient(to right,transparent,${rm.color}40,transparent)` }}/>

      <div className="mx-auto max-w-4xl space-y-px p-4 sm:p-6">

        {/* ══════════════════════════════════════
            PROFILE HEADER — asymmetric layout
        ══════════════════════════════════════ */}
        <div className="relative overflow-hidden rounded-2xl" style={{ background:"#0b1510" }}>
          {/* background wash */}
          <div className="pointer-events-none absolute inset-0"
            style={{ background:`radial-gradient(ellipse 55% 70% at 0% 0%,${rm.color}0d,transparent)` }}/>

          <div className="relative flex flex-col sm:flex-row sm:items-start gap-0">

            {/* ── Avatar column ── */}
            <div className="relative flex flex-col items-center gap-3 p-6 sm:w-48 sm:border-r sm:border-white/[0.05]">
              {/* avatar + camera overlay */}
              <div className="group relative cursor-pointer" onClick={()=>fileRef.current?.click()}>
                <div className="relative h-[88px] w-[88px] rounded-2xl overflow-hidden"
                  style={{ boxShadow:`0 0 0 2px ${rm.color}35, 0 8px 32px rgba(0,0,0,0.5)` }}>
                  <Avatar className="h-full w-full rounded-none">
                    <AvatarImage src={avatarSrc} className="object-cover"/>
                    <AvatarFallback className="rounded-none text-lg font-semibold" style={{ background:rm.dim, color:rm.color }}>
                      {initials(me?.name||"U")}
                    </AvatarFallback>
                  </Avatar>
                  {/* hover overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ background:"rgba(0,0,0,0.65)" }}>
                    {imgBusy
                      ? <Loader2Icon size={18} className="animate-spin text-white/70"/>
                      : <><CameraIcon size={16} className="text-white/80" strokeWidth={1.8}/><span className="text-[9px] text-white/60 tracking-wide">পরিবর্তন</span></>}
                  </div>
                </div>
                {/* online dot */}
                <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                  style={{ borderColor:"#0b1510" }}/>
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onImagePick}/>

              {imgPreview && (
                <div className="flex gap-2">
                  <button onClick={saveImage} disabled={imgBusy}
                    className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-[10px] font-medium transition-colors"
                    style={{ background:`${rm.color}18`, color:rm.color }}>
                    {imgBusy ? <Loader2Icon size={10} className="animate-spin"/> : <CheckIcon size={10} strokeWidth={2.5}/>}
                    সংরক্ষণ
                  </button>
                  <button onClick={()=>{setImgPreview(null); if(fileRef.current) fileRef.current.value=""}}
                    className="flex items-center gap-1 rounded-lg bg-white/[0.05] px-2.5 py-1 text-[10px] text-white/40 hover:text-white/70 transition-colors">
                    <XIcon size={10} strokeWidth={2.5}/>বাতিল
                  </button>
                </div>
              )}

              {/* role chip */}
              <div className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium"
                style={{ background:rm.dim, color:rm.color }}>
                <BadgeCheckIcon size={11} strokeWidth={2.5}/>{roleLabel(role)}
              </div>
            </div>

            {/* ── Info column ── */}
            <div className="flex flex-1 flex-col justify-between gap-4 p-6">

              {/* name row */}
              <div>
                {editingName ? (
                  <div className="flex items-center gap-2">
                    <input ref={nameRef} value={nameVal} onChange={e=>setNameVal(e.target.value)}
                      onKeyDown={e=>{ if(e.key==="Enter") saveName(); if(e.key==="Escape") cancelEditName() }}
                      className="flex-1 rounded-lg border bg-white/[0.05] px-3 py-1.5 text-[18px] font-semibold text-white outline-none"
                      style={{ borderColor:`${rm.color}40`, caretColor:rm.color }}/>
                    <button onClick={saveName} disabled={nameBusy}
                      className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
                      style={{ background:`${rm.color}18`, color:rm.color }}>
                      {nameBusy ? <Loader2Icon size={13} className="animate-spin"/> : <CheckIcon size={13} strokeWidth={2.5}/>}
                    </button>
                    <button onClick={cancelEditName}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.05] text-white/40 hover:text-white/70 transition-colors">
                      <XIcon size={13} strokeWidth={2.5}/>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {pageLoading
                      ? <Skeleton w="w-40" h="h-6"/>
                      : <h1 className="text-[20px] font-semibold text-white leading-none">{me?.name||"ব্যবহারকারী"}</h1>}
                    <button onClick={startEditName}
                      className="rounded-md p-1 text-white/25 transition-all hover:bg-white/[0.07] hover:text-white/60">
                      <PencilIcon size={13} strokeWidth={2}/>
                    </button>
                  </div>
                )}

                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="flex items-center gap-1.5 text-[12px] text-white/35">
                    <MailIcon size={12} strokeWidth={1.8}/>{me?.email||"—"}
                  </span>
                  {joinDate && (
                    <span className="flex items-center gap-1.5 text-[12px] text-white/25">
                      <CalendarIcon size={12} strokeWidth={1.8}/>যোগ: {joinDate}
                    </span>
                  )}
                </div>
              </div>

              {/* stats row — simple numbers, no cards */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/[0.05] pt-4">
                {[
                  { label:"নোট", val:notes.length,         color:"#a78bfa" },
                  { label:"রিপোর্ট", val:reportHistory.length, color:"#60a5fa" },
                  { label:"এই সপ্তাহ", val:weekNotes,          color:"#fbbf24" },
                  { label:"স্ট্যাটাস",  val:"সক্রিয়",           color:"#34d399" },
                ].map(s=>(
                  <div key={s.label} className="flex flex-col gap-0.5">
                    {pageLoading
                      ? <Skeleton w="w-6"/>
                      : <span className="text-[20px] font-bold leading-none" style={{ color:s.color }}>{s.val}</span>}
                    <span className="text-[10px] text-white/25 tracking-wide">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════
            BODY — two columns on md+
        ══════════════════════════════════════ */}
        <div className="grid gap-px md:grid-cols-[1fr_320px]">

          {/* LEFT — quick links */}
          <div className="rounded-bl-2xl bg-[#0b1510] p-6">
            <p className="mb-4 text-[10px] tracking-[2.5px] text-white/25 uppercase">দ্রুত যোগাযোগ</p>
            <div className="space-y-1.5">
              {quickLinks.map(item=>(
                <Link key={item.href} href={item.href}
                  className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 hover:bg-white/[0.04]">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105"
                    style={{ background:`${item.color}14` }}>
                    <item.icon size={15} style={{ color:item.color }} strokeWidth={1.8}/>
                  </div>
                  <span className="flex-1 text-[13px] text-white/50 transition-colors group-hover:text-white/80">{item.label}</span>
                  <ChevronRightIcon size={13} className="text-white/15 transition-all group-hover:translate-x-0.5 group-hover:text-white/35" strokeWidth={2}/>
                </Link>
              ))}
            </div>

            {/* account meta — clean list, no cards */}
            <div className="mt-6 border-t border-white/[0.05] pt-5 space-y-3">
              <p className="text-[10px] tracking-[2.5px] text-white/25 uppercase">তথ্য</p>
              {[
                { icon:ShieldIcon,   label:"ভূমিকা",      val:roleLabel(role), color:rm.color },
                { icon:ActivityIcon, label:"স্ট্যাটাস",    val:"সক্রিয়",        color:"#34d399" },
                { icon:CalendarIcon, label:"যোগদান",      val:joinDate||"—",   color:"#fbbf24" },
                { icon:ZapIcon,      label:"এই সপ্তাহ",   val:`${weekNotes} নোট`, color:"#60a5fa" },
              ].map(r=>(
                <div key={r.label} className="flex items-center gap-2.5">
                  <r.icon size={13} style={{ color:r.color }} strokeWidth={1.8} className="shrink-0 opacity-70"/>
                  <span className="text-[12px] text-white/30 w-16 shrink-0">{r.label}</span>
                  <span className="text-[12px] text-white/55">{pageLoading ? "—" : r.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — password change */}
          <div className="rounded-br-2xl bg-[#0b1510] p-6 md:border-l md:border-white/[0.04]">
            <div className="flex items-center gap-2 mb-5">
              <KeyRoundIcon size={14} className="text-white/30" strokeWidth={1.8}/>
              <p className="text-[10px] tracking-[2.5px] text-white/25 uppercase">পাসওয়ার্ড পরিবর্তন</p>
            </div>

            <div className="space-y-3">
              <PwField label="পুরানো পাসওয়ার্ড" val={oldPw} set={setOldPw}
                show={showOld} toggle={()=>setShowOld(v=>!v)} accent={rm.color}/>
              <PwField label="নতুন পাসওয়ার্ড" val={newPw} set={setNewPw}
                show={showNew} toggle={()=>setShowNew(v=>!v)} accent={rm.color}/>

              {/* strength */}
              {newPw && (
                <div className="space-y-1.5">
                  <div className="flex gap-1">
                    {[1,2,3,4].map(i=>{
                      const c = pwStr>=i ? (pwStr<=1?"#f87171":pwStr<=2?"#fbbf24":pwStr<=3?"#60a5fa":"#34d399") : "rgba(255,255,255,0.06)"
                      return <div key={i} className="h-[3px] flex-1 rounded-full transition-all duration-300" style={{ background:c }}/>
                    })}
                  </div>
                  <p className="text-[10px]" style={{ color: pwStr<=1?"#f87171":pwStr<=2?"#fbbf24":pwStr<=3?"#60a5fa":"#34d399" }}>
                    {["","দুর্বল","মাঝারি","ভালো","শক্তিশালী"][pwStr]}
                  </p>
                </div>
              )}

              <PwField label="পাসওয়ার্ড নিশ্চিত করুন" val={confirmPw} set={setConfirmPw}
                show={showConfirm} toggle={()=>setShowConfirm(v=>!v)} accent={rm.color}/>
            </div>

            {/* feedback */}
            {pwMsg && (
              <div className={`mt-3 flex items-center gap-2 rounded-lg px-3 py-2 text-[11px] ${pwMsg.type==="ok" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                {pwMsg.type==="ok" ? <CheckIcon size={12} strokeWidth={2.5}/> : <XIcon size={12} strokeWidth={2.5}/>}
                {pwMsg.text}
              </div>
            )}

            <button onClick={savePw} disabled={pwBusy}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-[12.5px] font-medium transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-40"
              style={{ background:`${rm.color}18`, color:rm.color, border:`1px solid ${rm.color}25` }}>
              {pwBusy ? <Loader2Icon size={13} className="animate-spin"/> : <KeyRoundIcon size={13} strokeWidth={2}/>}
              পাসওয়ার্ড পরিবর্তন করুন
            </button>

            {/* security note */}
            <p className="mt-4 text-[10px] leading-relaxed text-white/18">
              পাসওয়ার্ড পরিবর্তনের পর আপনাকে পুনরায় লগইন করতে হতে পারে। নিরাপদ পাসওয়ার্ড ব্যবহার করুন।
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
