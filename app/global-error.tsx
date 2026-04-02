"use client"

import { useEffect } from "react"
import RouteErrorViewClient from "@/components/shared/fallback/RouteErrorViewClient"

export default function GlobalError({
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
    <html lang="en">
      <body className="bg-background text-foreground">
        <RouteErrorViewClient
          title="A global system error occurred"
          description="The application hit an unexpected state. You can retry, and if the issue persists, refresh the page."
          onRetry={reset}
        />
      </body>
    </html>
  )
}
