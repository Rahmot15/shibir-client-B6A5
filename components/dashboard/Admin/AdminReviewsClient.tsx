"use client"

import { useEffect, useState } from "react"
import {
  CheckCircle2Icon,
  SearchIcon,
  StarIcon,
  Trash2Icon,
  XCircleIcon,
} from "lucide-react"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  moderateReview,
  deleteReviewAsAdmin,
  getReportedReviews,
  type ReportedReview,
} from "@/lib/adminReviewService"
import { cn } from "@/lib/utils"

type FilterStatus = "ALL" | "REPORTED" | "APPROVED" | "REJECTED"

function initials(name: string) {
  const parts = name.split(" ").filter(Boolean)
  return parts
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase()
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon
          key={i}
          className={cn(
            "h-4 w-4",
            i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"
          )}
        />
      ))}
    </span>
  )
}

const STATUSES: FilterStatus[] = ["ALL", "REPORTED", "APPROVED", "REJECTED"]

export default function AdminReviewsClient() {
  const [reviews, setReviews] = useState<ReportedReview[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("ALL")
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    loadReviews()
  }, [])

  async function loadReviews() {
    setLoading(true)
    try {
      const data = await getReportedReviews()
      setReviews(data)
    } catch {
      toast.error("Failed to load reported reviews")
    } finally {
      setLoading(false)
    }
  }

  async function handleApprove(review: ReportedReview) {
    setActionLoading(review.id)
    try {
      await moderateReview(review.id, true)
      toast.success("Review approved")
      setReviews((prev) => prev.filter((r) => r.id !== review.id))
    } catch {
      toast.error("Failed to approve review")
    } finally {
      setActionLoading(null)
    }
  }

  async function handleReject(review: ReportedReview) {
    setActionLoading(review.id)
    try {
      await moderateReview(review.id, false)
      toast.success("Review rejected")
      setReviews((prev) => prev.filter((r) => r.id !== review.id))
    } catch {
      toast.error("Failed to reject review")
    } finally {
      setActionLoading(null)
    }
  }

  async function handleDelete(review: ReportedReview) {
    if (!confirm("Delete this review permanently?")) return
    setActionLoading(review.id)
    try {
      await deleteReviewAsAdmin(review.issue.id, review.id)
      toast.success("Review deleted")
      setReviews((prev) => prev.filter((r) => r.id !== review.id))
    } catch {
      toast.error("Failed to delete review")
    } finally {
      setActionLoading(null)
    }
  }

  const filtered = reviews.filter((r) => {
    const matchSearch =
      search === "" ||
      r.user.name.toLowerCase().includes(search.toLowerCase()) ||
      r.comment.toLowerCase().includes(search.toLowerCase()) ||
      r.issue.title.toLowerCase().includes(search.toLowerCase())

    const matchStatus =
      statusFilter === "ALL" ||
      (statusFilter === "APPROVED" && r.isApproved) ||
      (statusFilter === "REJECTED" && !r.isApproved && !r.isReported) ||
      (statusFilter === "REPORTED" && r.isReported)

    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reported Reviews</h1>
          <p className="text-muted-foreground mt-1">
            Moderate user-reported reviews
          </p>
        </div>
        <Button variant="outline" onClick={loadReviews} disabled={loading}>
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by user, comment, or issue..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          {STATUSES.map((s) => (
            <Button
              key={s}
              variant={statusFilter === s ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(s)}
            >
              {s}
            </Button>
          ))}
        </div>
      </div>

      {/* Review List */}
      {loading ? (
        <div className="py-12 text-center text-muted-foreground">
          Loading reported reviews...
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          No reported reviews found.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((review) => (
            <div
              key={review.id}
              className="rounded-lg border bg-card p-4 shadow-sm space-y-3"
            >
              {/* Top: User + Issue + Status */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={review.user.image} alt={review.user.name} />
                    <AvatarFallback>{initials(review.user.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{review.user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      on <span className="font-medium">{review.issue.title}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {review.isApproved ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                      <CheckCircle2Icon className="h-3 w-3" /> Approved
                    </span>
                  ) : review.isReported ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                      Reported
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">
                      Rejected
                    </span>
                  )}
                </div>
              </div>

              {/* Rating + Comment */}
              <div>
                <StarRating rating={review.rating} />
                <p className="mt-1 text-sm text-foreground">{review.comment}</p>
              </div>

              {/* Report Reason */}
              {review.reportReason && (
                <div className="rounded-md bg-red-50 p-3 text-sm">
                  <span className="font-medium text-red-700">Report reason: </span>
                  <span className="text-red-600">{review.reportReason}</span>
                </div>
              )}

              {/* Date + Actions */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-muted-foreground">
                  {new Date(review.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <div className="flex gap-2">
                  {!review.isApproved && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-600 hover:text-green-700"
                      onClick={() => handleApprove(review)}
                      disabled={actionLoading === review.id}
                    >
                      <CheckCircle2Icon className="mr-1 h-4 w-4" /> Approve
                    </Button>
                  )}
                  {review.isReported && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-yellow-600 hover:text-yellow-700"
                      onClick={() => handleReject(review)}
                      disabled={actionLoading === review.id}
                    >
                      <XCircleIcon className="mr-1 h-4 w-4" /> Reject
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(review)}
                    disabled={actionLoading === review.id}
                  >
                    <Trash2Icon className="mr-1 h-4 w-4" /> Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
