import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 flex h-(--header-height) shrink-0 items-center gap-2 border-b border-emerald-500/20 bg-[linear-gradient(90deg,rgba(5,20,12,0.96)_0%,rgba(9,35,22,0.92)_55%,rgba(10,48,29,0.9)_100%)] backdrop-blur-md transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1 text-emerald-100 hover:bg-emerald-500/10 hover:text-emerald-300" />
        <Separator
          orientation="vertical"
          className="mx-2 bg-emerald-500/25 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-semibold tracking-wide text-emerald-50">Dashboard</h1>
      </div>
    </header>
  )
}
