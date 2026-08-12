/* ══════════════════════════════════════════════════════
   kisorkontho/data.ts
   Types + API helpers for কিশোরকণ্ঠ magazine pages
══════════════════════════════════════════════════════ */

export type PaymentMethod = "bkash" | "nagad" | "rocket" | "card" | "bank"
export type PurchaseType  = "physical" | "digital" | "both"
export type ContentType   = "story" | "poem" | "science" | "islamic" | "quiz" | "art" | "travel"

export interface ContentItem {
  type:   ContentType
  title:  string
  author: string
  page:   number
}

export interface Review {
  id:      string
  user:    { id: string; name: string; image?: string }
  rating:  number
  comment: string
  isEdited:   boolean
  isApproved: boolean
  isReported: boolean
  createdAt: string
  updatedAt: string
}

export interface KisorkonthoIssue {
  id:                  string
  title:               string
  month:               string
  year:                number
  price:               number | string
  discount:            number
  finalPrice:          number | string
  currency:            string
  coverImage:          string
  description:         string
  slug:                string
  pdfFull:             string | null
  pdfPreview:          string | null
  isFreePreview:       boolean
  purchaseType:        string
  stock:               number
  isAvailable:         boolean
  paymentMethods:      string[]
  subscriptionEligible:boolean
  language:            string
  publisherName:       string
  publisherOrg:        string
  editorName:          string
  editorRole:          string
  contents:            ContentItem[]
  tags:                string[]
  averageRating:       number | string
  ratingCount:         number
  views:               number
  downloads:           number
  purchases:           number | string
  reviews:             Review[]
  createdAt:           string
  updatedAt:           string
}

/* ── helpers ── */
export const CURRENCY_SYMBOL: Record<string, string> = { BDT: "৳" }

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  bkash:  "bKash",
  nagad:  "Nagad",
  rocket: "Rocket",
  card:   "Card",
  bank:   "Bank",
}

export const CONTENT_LABELS: Record<ContentType, string> = {
  story:   "গল্প",
  poem:    "কবিতা",
  science: "বিজ্ঞান",
  islamic: "ইসলাম",
  quiz:    "কুইজ",
  art:     "শিল্পকলা",
  travel:  "ভ্রমণ",
}

export const CONTENT_COLORS: Record<ContentType, string> = {
  story:   "#4ade80",
  poem:    "#c084fc",
  science: "#60a5fa",
  islamic: "#fbbf24",
  quiz:    "#fb923c",
  art:     "#f472b6",
  travel:  "#2dd4bf",
}

export function paymentLabel(m: string) {
  return PAYMENT_LABELS[m as PaymentMethod] ?? m
}
export function contentLabel(t: string) {
  return CONTENT_LABELS[t as ContentType] ?? t
}
export function contentColor(t: string) {
  return CONTENT_COLORS[t as ContentType] ?? "#94a3b8"
}

/* ══════════════════════════════════════════════════════
   API FETCH FUNCTIONS
══════════════════════════════════════════════════════ */

const API_BASE = "/api/v1/kishorkontho"
const API_BASE_SERVER = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/kishorkontho`

export async function fetchKishorkonthoIssues(params?: {
  page?: number
  limit?: number
  search?: string
  month?: string
  year?: string
  purchaseType?: string
}) {
  const query = new URLSearchParams()
  if (params?.page) query.set("page", String(params.page))
  if (params?.limit) query.set("limit", String(params.limit))
  if (params?.search) query.set("search", params.search)
  if (params?.month) query.set("month", params.month)
  if (params?.year) query.set("year", params.year)
  if (params?.purchaseType) query.set("purchaseType", params.purchaseType)

  const res = await fetch(`${API_BASE}?${query.toString()}`, { cache: "no-store" })
  const data = await res.json()

  if (!data.success) throw new Error(data.message || "Failed to fetch issues")
  return { issues: data.data as KisorkonthoIssue[], meta: data.meta }
}

export async function fetchKishorkonthoBySlug(slug: string) {
  const res = await fetch(`${API_BASE_SERVER}/slug/${slug}`, { cache: "no-store" })
  const data = await res.json()

  if (!data.success) return null
  return data.data as KisorkonthoIssue
}

export async function fetchRelatedIssues(currentSlug: string, limit = 4) {
  const res = await fetch(`${API_BASE_SERVER}?limit=${limit + 5}`, { cache: "no-store" })
  const data = await res.json()

  if (!data.success) return []
  return (data.data as KisorkonthoIssue[]).filter(i => i.slug !== currentSlug).slice(0, limit)
}

export async function trackDownload(issueId: string) {
  await fetch(`${API_BASE_SERVER}/${issueId}/download`, {
    method: "POST",
    credentials: "include",
  })
}

export async function updateReview(issueId: string, reviewId: string, data: { rating?: number; comment?: string }) {
  const res = await fetch(`${API_BASE_SERVER}/${issueId}/reviews/${reviewId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  })
  const result = await res.json()
  if (!result.success) throw new Error(result.message)
  return result.data
}

export async function deleteReview(issueId: string, reviewId: string) {
  const res = await fetch(`${API_BASE_SERVER}/${issueId}/reviews/${reviewId}`, {
    method: "DELETE",
    credentials: "include",
  })
  const result = await res.json()
  if (!result.success) throw new Error(result.message)
  return result
}

export async function reportReview(issueId: string, reviewId: string, reason: string) {
  const res = await fetch(`${API_BASE_SERVER}/${issueId}/reviews/${reviewId}/report`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ reason }),
  })
  const result = await res.json()
  if (!result.success) throw new Error(result.message)
  return result
}
