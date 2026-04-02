"use client"

import { useEffect } from "react"
import RouteErrorViewClient from "@/components/shared/fallback/RouteErrorViewClient"

export default function CommonLayoutError({
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
      title="This section is temporarily unavailable"
      description="Something interrupted this page. Retry now or move to another section from the top navigation."
      onRetry={reset}
    />
  )
}
