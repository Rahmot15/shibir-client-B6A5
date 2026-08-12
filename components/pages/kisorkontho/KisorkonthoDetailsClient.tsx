"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link  from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/AuthContext"
import {
  ArrowLeftIcon, ShoppingCartIcon, CreditCardIcon,
  PlusIcon, MinusIcon, StarIcon, PackageIcon, DownloadIcon,
  CheckCircleIcon, EyeIcon, BookOpenIcon, UserIcon, TagIcon,
  TrendingUpIcon, WalletIcon, ClockIcon, ShareIcon,
  ChevronDownIcon, ChevronUpIcon, ExternalLinkIcon, SparklesIcon,
  Loader2Icon, PencilIcon, Trash2Icon, XIcon, CheckIcon, FlagIcon,
} from "lucide-react"
import { toast } from "sonner"
import {
  type KisorkonthoIssue, paymentLabel,
  contentLabel, contentColor, trackDownload,
  updateReview, deleteReview, reportReview,
} from "./data"
import { addToCart as apiAddToCart } from "@/lib/cartOrderService"

/* ── Stars ── */
function Stars({ rating, size=14 }: { rating:number; size?:number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i=>(
        <StarIcon key={i} style={{ width:size, height:size }}
          className={i<=Math.round(rating)?"text-amber-400 fill-amber-400":"text-white/12"}
          strokeWidth={1.5}/>
      ))}
    </div>
  )
}

