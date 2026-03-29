import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { BellIcon, SearchIcon } from "lucide-react"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 flex h-(--header-height) shrink-0 items-center border-b border-emerald-500/10 bg-[#050f08]/95 backdrop-blur-md transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-2 px-4 lg:px-5">

        {/* Sidebar trigger */}
        <SidebarTrigger className="-ml-1 h-8 w-8 rounded-lg text-emerald-100/50 hover:bg-emerald-500/10 hover:text-emerald-300 transition-all duration-200" />

        <Separator
          orientation="vertical"
          className="mx-1 h-4 bg-emerald-500/15"
        />

        {/* Page title */}
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(0,200,83,0.7)]" />
          <h1 className="text-[14px] font-semibold tracking-wide text-emerald-50/90">
            Dashboard
          </h1>
        </div>

        {/* Spacer */}
        <div className="ml-auto flex items-center gap-2">

          {/* Search button */}
          <button className="flex h-8 items-center gap-2 rounded-lg border border-emerald-500/12 bg-emerald-500/5 px-3 text-[12px] text-emerald-100/35 transition-all duration-200 hover:border-emerald-500/22 hover:bg-emerald-500/10 hover:text-emerald-100/60">
            <SearchIcon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline font-mono tracking-wide">অনুসন্ধান...</span>
            <kbd className="hidden rounded border border-emerald-500/15 bg-emerald-500/8 px-1.5 py-0.5 text-[10px] font-mono text-emerald-500/40 sm:inline">
              ⌘K
            </kbd>
          </button>

          {/* Notification bell */}
          <button className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/12 bg-emerald-500/5 text-emerald-100/40 transition-all duration-200 hover:border-emerald-500/22 hover:bg-emerald-500/10 hover:text-emerald-300">
            <BellIcon className="h-4 w-4" />
            {/* Unread dot */}
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.7)]" />
          </button>

        </div>
      </div>
    </header>
  )
}
