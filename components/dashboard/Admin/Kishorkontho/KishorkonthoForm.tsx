"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeftIcon, SaveIcon, PlusIcon, TrashIcon, Loader2Icon } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

type ContentItem = {
  type: string
  title: string
  author: string
  page: number
}

type FormData = {
  title: string
  month: string
  year: number
  price: number
  discount: number
  coverImage: string
  description: string
  slug: string
  pdfFull: string
  pdfPreview: string
  isFreePreview: boolean
  purchaseType: string
  stock: number
  isAvailable: boolean
  paymentMethods: string[]
  subscriptionEligible: boolean
  language: string
  publisherName: string
  publisherOrg: string
  editorName: string
  editorRole: string
  tags: string
  contents: ContentItem[]
}

const MONTHS = ["জানুয়ারি","ফেব্রুয়ারি","মার্চ","এপ্রিল","মে","জুন","জুলাই","আগস্ট","সেপ্টেম্বর","অক্টোবর","নভেম্বর","ডিসেম্বর"]
const CONTENT_TYPES = ["STORY","POEM","SCIENCE","ISLAMIC","QUIZ","ART","TRAVEL"]
const CONTENT_TYPE_LABELS: Record<string, string> = {
  STORY: "গল্প", POEM: "কবিতা", SCIENCE: "বিজ্ঞান", ISLAMIC: "ইসলাম",
  QUIZ: "কুইজ", ART: "শিল্পকলা", TRAVEL: "ভ্রমণ",
}
const PAYMENT_METHODS = [
  { value: "BKASH", label: "bKash" },
  { value: "NAGAD", label: "Nagad" },
  { value: "ROCKET", label: "Rocket" },
  { value: "CARD", label: "Card" },
  { value: "BANK", label: "Bank" },
]