/* ══════════════════════════════════════════
   MAIN
══════════════════════════════════════════ */
export default function KisorkonthoDetailsClient({
  issue, related,
}: {
  issue: KisorkonthoIssue
  related: KisorkonthoIssue[]
}) {
  const router = useRouter()
  const { user } = useAuth()
  const [qty,       setQty]       = useState(1)
  const [inCart,    setInCart]    = useState(false)
  const [cartLoading, setCartLoading] = useState(false)
  const [buyLoading, setBuyLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"contents"|"reviews"|"info">("contents")
  const [showPdf,   setShowPdf]   = useState(false)

  /* ── review edit/delete state ── */
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null)
  const [editRating, setEditRating] = useState(0)
  const [editComment, setEditComment] = useState("")
  const [reviewLoading, setReviewLoading] = useState<string | null>(null)

  /* ── write review state ── */
  const [newRating, setNewRating] = useState(0)
  const [newComment, setNewComment] = useState("")
  const [submittingReview, setSubmittingReview] = useState(false)

  /* ── report state ── */
  const [reportingId, setReportingId] = useState<string | null>(null)
  const [reportReason, setReportReason] = useState("")

  const total = useMemo(()=>Number(issue.finalPrice)*qty,[issue.finalPrice,qty])

  /* ── add to cart ── */
  async function addToCart() {
    if (!issue.isAvailable) { toast.error("স্টক শেষ"); return }
    setCartLoading(true)
    try {
      await apiAddToCart(issue.id, qty)
      setInCart(true)
      toast.success("কার্টে যোগ হয়েছে!", { description:`${issue.title} × ${qty}` })
    } catch (e: any) {
      toast.error(e.message || "কার্টে যোগ করা যায়নি")
    } finally {
      setCartLoading(false)
    }
  }

  /* ── buy now ── */
  async function buyNow() {
    if (!issue.isAvailable) { toast.error("স্টক শেষ"); return }
    setBuyLoading(true)
    try {
      await apiAddToCart(issue.id, qty)
      router.push("/checkout")
    } catch (e: any) {
      toast.error(e.message || "কিছু ভুল হয়েছে")
    } finally {
      setBuyLoading(false)
    }
  }

  /* ── share ── */
  async function share() {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title: issue.title, url })
        return
      } catch {}
    }
    await navigator.clipboard.writeText(url)
    toast.success("লিংক কপি হয়েছে")
  }

  /* ── review edit ── */
  function startEditReview(review: any) {
    setEditingReviewId(review.id)
    setEditRating(review.rating)
    setEditComment(review.comment)
  }

  async function saveEditReview(reviewId: string) {
    setReviewLoading(reviewId)
    try {
      await updateReview(issue.id, reviewId, { rating: editRating, comment: editComment })
      toast.success("রিভিউ আপডেট হয়েছে")
      setEditingReviewId(null)
      router.refresh()
    } catch (e: any) {
      toast.error(e.message || "আপডেট করা যায়নি")
    } finally {
      setReviewLoading(null)
    }
  }

  async function handleDeleteReview(reviewId: string) {
    if (!confirm("আপনি কি নিশ্চিত এই রিভিউ মুছে ফেলতে চান?")) return
    setReviewLoading(reviewId)
    try {
      await deleteReview(issue.id, reviewId)
      toast.success("রিভিউ মুছে ফেলা হয়েছে")
      router.refresh()
    } catch (e: any) {
      toast.error(e.message || "মুছে ফেলা যায়নি")
    } finally {
      setReviewLoading(null)
    }
  }

  /* ── write review ── */
  async function submitReview() {
    if (!newRating) { toast.error("Rating দিন"); return }
    if (!newComment.trim()) { toast.error("Comment লিখুন"); return }
    setSubmittingReview(true)
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"}/api/v1/kishorkontho/${issue.id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ rating: newRating, comment: newComment }),
      }).then(async r => { const d = await r.json(); if (!d.success) throw new Error(d.message) })
      toast.success("Review submitted!")
      setNewRating(0); setNewComment("")
      router.refresh()
    } catch (e: any) {
      toast.error(e.message || "Failed to submit")
    } finally {
      setSubmittingReview(false)
    }
  }

  /* ── report review ── */
  async function submitReport(reviewId: string) {
    if (!reportReason.trim()) { toast.error("Reason দিন"); return }
    setReviewLoading(reviewId)
    try {
      await reportReview(issue.id, reviewId, reportReason)
      toast.success("Reported")
      setReportingId(null); setReportReason("")
    } catch (e: any) {
      toast.error(e.message || "Failed")
    } finally {
      setReviewLoading(null)
    }
  }

  const hasDiscount = issue.discount > 0
  const pt = issue.purchaseType?.toLowerCase() || ""
  const avgRating = Number(issue.averageRating)

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050f08] pb-20 pt-24">
      {/* ambient glow */}
      <div className="pointer-events-none absolute inset-0"
        style={{ background:"radial-gradient(ellipse 55% 45% at 20% 10%,rgba(0,200,83,0.07),transparent),radial-gradient(ellipse 40% 35% at 80% 5%,rgba(251,191,36,0.05),transparent)" }}/>

      <div className="relative mx-auto w-7xl">

        {/* ── Back link ── */}
        <Link href="/kisorkontho"
          className="mb-6 inline-flex items-center gap-2 font-mono text-[11px] text-white/35 uppercase tracking-widest transition-colors hover:text-emerald-400">
          <ArrowLeftIcon className="h-3.5 w-3.5" strokeWidth={2}/> সব সংখ্যা
        </Link>

        {/* ══════════════════════════════════════════
            HERO SECTION
        ══════════════════════════════════════════ */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[340px_1fr] xl:grid-cols-[380px_1fr]">

          {/* ── Cover + mini stats ── */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-[#071310] shadow-2xl">
              <div className="relative aspect-3/4">
                <Image src={issue.coverImage} alt={issue.title} fill
                  sizes="(max-width:1024px) 100vw,380px" className="object-cover" unoptimized/>
                <div className="absolute inset-0 bg-linear-to-t from-[#050f08]/60 via-transparent to-transparent"/>
              </div>

              {/* Discount badge */}
              {hasDiscount && (
                <div className="absolute right-3 top-3 flex h-12 w-12 flex-col items-center justify-center rounded-xl border border-amber-400/40 bg-amber-500/20 backdrop-blur-sm">
                  <span className="font-mono text-[14px] font-black text-amber-300">{issue.discount}</span>
                  <span className="font-mono text-[8px] text-amber-400/80">%OFF</span>
                </div>
              )}
            </div>

            {/* Mini stat pills */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label:"ভিউ",      value:issue.views,     color:"#60a5fa", icon:EyeIcon       },
                { label:"ডাউনলোড", value:issue.downloads, color:"#a78bfa", icon:DownloadIcon  },
                { label:"অর্ডার",  value:issue.purchases, color:"#4ade80", icon:ShoppingCartIcon },
              ].map(s=>(
                <div key={s.label} className="flex flex-col items-center gap-1 rounded-xl border border-white/5 bg-white/2 py-3">
                  <s.icon className="h-4 w-4" style={{ color:s.color }} strokeWidth={1.8}/>
                  <p className="font-mono text-[14px] font-bold" style={{ color:s.color }}>{s.value}</p>
                  <p className="font-mono text-[9px] text-white/22">{s.label}</p>
                </div>
              ))}
            </div>

            {/* PDF preview button */}
            {issue.isFreePreview && issue.pdfPreview && (
              <button onClick={()=>setShowPdf(p=>!p)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-purple-500/25 bg-purple-500/8 py-2.5 text-[12px] font-semibold text-purple-400 transition-all hover:border-purple-500/45 hover:bg-purple-500/14">
                <BookOpenIcon className="h-4 w-4" strokeWidth={1.8}/>
                ফ্রি প্রিভিউ পড়ুন
                {showPdf ? <ChevronUpIcon className="ml-auto h-3.5 w-3.5" strokeWidth={2}/> : <ChevronDownIcon className="ml-auto h-3.5 w-3.5" strokeWidth={2}/>}
              </button>
            )}
            {showPdf && issue.pdfPreview && (
              <div className="overflow-hidden rounded-xl border border-purple-500/18 bg-purple-500/4">
                <iframe src={issue.pdfPreview} className="h-64 w-full" title="PDF Preview"/>
                <div className="border-t border-purple-500/12 p-3 text-center">
                  <a href={issue.pdfPreview} target="_blank" rel="noopener noreferrer"
                    onClick={() => trackDownload(issue.id)}
                    className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-purple-400/70 hover:text-purple-400 transition-colors">
                    <ExternalLinkIcon className="h-3 w-3" strokeWidth={2}/> নতুন ট্যাবে খুলুন
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* ── Main info + buy panel ── */}
          <div className="space-y-5">

            {/* Title + rating */}
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-white/10 bg-white/4 px-2.5 py-0.5 font-mono text-[10px] text-white/45">
                  {issue.month} {issue.year}
                </span>
                {issue.subscriptionEligible && (
                  <span className="flex items-center gap-1 rounded-full border border-emerald-500/22 bg-emerald-500/8 px-2.5 py-0.5 font-mono text-[10px] text-emerald-400">
                    <SparklesIcon className="h-2.5 w-2.5" strokeWidth={2}/> সাবস্ক্রিপশনযোগ্য
                  </span>
                )}
              </div>
              <h1 className="text-[26px] font-extrabold leading-tight text-emerald-50 md:text-[32px]">{issue.title}</h1>
              <div className="mt-2 flex items-center gap-3">
                <Stars rating={avgRating}/>
                <span className="font-mono text-[13px] font-bold text-amber-400">{avgRating}</span>
                <span className="font-mono text-[11px] text-white/28">({issue.ratingCount} রিভিউ)</span>
              </div>
            </div>

            {/* Description */}
            <p className="rounded-xl border border-white/5 bg-white/2 p-4 text-[13px] leading-relaxed text-white/55">
              {issue.description}
            </p>

            {/* Price card */}
            <div className="overflow-hidden rounded-2xl border border-white/8 bg-[#071310]">
              <div className="h-0.5 bg-linear-to-r from-transparent via-emerald-500/60 to-transparent"/>
              <div className="p-5">
                <div className="flex flex-wrap items-end gap-4">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-white/25">ফাইনাল মূল্য</p>
                    <p className="text-[36px] font-black leading-none text-emerald-300">
                      ৳{Number(issue.finalPrice)}
                    </p>
                  </div>
                  {hasDiscount && (
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-white/22">নিয়মিত মূল্য</p>
                      <p className="text-[18px] font-semibold text-white/25 line-through">
                        ৳{Number(issue.price)}
                      </p>
                    </div>
                  )}
                  {hasDiscount && (
                    <span className="rounded-xl border border-amber-500/30 bg-amber-500/12 px-3 py-1 font-mono text-[11px] font-bold text-amber-300">
                      ৳{Number(issue.price) - Number(issue.finalPrice)} সাশ্রয়
                    </span>
                  )}
                </div>

                {/* Purchase type */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {(pt === "physical" || pt === "both") && (
                    <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/22 bg-emerald-500/8 px-3 py-1 text-[11px] font-medium text-emerald-400">
                      <PackageIcon className="h-3 w-3" strokeWidth={2}/> ফিজিক্যাল কপি
                    </span>
                  )}
                  {(pt === "digital" || pt === "both") && (
                    <span className="flex items-center gap-1.5 rounded-full border border-blue-500/22 bg-blue-500/8 px-3 py-1 text-[11px] font-medium text-blue-400">
                      <DownloadIcon className="h-3 w-3" strokeWidth={2}/> ডিজিটাল কপি
                    </span>
                  )}
                </div>

                {/* Quantity + total */}
                <div className="mt-5 flex flex-wrap items-center gap-4">
                  <div>
                    <p className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-white/25">পরিমাণ</p>
                    <div className="inline-flex items-center overflow-hidden rounded-xl border border-white/10 bg-[#050f08]">
                      <button onClick={()=>setQty(q=>Math.max(1,q-1))} type="button"
                        className="flex h-10 w-10 items-center justify-center text-white/35 transition-colors hover:bg-white/5 hover:text-white/65">
                        <MinusIcon className="h-4 w-4" strokeWidth={2.5}/>
                      </button>
                      <span className="min-w-12 text-center font-mono text-[16px] font-bold text-emerald-300">{qty}</span>
                      <button onClick={()=>setQty(q=>Math.min(q+1,issue.stock))} type="button"
                        className="flex h-10 w-10 items-center justify-center text-white/35 transition-colors hover:bg-white/5 hover:text-white/65">
                        <PlusIcon className="h-4 w-4" strokeWidth={2.5}/>
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-white/22">মোট</p>
                    <p className="font-mono text-[22px] font-black text-white/70">
                      ৳{total}
                    </p>
                  </div>
                  {/* Stock indicator */}
                  <div className="ml-auto">
                    {issue.isAvailable ? (
                      <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/22 bg-emerald-500/7 px-3 py-1 text-[11px] font-semibold text-emerald-400">
                        <CheckCircleIcon className="h-3 w-3" strokeWidth={2.5}/>
                        {issue.stock}টি স্টকে
                      </span>
                    ) : (
                      <span className="rounded-full border border-red-500/22 bg-red-500/7 px-3 py-1 text-[11px] font-semibold text-red-400">
                        স্টক শেষ
                      </span>
                    )}
                  </div>
                </div>

                {/* CTA buttons */}
                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <button onClick={buyNow} disabled={buyLoading || !issue.isAvailable}
                    className={`flex items-center justify-center gap-2 rounded-xl py-3 text-[13px] font-bold transition-all ${
                      buyLoading || !issue.isAvailable
                        ? "cursor-not-allowed border border-white/5 bg-white/2 text-white/20 opacity-50"
                        : "border border-amber-500/35 bg-amber-500/12 text-amber-300 hover:border-amber-500/60 hover:bg-amber-500/22 hover:shadow-[0_0_20px_rgba(251,191,36,0.12)]"
                    }`}>
                    {buyLoading
                      ? <><Loader2Icon className="h-4 w-4 animate-spin"/> লোড হচ্ছে…</>
                      : <><CreditCardIcon className="h-4 w-4" strokeWidth={2}/> এখনই কিনুন</>
                    }
                  </button>

                  <button onClick={addToCart} disabled={cartLoading || !issue.isAvailable}
                    className={`flex items-center justify-center gap-2 rounded-xl py-3 text-[13px] font-bold transition-all ${
                      cartLoading || !issue.isAvailable
                        ? "cursor-not-allowed border border-white/5 bg-white/2 text-white/20 opacity-50"
                        : inCart
                        ? "border border-emerald-400/50 bg-emerald-500/18 text-emerald-300"
                        : "border border-emerald-500/28 bg-emerald-500/8 text-emerald-400 hover:border-emerald-500/55 hover:bg-emerald-500/16 hover:shadow-[0_0_20px_rgba(0,200,83,0.1)]"
                    }`}>
                    {cartLoading
                      ? <><Loader2Icon className="h-4 w-4 animate-spin"/> লোড হচ্ছে…</>
                      : inCart
                      ? <><CheckCircleIcon className="h-4 w-4" strokeWidth={2}/> কার্টে আছে</>
                      : <><ShoppingCartIcon className="h-4 w-4" strokeWidth={2}/> কার্টে যোগ</>
                    }
                  </button>
                </div>

                <div className="mt-3 flex justify-end">
                  <button onClick={share} type="button"
                    className="flex items-center gap-1.5 rounded-xl border border-white/8 bg-white/3 px-3 py-2 text-[11px] text-white/30 transition-all hover:border-white/16 hover:text-white/60">
                    <ShareIcon className="h-3.5 w-3.5" strokeWidth={2}/> শেয়ার
                  </button>
                </div>

                {/* Payment methods */}
                <div className="mt-4 flex flex-wrap gap-2 border-t border-white/5 pt-4">
                  <WalletIcon className="h-3.5 w-3.5 text-white/22" strokeWidth={1.8}/>
                  {issue.paymentMethods.map(m=>(
                    <span key={m} className="rounded-full border border-white/8 bg-white/3 px-2.5 py-0.5 font-mono text-[10px] text-white/40">
                      {paymentLabel(m)}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Publisher info */}
            <div className="flex flex-wrap gap-4 rounded-xl border border-white/5 bg-white/2 px-4 py-3">
              {[
                { icon:BookOpenIcon, label:"প্রকাশক",   value:issue.publisherName },
                { icon:UserIcon,     label:"সম্পাদক",   value:issue.editorName },
                { icon:ClockIcon,    label:"প্রকাশকাল", value:issue.createdAt },
              ].map(r=>(
                <div key={r.label} className="flex items-center gap-2">
                  <r.icon className="h-3.5 w-3.5 text-white/20" strokeWidth={1.8}/>
                  <div>
                    <p className="font-mono text-[8px] text-white/20 uppercase tracking-widest">{r.label}</p>
                    <p className="text-[12px] text-white/55">{r.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {issue.tags.map(tag=>(
                <span key={tag} className="flex items-center gap-1 rounded-full border border-white/8 bg-white/3 px-2.5 py-0.5 font-mono text-[10px] text-white/35">
                  <TagIcon className="h-2.5 w-2.5" strokeWidth={2}/>{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            TABS — Contents / Reviews / Info
        ══════════════════════════════════════════ */}
        <div className="mt-10 rounded-2xl border border-white/6 bg-[#071310] overflow-hidden">
          <div className="h-0.5 bg-linear-to-r from-transparent via-emerald-500/40 to-transparent"/>

          {/* Tab bar */}
          <div className="flex border-b border-white/5">
            {([
              ["contents","সূচিপত্র"],
              ["reviews","রিভিউ"],
              ["info","তথ্য"],
            ] as const).map(([k,l])=>(
              <button key={k} onClick={()=>setActiveTab(k)}
                className={`flex flex-1 items-center justify-center gap-2 py-3.5 text-[12px] font-semibold transition-all ${
                  activeTab===k
                    ? "border-b-2 border-emerald-500 bg-emerald-500/6 text-emerald-400"
                    : "text-white/30 hover:bg-white/2 hover:text-white/55"
                }`}>
                {l}
              </button>
            ))}
          </div>

          <div className="p-5 md:p-6">
            {/* Contents */}
            {activeTab==="contents" && (
              <div className="space-y-2.5">
                {issue.contents?.map((c,i)=>{
                  const clr = contentColor(c.type)
                  return (
                    <div key={i} className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/2 px-4 py-3 transition-colors hover:border-white/10">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-[10px] font-bold font-mono"
                        style={{ borderColor:`${clr}30`, background:`${clr}12`, color:clr }}>
                        {String(i+1).padStart(2,"0")}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-[13px] font-semibold text-white/75">{c.title}</p>
                        <p className="text-[11px] text-white/30">{c.author}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="rounded-full border px-2 py-0.5 font-mono text-[9px]"
                          style={{ borderColor:`${clr}25`, color:clr }}>
                          {contentLabel(c.type)}
                        </span>
                        <span className="font-mono text-[10px] text-white/22">পৃ.{c.page}</span>
                      </div>
                    </div>
                  )
                })}
                {(!issue.contents || issue.contents.length === 0) && (
                  <p className="text-center text-[13px] text-white/22 py-8">কোনো সূচিপত্র নেই</p>
                )}
              </div>
            )}

            {/* Reviews */}
            {activeTab==="reviews" && (
              <div className="space-y-4">
                {/* Summary */}
                <div className="flex items-center gap-6 rounded-xl border border-amber-500/14 bg-amber-500/4 px-5 py-4">
                  <div className="text-center">
                    <p className="text-[42px] font-black text-amber-300 leading-none">{avgRating}</p>
                    <Stars rating={avgRating} size={16}/>
                    <p className="mt-1 font-mono text-[10px] text-white/28">{issue.ratingCount} রিভিউ</p>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {[5,4,3,2,1].map(n=>{
                      const count = issue.reviews?.filter(r=>r.rating===n).length || 0
                      const total_ = issue.reviews?.length || 1
                      const pct   = Math.round((count/total_)*100)
                      return (
                        <div key={n} className="flex items-center gap-2">
                          <span className="w-4 font-mono text-[10px] text-white/30">{n}</span>
                          <StarIcon className="h-3 w-3 text-amber-400 fill-amber-400" strokeWidth={1}/>
                          <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-white/5">
                            <div className="h-full rounded-full bg-amber-400/60 transition-all" style={{ width:`${pct}%` }}/>
                          </div>
                          <span className="w-6 font-mono text-[9px] text-white/22 text-right">{count}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Write Review Form */}
                {user && (
                  <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/5 p-4">
                    <p className="mb-3 text-sm font-semibold text-white/60">Write a Review</p>
                    <div className="mb-3 flex items-center gap-1">
                      {[1,2,3,4,5].map(s=>(
                        <button key={s} type="button" onClick={()=>setNewRating(s)}
                          className="transition-transform hover:scale-110">
                          <StarIcon style={{ width:22, height:22 }} strokeWidth={1.5}
                            className={s<=newRating?"text-amber-400 fill-amber-400":"text-white/15"}/>
                        </button>
                      ))}
                      {newRating > 0 && <span className="ml-2 font-mono text-xs text-amber-400">{newRating}/5</span>}
                    </div>
                    <textarea value={newComment} onChange={e=>setNewComment(e.target.value)}
                      placeholder="আপনার মতামত লিখুন..."
                      rows={3}
                      className="w-full rounded-xl border border-white/10 bg-[#050f08] px-4 py-3 text-[13px] text-white/70 placeholder:text-white/20 focus:border-emerald-500/40 focus:outline-none"/>
                    <button onClick={submitReview} disabled={submittingReview || !newRating || !newComment.trim()}
                      className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-[12px] font-semibold text-emerald-400 transition-all hover:bg-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed">
                      {submittingReview ? <Loader2Icon className="h-3.5 w-3.5 animate-spin"/> : null}
                      {submittingReview ? "Submitting..." : "Submit Review"}
                    </button>
                  </div>
                )}
                {!user && (
                  <p className="text-center text-[13px] text-white/25 py-4">Login করুন review দিতে</p>
                )}

                {issue.reviews?.map((r,i)=>{
                  const isOwn = user && r.user?.id === user.id
                  const isEditing = editingReviewId === r.id
                  const isLoading = reviewLoading === r.id

                  return (
                    <div key={i} className={`rounded-xl border bg-white/2 p-4 ${isOwn ? "border-emerald-500/15" : "border-white/5"}`}>
                      <div className="mb-2 flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/8 font-mono text-[12px] font-bold text-emerald-400">
                          {r.user?.name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-[13px] font-semibold text-white/70">{r.user?.name || "ব্যবহারকারী"}</p>
                            {r.isEdited && <span className="text-[9px] text-white/20">(edited)</span>}
                          </div>
                          {!isEditing && <Stars rating={r.rating} size={11}/>}
                        </div>
                        {isOwn && !isEditing && (
                          <div className="flex gap-1.5">
                            <button onClick={() => startEditReview(r)} disabled={isLoading}
                              className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 text-white/30 transition-all hover:border-emerald-500/30 hover:text-emerald-400">
                              <PencilIcon className="h-3 w-3" strokeWidth={2}/>
                            </button>
                            <button onClick={() => handleDeleteReview(r.id)} disabled={isLoading}
                              className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 text-white/30 transition-all hover:border-red-500/30 hover:text-red-400">
                              {isLoading ? <Loader2Icon className="h-3 w-3 animate-spin"/> : <Trash2Icon className="h-3 w-3" strokeWidth={2}/>}
                            </button>
                          </div>
                        )}
                        {!isOwn && user && !isEditing && (
                          <div>
                            {reportingId === r.id ? (
                              <div className="flex gap-1.5">
                                <input type="text" value={reportReason} onChange={e=>setReportReason(e.target.value)}
                                  placeholder="Reason..."
                                  className="w-28 rounded-lg border border-white/10 bg-[#050f08] px-2 py-1 text-[10px] text-white/60 focus:outline-none"/>
                                <button onClick={()=>submitReport(r.id)} disabled={isLoading}
                                  className="rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-1 text-[10px] text-red-400 hover:bg-red-500/20">
                                  {isLoading ? <Loader2Icon className="h-3 w-3 animate-spin"/> : "Send"}
                                </button>
                                <button onClick={()=>{setReportingId(null);setReportReason("")}}
                                  className="rounded-lg border border-white/10 px-2 py-1 text-[10px] text-white/30">
                                  X
                                </button>
                              </div>
                            ) : (
                              <button onClick={()=>setReportingId(r.id)}
                                className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 text-white/20 transition-all hover:border-amber-500/30 hover:text-amber-400">
                                <FlagIcon className="h-3 w-3" strokeWidth={2}/>
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      {isEditing ? (
                        <div className="space-y-3">
                          <div className="flex items-center gap-1">
                            {[1,2,3,4,5].map(s=>(
                              <button key={s} type="button" onClick={()=>setEditRating(s)}
                                className="transition-transform hover:scale-110">
                                <StarIcon style={{ width:20, height:20 }} strokeWidth={1.5}
                                  className={s<=editRating?"text-amber-400 fill-amber-400":"text-white/15"}/>
                              </button>
                            ))}
                          </div>
                          <textarea value={editComment} onChange={e=>setEditComment(e.target.value)}
                            rows={3}
                            className="w-full rounded-xl border border-white/10 bg-[#050f08] px-4 py-3 text-[13px] text-white/70 focus:border-emerald-500/40 focus:outline-none"/>
                          <div className="flex gap-2">
                            <button onClick={()=>saveEditReview(r.id)} disabled={isLoading || !editRating || !editComment.trim()}
                              className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-semibold text-emerald-400 transition-all hover:bg-emerald-500/20 disabled:opacity-40">
                              <CheckIcon className="h-3 w-3" strokeWidth={2.5}/> সেভ
                            </button>
                            <button onClick={()=>setEditingReviewId(null)}
                              className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-[11px] font-semibold text-white/40 transition-all hover:text-white/60">
                              <XIcon className="h-3 w-3" strokeWidth={2.5}/> বাতিল
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-[13px] leading-relaxed text-white/50">{r.comment}</p>
                      )}
                    </div>
                  )
                })}
                {(!issue.reviews || issue.reviews.length === 0) && (
                  <p className="text-center text-[13px] text-white/22 py-8">কোনো রিভিউ নেই</p>
                )}
              </div>
            )}

            {/* Info */}
            {activeTab==="info" && (
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { label:"ভাষা",         value:issue.language },
                  { label:"প্রকাশনী",     value:issue.publisherName },
                  { label:"সংগঠন",         value:issue.publisherOrg },
                  { label:"সম্পাদক",      value:`${issue.editorName} (${issue.editorRole})` },
                  { label:"প্রকাশকাল",   value:issue.createdAt },
                  { label:"সর্বশেষ আপডেট",value:issue.updatedAt },
                  { label:"পেমেন্ট",      value:issue.paymentMethods.map(paymentLabel).join(", ") },
                  { label:"ধরন",           value:issue.purchaseType },
                ].map(row=>(
                  <div key={row.label} className="flex gap-3 rounded-xl border border-white/5 bg-white/2 px-4 py-3">
                    <p className="w-28 shrink-0 font-mono text-[10px] uppercase tracking-widest text-white/25 pt-0.5">{row.label}</p>
                    <p className="text-[13px] text-white/60">{row.value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════════
            RELATED
        ══════════════════════════════════════════ */}
        {related.length>0 && (
          <section className="mt-8">
            <div className="mb-4 flex items-center gap-2">
              <TrendingUpIcon className="h-4 w-4 text-emerald-400/60" strokeWidth={1.8}/>
              <h2 className="text-[15px] font-bold text-white/60">সংশ্লিষ্ট সংখ্যা</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {related.map(item=>(
                <Link key={item.id} href={`/kisorkontho/${item.slug}`}
                  className="group overflow-hidden rounded-2xl border border-white/6 bg-[#071310] transition-all hover:-translate-y-0.5 hover:border-emerald-500/22">
                  <div className="relative aspect-3/4 overflow-hidden">
                    <Image src={item.coverImage} alt={item.title} fill
                      sizes="(max-width:768px)50vw,25vw" className="object-cover transition-transform duration-400 group-hover:scale-[1.03]" unoptimized/>
                    <div className="absolute inset-0 bg-linear-to-t from-[#050f08]/70 via-transparent to-transparent"/>
                    <div className="absolute inset-x-0 bottom-0 p-3">
                      <p className="line-clamp-2 text-[11px] font-bold leading-tight text-white/85">{item.title}</p>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between">
                      <p className="font-mono text-[10px] text-white/28">{item.month} {item.year}</p>
                      <p className="font-mono text-[13px] font-bold text-emerald-400">
                        ৳{Number(item.finalPrice)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
