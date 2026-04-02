import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { cookies, headers } from "next/headers"
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
  const cookieStore = await cookies()
  const headerStore = await headers()
  const host = headerStore.get("host")
  const protocol = host?.includes("localhost") ? "http" : "https"
  const baseUrl = host ? `${protocol}://${host}` : "http://localhost:3000"

  const res = await fetch(`${baseUrl}/api/v1/auth/me`, {
    headers: { Cookie: cookieStore.toString() },
    cache: "no-store",
  })

  const result = await res.json()
  const role = result?.data?.role as Role

  if (!role) redirect("/login")

  const roleUI: Record<Role, React.ReactNode> = {
    SUPPORTER: supporter,
    WORKER:    worker,
    ASSOCIATE: associate,
    MEMBER:    member,
    ADMIN:     admin,
  }

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 68)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar
        variant="inset"
        role={role}
        user={result?.data ? {
          name:   result.data.name,
          email:  result.data.email,
          avatar: result.data.image || "",
        } : undefined}
      />
      <SidebarInset className="bg-[#050f08]">
        <SiteHeader />
        <div className="flex flex-1 flex-col p-4 lg:p-6">
          {roleUI[role]}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
