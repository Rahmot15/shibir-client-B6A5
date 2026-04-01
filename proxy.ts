import { NextRequest, NextResponse } from "next/server"

type Role = "SUPPORTER" | "WORKER" | "ASSOCIATE" | "MEMBER" | "ADMIN"

const allowedRoutesByRole: Record<Role, string[]> = {
  ADMIN: [
    "/dashboard/overview",
    "/dashboard/note",
    "/dashboard/manage-users",
    "/dashboard/approve-viva",
  ],
  ASSOCIATE: ["/dashboard/overview", "/dashboard/note", "/dashboard/exam", "/dashboard/syllabus"],
  MEMBER: ["/dashboard/overview", "/dashboard/note", "/dashboard/guidance", "/dashboard/syllabus"],
  SUPPORTER: ["/dashboard/overview", "/dashboard/note", "/dashboard/exam", "/dashboard/syllabus", "/dashboard/report"],
  WORKER: ["/dashboard/overview", "/dashboard/note", "/dashboard/exam", "/dashboard/syllabus"],
}

const reportPageAllowedRoles: Role[] = ["WORKER", "MEMBER", "ASSOCIATE"]

function matchesRoute(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(`${route}/`)
}

function isAllowedForRole(pathname: string, role: Role) {
  if (pathname === "/dashboard") {
    return true
  }

  return allowedRoutesByRole[role].some((route) => matchesRoute(pathname, route))
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isDashboardRoute = pathname.startsWith("/dashboard")
  const isReportsRoute = pathname === "/reports" || pathname.startsWith("/reports/")

  if (!isDashboardRoute && !isReportsRoute) {
    return NextResponse.next()
  }

  const cookie = request.headers.get("cookie") ?? ""

  const meResponse = await fetch("http://localhost:5000/api/v1/auth/me", {
    headers: {
      Cookie: cookie,
    },
    cache: "no-store",
  })

  if (!meResponse.ok) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  const meResult = await meResponse.json()
  const role = meResult?.data?.role as Role | undefined

  if (!role) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (isDashboardRoute && pathname === "/dashboard") {
    return NextResponse.redirect(new URL("/dashboard/overview", request.url))
  }

  if (isDashboardRoute && !isAllowedForRole(pathname, role)) {
    return NextResponse.redirect(new URL("/dashboard/overview", request.url))
  }

  if (isReportsRoute && !reportPageAllowedRoles.includes(role)) {
    if (role === "SUPPORTER") {
      return NextResponse.redirect(new URL("/dashboard/report", request.url))
    }

    return NextResponse.redirect(new URL("/dashboard/overview", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/reports/:path*"],
}