const defaultForm: FormData = {
  title: "",
  month: "জানুয়ারি",
  year: 2026,
  price: 50,
  discount: 0,
  coverImage: "",
  description: "",
  slug: "",
  pdfFull: "",
  pdfPreview: "",
  isFreePreview: false,
  purchaseType: "BOTH",
  stock: 0,
  isAvailable: true,
  paymentMethods: ["BKASH", "NAGAD"],
  subscriptionEligible: false,
  language: "Bangla",
  publisherName: "কিশোরকণ্ঠ প্রকাশনা",
  publisherOrg: "বাংলাদেশ ইসলামী ছাত্রশিবির",
  editorName: "",
  editorRole: "Editor",
  tags: "",
  contents: [],
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

export default function KishorkonthoForm({
  mode = "create",
  initialData,
  issueId,
}: {
  mode?: "create" | "edit"
  initialData?: Partial<FormData> & { contents?: ContentItem[] }
  issueId?: string
}) {
  const router = useRouter()
  const [form, setForm] = useState<FormData>(() => {
    if (initialData) {
      return {
        ...defaultForm,
        ...initialData,
        tags: Array.isArray(initialData.tags) ? initialData.tags.join(", ") : (initialData.tags || ""),
        contents: initialData.contents || [],
      }
    }
    return defaultForm
  })
  const [submitting, setSubmitting] = useState(false)

  function updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function addContent() {
    setForm(prev => ({
      ...prev,
      contents: [...prev.contents, { type: "STORY", title: "", author: "", page: 1 }],
    }))
  }

  function removeContent(index: number) {
    setForm(prev => ({
      ...prev,
      contents: prev.contents.filter((_, i) => i !== index),
    }))
  }

  function updateContent(index: number, field: keyof ContentItem, value: string | number) {
    setForm(prev => ({
      ...prev,
      contents: prev.contents.map((c, i) => i === index ? { ...c, [field]: value } : c),
    }))
  }

  function togglePaymentMethod(method: string) {
    setForm(prev => ({
      ...prev,
      paymentMethods: prev.paymentMethods.includes(method)
        ? prev.paymentMethods.filter(m => m !== method)
        : [...prev.paymentMethods, method],
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)

    try {
      const payload = {
        ...form,
        slug: form.slug || generateSlug(form.title),
        tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
        pdfFull: form.pdfFull || undefined,
        pdfPreview: form.pdfPreview || undefined,
        contents: form.contents.filter(c => c.title && c.author),
      }

      const url = mode === "edit" ? `/api/v1/kishorkontho/${issueId}` : "/api/v1/kishorkontho"
      const method = mode === "edit" ? "PATCH" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (data.success) {
        toast.success(mode === "edit" ? "সম্পাদনা সফল হয়েছে!" : "নতুন সংখ্যা যোগ হয়েছে!")
        router.push("/dashboard/kishorkontho")
      } else {
        toast.error(data.message || "কাজ সফল হয়নি")
      }
    } catch {
      toast.error("সার্ভার ত্রুটি")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050f08] text-emerald-50">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-emerald-500/15 bg-[#071310] px-3 py-6 sm:px-4 md:px-8 md:py-7">
        <div className="pointer-events-none absolute -left-28 bottom-0 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-0 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <Link href="/dashboard/kishorkontho"
            className="mb-3 inline-flex items-center gap-2 text-xs text-emerald-300/60 hover:text-emerald-300 transition-colors">
            <ArrowLeftIcon className="h-3.5 w-3.5" /> কিশোরকণ্ঠ তালিকায় ফিরুন
          </Link>
          <h1 className="text-xl font-bold tracking-tight text-emerald-50 sm:text-2xl md:text-3xl">
            {mode === "edit" ? "সংখ্যা সম্পাদনা করুন" : "নতুন সংখ্যা যোগ করুন"}
          </h1>
        </div>
      </section>

      {/* Form */}
      <section className="mx-auto max-w-4xl px-2 py-4 sm:px-4 sm:py-6 md:px-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Basic Info */}
          <div className="rounded-2xl border border-emerald-500/15 bg-[#07130f]/80 p-4 sm:p-5">
            <h2 className="mb-4 text-sm font-bold text-emerald-200 uppercase tracking-wide">মৌলিক তথ্য</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-[11px] text-emerald-200/50 uppercase tracking-wider">শিরোনাম *</label>
                <input type="text" required value={form.title} onChange={e => updateField("title", e.target.value)}
                  className="h-10 w-full rounded-lg border border-emerald-500/20 bg-[#081610] px-3 text-sm text-emerald-50 focus:outline-none focus:ring-1 focus:ring-emerald-500/40" />
              </div>
              <div>
                <label className="mb-1 block text-[11px] text-emerald-200/50 uppercase tracking-wider">মাস *</label>
                <select required value={form.month} onChange={e => updateField("month", e.target.value)}
                  className="h-10 w-full rounded-lg border border-emerald-500/20 bg-[#081610] px-3 text-sm text-emerald-50 focus:outline-none">
                  {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[11px] text-emerald-200/50 uppercase tracking-wider">বছর *</label>
                <input type="number" required min={2000} max={2100} value={form.year}
                  onChange={e => updateField("year", Number(e.target.value))}
                  className="h-10 w-full rounded-lg border border-emerald-500/20 bg-[#081610] px-3 text-sm text-emerald-50 focus:outline-none focus:ring-1 focus:ring-emerald-500/40" />
              </div>
              <div>
                <label className="mb-1 block text-[11px] text-emerald-200/50 uppercase tracking-wider">মূল্য (৳) *</label>
                <input type="number" required min={0} step={0.01} value={form.price}
                  onChange={e => updateField("price", Number(e.target.value))}
                  className="h-10 w-full rounded-lg border border-emerald-500/20 bg-[#081610] px-3 text-sm text-emerald-50 focus:outline-none focus:ring-1 focus:ring-emerald-500/40" />
              </div>
              <div>
                <label className="mb-1 block text-[11px] text-emerald-200/50 uppercase tracking-wider">ডিসকাউন্ট (%)</label>
                <input type="number" min={0} max={100} value={form.discount}
                  onChange={e => updateField("discount", Number(e.target.value))}
                  className="h-10 w-full rounded-lg border border-emerald-500/20 bg-[#081610] px-3 text-sm text-emerald-50 focus:outline-none focus:ring-1 focus:ring-emerald-500/40" />
              </div>
              <div>
                <label className="mb-1 block text-[11px] text-emerald-200/50 uppercase tracking-wider">স্টক পরিমাণ</label>
                <input type="number" min={0} value={form.stock}
                  onChange={e => updateField("stock", Number(e.target.value))}
                  className="h-10 w-full rounded-lg border border-emerald-500/20 bg-[#081610] px-3 text-sm text-emerald-50 focus:outline-none focus:ring-1 focus:ring-emerald-500/40" />
              </div>
              <div>
                <label className="mb-1 block text-[11px] text-emerald-200/50 uppercase tracking-wider">Slug</label>
                <input type="text" value={form.slug} onChange={e => updateField("slug", e.target.value)}
                  placeholder="অটো তৈরি হবে"
                  className="h-10 w-full rounded-lg border border-emerald-500/20 bg-[#081610] px-3 text-sm text-emerald-50 placeholder:text-emerald-300/20 focus:outline-none focus:ring-1 focus:ring-emerald-500/40" />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-[11px] text-emerald-200/50 uppercase tracking-wider">বিবরণ *</label>
                <textarea required rows={3} value={form.description} onChange={e => updateField("description", e.target.value)}
                  className="w-full rounded-lg border border-emerald-500/20 bg-[#081610] px-3 py-2 text-sm text-emerald-50 focus:outline-none focus:ring-1 focus:ring-emerald-500/40" />
              </div>
            </div>
          </div>

          {/* Cover Image */}
          <div className="rounded-2xl border border-emerald-500/15 bg-[#07130f]/80 p-4 sm:p-5">
            <h2 className="mb-4 text-sm font-bold text-emerald-200 uppercase tracking-wide">কভার ইমেজ</h2>
            <div>
              <label className="mb-1 block text-[11px] text-emerald-200/50 uppercase tracking-wider">ইমেজ URL *</label>
              <input type="url" required value={form.coverImage} onChange={e => updateField("coverImage", e.target.value)}
                placeholder="https://..."
                className="h-10 w-full rounded-lg border border-emerald-500/20 bg-[#081610] px-3 text-sm text-emerald-50 placeholder:text-emerald-300/20 focus:outline-none focus:ring-1 focus:ring-emerald-500/40" />
            </div>
          </div>

          {/* PDF */}
          <div className="rounded-2xl border border-emerald-500/15 bg-[#07130f]/80 p-4 sm:p-5">
            <h2 className="mb-4 text-sm font-bold text-emerald-200 uppercase tracking-wide">PDF</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-[11px] text-emerald-200/50 uppercase tracking-wider">ফুল PDF URL</label>
                <input type="url" value={form.pdfFull} onChange={e => updateField("pdfFull", e.target.value)}
                  placeholder="https://..."
                  className="h-10 w-full rounded-lg border border-emerald-500/20 bg-[#081610] px-3 text-sm text-emerald-50 placeholder:text-emerald-300/20 focus:outline-none focus:ring-1 focus:ring-emerald-500/40" />
              </div>
              <div>
                <label className="mb-1 block text-[11px] text-emerald-200/50 uppercase tracking-wider">প্রিভিউ PDF URL</label>
                <input type="url" value={form.pdfPreview} onChange={e => updateField("pdfPreview", e.target.value)}
                  placeholder="https://..."
                  className="h-10 w-full rounded-lg border border-emerald-500/20 bg-[#081610] px-3 text-sm text-emerald-50 placeholder:text-emerald-300/20 focus:outline-none focus:ring-1 focus:ring-emerald-500/40" />
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isFreePreview}
                    onChange={e => updateField("isFreePreview", e.target.checked)}
                    className="h-4 w-4 rounded border-emerald-500/30 bg-[#081610] text-emerald-500 focus:ring-emerald-500/40" />
                  <span className="text-sm text-emerald-200/70">ফ্রি প্রিভিউ আছে</span>
                </label>
              </div>
            </div>
          </div>

          {/* Purchase & Payment */}
          <div className="rounded-2xl border border-emerald-500/15 bg-[#07130f]/80 p-4 sm:p-5">
            <h2 className="mb-4 text-sm font-bold text-emerald-200 uppercase tracking-wide">পেমেন্ট ও ক্রয়</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-[11px] text-emerald-200/50 uppercase tracking-wider">ক্রয়ের ধরন</label>
                <select value={form.purchaseType} onChange={e => updateField("purchaseType", e.target.value)}
                  className="h-10 w-full rounded-lg border border-emerald-500/20 bg-[#081610] px-3 text-sm text-emerald-50 focus:outline-none">
                  <option value="PHYSICAL">শুধু ফিজিক্যাল</option>
                  <option value="DIGITAL">শুধু ডিজিটাল</option>
                  <option value="BOTH">উভয়</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[11px] text-emerald-200/50 uppercase tracking-wider">ভাষা</label>
                <input type="text" value={form.language} onChange={e => updateField("language", e.target.value)}
                  className="h-10 w-full rounded-lg border border-emerald-500/20 bg-[#081610] px-3 text-sm text-emerald-50 focus:outline-none focus:ring-1 focus:ring-emerald-500/40" />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-2 block text-[11px] text-emerald-200/50 uppercase tracking-wider">পেমেন্ট মাধ্যম</label>
                <div className="flex flex-wrap gap-2">
                  {PAYMENT_METHODS.map(pm => (
                    <button key={pm.value} type="button" onClick={() => togglePaymentMethod(pm.value)}
                      className={`inline-flex rounded-lg border px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                        form.paymentMethods.includes(pm.value)
                          ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-300"
                          : "border-emerald-500/15 bg-[#081610] text-emerald-200/40 hover:bg-emerald-500/10"
                      }`}>
                      {pm.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4 sm:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isAvailable}
                    onChange={e => updateField("isAvailable", e.target.checked)}
                    className="h-4 w-4 rounded border-emerald-500/30 bg-[#081610] text-emerald-500 focus:ring-emerald-500/40" />
                  <span className="text-sm text-emerald-200/70">স্টকে আছে</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.subscriptionEligible}
                    onChange={e => updateField("subscriptionEligible", e.target.checked)}
                    className="h-4 w-4 rounded border-emerald-500/30 bg-[#081610] text-emerald-500 focus:ring-emerald-500/40" />
                  <span className="text-sm text-emerald-200/70">সাবস্ক্রিপশনযোগ্য</span>
                </label>
              </div>
            </div>
          </div>

          {/* Publisher & Editor */}
          <div className="rounded-2xl border border-emerald-500/15 bg-[#07130f]/80 p-4 sm:p-5">
            <h2 className="mb-4 text-sm font-bold text-emerald-200 uppercase tracking-wide">প্রকাশক ও সম্পাদক</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-[11px] text-emerald-200/50 uppercase tracking-wider">প্রকাশকের নাম *</label>
                <input type="text" required value={form.publisherName} onChange={e => updateField("publisherName", e.target.value)}
                  className="h-10 w-full rounded-lg border border-emerald-500/20 bg-[#081610] px-3 text-sm text-emerald-50 focus:outline-none focus:ring-1 focus:ring-emerald-500/40" />
              </div>
              <div>
                <label className="mb-1 block text-[11px] text-emerald-200/50 uppercase tracking-wider">প্রকাশনী *</label>
                <input type="text" required value={form.publisherOrg} onChange={e => updateField("publisherOrg", e.target.value)}
                  className="h-10 w-full rounded-lg border border-emerald-500/20 bg-[#081610] px-3 text-sm text-emerald-50 focus:outline-none focus:ring-1 focus:ring-emerald-500/40" />
              </div>
              <div>
                <label className="mb-1 block text-[11px] text-emerald-200/50 uppercase tracking-wider">সম্পাদকের নাম *</label>
                <input type="text" required value={form.editorName} onChange={e => updateField("editorName", e.target.value)}
                  className="h-10 w-full rounded-lg border border-emerald-500/20 bg-[#081610] px-3 text-sm text-emerald-50 focus:outline-none focus:ring-1 focus:ring-emerald-500/40" />
              </div>
              <div>
                <label className="mb-1 block text-[11px] text-emerald-200/50 uppercase tracking-wider">সম্পাদকের পদবি</label>
                <input type="text" value={form.editorRole} onChange={e => updateField("editorRole", e.target.value)}
                  className="h-10 w-full rounded-lg border border-emerald-500/20 bg-[#081610] px-3 text-sm text-emerald-50 focus:outline-none focus:ring-1 focus:ring-emerald-500/40" />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="rounded-2xl border border-emerald-500/15 bg-[#07130f]/80 p-4 sm:p-5">
            <h2 className="mb-4 text-sm font-bold text-emerald-200 uppercase tracking-wide">ট্যাগ</h2>
            <div>
              <label className="mb-1 block text-[11px] text-emerald-200/50 uppercase tracking-wider">ট্যাগ (কমা দিয়ে আলাদা করুন)</label>
              <input type="text" value={form.tags} onChange={e => updateField("tags", e.target.value)}
                placeholder="science, story, islamic"
                className="h-10 w-full rounded-lg border border-emerald-500/20 bg-[#081610] px-3 text-sm text-emerald-50 placeholder:text-emerald-300/20 focus:outline-none focus:ring-1 focus:ring-emerald-500/40" />
            </div>
          </div>

          {/* Contents */}
          <div className="rounded-2xl border border-emerald-500/15 bg-[#07130f]/80 p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-bold text-emerald-200 uppercase tracking-wide">সূচিপত্র</h2>
              <button type="button" onClick={addContent}
                className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-semibold text-emerald-300 hover:bg-emerald-500/20">
                <PlusIcon className="h-3 w-3" /> যোগ করুন
              </button>
            </div>
            {form.contents.length === 0 && (
              <p className="text-xs text-emerald-200/40">কোনো সূচিপত্র যোগ করা হয়নি।</p>
            )}
            <div className="space-y-3">
              {form.contents.map((c, i) => (
                <div key={i} className="flex flex-wrap items-end gap-2 rounded-lg border border-emerald-500/10 bg-[#081610] p-3">
                  <div className="w-32">
                    <label className="mb-1 block text-[9px] text-emerald-200/40 uppercase">ধরন</label>
                    <select value={c.type} onChange={e => updateContent(i, "type", e.target.value)}
                      className="h-9 w-full rounded-md border border-emerald-500/20 bg-[#050f08] px-2 text-xs text-emerald-50 focus:outline-none">
                      {CONTENT_TYPES.map(t => <option key={t} value={t}>{CONTENT_TYPE_LABELS[t]}</option>)}
                    </select>
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="mb-1 block text-[9px] text-emerald-200/40 uppercase">শিরোনাম</label>
                    <input type="text" value={c.title} onChange={e => updateContent(i, "title", e.target.value)}
                      className="h-9 w-full rounded-md border border-emerald-500/20 bg-[#050f08] px-2 text-xs text-emerald-50 focus:outline-none" />
                  </div>
                  <div className="w-36">
                    <label className="mb-1 block text-[9px] text-emerald-200/40 uppercase">লেখক</label>
                    <input type="text" value={c.author} onChange={e => updateContent(i, "author", e.target.value)}
                      className="h-9 w-full rounded-md border border-emerald-500/20 bg-[#050f08] px-2 text-xs text-emerald-50 focus:outline-none" />
                  </div>
                  <div className="w-20">
                    <label className="mb-1 block text-[9px] text-emerald-200/40 uppercase">পৃষ্ঠা</label>
                    <input type="number" min={1} value={c.page} onChange={e => updateContent(i, "page", Number(e.target.value))}
                      className="h-9 w-full rounded-md border border-emerald-500/20 bg-[#050f08] px-2 text-xs text-emerald-50 focus:outline-none" />
                  </div>
                  <button type="button" onClick={() => removeContent(i)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-red-500/20 bg-red-500/8 text-red-300 hover:bg-red-500/20">
                    <TrashIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center gap-3">
            <button type="submit" disabled={submitting}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/15 px-6 text-sm font-bold text-emerald-300 hover:bg-emerald-500/25 disabled:opacity-50">
              {submitting ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <SaveIcon className="h-4 w-4" />}
              {mode === "edit" ? "সম্পাদনা সংরক্ষণ" : "সংখ্যা যোগ করুন"}
            </button>
            <Link href="/dashboard/kishorkontho"
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-emerald-500/20 bg-[#081610] px-6 text-sm text-emerald-200 hover:bg-emerald-500/10">
              বাতিল
            </Link>
          </div>
        </form>
      </section>
    </div>
  )
}
