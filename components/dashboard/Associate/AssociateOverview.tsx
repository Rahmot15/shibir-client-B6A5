"use client"

import {
  BookOpen,
  CheckCircle2,
  BarChart3,
  Clock,
  Calendar,
  TrendingUp,
  ArrowRight,
  Target,
  GraduationCap,
  ScrollText,
  Clock3,
  Search,
  PlusCircle as PlusIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect, type SVGProps } from "react"
import { format } from "date-fns"
import { bn } from "date-fns/locale"
import { noteService } from "@/lib/noteService"
import Link from "next/link"

export function AssociateOverviewContent() {
  const [noteCount, setNoteCount] = useState(0)
  const today = new Date()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const notes = await noteService.getAllNotes()
        setNoteCount(notes.length)
      } catch (error) {
        console.error("Stats fetch error:", error)
      }
    }
    fetchStats()
  }, [])

  // Mock stats - In a real app, these would come from specialized services
  const stats = [
    { label: "সিলেবাস সম্পন্ন", value: "৬৫%", icon: <BookOpen className="text-blue-400" />, trend: "+৫% এই মাসে" },
    { label: "গড় অধ্যয়ন সময়", value: "৫.৫ ঘণ্টা", icon: <Clock3 className="text-emerald-400" />, trend: "লক্ষ্য: ৮ ঘণ্টা" },
    { label: "জামায়াতে নামাজ", value: "৯৪%", icon: <CheckCircle2 className="text-orange-400" />, trend: "গত ৭ দিন" },
    { label: "মোট নোট", value: noteCount, icon: <ScrollText className="text-purple-400" />, trend: "ব্যক্তিগত ডায়েরি" },
  ]

  const upcomingTasks = [
    { title: "সাথী সিলেবাস পরীক্ষা - ৩", date: "১৫ এপ্রিল", type: "Exam", status: "Upcoming" },
    { title: "মাসিক রিপোর্ট জমা", date: "৩১ মার্চ", type: "Report", status: "Due" },
    { title: "কুরআন দরস প্রস্তুতি", date: "০২ এপ্রিল", type: "Study", status: "In Progress" },
  ]

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#071310]/40 p-6 rounded-[32px] border border-white/5 backdrop-blur-sm">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-50 to-emerald-500/50 bg-clip-text text-transparent">
            আসসালামু আলাইকুম, সাথী ভাই!
          </h1>
          <p className="text-white/40 font-medium">আপনার আজকের অগ্রগতির এক নজরে সারসংক্ষেপ</p>
        </div>
        <div className="flex items-center gap-3 bg-white/5 py-2 px-4 rounded-2xl border border-white/5 self-start md:self-center">
          <Calendar className="text-emerald-500 w-5 h-5" />
          <span className="text-emerald-50 font-bold text-sm">
            {format(today, "EEEE, dd MMMM", { locale: bn })}
          </span>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, idx) => (
          <div key={idx} className="group relative p-6 rounded-[28px] bg-[#071310]/60 border border-white/5 hover:border-emerald-500/20 transition-all duration-300 overflow-hidden">
             {/* Background Glow */}
             <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/5 blur-3xl rounded-full transition-all group-hover:bg-emerald-500/10" />

             <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <div className="text-[10px] bg-white/5 px-2 py-1 rounded-full text-white/30 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                   Details
                </div>
             </div>
             <div className="space-y-1 relative">
                <h3 className="text-2xl font-black text-emerald-50 tracking-tight">{item.value}</h3>
                <p className="text-sm font-bold text-white/40">{item.label}</p>
                <div className="flex items-center gap-1.5 pt-2">
                   <TrendingUp size={12} className="text-emerald-500/80" />
                   <span className="text-[10px] text-emerald-500/60 font-medium">{item.trend}</span>
                </div>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Module Nav Cards */}
        <div className="lg:col-span-2 space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/dashboard/syllabus" className="group p-6 rounded-[32px] bg-gradient-to-br from-[#0c1f1a] to-[#071310] border border-white/5 hover:border-emerald-500/30 transition-all overflow-hidden relative">
                 <div className="relative z-10">
                    <GraduationCap className="w-10 h-10 text-blue-400 mb-4" />
                    <h4 className="text-xl font-bold text-emerald-50 mb-1">সিলেবাস ট্র্যাকার</h4>
                    <p className="text-xs text-white/30 font-medium mb-4">আপনার পাঠ্যসূচির ধাপগুলো অনুসরণ করুন</p>
                    <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
                       অন্বেষণ করুন <ArrowRight size={14} />
                    </div>
                 </div>
                 <BookOpen className="absolute -right-6 -bottom-6 w-32 h-32 text-white/[0.02] transform rotate-12 transition-transform group-hover:rotate-0" />
              </Link>

              <Link href="/dashboard/exam" className="group p-6 rounded-[32px] bg-gradient-to-br from-[#1a160c] to-[#131007] border border-white/5 hover:border-orange-500/30 transition-all overflow-hidden relative">
                 <div className="relative z-10">
                    <Target className="w-10 h-10 text-orange-400 mb-4" />
                    <h4 className="text-xl font-bold text-emerald-50 mb-1">পরীক্ষা ও মূল্যায়ন</h4>
                    <p className="text-xs text-white/30 font-medium mb-4">আপনার বর্তমান প্রস্তুতির পরীক্ষা দিন</p>
                    <div className="flex items-center gap-2 text-orange-500 font-bold text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
                       অংশগ্রহণ করুন <ArrowRight size={14} />
                    </div>
                 </div>
                 <BarChart3 className="absolute -right-6 -bottom-6 w-32 h-32 text-white/[0.02] transform -rotate-12 transition-transform group-hover:rotate-0" />
              </Link>
           </div>

           {/* Quick Actions / Recent Activity Area */}
           <div className="p-8 rounded-[40px] bg-[#071310]/40 border border-white/5">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-xl font-bold text-emerald-50 flex items-center gap-3">
                    <Clock className="text-emerald-500" />
                    চলমান কার্যক্রম
                 </h3>
                 <Button variant="ghost" className="text-white/20 hover:text-emerald-400 text-xs font-bold uppercase tracking-widest">সকল কার্যক্রম</Button>
              </div>
              <div className="space-y-4">
                 {upcomingTasks.map((task, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group">
                       <div className="flex items-center gap-4">
                          <div className={`w-2 h-2 rounded-full ${task.status === 'Due' ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
                          <div>
                             <h5 className="text-sm font-bold text-emerald-50/80 group-hover:text-emerald-50 transition-colors">{task.title}</h5>
                             <p className="text-[10px] text-white/20 uppercase tracking-widest font-mono mt-0.5">{task.type} • {task.date}</p>
                          </div>
                       </div>
                       <div className="text-[10px] text-white/30 font-bold border border-white/10 px-3 py-1 rounded-lg">
                          {task.status}
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Note Sidebar integration highlight */}
        <div className="space-y-6">
           <Link href="/dashboard/note" className="block group p-8 rounded-[40px] bg-gradient-to-b from-blue-500/10 to-transparent border border-blue-500/20 hover:border-blue-500/40 transition-all h-full">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-500/10 text-blue-400 mb-6 group-hover:rotate-6 transition-transform">
                 <ScrollText size={32} />
              </div>
              <h4 className="text-2xl font-black text-emerald-50 mb-3 tracking-tight leading-tight">ব্যক্তিগত ডায়েরি ও নোট খাতা</h4>
              <p className="text-sm leading-relaxed text-white/40 mb-8">
                 আপনার অধ্যয়ন থেকে প্রাপ্ত শিক্ষা এবং প্রতিদিনের উপলব্ধিবোধগুলো গুছিয়ে রাখুন আমাদের আধুনিক নোট এডিটরে।
              </p>
              <div className="bg-blue-500 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-between group-hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all">
                 নোট লিখুন
                 <PlusIcon className="w-5 h-5" />
              </div>
           </Link>
        </div>
      </div>
    </div>
  )
}

function PlusCircle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12h8" />
      <path d="M12 8v8" />
    </svg>
  )
}
