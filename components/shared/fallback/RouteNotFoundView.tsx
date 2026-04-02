import Link from "next/link"
import { Compass, Home, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import FallbackShell from "@/components/shared/fallback/FallbackShell"

type Props = {
  title?: string
  description?: string
}

export default function RouteNotFoundView({
  title = "Page not found",
  description = "The page you are trying to open does not exist or may have been moved to another location.",
}: Props) {
  return (
    <main className="relative grid min-h-[72vh] place-items-center px-4 py-10 sm:px-6">
      <FallbackShell
        badge="404"
        title={title}
        description={description}
        icon={<Compass className="h-3.5 w-3.5 text-(--status-warning)" />}
        actions={
          <>
            <Button asChild variant="outline" className="h-9 rounded-xl border-white/20 bg-white/5 px-4 text-(--text-strong) hover:bg-white/10">
              <Link href="/">
                <Home />
                Back to Home
              </Link>
            </Button>
            <Button asChild className="h-9 rounded-xl bg-(--status-success) px-4 text-[#05250f] hover:bg-[oklch(0.82_0.17_147)]">
              <Link href="/reports">
                Open Reports
                <ArrowRight />
              </Link>
            </Button>
          </>
        }
      />
    </main>
  )
}
