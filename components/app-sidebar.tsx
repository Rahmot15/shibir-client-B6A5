"use client"

import * as React from "react"
import Link from "next/link"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  BookOpenIcon,
  CheckCircleIcon,
  ClipboardListIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  StickyNoteIcon,
  UsersIcon,
  MoonIcon,
} from "lucide-react"

type Role = "SUPPORTER" | "WORKER" | "ASSOCIATE" | "MEMBER" | "ADMIN"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
}

const navByRole: Record<Role, { title: string; url: string; icon: React.ReactNode }[]> = {
  ADMIN: [
    { title: "Overview",      url: "/dashboard/overview",      icon: <LayoutDashboardIcon /> },
    { title: "Note",          url: "/dashboard/note",          icon: <StickyNoteIcon /> },
    { title: "Manage Users",  url: "/dashboard/manage-users",  icon: <UsersIcon /> },
    { title: "Approve Viva",  url: "/dashboard/approve-viva",  icon: <CheckCircleIcon /> },
  ],
  ASSOCIATE: [
    { title: "Overview", url: "/dashboard/overview", icon: <LayoutDashboardIcon /> },
    { title: "Note",     url: "/dashboard/note",     icon: <StickyNoteIcon /> },
    { title: "Syllabus", url: "/dashboard/syllabus", icon: <BookOpenIcon /> },
    { title: "Exam",     url: "/dashboard/exam",     icon: <ClipboardListIcon /> },
  ],
  MEMBER: [
    { title: "Overview",  url: "/dashboard/overview",  icon: <LayoutDashboardIcon /> },
    { title: "Note",      url: "/dashboard/note",      icon: <StickyNoteIcon /> },
    { title: "Guidance",  url: "/dashboard/guidance",  icon: <BookOpenIcon /> },
  ],
  SUPPORTER: [
    { title: "Overview", url: "/dashboard/overview", icon: <LayoutDashboardIcon /> },
    { title: "Report",   url: "/dashboard/report",   icon: <FileTextIcon /> },
    { title: "Note",     url: "/dashboard/note",     icon: <StickyNoteIcon /> },
    { title: "Syllabus", url: "/dashboard/syllabus", icon: <BookOpenIcon /> },
    { title: "Exam",     url: "/dashboard/exam",     icon: <ClipboardListIcon /> },
  ],
  WORKER: [
    { title: "Overview",          url: "/dashboard/overview",          icon: <LayoutDashboardIcon /> },
    { title: "Note",              url: "/dashboard/note",              icon: <StickyNoteIcon /> },
    { title: "Syllabus",          url: "/dashboard/syllabus",          icon: <BookOpenIcon /> },
    { title: "Exam",              url: "/dashboard/exam",              icon: <ClipboardListIcon /> },
  ],
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  role?: Role
  user?: { name: string; email: string; avatar: string }
}

export function AppSidebar({ role, user, ...props }: AppSidebarProps) {
  const navItems = role ? navByRole[role] : []

  return (
    <Sidebar collapsible="offcanvas" {...props}>

      {/* ── HEADER ── */}
      <SidebarHeader className="border-b border-emerald-500/10 bg-[#050f08]">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="h-auto rounded-xl px-3 py-3 hover:bg-emerald-500/8 active:bg-emerald-500/12 transition-all duration-200"
            >
              <Link href="/" className="flex items-center gap-3">
                {/* Logo mark */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-500/25 bg-emerald-500/10 shadow-[0_0_16px_rgba(0,200,83,0.15)]">
                  <MoonIcon className="h-4.5 w-4.5 text-emerald-400" strokeWidth={1.6} />
                </div>

                {/* Brand text */}
                <div className="flex flex-col leading-tight">
                  <span className="text-[15px] font-bold tracking-wide text-emerald-50">
                    Shibir
                  </span>
                  <span className="text-[10px] font-medium tracking-[3px] text-emerald-500/60 uppercase">
                    Dashboard
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* ── NAV ── */}
      <SidebarContent className="bg-[#050f08] px-2 py-3">

        {/* Role badge */}
        {role && (
          <div className="mb-3 px-2">
            <div className="flex items-center gap-2 rounded-lg border border-amber-500/15 bg-amber-500/6 px-3 py-2">
              <div className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
              <span className="text-[10px] font-semibold tracking-[2.5px] text-amber-400/80 uppercase font-mono">
                {role}
              </span>
            </div>
          </div>
        )}

        <NavMain items={navItems} />
      </SidebarContent>

      {/* ── FOOTER ── */}
      <SidebarFooter className="border-t border-emerald-500/10 bg-[#050f08] p-2">
        <NavUser user={user || data.user} />
      </SidebarFooter>

    </Sidebar>
  )
}
