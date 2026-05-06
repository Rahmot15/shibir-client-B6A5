"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useMemo } from "react"
import {
  Search, X, ChevronLeft, ChevronRight,
  Star, Package, Download, Sparkles,
} from "lucide-react"
import {
  KISORKONTHO_ISSUES,
  CURRENCY_SYMBOL,
  type KisorkonthoIssue,
} from "./data"

const PER_PAGE = 10

/* ── Stars ── */
function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-[9px] w-[9px] ${
            i <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-transparent text-white/15"
          }`}
          strokeWidth={i <= Math.round(rating) ? 0 : 1.5}
        />
      ))}
    </div>
  )
}

/* ── Card ── */
function IssueCard({ issue }: { issue: KisorkonthoIssue }) {
  const hasDiscount = issue.discount > 0
  const lowStock    = issue.isAvailable && issue.stock > 0 && issue.stock <= 10

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[14px] border border-white/[0.055] bg-[#071310] transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-500/20 hover:shadow-[0_12px_36px_rgba(0,200,83,0.1)]">

      {/* Cover */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#0a1a10]">
        <Image
          src={issue.coverImage}
          alt={issue.title}
          fill
          sizes="(max-width:640px) 50vw,(max-width:1024px) 33vw,20vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050f08]/88 via-[#050f08]/20 to-transparent" />

        {/* Top badges */}
        <div className="absolute left-2 top-2 flex items-start gap-1.5">
          <span className="rounded-md border border-white/10 bg-[#050f08]/70 px-1.5 py-0.5 font-mono text-[8px] tracking-wide text-white/50 backdrop-blur-sm">
            {issue.month} {issue.year}
          </span>
          {hasDiscount && (
            <span className="rounded-md border border-amber-400/30 bg-amber-500/15 px-1.5 py-0.5 font-mono text-[8px] font-bold text-amber-300">
              {issue.discount}%
            </span>
          )}
        </div>

        {/* Unavailable */}
        {!issue.isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#050f08]/70 backdrop-blur-[2px]">
            <span className="rounded-lg border border-red-500/30 bg-red-500/15 px-3 py-1.5 text-[10px] font-bold text-red-300">
              স্টক শেষ
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2 p-3">

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <Stars rating={issue.rating.average} />
          <span className="font-mono text-[9px] text-amber-400">{issue.rating.average}</span>
          <span className="font-mono text-[8px] text-white/18">({issue.rating.count})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1.5">
          <span className="font-mono text-[9px] text-emerald-400/70">{CURRENCY_SYMBOL[issue.currency]}</span>
          <span className="font-mono text-[17px] font-bold leading-none text-emerald-300">
            {issue.finalPrice}
          </span>
          {hasDiscount && (
            <span className="font-mono text-[10px] text-white/22 line-through">
              {issue.price}
            </span>
          )}
        </div>

        {/* Type pills */}
        <div className="flex flex-wrap gap-1">
          {issue.purchaseType.includes("physical") && (
            <span className="flex items-center gap-0.5 rounded-[5px] border border-emerald-500/18 bg-emerald-500/7 px-1.5 py-0.5 font-mono text-[8px] text-emerald-400">
              <Package className="h-2 w-2" /> ফিজিক্যাল
            </span>
          )}
          {issue.purchaseType.includes("digital") && (
            <span className="flex items-center gap-0.5 rounded-[5px] border border-blue-500/18 bg-blue-500/7 px-1.5 py-0.5 font-mono text-[8px] text-blue-400">
              <Download className="h-2 w-2" /> ডিজিটাল
            </span>
          )}
        </div>

        {/* Stock status */}
        {issue.isAvailable && lowStock && (
          <p className="font-mono text-[8px] text-orange-400">মাত্র {issue.stock}টি বাকি</p>
        )}

        {/* Actions */}
        <div className="mt-auto flex gap-1.5 pt-1">
          <Link
            href={`/kisorkontho/${issue.slug}`}
            className="flex flex-1 items-center justify-center rounded-[8px] border border-white/7 bg-white/[0.03] py-[6px] text-[10px] text-white/40 transition-all hover:border-white/14 hover:text-white/65"
          >
            বিস্তারিত
          </Link>
          <Link
            href={`/kisorkontho/${issue.slug}?action=buy`}
            aria-disabled={!issue.isAvailable}
            className={`flex flex-1 items-center justify-center rounded-[8px] border py-[6px] text-[10px] font-bold transition-all ${
              issue.isAvailable
                ? "border-emerald-500/28 bg-emerald-500/8 text-emerald-400 hover:border-emerald-500/45 hover:bg-emerald-500/14"
                : "pointer-events-none border-white/5 bg-white/[0.02] text-white/15"
            }`}
          >
            অর্ডার
          </Link>
        </div>
      </div>
    </article>
  )
}

/* ── Pagination button ── */
function PageBtn({
  children, active, disabled, onClick,
}: {
  children: React.ReactNode
  active?: boolean
  disabled?: boolean
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex h-8 w-8 items-center justify-center rounded-[8px] border font-mono text-[11px] transition-all ${
        active
          ? "border-emerald-500/38 bg-emerald-500/10 text-emerald-400"
          : disabled
          ? "cursor-not-allowed border-white/4 text-white/15"
          : "border-white/6 bg-white/[0.02] text-white/30 hover:border-white/12 hover:text-white/55"
      }`}
    >
      {children}
    </button>
  )
}

