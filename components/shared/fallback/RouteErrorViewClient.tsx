"use client"

import Link from "next/link"
import { AlertTriangle, RefreshCcw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import FallbackShell from "@/components/shared/fallback/FallbackShell"

type Props = {
  title?: string
  description?: string
  onRetry?: () => void
}

export default function RouteErrorViewClient({
  title = "Something went wrong",
  description = "An unexpected issue interrupted this page. You can retry now or return to the homepage.",
  onRetry,
}: Props) {
  return (
    <main className="relative grid min-h-[72vh] place-items-center px-4 py-10 sm:px-6">
      <FallbackShell
        badge="System Alert"
        title={title}
        description={description}
        icon={<AlertTriangle className="h-3.5 w-3.5 text-(--status-danger)" />}
        actions={
          <>
            <Button
              type="button"
              onClick={onRetry}
              className="h-9 rounded-xl bg-(--status-danger) px-4 text-white hover:bg-[oklch(0.74_0.2_22)]"
            >
              <RefreshCcw />
              Try Again
            </Button>
            <Button asChild variant="outline" className="h-9 rounded-xl border-white/20 bg-white/5 px-4 text-(--text-strong) hover:bg-white/10">
              <Link href="/">
                <Home />
                Go Home
              </Link>
            </Button>
          </>
        }
      />
    </main>
  )
}
