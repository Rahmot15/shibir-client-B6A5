const API_BASE = "/api/v1"

export type ReportedReview = {
  id: string
  rating: number
  comment: string
  isApproved: boolean
  isReported: boolean
  reportReason: string | null
  reportedBy: string[]
  createdAt: string
  user: { id: string; name: string; image?: string }
  issue: { id: string; title: string; slug: string }
}

export async function getReportedReviews(): Promise<ReportedReview[]> {
  const res = await fetch(`${API_BASE}/kishorkontho/reviews/reported`, {
    credentials: "include",
  })
  const json = await res.json()
  if (!json.success) throw new Error(json.message || "Failed to fetch reported reviews")
  return json.data
}

export async function moderateReview(
  reviewId: string,
  approve: boolean
): Promise<ReportedReview> {
  const res = await fetch(`${API_BASE}/kishorkontho/reviews/${reviewId}/moderate`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ approve }),
  })
  const json = await res.json()
  if (!json.success) throw new Error(json.message || "Failed to moderate review")
  return json.data
}

export async function deleteReviewAsAdmin(
  issueId: string,
  reviewId: string
): Promise<void> {
  const res = await fetch(`${API_BASE}/kishorkontho/${issueId}/reviews/${reviewId}`, {
    method: "DELETE",
    credentials: "include",
  })
  const json = await res.json()
  if (!json.success) throw new Error(json.message || "Failed to delete review")
}
