"use client"

import { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  BookOpenIcon, PlusIcon, PencilIcon, TrashIcon,
  SearchIcon, FilterIcon, ChevronLeftIcon, ChevronRightIcon,
} from "lucide-react"
import { toast } from "sonner"
import Swal from "sweetalert2"

type Issue = {
  id: string
  title: string
  month: string
  year: number
  price: string | number
  discount: number
  finalPrice: string | number
  coverImage: string
  slug: string
  stock: number
  isAvailable: boolean
  purchaseType: string
  averageRating: string | number
  ratingCount: number
  views: number
  downloads: number
  purchases: string | number
  createdAt: string
}

type Meta = {
  total: number
  page: number
  limit: number
  totalPages: number
}

const MONTHS = ["জানুয়ারি","ফেব্রুয়ারি","মার্চ","এপ্রিল","মে","জুন","জুলাই","আগস্ট","সেপ্টেম্বর","অক্টোবর","নভেম্বর","ডিসেম্বর"]

function num(val: string | number): number {
  return Number(val) || 0
}

export default function AdminKishorkonthoListClient() {
  const router = useRouter()
  const [issues, setIssues] = useState<Issue[]>([])
  const [meta, setMeta] = useState<Meta>({ total: 0, page: 1, limit: 10, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filterMonth, setFilterMonth] = useState("")
  const [filterYear, setFilterYear] = useState("")
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchIssues = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set("page", String(page))
      params.set("limit", "10")
      if (search) params.set("search", search)
      if (filterMonth) params.set("month", filterMonth)
      if (filterYear) params.set("year", filterYear)

      const res = await fetch(`/api/v1/kishorkontho?${params.toString()}`)
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()
      if (data.success) {
        setIssues(data.data)
        setMeta(data.meta)
      } else {
        throw new Error(data.message)
      }
    } catch (err) {
      console.error(err)
      toast.error("ডাটা লোড করা যায়নি")
      setIssues([])
    } finally {
      setLoading(false)
    }
  }, [search, filterMonth, filterYear])

  useEffect(() => { fetchIssues(1) }, [fetchIssues])

  async function handleDelete(id: string, title: string) {
    const result = await Swal.fire({
      title: `"${title}" মুছে ফেলতে চান?`,
      text: "এই কাজটি ফেরানো যাবে না!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "হ্যাঁ, মুছুন!",
      cancelButtonText: "বাতিল",
      background: "#071310",
      color: "#d1fae5",
      customClass: {
        popup: "swal-dark",
        title: "swal-title",
        htmlContainer: "swal-text",
      },
    })

    if (!result.isConfirmed) return

    setDeleting(id)
    try {
      const res = await fetch(`/api/v1/kishorkontho/${id}`, { method: "DELETE" })
      const data = await res.json()
      if (data.success) {
        Swal.fire({
          title: "মুছে ফেলা হয়েছে!",
          text: "সংখ্যাটি সফলভাবে মুছে ফেলা হয়েছে।",
          icon: "success",
          confirmButtonColor: "#10b981",
          background: "#071310",
          color: "#d1fae5",
        })
        fetchIssues(meta.page)
      } else {
        toast.error(data.message || "মুছে ফেলা যায়নি")
      }
    } catch {
      toast.error("সার্ভার ত্রুটি")
    } finally {
      setDeleting(null)
    }
  }

  const totalPurchases = issues.reduce((s, i) => s + num(i.purchases), 0)

  return (
    <div className="min-h-screen bg-[#050f08] text-emerald-50">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-emerald-500/15 bg-[#071310] px-3 py-6 sm:px-4 md:px-8 md:py-7">
        <div className="pointer-events-none absolute -left-28 bottom-0 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-0 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold tracking-[1.2px] text-emerald-300 uppercase">
                <BookOpenIcon className="h-3.5 w-3.5" />
                Admin Console
              </p>
              <h1 className="text-xl font-bold tracking-tight text-emerald-50 sm:text-2xl md:text-3xl">কিশোরকণ্ঠ ব্যবস্থাপনা</h1>
              <p className="mt-2 max-w-2xl text-xs text-emerald-100/70 sm:text-sm">সকল কিশোরকণ্ঠ সংখ্যা দেখুন, যোগ করুন, সম্পাদনা করুন</p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:min-w-md lg:grid-cols-4">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/8 p-2.5 sm:p-3">
                <p className="text-[11px] text-emerald-200/60">মোট সংখ্যা</p>
                <p className="text-lg font-bold text-emerald-200 sm:text-xl">{meta.total}</p>
              </div>
              <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/8 p-2.5 sm:p-3">
                <p className="text-[11px] text-emerald-200/60">স্টকে</p>
                <p className="text-lg font-bold text-cyan-200 sm:text-xl">{issues.filter(i => i.isAvailable).length}</p>
              </div>
              <div className="rounded-xl border border-red-500/20 bg-red-500/8 p-2.5 sm:p-3">
                <p className="text-[11px] text-emerald-200/60">স্টক শেষ</p>
                <p className="text-lg font-bold text-red-200 sm:text-xl">{issues.filter(i => !i.isAvailable).length}</p>
              </div>
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/8 p-2.5 sm:p-3">
                <p className="text-[11px] text-emerald-200/60">মোট বিক্রি</p>
                <p className="text-lg font-bold text-amber-200 sm:text-xl">{totalPurchases}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-2 py-4 sm:px-4 sm:py-6 md:px-8">
        <div className="rounded-2xl border border-emerald-500/15 bg-[#07130f]/80 p-3 backdrop-blur-md sm:p-4 md:p-5">

          {/* Toolbar */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 flex-wrap items-center gap-2">
              <div className="relative flex-1 sm:max-w-xs">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-300/40" />
                <input
                  type="text"
                  placeholder="অনুসন্ধান..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && fetchIssues(1)}
                  className="h-9 w-full rounded-lg border border-emerald-500/20 bg-[#081610] pl-9 pr-3 text-sm text-emerald-50 placeholder:text-emerald-300/30 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                />
              </div>
              <select
                value={filterMonth}
                onChange={e => setFilterMonth(e.target.value)}
                className="h-9 rounded-lg border border-emerald-500/15 bg-[#081610] px-2 text-sm focus:outline-none"
                style={{ color: "#a7f3d0", backgroundColor: "#081610" }}
              >
                <option value="" style={{ backgroundColor: "#081610", color: "#a7f3d0" }}>সব মাস</option>
                {MONTHS.map(m => <option key={m} value={m} style={{ backgroundColor: "#081610", color: "#a7f3d0" }}>{m}</option>)}
              </select>
              <select
                value={filterYear}
                onChange={e => setFilterYear(e.target.value)}
                className="h-9 rounded-lg border border-emerald-500/15 bg-[#081610] px-2 text-sm focus:outline-none"
                style={{ color: "#a7f3d0", backgroundColor: "#081610" }}
              >
                <option value="" style={{ backgroundColor: "#081610", color: "#a7f3d0" }}>সব বছর</option>
                {[2026, 2025, 2024].map(y => <option key={y} value={y} style={{ backgroundColor: "#081610", color: "#a7f3d0" }}>{y}</option>)}
              </select>
              <button
                onClick={() => { setSearch(""); setFilterMonth(""); setFilterYear("") }}
                className="h-9 rounded-lg border border-emerald-500/20 bg-[#081610] px-3 text-xs text-emerald-200 hover:bg-emerald-500/15"
              >
                <FilterIcon className="mr-1 inline h-3 w-3" /> রিসেট
              </button>
            </div>
            <Link
              href="/dashboard/kishorkontho/add"
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/15 px-4 text-sm font-semibold text-emerald-300 hover:bg-emerald-500/25"
            >
              <PlusIcon className="h-4 w-4" /> নতুন সংখ্যা
            </Link>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-2 px-5 py-12 text-center">
              <BookOpenIcon className="h-9 w-9 animate-pulse text-emerald-300/40" />
              <p className="text-sm font-medium text-emerald-100/80">লোড হচ্ছে...</p>
            </div>
          ) : issues.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 px-5 py-12 text-center">
              <BookOpenIcon className="h-9 w-9 text-emerald-300/40" />
              <p className="text-sm font-medium text-emerald-100/80">কোনো সংখ্যা পাওয়া যায়নি</p>
              <p className="text-xs text-emerald-200/50">নতুন সংখ্যা যোগ করুন।</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-xl border border-emerald-500/15">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-emerald-500/12 bg-emerald-500/8 text-[11px] font-semibold tracking-wide text-emerald-200/70 uppercase">
                      <th className="px-4 py-3">সংখ্যা</th>
                      <th className="px-4 py-3">মাস/বছর</th>
                      <th className="px-4 py-3">মূল্য</th>
                      <th className="px-4 py-3">স্টক</th>
                      <th className="px-4 py-3">রেটিং</th>
                      <th className="px-4 py-3">বিক্রি</th>
                      <th className="px-4 py-3 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-500/12 bg-[#060f0b]">
                    {issues.map(issue => (
                      <tr key={issue.id} className="group hover:bg-emerald-500/5">
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            {issue.coverImage ? (
                              <div className="relative h-10 w-7 overflow-hidden rounded-md border border-emerald-500/15">
                                <Image
                                  src={issue.coverImage}
                                  alt={issue.title}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              </div>
                            ) : (
                              <div className="flex h-10 w-7 items-center justify-center rounded-md border border-emerald-500/15 bg-emerald-500/8">
                                <BookOpenIcon className="h-4 w-4 text-emerald-400/40" />
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-medium text-emerald-50 line-clamp-1">{issue.title}</p>
                              <p className="text-[11px] text-emerald-200/40">{issue.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-sm text-emerald-100/70">{issue.month} {issue.year}</td>
                        <td className="px-4 py-3.5">
                          <span className="font-mono text-sm font-bold text-emerald-300">৳{num(issue.finalPrice)}</span>
                          {issue.discount > 0 && (
                            <span className="ml-1 text-[10px] text-amber-400">-{issue.discount}%</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex rounded-md border px-2 py-1 text-[11px] font-semibold ${
                            issue.stock > 10
                              ? "text-emerald-300 border-emerald-500/25 bg-emerald-500/12"
                              : issue.stock > 0
                              ? "text-amber-300 border-amber-500/25 bg-amber-500/12"
                              : "text-red-300 border-red-500/25 bg-red-500/12"
                          }`}>
                            {issue.stock}টি
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1">
                            <span className="text-sm text-amber-300">⭐ {num(issue.averageRating)}</span>
                            <span className="text-[10px] text-emerald-200/30">({issue.ratingCount})</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-sm text-emerald-100/70">{num(issue.purchases)}</td>
                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => router.push(`/dashboard/kishorkontho/${issue.id}/edit`)}
                              className="rounded-lg border border-emerald-500/20 bg-emerald-500/8 p-1.5 text-emerald-300 hover:bg-emerald-500/20"
                              title="সম্পাদনা"
                            >
                              <PencilIcon className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(issue.id, issue.title)}
                              disabled={deleting === issue.id}
                              className="rounded-lg border border-red-500/20 bg-red-500/8 p-1.5 text-red-300 hover:bg-red-500/20 disabled:opacity-50"
                              title="মুছে ফেলুন"
                            >
                              {deleting === issue.id ? (
                                <span className="block h-3.5 w-3.5 animate-spin rounded-full border-2 border-red-300 border-t-transparent" />
                              ) : (
                                <TrashIcon className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {meta.totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-[11px] text-emerald-200/40">
                    মোট {meta.total}টি সংখ্যা
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => fetchIssues(meta.page - 1)}
                      disabled={meta.page <= 1}
                      className="inline-flex h-8 items-center gap-1 rounded-lg border border-emerald-500/20 bg-[#081610] px-2 text-xs text-emerald-200 hover:bg-emerald-500/15 disabled:opacity-40"
                    >
                      <ChevronLeftIcon className="h-3.5 w-3.5" /> পূর্ববর্তী
                    </button>
                    <span className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-300">
                      {meta.page} / {meta.totalPages}
                    </span>
                    <button
                      onClick={() => fetchIssues(meta.page + 1)}
                      disabled={meta.page >= meta.totalPages}
                      className="inline-flex h-8 items-center gap-1 rounded-lg border border-emerald-500/20 bg-[#081610] px-2 text-xs text-emerald-200 hover:bg-emerald-500/15 disabled:opacity-40"
                    >
                      পরবর্তী <ChevronRightIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}
