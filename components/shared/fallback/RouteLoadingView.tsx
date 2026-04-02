import { LoaderCircle } from "lucide-react"
import FallbackShell from "@/components/shared/fallback/FallbackShell"

export default function RouteLoadingView() {
  return (
    <main className="relative grid min-h-[72vh] place-items-center px-4 py-10 sm:px-6">
      <FallbackShell
        badge="Preparing View"
        title="Loading your next screen"
        description="We are preparing content and syncing required data. This usually takes only a moment."
        icon={<LoaderCircle className="h-3.5 w-3.5 animate-spin text-(--status-success)" />}
        actions={
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-(--text-soft)">
            <span className="h-2 w-2 animate-pulse rounded-full bg-(--status-success)" />
            Please wait...
          </div>
        }
      />
    </main>
  )
}
