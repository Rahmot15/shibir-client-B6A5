"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
	ActivityIcon,
	ArrowRightIcon,
	BookMarkedIcon,
	BookOpenIcon,
	CalendarClockIcon,
	CheckCircleIcon,
	ChevronRightIcon,
	ClipboardListIcon,
	FileTextIcon,
	FlameIcon,
	NotebookPenIcon,
	SparklesIcon,
	TargetIcon,
	UsersIcon,
} from "lucide-react"
import { getMe, type UserData } from "@/lib/authService"
import { noteService, type Note } from "@/lib/noteService"
import {
	getMyWorkerReportById,
	getMyWorkerReportHistory,
	type WorkerReportDetails,
	type WorkerReportHistoryItem,
} from "@/lib/workerReportService"

const WORKER_PRIORITIES = [
	"দাওয়াতি যোগাযোগ বৃদ্ধি",
	"হালাকা উপস্থিতি শতভাগে উন্নীত করা",
	"সাপ্তাহিক স্টাডি রিভিশন চালু রাখা",
	"ইসলামী আদর্শভিত্তিক চরিত্র গঠন",
]

const NOTICE_BOARD = [
	{ id: 1, text: "এই সপ্তাহের কর্মী বৈঠক শুক্রবার মাগরিবের পরে।", time: "আপডেটেড" },
	{ id: 2, text: "রিপোর্ট জমা দিন /reports পেইজ থেকে।", time: "আপডেটেড" },
	{ id: 3, text: "পরীক্ষা মডিউলে MCQ ও ভাইভা চ্যাট প্রস্তুত আছে।", time: "আপডেটেড" },
]

const DAILY_ACTIONS = [
	{ label: "ফজর জামাতে অংশগ্রহণ", done: true },
	{ label: "কমপক্ষে ১০ পৃষ্ঠা কুরআন তিলাওয়াত", done: true },
	{ label: "হালাকার একজন নতুন ভাইয়ের সাথে যোগাযোগ", done: false },
	{ label: "রাতের আগে রিপোর্ট ড্রাফট সম্পন্ন", done: false },
]

const SYLLABUS_STRUCTURE = {
	quranTopics: 20,
	quranMemorize: 6,
	hadithBooks: 4,
	books: 30,
	coreSubjects: 8,
	specialDays: 6,
}

function PillStat({ label, value }: { label: string; value: string }) {
	return (
		<div className="rounded-xl border border-emerald-500/20 bg-emerald-500/8 px-3 py-2">
			<div className="font-mono text-[16px] font-bold text-emerald-300">{value}</div>
			<div className="text-[11px] text-emerald-100/65">{label}</div>
		</div>
	)
}

function numFrom(value: string | number) {
	const n = Number(value)
	return Number.isFinite(n) ? n : 0
}

function averageMetric(report: WorkerReportDetails | null, metric: string) {
	if (!report) return null
	const values = report.numericEntries.filter((m) => m.metric === metric).map((m) => numFrom(m.value))
	if (values.length === 0) return null
	const avg = values.reduce((sum, cur) => sum + cur, 0) / values.length
	return avg
}

function countChecked(report: WorkerReportDetails | null, metric: string) {
	if (!report) return 0
	return report.checkboxEntries.filter((m) => m.metric === metric && m.checked).length
}

function isOnTime(monthIso: string, submittedAtIso: string) {
	const monthDate = new Date(monthIso)
	const submitted = new Date(submittedAtIso)
	if (Number.isNaN(monthDate.getTime()) || Number.isNaN(submitted.getTime())) return false
	const due = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0, 23, 59, 59, 999)
	return submitted.getTime() <= due.getTime()
}

function toBnDate(value: string) {
	const d = new Date(value)
	if (Number.isNaN(d.getTime())) return "-"
	return d.toLocaleDateString("bn-BD", {
		year: "numeric",
		month: "long",
		day: "numeric",
	})
}

