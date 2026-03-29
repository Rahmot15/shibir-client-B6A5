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
  ShieldCheckIcon,
  UsersIcon,
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
    { title: "Overview", url: "/dashboard/overview", icon: <LayoutDashboardIcon /> },
    { title: "Manage Users", url: "/dashboard/manage-users", icon: <UsersIcon /> },
    { title: "Approve Viva", url: "/dashboard/approve-viva", icon: <CheckCircleIcon /> },
  ],
  ASSOCIATE: [
    { title: "Overview", url: "/dashboard/overview", icon: <LayoutDashboardIcon /> },
    { title: "Exam", url: "/dashboard/exam", icon: <ClipboardListIcon /> },
    { title: "Report", url: "/dashboard/report", icon: <FileTextIcon /> },
  ],
  MEMBER: [
    { title: "Overview", url: "/dashboard/overview", icon: <LayoutDashboardIcon /> },
    { title: "Guidance", url: "/dashboard/guidance", icon: <BookOpenIcon /> },
    { title: "Report", url: "/dashboard/report", icon: <FileTextIcon /> },
  ],
  SUPPORTER: [
    { title: "Overview", url: "/dashboard/overview", icon: <LayoutDashboardIcon /> },
    { title: "Exam", url: "/dashboard/exam", icon: <ClipboardListIcon /> },
    { title: "Syllabus", url: "/dashboard/syllabus", icon: <BookOpenIcon /> },
    { title: "Report", url: "/dashboard/report", icon: <FileTextIcon /> },
  ],
  WORKER: [
    { title: "Overview", url: "/dashboard/overview", icon: <LayoutDashboardIcon /> },
    { title: "Exam", url: "/dashboard/exam", icon: <ClipboardListIcon /> },
    { title: "Responsibilities", url: "/dashboard/responsibilities", icon: <ShieldCheckIcon /> },
    { title: "Report", url: "/dashboard/report", icon: <FileTextIcon /> },
  ],
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  role?: Role
  user?: {
    name: string
    email: string
    avatar: string
  }
}

export function AppSidebar({ role, user, ...props }: AppSidebarProps) {
  const navItems = role ? navByRole[role] : []

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:rounded-lg data-[slot=sidebar-menu-button]:p-2! data-[slot=sidebar-menu-button]:hover:bg-emerald-500/10"
            >
              <Link href="/dashboard/overview">
                <LayoutDashboardIcon className="size-5! text-emerald-400" />
                <span className="text-base font-semibold tracking-wide text-emerald-50">Shibir Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user || data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
