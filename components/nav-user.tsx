"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  CircleUserRoundIcon,
  BellIcon,
  LogOutIcon,
  ChevronUpIcon,
  SettingsIcon,
} from "lucide-react"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>

          {/* ── Trigger ── */}
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="group h-auto rounded-xl border border-emerald-500/10 bg-emerald-500/5 px-3 py-2.5 hover:border-emerald-500/20 hover:bg-emerald-500/10 data-[state=open]:border-emerald-500/25 data-[state=open]:bg-emerald-500/12 transition-all duration-200"
            >
              {/* Avatar */}
              <Avatar className="h-8 w-8 rounded-lg ring-1 ring-emerald-500/20">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg bg-emerald-500/15 text-[12px] font-bold text-emerald-400">
                  {initials}
                </AvatarFallback>
              </Avatar>

              {/* Name + email */}
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate text-[13px] font-semibold text-emerald-50">
                  {user.name}
                </span>
                <span className="truncate text-[10px] text-emerald-500/50 font-mono">
                  {user.email}
                </span>
              </div>

              {/* Chevron */}
              <ChevronUpIcon className="ml-auto h-3.5 w-3.5 text-emerald-500/40 transition-transform group-data-[state=open]:rotate-180" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          {/* ── Dropdown ── */}
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-xl border border-emerald-500/15 bg-[#071310] p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={6}
          >
            {/* User info header */}
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2.5 rounded-lg bg-emerald-500/6 px-3 py-2.5">
                <Avatar className="h-9 w-9 rounded-lg ring-1 ring-emerald-500/20">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg bg-emerald-500/15 text-[13px] font-bold text-emerald-400">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate text-[13px] font-semibold text-emerald-50">
                    {user.name}
                  </span>
                  <span className="truncate text-[11px] text-emerald-500/50 font-mono">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="my-1.5 bg-emerald-500/10" />

            {/* Menu items */}
            <DropdownMenuGroup className="space-y-0.5">
              <DropdownMenuItem className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] text-emerald-100/60 hover:bg-emerald-500/8 hover:text-emerald-200 focus:bg-emerald-500/8 focus:text-emerald-200 transition-colors [&_svg]:h-3.5 [&_svg]:w-3.5 [&_svg]:text-emerald-500/50">
                <CircleUserRoundIcon />
                প্রোফাইল
              </DropdownMenuItem>
              <DropdownMenuItem className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] text-emerald-100/60 hover:bg-emerald-500/8 hover:text-emerald-200 focus:bg-emerald-500/8 focus:text-emerald-200 transition-colors [&_svg]:h-3.5 [&_svg]:w-3.5 [&_svg]:text-emerald-500/50">
                <BellIcon />
                নোটিফিকেশন
              </DropdownMenuItem>
              <DropdownMenuItem className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] text-emerald-100/60 hover:bg-emerald-500/8 hover:text-emerald-200 focus:bg-emerald-500/8 focus:text-emerald-200 transition-colors [&_svg]:h-3.5 [&_svg]:w-3.5 [&_svg]:text-emerald-500/50">
                <SettingsIcon />
                সেটিংস
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="my-1.5 bg-emerald-500/10" />

            <DropdownMenuItem className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] text-red-400/70 hover:bg-red-500/8 hover:text-red-400 focus:bg-red-500/8 focus:text-red-400 transition-colors [&_svg]:h-3.5 [&_svg]:w-3.5 [&_svg]:text-red-400/60">
              <LogOutIcon />
              লগ আউট
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
