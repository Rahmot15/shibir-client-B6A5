"use client"

import Link       from "next/link"
import Image      from "next/image"
import { useAuth } from "@/components/auth/AuthContext"
import {
  LogOut, LayoutDashboard, Menu,
  FileText, ChevronRightIcon, XIcon,
  MoonStar,
} from "lucide-react"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet, SheetContent, SheetTrigger, SheetClose,
} from "@/components/ui/sheet"
import type { NavLink } from "./nav-links"

type Props = { links: NavLink[] }

/* ── Spinner ── */
function Spinner() {
  return (
    <div className="h-7 w-7 animate-spin rounded-full border border-emerald-500/12 border-t-emerald-500/60" />
  )
}

/* ── Avatar button ── */
function AvatarBtn({ user }: { user: { name?: string; email?: string; image?: string } }) {
  const initials = (user.name ?? "U")
    .split(" ").map(p => p[0]).join("").slice(0,2).toUpperCase()
  return (
    <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-emerald-500/25 bg-emerald-500/8 transition-all duration-200 hover:border-emerald-500/50 hover:shadow-[0_0_14px_rgba(0,200,83,0.18)]">
      {user.image ? (
        <Image src={user.image} alt={user.name || "User"} width={36} height={36} className="h-full w-full object-cover" />
      ) : (
        <span className="text-[12px] font-bold text-emerald-400">{initials}</span>
      )}
      {/* online dot */}
      <span className="absolute bottom-0.5 right-0.5 h-2 w-2 rounded-full border border-[#050f08] bg-emerald-400 shadow-[0_0_5px_rgba(74,222,128,0.8)]" />
    </div>
  )
}

