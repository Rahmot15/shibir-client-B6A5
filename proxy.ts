import { NextRequest, NextResponse } from "next/server"

type Role = "SUPPORTER" | "WORKER" | "ASSOCIATE" | "MEMBER" | "ADMIN"

const allowedRoutesByRole: Record<Role, string[]> = {
  ADMIN: ["/dashboard/overview", "/dashboard/manage-users", "/dashboard/approve-viva"],
  ASSOCIATE: ["/dashboard/overview", "/dashboard/exam", "/dashboard/report"],
  MEMBER: ["/dashboard/overview", "/dashboard/guidance", "/dashboard/report"],
  SUPPORTER: ["/dashboard/overview", "/dashboard/exam", "/dashboard/syllabus", "/dashboard/report"],
  WORKER: ["/dashboard/overview", "/dashboard/exam", "/dashboard/syllabus", "/dashboard/responsibilities", "/dashboard/report"],
}

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

  if (!pathname.startsWith("/dashboard")) {
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

  if (pathname === "/dashboard") {
    return NextResponse.redirect(new URL("/dashboard/overview", request.url))
  }

  if (!isAllowedForRole(pathname, role)) {
    return NextResponse.redirect(new URL("/dashboard/overview", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