function toRelativeBn(value: string) {
	const d = new Date(value)
	if (Number.isNaN(d.getTime())) return "সময় অজানা"
	const diffMs = Date.now() - d.getTime()
	const diffMin = Math.floor(diffMs / (1000 * 60))
	if (diffMin < 60) return `${diffMin} মিনিট আগে`
	const diffHour = Math.floor(diffMin / 60)
	if (diffHour < 24) return `${diffHour} ঘণ্টা আগে`
	const diffDay = Math.floor(diffHour / 24)
	if (diffDay === 1) return "গতকাল"
	return `${diffDay} দিন আগে`
}

function extractText(content: unknown): string {
	if (!content || typeof content !== "object") return ""
	const node = content as { text?: string; content?: unknown[] }
	let out = typeof node.text === "string" ? node.text : ""
	if (Array.isArray(node.content)) {
		for (const child of node.content) {
			out += ` ${extractText(child)}`
		}
	}
	return out.trim()
}

function notePreview(note: Note) {
	const text = extractText(note.content)
	if (!text) return "কোনো কন্টেন্ট নেই"
	return text.length > 95 ? `${text.slice(0, 95)}...` : text
}

export default function WorkerOverview() {
	const [me, setMe] = useState<UserData | null>(null)
	const [notes, setNotes] = useState<Note[]>([])
	const [history, setHistory] = useState<WorkerReportHistoryItem[]>([])
	const [latestReport, setLatestReport] = useState<WorkerReportDetails | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		let mounted = true

		const load = async () => {
			setLoading(true)
			try {
				const [meRes, reportHistory] = await Promise.all([
					getMe(),
					getMyWorkerReportHistory(),
				])

				let fetchedNotes: Note[] = []
				try {
					fetchedNotes = await noteService.getAllNotes()
				} catch {
					fetchedNotes = []
				}

				let latest: WorkerReportDetails | null = null
				const reportRows = reportHistory.success && reportHistory.data ? reportHistory.data : []
				if (reportRows.length > 0) {
					const detail = await getMyWorkerReportById(reportRows[0].id)
					if (detail.success && detail.data) {
						latest = detail.data
					}
				}

				if (!mounted) return
				setMe(meRes.success && meRes.data ? meRes.data : null)
				setNotes(fetchedNotes)
				setHistory(reportRows)
				setLatestReport(latest)
			} finally {
				if (mounted) setLoading(false)
			}
		}

		load()
		return () => {
			mounted = false
		}
	}, [])

	const totalSyllabusUnits =
		SYLLABUS_STRUCTURE.quranTopics +
		SYLLABUS_STRUCTURE.quranMemorize +
		SYLLABUS_STRUCTURE.hadithBooks +
		SYLLABUS_STRUCTURE.books +
		SYLLABUS_STRUCTURE.coreSubjects +
		SYLLABUS_STRUCTURE.specialDays

	const reportSubmitted = history.length
	const onTimeRate = useMemo(() => {
		if (history.length === 0) return "0%"
		const onTime = history.filter((h) => isOnTime(h.month, h.submittedAt)).length
		return `${Math.round((onTime / history.length) * 100)}%`
	}, [history])

	const avgQuran = averageMetric(latestReport, "QURAN_AYAH")
	const avgHadith = averageMetric(latestReport, "HADITH_COUNT")
	const classDays = countChecked(latestReport, "CLASS")
	const studyDays = (latestReport?.numericEntries ?? []).filter(
		(m) => m.metric === "TEXTBOOK_HOURS" && numFrom(m.value) > 0,
	).length

	const weeklyAdded = notes.filter((note) => {
		const created = new Date(note.createdAt).getTime()
		return Number.isFinite(created) && created >= Date.now() - 7 * 24 * 60 * 60 * 1000
	}).length

	const recentNotes = [...notes]
		.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
		.slice(0, 3)

	const tasksDone = DAILY_ACTIONS.filter((item) => item.done).length
	const taskPct = Math.round((tasksDone / DAILY_ACTIONS.length) * 100)

	const quickLinks = [
		{
			href: "/reports",
			label: "রিপোর্ট",
			desc: loading ? "লোড হচ্ছে..." : `${reportSubmitted} টি সাবমিটেড`,
			icon: FileTextIcon,
			color: "blue",
		},
		{
			href: "/dashboard/note",
			label: "নোট",
			desc: loading ? "লোড হচ্ছে..." : `${notes.length} টি মোট নোট`,
			icon: BookMarkedIcon,
			color: "purple",
		},
		{
			href: "/dashboard/syllabus",
			label: "সিলেবাস",
			desc: `${totalSyllabusUnits} ইউনিট কাঠামো`,
			icon: BookOpenIcon,
			color: "emerald",
		},
		{
			href: "/dashboard/exam",
			label: "পরীক্ষা",
			desc: "MCQ + ভাইভা মডিউল",
			icon: ClipboardListIcon,
			color: "amber",
		},
	]

	return (
		<div className="min-h-screen bg-[#050f08] text-emerald-50">
			<div className="relative overflow-hidden border-b border-emerald-500/15 bg-[#071310] px-5 py-7 md:px-8">
				<div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
				<div className="pointer-events-none absolute -left-20 -bottom-24 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />

				<div className="relative mx-auto max-w-6xl">
					<div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
						<div>
							<p className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold tracking-[1.4px] text-emerald-300 uppercase">
								<SparklesIcon className="h-3.5 w-3.5" />
								Worker Command Center
							</p>
							<h1 className="text-[26px] font-extrabold tracking-tight text-emerald-50 md:text-[31px]">
								{me?.name || "কর্মী"} Overview
							</h1>
							<p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-white/45 md:text-sm">
								ইসলামী সমাজ বিনির্মাণের লক্ষ্যে দৈনিক আমল, সিলেবাস, রিপোর্ট এবং নোটের বাস্তব ডেটা এক জায়গায়।
							</p>

							<div className="mt-4 flex flex-wrap items-center gap-2">
								<span className="rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 font-mono text-[10px] text-amber-300">
									রোল: {me?.role || "WORKER"}
								</span>
								<span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[10px] text-white/40">
									সর্বশেষ রিপোর্ট: {history[0] ? toBnDate(history[0].submittedAt) : "এখনও জমা হয়নি"}
								</span>
								<span className="rounded-full border border-emerald-500/20 bg-emerald-500/8 px-3 py-1 font-mono text-[10px] text-emerald-300">
									আজকের কাজ: {tasksDone}/{DAILY_ACTIONS.length}
								</span>
							</div>
						</div>

						<div className="grid w-full max-w-sm grid-cols-2 gap-3">
							<PillStat label="সিলেবাস ইউনিট" value={`${totalSyllabusUnits}`} />
							<PillStat label="রিপোর্ট অন-টাইম" value={loading ? "..." : onTimeRate} />
							<PillStat label="মোট নোট" value={loading ? "..." : `${notes.length}`} />
							<PillStat label="চলতি মাসে ক্লাস দিন" value={loading ? "..." : `${classDays}`} />
						</div>
					</div>
				</div>
			</div>

			<div className="mx-auto max-w-6xl px-4 py-5 md:px-8">
				<div className="grid gap-4 lg:grid-cols-[1fr_320px]">
					<div className="space-y-4">
						<div className="grid grid-cols-2 gap-3 md:grid-cols-4">
							{quickLinks.map((item) => {
								const colors: Record<string, { card: string; icon: string; badge: string }> = {
									emerald: {
										card: "border-emerald-500/16 hover:border-emerald-500/30 hover:bg-emerald-500/6",
										icon: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
										badge: "text-emerald-300/70",
									},
									blue: {
										card: "border-blue-500/16 hover:border-blue-500/30 hover:bg-blue-500/6",
										icon: "border-blue-500/25 bg-blue-500/10 text-blue-300",
										badge: "text-blue-300/70",
									},
									amber: {
										card: "border-amber-500/16 hover:border-amber-500/30 hover:bg-amber-500/6",
										icon: "border-amber-500/25 bg-amber-500/10 text-amber-300",
										badge: "text-amber-300/70",
									},
									purple: {
										card: "border-purple-500/16 hover:border-purple-500/30 hover:bg-purple-500/6",
										icon: "border-purple-500/25 bg-purple-500/10 text-purple-300",
										badge: "text-purple-300/70",
									},
								}

								const tone = colors[item.color]
								return (
									<Link
										key={item.href}
										href={item.href}
										className={`group rounded-2xl border bg-[#071310] p-4 transition-all duration-200 ${tone.card}`}
									>
										<div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl border ${tone.icon}`}>
											<item.icon className="h-4 w-4" strokeWidth={1.8} />
										</div>
										<div className="text-[13px] font-semibold text-white/75 group-hover:text-white/95">{item.label}</div>
										<div className={`font-mono text-[10px] ${tone.badge}`}>{item.desc}</div>
										<ArrowRightIcon className="mt-3 h-3.5 w-3.5 text-white/20 transition-colors group-hover:text-white/40" />
									</Link>
								)
							})}
						</div>

						<div className="overflow-hidden rounded-2xl border border-blue-500/15 bg-[#071310]">
							<div className="h-0.5 bg-linear-to-r from-transparent via-blue-500/60 to-transparent" />
							<div className="p-5">
								<div className="mb-4 flex items-center justify-between">
									<div className="flex items-center gap-2">
										<ActivityIcon className="h-4 w-4 text-blue-300" strokeWidth={1.8} />
										<span className="text-[13px] font-semibold text-emerald-50">রিপোর্ট সারসংক্ষেপ</span>
									</div>
									<Link href="/reports" className="flex items-center gap-1 font-mono text-[10px] text-blue-300/75 hover:text-blue-300">
										বিস্তারিত <ChevronRightIcon className="h-3 w-3" />
									</Link>
								</div>

								<div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
									<PillStat label="সাবমিটেড" value={loading ? "..." : `${reportSubmitted}`} />
									<PillStat label="অন-টাইম" value={loading ? "..." : onTimeRate} />
									<PillStat label="কুরআন গড়" value={loading ? "..." : avgQuran ? avgQuran.toFixed(1) : "-"} />
									<PillStat label="হাদিস গড়" value={loading ? "..." : avgHadith ? avgHadith.toFixed(1) : "-"} />
									<PillStat label="ক্লাস দিন" value={loading ? "..." : `${classDays}`} />
								</div>

								<div className="mt-3 flex items-center gap-2 rounded-xl border border-white/8 bg-white/3 px-3 py-2.5">
									<CalendarClockIcon className="h-3.5 w-3.5 text-amber-300" strokeWidth={1.8} />
									<span className="text-[11px] text-white/45">
										সর্বশেষ সাবমিশন: {history[0] ? toBnDate(history[0].submittedAt) : "এখনও জমা হয়নি"}
									</span>
								</div>
							</div>
						</div>

						<div className="grid gap-4 xl:grid-cols-2">
							<div className="overflow-hidden rounded-2xl border border-emerald-500/14 bg-[#071310]">
								<div className="h-0.5 bg-linear-to-r from-transparent via-emerald-500/70 to-transparent" />
								<div className="p-5">
									<div className="mb-4 flex items-center justify-between">
										<div className="flex items-center gap-2">
											<BookOpenIcon className="h-4 w-4 text-emerald-300" strokeWidth={1.8} />
											<span className="text-[13px] font-semibold text-emerald-50">সিলেবাস Overview</span>
										</div>
										<Link href="/dashboard/syllabus" className="flex items-center gap-1 font-mono text-[10px] text-emerald-300/70 hover:text-emerald-300">
											খুলুন <ChevronRightIcon className="h-3 w-3" />
										</Link>
									</div>

									<div className="mb-3 rounded-xl border border-white/8 bg-white/4 p-3">
										<div className="mb-2 flex items-center justify-between text-[11px] text-white/50">
											<span>চলতি মাসে অধ্যয়ন দিন</span>
											<span className="font-mono text-emerald-300">{loading ? "..." : `${studyDays}/30`}</span>
										</div>
										<div className="h-1.5 overflow-hidden rounded-full bg-white/8">
											<div
												className="h-full rounded-full bg-linear-to-r from-emerald-400 to-cyan-400"
												style={{ width: `${Math.min(100, Math.round((studyDays / 30) * 100))}%` }}
											/>
										</div>
									</div>

									<div className="grid grid-cols-2 gap-2">
										<PillStat label="মোট ইউনিট" value={`${totalSyllabusUnits}`} />
										<PillStat label="টপিক ক্যাটাগরি" value="৬" />
									</div>

									<div className="mt-3 rounded-xl border border-emerald-500/20 bg-emerald-500/8 px-3 py-2 text-[11px] text-emerald-100/80">
										চলতি ফোকাস: কুরআন, হাদিস, পাঠ্যবই এবং মূল বিষয়সমূহ নিয়মিত রিভিশন
									</div>
								</div>
							</div>

							<div className="overflow-hidden rounded-2xl border border-amber-500/16 bg-[#0f1008]">
								<div className="h-0.5 bg-linear-to-r from-transparent via-amber-500/70 to-transparent" />
								<div className="p-5">
									<div className="mb-4 flex items-center justify-between">
										<div className="flex items-center gap-2">
											<ClipboardListIcon className="h-4 w-4 text-amber-300" strokeWidth={1.8} />
											<span className="text-[13px] font-semibold text-amber-100">পরীক্ষা Overview</span>
										</div>
										<Link href="/dashboard/exam" className="flex items-center gap-1 font-mono text-[10px] text-amber-300/70 hover:text-amber-300">
											প্রস্তুতি <ChevronRightIcon className="h-3 w-3" />
										</Link>
									</div>

									<div className="space-y-2.5">
										<div className="rounded-xl border border-emerald-500/20 bg-emerald-500/8 px-3 py-2.5">
											<div className="flex items-center justify-between text-[12px] text-emerald-100/85">
												<span>MCQ পরীক্ষা</span>
												<span className="font-mono text-emerald-300">সক্রিয়</span>
											</div>
										</div>

										<div className="rounded-xl border border-white/8 bg-white/4 px-3 py-2.5 text-[12px] text-white/55">
											ভাইভা অবস্থা: চ্যাট ও Meet ধাপ উপলব্ধ
										</div>
										<div className="rounded-xl border border-white/8 bg-white/4 px-3 py-2.5 text-[12px] text-white/55">
											ব্যক্তিগত ফলাফল: এখনো আলাদা exam API-তে সংরক্ষিত নয়
										</div>
										<div className="rounded-xl border border-white/8 bg-white/4 px-3 py-2.5 text-[12px] text-white/55">
											টিপস: পরীক্ষা শেষ করলে স্ক্রিনশট/নোটে ফলাফল সংরক্ষণ করুন
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="overflow-hidden rounded-2xl border border-purple-500/14 bg-[#0e0a14]">
							<div className="h-0.5 bg-linear-to-r from-transparent via-purple-500/65 to-transparent" />
							<div className="p-5">
								<div className="mb-4 flex items-center justify-between">
									<div className="flex items-center gap-2">
										<NotebookPenIcon className="h-4 w-4 text-purple-300" strokeWidth={1.8} />
										<span className="text-[13px] font-semibold text-purple-100">নোট Overview</span>
									</div>
									<Link href="/dashboard/note" className="font-mono text-[10px] text-purple-300/70 hover:text-purple-200">
										সব নোট
									</Link>
								</div>

								<div className="mb-3 grid gap-2 sm:grid-cols-3">
									<PillStat label="মোট নোট" value={loading ? "..." : `${notes.length}`} />
									<PillStat label="এই সপ্তাহে" value={loading ? "..." : `+${weeklyAdded}`} />
									<PillStat label="লাস্ট আপডেট" value={recentNotes[0] ? toRelativeBn(recentNotes[0].updatedAt) : "-"} />
								</div>

								<div className="space-y-2.5">
									{recentNotes.length === 0 && !loading ? (
										<div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-[12px] text-white/50">
											এখনও কোনো নোট পাওয়া যায়নি।
										</div>
									) : null}

									{recentNotes.map((note) => (
										<div key={note.id} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
											<div className="flex items-center justify-between gap-2">
												<p className="truncate text-[12px] font-semibold text-white/80">{note.title}</p>
												<span className="font-mono text-[9px] text-white/35">{toRelativeBn(note.updatedAt)}</span>
											</div>
											<p className="mt-1 text-[11px] leading-relaxed text-white/45">{notePreview(note)}</p>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>

					<div className="space-y-4">
						<div className="overflow-hidden rounded-2xl border border-emerald-500/14 bg-[#071310]">
							<div className="h-0.5 bg-linear-to-r from-transparent via-emerald-500/60 to-transparent" />
							<div className="p-5">
								<div className="mb-3 flex items-center gap-2">
									<TargetIcon className="h-4 w-4 text-emerald-300" strokeWidth={1.8} />
									<span className="text-[12px] font-semibold text-emerald-100">আজকের কর্মপরিকল্পনা</span>
								</div>

								<div className="mb-3 rounded-xl border border-emerald-500/20 bg-emerald-500/8 px-3 py-2.5">
									<div className="font-mono text-[18px] font-bold text-emerald-300">{taskPct}%</div>
									<div className="text-[11px] text-emerald-100/60">দৈনিক সম্পন্নতা</div>
								</div>

								<div className="space-y-2">
									{DAILY_ACTIONS.map((task) => (
										<div
											key={task.label}
											className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 ${
												task.done ? "border-emerald-500/20 bg-emerald-500/8" : "border-white/8 bg-white/3"
											}`}
										>
											<CheckCircleIcon className={`h-4 w-4 shrink-0 ${task.done ? "text-emerald-300" : "text-white/20"}`} strokeWidth={2} />
											<span className={`text-[11px] ${task.done ? "text-emerald-100/85" : "text-white/45"}`}>{task.label}</span>
										</div>
									))}
								</div>
							</div>
						</div>

						<div className="overflow-hidden rounded-2xl border border-cyan-500/14 bg-[#071310]">
							<div className="h-0.5 bg-linear-to-r from-transparent via-cyan-500/60 to-transparent" />
							<div className="p-5">
								<div className="mb-3 flex items-center gap-2">
									<UsersIcon className="h-4 w-4 text-cyan-300" strokeWidth={1.8} />
									<span className="text-[12px] font-semibold text-cyan-100">শিবির ফোকাস (Research Summary)</span>
								</div>
								<p className="mb-3 text-[11px] leading-relaxed text-white/50">
									সংগঠনভিত্তিক সিলেবাস ও কর্মী দায়িত্বের সাধারণ ফোকাস অনুযায়ী এই অগ্রাধিকারগুলো রাখা হয়েছে।
								</p>
								<div className="space-y-2">
									{WORKER_PRIORITIES.map((point) => (
										<div key={point} className="flex items-start gap-2 rounded-xl border border-white/8 bg-white/3 px-3 py-2">
											<FlameIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-300" strokeWidth={1.8} />
											<span className="text-[11px] text-white/55">{point}</span>
										</div>
									))}
								</div>
							</div>
						</div>

						<div className="overflow-hidden rounded-2xl border border-white/8 bg-[#071310]">
							<div className="flex items-center gap-2 border-b border-white/6 px-4 py-3">
								<FileTextIcon className="h-3.5 w-3.5 text-amber-300/80" strokeWidth={1.8} />
								<span className="text-[12px] font-semibold text-white/60">নোটিশ বোর্ড</span>
							</div>
							<div className="divide-y divide-white/6">
								{NOTICE_BOARD.map((notice) => (
									<div key={notice.id} className="px-4 py-3">
										<p className="text-[11px] leading-relaxed text-white/55">{notice.text}</p>
										<p className="mt-1 font-mono text-[9px] text-white/25">{notice.time}</p>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
