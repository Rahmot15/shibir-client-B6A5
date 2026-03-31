"use client"

import { useEffect, useRef, useState } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { BookOpenCheckIcon, ChevronLeftIcon, ChevronRightIcon, ExternalLinkIcon } from "lucide-react"

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

type AssociateSyllabusViewerProps = {
  pdfUrl: string
}

export default function AssociateSyllabusViewer({ pdfUrl }: AssociateSyllabusViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [numPages, setNumPages] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)
  const [pageWidth, setPageWidth] = useState(760)

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

  const handleLoaded = ({ numPages: totalPages }: { numPages: number }) => {
    setNumPages(totalPages)
    setPageNumber(1)
  }

  const handleClose = () => {
    setIsOpen(false)
    setPageNumber(1)
  }

  const nextPage = () => setPageNumber((prev) => Math.min(prev + 1, numPages))
  const previousPage = () => setPageNumber((prev) => Math.max(prev - 1, 1))

  return (
    <section className="mt-6 rounded-2xl border border-emerald-500/25 bg-linear-to-b from-emerald-500/10 to-black/20 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-emerald-100">সদস্য সহায়িকা</h2>
          <p className="text-sm text-emerald-200/80">বাটনে ক্লিক করে PDF ওপেন করে পড়তে পারবেন।</p>
        </div>

        <div className="flex items-center gap-2">
          {!isOpen ? (
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/25"
            >
              <BookOpenCheckIcon className="h-4 w-4" />
              সদস্য সহায়িকা
            </button>
          ) : (
            <button
              type="button"
              onClick={handleClose}
              className="rounded-xl border border-rose-400/35 bg-rose-500/15 px-4 py-2 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/25"
            >
              Close PDF
            </button>
          )}

          <a
            href={pdfUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-400/35 bg-cyan-500/15 px-3 py-2 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-500/25"
          >
            New Tab
            <ExternalLinkIcon className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {isOpen ? (
        <div ref={containerRef} className="mt-4 rounded-xl border border-white/10 bg-black/30 p-3">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/10 bg-black/35 px-3 py-2">
            <p className="text-xs text-emerald-100/90">
              Page {pageNumber} / {numPages || "..."}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={previousPage}
                disabled={pageNumber <= 1}
                className="inline-flex items-center gap-1 rounded-md border border-white/15 bg-white/5 px-2 py-1 text-xs text-emerald-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeftIcon className="h-3.5 w-3.5" />
                Prev
              </button>

              <button
                type="button"
                onClick={nextPage}
                disabled={numPages === 0 || pageNumber >= numPages}
                className="inline-flex items-center gap-1 rounded-md border border-white/15 bg-white/5 px-2 py-1 text-xs text-emerald-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRightIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="mx-auto w-fit rounded-lg border border-white/15 bg-white/95 p-1">
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