/* ── Main page ── */
export default function KisorkonthoPage() {
  const [search,     setSearch]     = useState("")
  const [yearFilter, setYearFilter] = useState<number | "all">("all")
  const [typeFilter, setTypeFilter] = useState<"all" | "physical" | "digital">("all")
  const years = [...new Set(KISORKONTHO_ISSUES.map((i) => i.year))].sort((a, b) => b - a)

  // Initialize page to 1
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    return KISORKONTHO_ISSUES.filter((issue) => {
      if (
        search &&
        !issue.title.toLowerCase().includes(search.toLowerCase()) &&
        !issue.month.toLowerCase().includes(search.toLowerCase())
      ) return false
      if (yearFilter !== "all" && issue.year !== yearFilter) return false
      if (typeFilter !== "all" && !issue.purchaseType.includes(typeFilter)) return false
      return true
    })
  }, [search, yearFilter, typeFilter])

  // Simple state reset logic when filters change
  const currentSearch = search + yearFilter + typeFilter
  const [prevSearch, setPrevSearch] = useState(currentSearch)

  if (prevSearch !== currentSearch) {
    setPrevSearch(currentSearch)
    setPage(1)
  }

  const startIdx = (page - 1) * PER_PAGE
  const endIdx   = startIdx + PER_PAGE
  const paginated = filtered.slice(startIdx, endIdx)

  const totalPages = Math.ceil(filtered.length / PER_PAGE)

  const avgRating    = (KISORKONTHO_ISSUES.reduce((s, i) => s + i.rating.average, 0) / KISORKONTHO_ISSUES.length).toFixed(1)
  const discountCount = KISORKONTHO_ISSUES.filter((i) => i.discount > 0).length

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#060d09] pb-20 pt-20">

      {/* Grid texture */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.012) 1px,transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse at center,black 30%,transparent 80%)",
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(0,200,83,0.06),transparent)]" />

      <div className="relative mx-auto w-full max-w-[1300px] px-4 sm:px-6">

        {/* ── Header ── */}
        <header className="mb-7 flex flex-col gap-5 border-b border-white/[0.055] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-emerald-500/50" strokeWidth={1.8} />
              <span className="font-mono text-[9px] uppercase tracking-[3px] text-emerald-500/50">
                আর্কাইভ ও সংগ্রহ
              </span>
            </div>
            <h1 className="text-[24px] font-bold leading-tight tracking-tight text-emerald-50 sm:text-[28px]">
              মাসিক কিশোরকণ্ঠ
            </h1>
            <p className="mt-1 font-mono text-[10px] text-white/25">
              বাংলাদেশ ইসলামী ছাত্রশিবির প্রকাশিত
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-5">
            {[
              { val: KISORKONTHO_ISSUES.length + " টি", lbl: "সংখ্যা" },
              { val: avgRating, lbl: "গড় রেটিং" },
              { val: discountCount + " টি", lbl: "ছাড়যুক্ত" },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-5">
                {i > 0 && <div className="h-7 w-px bg-white/[0.07]" />}
                <div className="text-center">
                  <p className="font-mono text-[18px] font-bold leading-none text-emerald-300">{s.val}</p>
                  <p className="mt-1 font-mono text-[8px] uppercase tracking-[1.5px] text-white/22">{s.lbl}</p>
                </div>
              </div>
            ))}
          </div>
        </header>

        {/* ── Toolbar ── */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/20" strokeWidth={2} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="সংখ্যা খুঁজুন..."
              className="h-9 w-52 rounded-[10px] border border-white/6 bg-[#071310] pl-9 pr-8 font-sans text-[12px] text-emerald-50 placeholder-white/18 outline-none transition-all focus:border-emerald-500/28"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/22 hover:text-white/50">
                <X className="h-3 w-3" strokeWidth={2.5} />
              </button>
            )}
          </div>

          {/* Divider */}
          <div className="h-5 w-px bg-white/[0.06]" />

          {/* Year filter */}
          <div className="flex items-center gap-1.5">
            {(["all", ...years] as const).map((y) => (
              <button
                key={y}
                onClick={() => setYearFilter(y)}
                className={`h-9 rounded-[9px] border px-3 font-mono text-[10px] transition-all ${
                  yearFilter === y
                    ? "border-emerald-500/32 bg-emerald-500/8 text-emerald-400"
                    : "border-white/5 bg-white/[0.02] text-white/28 hover:border-white/10 hover:text-white/50"
                }`}
              >
                {y === "all" ? "সব" : y}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="h-5 w-px bg-white/[0.06]" />

          {/* Type filter */}
          <div className="flex items-center gap-1.5">
            {([["all","সব"],["physical","ফিজিক্যাল"],["digital","ডিজিটাল"]] as const).map(([k, l]) => (
              <button
                key={k}
                onClick={() => setTypeFilter(k)}
                className={`h-9 rounded-[9px] border px-3 font-mono text-[10px] transition-all ${
                  typeFilter === k
                    ? "border-emerald-500/32 bg-emerald-500/8 text-emerald-400"
                    : "border-white/5 bg-white/[0.02] text-white/28 hover:border-white/10 hover:text-white/50"
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Result count */}
          <span className="ml-auto font-mono text-[10px] text-white/20">
            {filtered.length} টি পাওয়া গেছে
          </span>

          {/* Clear */}
          {(search || yearFilter !== "all" || typeFilter !== "all") && (
            <button
              onClick={() => { setSearch(""); setYearFilter("all"); setTypeFilter("all") }}
              className="flex items-center gap-1 font-mono text-[10px] text-emerald-500/45 transition-colors hover:text-emerald-400"
            >
              <X className="h-2.5 w-2.5" strokeWidth={2.5} />
              ফিল্টার সরান
            </button>
          )}
        </div>

        {/* ── Grid ── */}
        {paginated.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {paginated.map((issue, idx) => (
              <IssueCard key={`${issue.id}-${idx}`} issue={issue} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/6 py-20 text-center">
            <Search className="h-10 w-10 text-white/8" strokeWidth={1} />
            <p className="text-[13px] text-white/22">কোনো সংখ্যা পাওয়া যায়নি</p>
          </div>
        )}

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-1.5">
            <PageBtn disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2} />
            </PageBtn>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <PageBtn key={p} active={p === page} onClick={() => setPage(p)}>
                {p}
              </PageBtn>
            ))}

            <span className="px-2 font-mono text-[9px] text-white/18">/ {totalPages} পাতা</span>

            <PageBtn disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
              <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} />
            </PageBtn>
          </div>
        )}
      </div>
    </main>
  )
}