export default function NavbarActionsClient({ links }: Props) {
  const { user, logout, loading } = useAuth()

  return (
    <>
      {/* ════════════════════════════════
          DESKTOP (≥ xl)
      ════════════════════════════════ */}
      <div className="hidden xl:flex xl:items-center xl:gap-2.5">
        {loading ? <Spinner /> : user ? (
          <>
            {/* Report link */}
            <Link href="/reports"
              className="flex items-center gap-1.5 rounded-lg border border-amber-500/28 bg-amber-500/8 px-3 py-1.5 text-[11px] font-semibold tracking-[1px] text-amber-300/90 transition-all duration-200 hover:border-amber-500/55 hover:bg-amber-500/15 hover:shadow-[0_0_14px_rgba(200,162,39,0.15)]">
              <FileText className="h-3.5 w-3.5" strokeWidth={2}/>
              রিপোর্ট
            </Link>

            {/* User dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="outline-none ring-0">
                  <AvatarBtn user={user}/>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" sideOffset={10}
                className="w-56 overflow-hidden rounded-2xl border border-white/8 bg-[#071310]/96 p-1 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl">

                {/* User info */}
                <DropdownMenuLabel className="px-3 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <AvatarBtn user={user}/>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-semibold text-emerald-50">{user.name}</p>
                      <p className="truncate text-[10px] font-mono text-white/30">{user.email}</p>
                    </div>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="my-0.5 bg-white/6"/>

                <DropdownMenuItem asChild className="cursor-pointer rounded-xl px-3 py-2 text-[12px] text-white/55 transition-colors focus:bg-emerald-500/10 focus:text-emerald-300">
                  <Link href="/dashboard" className="flex items-center gap-2.5">
                    <LayoutDashboard className="h-3.5 w-3.5" strokeWidth={1.8}/>
                    ড্যাশবোর্ড
                    <ChevronRightIcon className="ml-auto h-3 w-3 opacity-40"/>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="my-0.5 bg-white/6"/>

                <DropdownMenuItem onClick={logout}
                  className="cursor-pointer rounded-xl px-3 py-2 text-[12px] text-red-400/75 transition-colors focus:bg-red-500/10 focus:text-red-400">
                  <LogOut className="mr-2.5 h-3.5 w-3.5" strokeWidth={1.8}/>
                  লগআউট
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          /* Not logged in */
          <div className="flex items-center gap-2">
            <Link href="/login"
              className="rounded-lg border border-emerald-500/35 bg-emerald-500/6 px-4 py-1.5 text-[11px] font-semibold tracking-[1.5px] text-emerald-400 uppercase transition-all duration-200 hover:border-emerald-500/65 hover:bg-emerald-500/14 hover:shadow-[0_0_16px_rgba(0,200,83,0.14)]">
              লগইন
            </Link>
            <Link href="/register"
              className="rounded-lg border border-amber-500/28 bg-amber-500/6 px-4 py-1.5 text-[11px] font-semibold tracking-[1.5px] text-amber-400 uppercase transition-all duration-200 hover:border-amber-500/55 hover:bg-amber-500/12">
              রেজিস্টার
            </Link>
          </div>
        )}
      </div>

      {/* ════════════════════════════════
          MOBILE (< xl) — Sheet drawer
      ════════════════════════════════ */}
      <div className="flex items-center gap-2 xl:hidden">
        {/* Mobile report pill */}
        {!loading && user && (
          <Link href="/reports"
            className="flex items-center gap-1 rounded-lg border border-amber-500/28 bg-amber-500/8 px-2.5 py-1.5 text-[10px] font-semibold tracking-[1px] text-amber-300/85 transition-all hover:border-amber-500/50">
            <FileText className="h-3.5 w-3.5" strokeWidth={2}/>
            রিপোর্ট
          </Link>
        )}

        <Sheet>
          <SheetTrigger asChild>
            <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/25 bg-emerald-500/6 text-emerald-400 transition-all duration-200 hover:border-emerald-500/45 hover:bg-emerald-500/12">
              <Menu className="h-4 w-4" strokeWidth={2}/>
            </button>
          </SheetTrigger>

          <SheetContent side="right"
            className="flex w-[280px] flex-col border-l border-white/6 bg-[#060e0a] p-0 sm:w-[320px]">

            {/* Sheet header */}
            <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-emerald-500/28 bg-emerald-500/8">
                  <MoonStar className="h-3.5 w-3.5 text-emerald-400" strokeWidth={1.8}/>
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-emerald-50">ইসলামী ছাত্রশিবির</p>
                  <p className="text-[8px] uppercase tracking-[3px] text-emerald-500/45">Bangladesh</p>
                </div>
              </div>
              <SheetClose asChild>
                <button className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/8 text-white/28 transition-colors hover:border-white/16 hover:text-white/55">
                  <XIcon className="h-3.5 w-3.5" strokeWidth={2}/>
                </button>
              </SheetClose>
            </div>

            {/* Nav links */}
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
              <p className="mb-2 px-2 font-mono text-[9px] uppercase tracking-[3px] text-white/20">নেভিগেশন</p>
              {links.map(item => (
                <SheetClose asChild key={item.title}>
                  <Link href={item.url}
                    className="flex items-center justify-between rounded-xl px-3 py-2.5 text-[13px] font-medium text-white/45 transition-colors hover:bg-emerald-500/8 hover:text-emerald-300">
                    {item.title}
                    <ChevronRightIcon className="h-3.5 w-3.5 opacity-30" strokeWidth={2}/>
                  </Link>
                </SheetClose>
              ))}
            </div>

            {/* Auth section */}
            <div className="border-t border-white/5 px-3 py-4 space-y-2">
              {loading ? (
                <div className="flex justify-center py-2"><Spinner /></div>
              ) : user ? (
                <>
                  {/* User card */}
                  <div className="flex items-center gap-2.5 rounded-xl border border-white/6 bg-white/2 px-3 py-2.5">
                    <AvatarBtn user={user}/>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-semibold text-white/75">{user.name}</p>
                      <p className="truncate font-mono text-[10px] text-white/28">{user.email}</p>
                    </div>
                  </div>

                  <SheetClose asChild>
                    <Link href="/dashboard"
                      className="flex items-center justify-between rounded-xl border border-emerald-500/25 bg-emerald-500/8 px-4 py-2.5 text-[12px] font-semibold text-emerald-400 transition-all hover:border-emerald-500/45 hover:bg-emerald-500/14">
                      <div className="flex items-center gap-2">
                        <LayoutDashboard className="h-3.5 w-3.5" strokeWidth={1.8}/>
                        ড্যাশবোর্ড
                      </div>
                      <ChevronRightIcon className="h-3.5 w-3.5 opacity-50" strokeWidth={2}/>
                    </Link>
                  </SheetClose>

                  <button onClick={logout}
                    className="flex w-full items-center gap-2 rounded-xl border border-red-500/15 bg-red-500/5 px-4 py-2.5 text-[12px] font-medium text-red-400/70 transition-all hover:border-red-500/28 hover:bg-red-500/10 hover:text-red-400">
                    <LogOut className="h-3.5 w-3.5" strokeWidth={1.8}/>
                    লগআউট
                  </button>
                </>
              ) : (
                <>
                  <SheetClose asChild>
                    <Link href="/login"
                      className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/35 bg-emerald-500/8 px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[1.5px] text-emerald-400 transition-all hover:border-emerald-500/60 hover:bg-emerald-500/14">
                      লগইন
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="/register"
                      className="flex items-center justify-center gap-2 rounded-xl border border-amber-500/25 bg-amber-500/6 px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[1.5px] text-amber-400 transition-all hover:border-amber-500/45 hover:bg-amber-500/12">
                      রেজিস্টার
                    </Link>
                  </SheetClose>
                </>
              )}
            </div>

          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
