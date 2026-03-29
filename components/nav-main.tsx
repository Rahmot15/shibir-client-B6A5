"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: React.ReactNode
  }[]
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup className="px-0">
      <SidebarGroupLabel className="mb-1 px-3 text-[9px] font-semibold tracking-[3px] text-emerald-500/35 uppercase">
        Navigation
      </SidebarGroupLabel>

      <SidebarGroupContent>
        <SidebarMenu className="gap-3">
          {items.map((item) => {
            const isActive = pathname === item.url || pathname.startsWith(item.url + "/")

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={isActive}
                  className={[
                    /* base */
                    "group relative h-10 rounded-xl px-3 font-medium transition-all duration-200",

                    /* icon size inside */
                    "[&_svg]:h-[15px] [&_svg]:w-[15px] [&_svg]:flex-shrink-0 [&_svg]:transition-colors [&_svg]:duration-200",

                    /* inactive */
                    "text-emerald-100/45 hover:bg-emerald-500/8 hover:text-emerald-100/80",
                    "[&_svg]:text-emerald-500/40 hover:[&_svg]:text-emerald-400/70",

                    /* active */
                    isActive && [
                      "bg-emerald-500/12 text-emerald-300",
                      "[&_svg]:text-emerald-400",
                      "shadow-[inset_0_0_0_1px_rgba(0,200,83,0.18)]",
                    ].join(" "),
                  ].join(" ")}
                >
                  <Link href={item.url} className="flex items-center gap-3 w-full">

                    {/* Active left-bar indicator */}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-emerald-400 shadow-[0_0_8px_rgba(0,200,83,0.6)]" />
                    )}

                    {/* Icon wrapper */}
                    <span className={[
                      "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-emerald-500/15 shadow-[0_0_12px_rgba(0,200,83,0.15)]"
                        : "bg-white/4 group-hover:bg-emerald-500/10",
                    ].join(" ")}>
                      {item.icon}
                    </span>

                    <span className="text-[13px] tracking-wide">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
