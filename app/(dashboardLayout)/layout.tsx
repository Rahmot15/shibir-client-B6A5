import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

type Role = "SUPPORTER" | "WORKER" | "ASSOCIATE" | "MEMBER" | "ADMIN"

export default async function DashboardLayout({
  supporter,
  worker,
  associate,
  member,
  admin,
}: {
  supporter: React.ReactNode
  worker: React.ReactNode
  associate: React.ReactNode
  member: React.ReactNode
  admin: React.ReactNode
}) {
  // `cookies()` is async in Next 15+
  const cookieStore = await cookies()

  const res = await fetch(`http://localhost:5000/api/v1/auth/me`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
    cache: "no-store",
  })

  const result = await res.json()
  const role = result?.data?.role as Role

  if (!role) {
    redirect("/login")
  }

  const roleUI: Record<Role, React.ReactNode> = {
    SUPPORTER: supporter,
    WORKER: worker,
    ASSOCIATE: associate,
    MEMBER: member,
    ADMIN: admin,
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar
        variant="inset"
        role={role}
        user={result?.data ? {
          name: result.data.name,
          email: result.data.email,
          avatar: result.data.image || ""
        } : undefined}
      />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          {roleUI[role]}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
