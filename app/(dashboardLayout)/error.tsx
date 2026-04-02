"use client"

import { useEffect } from "react"
import RouteErrorViewClient from "@/components/shared/fallback/RouteErrorViewClient"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <RouteErrorViewClient
      title="Dashboard failed to load"
      description="Some dashboard resources could not load. Retry to fetch the latest data."
      onRetry={reset}
    />
  )
}
