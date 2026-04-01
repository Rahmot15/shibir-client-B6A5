"use client"

import { useEffect, useRef, useState } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import {
  BadgeCheckIcon,
  BookCheckIcon,
  BookOpenCheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Clock3Icon,
  ExternalLinkIcon,
  FileTextIcon,
  GaugeIcon,
  RotateCcwIcon,
} from "lucide-react"

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

type AssociateSyllabusViewerProps = {
  pdfUrl: string
}

const readTracking = (key: string) => {
  if (typeof window === "undefined") {
    return {
      lastReadPage: 1,
      completedPages: [] as number[],
      totalStudyMinutes: 0,
    }
  }

  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) {
      return {
        lastReadPage: 1,
        completedPages: [] as number[],
        totalStudyMinutes: 0,
      }
    }

    const parsed = JSON.parse(raw) as {
      lastReadPage?: number
      completedPages?: number[]
      totalStudyMinutes?: number
    }

    const lastReadPage =
      typeof parsed.lastReadPage === "number" && parsed.lastReadPage >= 1 ? parsed.lastReadPage : 1

    const completedPages = Array.isArray(parsed.completedPages)
      ? parsed.completedPages
          .filter((page) => typeof page === "number" && Number.isInteger(page) && page >= 1)
          .sort((a, b) => a - b)
      : []

    const totalStudyMinutes =
      typeof parsed.totalStudyMinutes === "number" && parsed.totalStudyMinutes >= 0
        ? Math.round(parsed.totalStudyMinutes)
        : 0

    return {
      lastReadPage,
      completedPages,
      totalStudyMinutes,
    }
  } catch {
    return {
      lastReadPage: 1,
      completedPages: [] as number[],
      totalStudyMinutes: 0,
    }
  }
}

export default function AssociateSyllabusViewer({ pdfUrl }: AssociateSyllabusViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const trackingKey = `associate-syllabus-tracking:${pdfUrl}`
  const initialTracking = readTracking(trackingKey)

  const [isOpen, setIsOpen] = useState(false)
  const [numPages, setNumPages] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)
  const [pageWidth, setPageWidth] = useState(760)
  const [pageInput, setPageInput] = useState("1")
  const [lastReadPage, setLastReadPage] = useState(initialTracking.lastReadPage)
  const [completedPages, setCompletedPages] = useState<number[]>(initialTracking.completedPages)
  const [totalStudyMinutes, setTotalStudyMinutes] = useState(initialTracking.totalStudyMinutes)
  const [sessionStart, setSessionStart] = useState<number | null>(null)
  const [liveSessionMinutes, setLiveSessionMinutes] = useState(0)

  useEffect(() => {
    try {
      window.localStorage.setItem(
        trackingKey,
        JSON.stringify({
          lastReadPage,
          completedPages,
          totalStudyMinutes,
        })
      )
    } catch {
      // Ignore local storage write issues.
    }
  }, [trackingKey, lastReadPage, completedPages, totalStudyMinutes])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const updatePageWidth = () => {
      const containerWidth = containerRef.current?.clientWidth ?? 860
      const nextWidth = Math.min(Math.max(containerWidth - 28, 280), 920)
      setPageWidth(nextWidth)
    }

    updatePageWidth()
    window.addEventListener("resize", updatePageWidth)
    return () => window.removeEventListener("resize", updatePageWidth)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || sessionStart === null) {
      return
    }

    const timer = window.setInterval(() => {
      const elapsedMinutes = Math.max(0, Math.floor((Date.now() - sessionStart) / 60000))
      setLiveSessionMinutes(elapsedMinutes)
    }, 15000)

    return () => window.clearInterval(timer)
  }, [isOpen, sessionStart])

  const applyPageTracking = (targetPage: number) => {
    if (targetPage < 1) return

    setPageNumber(targetPage)
    setPageInput(String(targetPage))
    setLastReadPage(targetPage)

    if (numPages === 0) return

    setCompletedPages((prev) => {
      if (prev.includes(targetPage)) {
        return prev
      }
      return [...prev, targetPage].sort((a, b) => a - b)
    })
  }

  const handleLoaded = ({ numPages: totalPages }: { numPages: number }) => {
    setNumPages(totalPages)
    const restoredPage = Math.min(Math.max(lastReadPage, 1), totalPages)
    applyPageTracking(restoredPage)
  }

  const handleClose = () => {
    if (sessionStart) {
      const elapsedMinutes = Math.max(0, Math.floor((Date.now() - sessionStart) / 60000))
      setTotalStudyMinutes((prev) => prev + elapsedMinutes)
    }

    setIsOpen(false)
    setSessionStart(null)
    setLiveSessionMinutes(0)
    setPageInput(String(pageNumber))
  }

  const nextPage = () => {
    const next = Math.min(pageNumber + 1, numPages)
    applyPageTracking(next)
  }

  const previousPage = () => {
    const next = Math.max(pageNumber - 1, 1)
    applyPageTracking(next)
  }

  const goToPage = () => {
    if (numPages === 0) return

    const parsed = Number(pageInput)
    if (Number.isNaN(parsed)) {
      setPageInput(String(pageNumber))
      return
    }

    const bounded = Math.min(Math.max(parsed, 1), numPages)
    applyPageTracking(bounded)
  }

  const resetTracking = () => {
    setLastReadPage(1)
    setCompletedPages([])
    setTotalStudyMinutes(0)
    setPageNumber(1)
    setPageInput("1")
    try {
      window.localStorage.removeItem(trackingKey)
    } catch {
      // Ignore local storage remove issues.
    }
  }

  const completedCount = numPages > 0 ? completedPages.filter((page) => page <= numPages).length : completedPages.length
  const progressPercent = numPages > 0 ? Math.round((completedCount / numPages) * 100) : 0
  const effectiveStudyMinutes = totalStudyMinutes + (isOpen ? liveSessionMinutes : 0)

  return (
    <section className="relative mt-6 overflow-hidden rounded-3xl border border-emerald-400/35 bg-linear-to-br from-emerald-500/20 via-emerald-950/45 to-black/60 p-3 sm:p-6">
      <div className="pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full bg-emerald-300/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-12 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(167,243,208,0.08),transparent_45%)]" />

      <div className="relative flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-400/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-100/90">
            Study Companion
          </div>

          <div>
            <h2 className="text-xl font-bold text-emerald-50 sm:text-2xl">সদস্য সহায়িকা</h2>
            <p className="mt-1 text-sm text-emerald-100/70">
              supporter dashboard pattern follow করে PDF সহায়িকা পড়ুন, progress track করুন,
              আর last page থেকে instantly resume করুন।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-emerald-100/85">
              <FileTextIcon className="h-3.5 w-3.5" />
              Smart PDF Viewer
            </span>
            <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-emerald-100/85">
              Live Progress Tracking
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          {!isOpen ? (
            <button
              type="button"
              onClick={() => {
                setSessionStart(Date.now())
                setLiveSessionMinutes(0)
                setIsOpen(true)
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-300/35 bg-emerald-400/15 px-4 py-2.5 text-sm font-semibold text-emerald-50 transition hover:-translate-y-0.5 hover:bg-emerald-400/25"
            >
              <BookOpenCheckIcon className="h-4 w-4" />
              PDF Open করুন
            </button>
          ) : (
            <button
              type="button"
              onClick={handleClose}
              className="rounded-xl border border-rose-300/35 bg-rose-500/15 px-4 py-2.5 text-sm font-semibold text-rose-100 transition hover:-translate-y-0.5 hover:bg-rose-500/25"
            >
              Viewer বন্ধ করুন
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              applyPageTracking(lastReadPage)
              setSessionStart(Date.now())
              setLiveSessionMinutes(0)
              setIsOpen(true)
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/5 px-3.5 py-2.5 text-xs font-semibold text-emerald-100 transition hover:-translate-y-0.5 hover:bg-white/10"
          >
            <RotateCcwIcon className="h-3.5 w-3.5" />
            Resume Page {lastReadPage}
          </button>

          <a
            href={pdfUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-300/35 bg-cyan-500/15 px-3.5 py-2.5 text-xs font-semibold text-cyan-100 transition hover:-translate-y-0.5 hover:bg-cyan-500/25"
          >
            New Tab
            <ExternalLinkIcon className="h-3.5 w-3.5" />
          </a>

          <button
            type="button"
            onClick={resetTracking}
            className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300/35 bg-amber-500/12 px-3.5 py-2.5 text-xs font-semibold text-amber-100 transition hover:bg-amber-500/20"
          >
            Reset Tracking
          </button>
        </div>
      </div>

      <div className="relative mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-black/30 p-3">
          <p className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wide text-emerald-200/70">
            <GaugeIcon className="h-3.5 w-3.5" />
            Progress
          </p>
          <p className="mt-1 text-xl font-bold text-emerald-50">{progressPercent}%</p>
          <p className="text-xs text-emerald-100/70">{completedCount} pages completed</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/30 p-3">
          <p className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wide text-emerald-200/70">
            <BookCheckIcon className="h-3.5 w-3.5" />
            Completed
          </p>
          <p className="mt-1 text-xl font-bold text-emerald-50">
            {completedCount}
            <span className="ml-1 text-sm font-medium text-emerald-200/70">/{numPages || "..."}</span>
          </p>
          <p className="text-xs text-emerald-100/70">tracked automatically</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/30 p-3">
          <p className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wide text-emerald-200/70">
            <BadgeCheckIcon className="h-3.5 w-3.5" />
            Last Read
          </p>
          <p className="mt-1 text-xl font-bold text-emerald-50">Page {lastReadPage}</p>
          <p className="text-xs text-emerald-100/70">resume anytime</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/30 p-3">
          <p className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wide text-emerald-200/70">
            <Clock3Icon className="h-3.5 w-3.5" />
            Study Time
          </p>
          <p className="mt-1 text-xl font-bold text-emerald-50">{effectiveStudyMinutes} min</p>
          <p className="text-xs text-emerald-100/70">total tracked time</p>
        </div>
      </div>

      <div className="relative mt-3 overflow-hidden rounded-xl border border-emerald-300/20 bg-black/30 p-3">
        <div className="mb-2 flex items-center justify-between text-xs text-emerald-100/80">
          <p>Reading completion</p>
          <p>{progressPercent}%</p>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-linear-to-r from-emerald-400 to-cyan-300 transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {isOpen ? (
        <div ref={containerRef} className="relative mt-5 rounded-2xl border border-white/10 bg-black/30 p-3 backdrop-blur-sm sm:p-4">
          <div className="mb-3 grid gap-2 rounded-xl border border-white/10 bg-black/45 px-3 py-3 sm:grid-cols-[1fr_auto] sm:items-center">
            <p className="text-xs font-medium text-emerald-100/90">
              Page {pageNumber} / {numPages || "..."}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={previousPage}
                disabled={pageNumber <= 1}
                className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs text-emerald-100 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeftIcon className="h-3.5 w-3.5" />
                Prev
              </button>

              <div className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-2 py-1.5">
                <span className="text-[11px] text-emerald-200/80">Go</span>
                <input
                  type="number"
                  min={1}
                  max={numPages || 1}
                  value={pageInput}
                  onChange={(event) => setPageInput(event.target.value)}
                  onBlur={goToPage}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      goToPage()
                    }
                  }}
                  className="h-6 w-14 rounded-md border border-white/15 bg-black/40 px-2 text-xs text-emerald-50 outline-hidden ring-0 placeholder:text-emerald-200/50 focus:border-emerald-300/45"
                />
              </div>

              <button
                type="button"
                onClick={nextPage}
                disabled={numPages === 0 || pageNumber >= numPages}
                className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs text-emerald-100 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRightIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="mx-auto w-fit rounded-xl border border-white/20 bg-white/95 p-1.5">
              <Document
                file={pdfUrl}
                onLoadSuccess={handleLoaded}
                loading={<p className="p-8 text-center text-xs text-slate-700">PDF loading...</p>}
                error={<p className="p-8 text-center text-xs text-rose-700">PDF load করতে সমস্যা হয়েছে।</p>}
              >
                <Page
                  pageNumber={pageNumber}
                  width={pageWidth}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                />
              </Document>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
