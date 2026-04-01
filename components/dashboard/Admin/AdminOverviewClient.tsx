"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  ClipboardCheckIcon,
  FileTextIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UserCog2Icon,
  Users2Icon,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { getAllUsers, type ManagedUser, type UserRole } from "@/lib/userService"

const ROLE_LABEL: Record<UserRole, string> = {
  ADMIN: "Admin",
  ASSOCIATE: "Associate",
  MEMBER: "Member",
  SUPPORTER: "Supporter",
  WORKER: "Worker",
}

const SHIBIR_PILLARS = [
  { title: "Ilm & Tilawah", description: "Quran, Hadith, and Islamic study consistency.", progress: 78 },
  { title: "Amal & Discipline", description: "Namaz, self-critique, and daily accountability.", progress: 72 },
  { title: "Dawah Reach", description: "Friends contact, follow-up, and new circle outreach.", progress: 69 },
  { title: "Leadership Growth", description: "Exam readiness, viva progress, and mentorship depth.", progress: 74 },
]

function formatPercent(value: number) {
  return `${Math.max(0, Math.min(100, value))}%`
}

export function AdminOverviewClient() {
  const [users, setUsers] = useState<ManagedUser[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true)
        const data = await getAllUsers()
        setUsers(data)
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to load overview"
        toast.error(message)
      } finally {
        setIsLoading(false)
      }
    }

    void load()
  }, [])

  const totalUsers = users.length
  const activeUsers = users.filter((user) => user.emailVerified).length
  const blockedUsers = users.filter((user) => !user.emailVerified).length
  const roleCounts = useMemo(() => {
    const base: Record<UserRole, number> = {
      ADMIN: 0,
      ASSOCIATE: 0,
      MEMBER: 0,
      SUPPORTER: 0,
      WORKER: 0,
    }

    for (const user of users) {
      base[user.role] += 1
    }

    return base
  }, [users])

  const newestUsers = useMemo(
    () =>
      [...users]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5),
    [users],
  )

  return (
    <div className="min-h-screen bg-[#050f08] text-emerald-50">
      <section className="relative overflow-hidden border-b border-emerald-500/15 bg-[#071310] px-3 py-6 sm:px-4 md:px-8 md:py-7">
        <div className="pointer-events-none absolute -left-28 bottom-0 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-0 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold tracking-[1.2px] text-emerald-300 uppercase">
                <ShieldCheckIcon className="h-3.5 w-3.5" />
                Shibir Admin Overview
              </p>
              <h1 className="text-xl font-bold tracking-tight text-emerald-50 sm:text-2xl md:text-3xl">Overview & Operational Pulse</h1>
              <p className="mt-2 max-w-2xl text-xs text-emerald-100/70 sm:text-sm">
                Central snapshot of users, viva workflow, note operations, and Shibir growth focus.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:min-w-md lg:grid-cols-4">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/8 p-2.5 sm:p-3">
                <p className="text-[11px] text-emerald-200/70">Total Users</p>
                <p className="mt-1 text-lg font-bold text-emerald-200 sm:text-xl">{isLoading ? "..." : totalUsers}</p>
              </div>
              <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/8 p-2.5 sm:p-3">
                <p className="text-[11px] text-cyan-200/70">Active Users</p>
                <p className="mt-1 text-lg font-bold text-cyan-200 sm:text-xl">{isLoading ? "..." : activeUsers}</p>
              </div>
              <div className="rounded-xl border border-red-500/20 bg-red-500/8 p-2.5 sm:p-3">
                <p className="text-[11px] text-red-200/70">Blocked Users</p>
                <p className="mt-1 text-lg font-bold text-red-200 sm:text-xl">{isLoading ? "..." : blockedUsers}</p>
              </div>
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/8 p-2.5 sm:p-3">
                <p className="text-[11px] text-amber-200/70">Role Coverage</p>
                <p className="mt-1 text-lg font-bold text-amber-200 sm:text-xl">{Object.values(roleCounts).filter((v) => v > 0).length}/5</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-2 py-4 sm:px-4 sm:py-6 md:px-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          <div className="rounded-2xl border border-emerald-500/15 bg-[#07130f]/80 p-3 backdrop-blur-md sm:p-4 md:p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-emerald-100 sm:text-base">Admin Route Shortcuts</h2>
              <SparklesIcon className="h-4 w-4 text-emerald-300/70" />
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              <Link
                href="/dashboard/manage-users"
                className="group rounded-xl border border-emerald-500/20 bg-[#081610] p-3 transition hover:border-emerald-400/35 hover:bg-emerald-500/12"
              >
                <UserCog2Icon className="h-4 w-4 text-emerald-300" />
                <p className="mt-2 text-sm font-semibold text-emerald-100">Manage Users</p>
                <p className="mt-1 text-xs text-emerald-200/60">Role control, ban/unban, and search</p>
              </Link>

              <Link
                href="/dashboard/approve-viva"
                className="group rounded-xl border border-cyan-500/20 bg-[#081610] p-3 transition hover:border-cyan-400/35 hover:bg-cyan-500/12"
              >
                <ClipboardCheckIcon className="h-4 w-4 text-cyan-300" />
                <p className="mt-2 text-sm font-semibold text-emerald-100">Approve Viva</p>
                <p className="mt-1 text-xs text-emerald-200/60">Live chat, meet link, and marks</p>
              </Link>

              <Link
                href="/dashboard/note"
                className="group rounded-xl border border-amber-500/20 bg-[#081610] p-3 transition hover:border-amber-400/35 hover:bg-amber-500/12 sm:col-span-2 lg:col-span-1"
              >
                <FileTextIcon className="h-4 w-4 text-amber-300" />
                <p className="mt-2 text-sm font-semibold text-emerald-100">Note Desk</p>
                <p className="mt-1 text-xs text-emerald-200/60">Guidance notes and follow-up logs</p>
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-500/15 bg-[#07130f]/80 p-3 backdrop-blur-md sm:p-4 md:p-5">
            <h2 className="text-sm font-semibold text-emerald-100 sm:text-base">Shibir Focus Snapshot</h2>
            <p className="mt-1 text-xs text-emerald-200/60">Overview priorities from tarbiyah, amal, dawah, and leadership flow.</p>

            <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {SHIBIR_PILLARS.map((pillar) => (
                <article key={pillar.title} className="rounded-xl border border-emerald-500/15 bg-[#07140f] p-3">
                  <p className="text-xs font-semibold text-emerald-100">{pillar.title}</p>
                  <p className="mt-1 text-[11px] text-emerald-200/55">{pillar.description}</p>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-emerald-500/15">
                    <div className="h-full rounded-full bg-linear-to-r from-emerald-400 to-cyan-300" style={{ width: formatPercent(pillar.progress) }} />
                  </div>
                  <p className="mt-1 text-[11px] text-emerald-300/75">{formatPercent(pillar.progress)}</p>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-emerald-500/15 bg-[#07130f]/80 p-3 backdrop-blur-md sm:p-4 md:p-5">
            <h2 className="text-sm font-semibold text-emerald-100 sm:text-base">Role Distribution</h2>
            <p className="mt-1 text-xs text-emerald-200/60">Current user mix across all Shibir dashboard roles.</p>

            <div className="mt-3 space-y-2.5">
              {(Object.keys(roleCounts) as UserRole[]).map((role) => {
                const count = roleCounts[role]
                const percent = totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0
                return (
                  <div key={role} className="rounded-lg border border-emerald-500/15 bg-[#06100c] p-2.5">
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="font-medium text-emerald-100">{ROLE_LABEL[role]}</span>
                      <span className="text-emerald-300/80">{count}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-emerald-500/15">
                      <div className="h-full rounded-full bg-linear-to-r from-emerald-400 to-cyan-300" style={{ width: formatPercent(percent) }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-500/15 bg-[#07130f]/80 p-3 backdrop-blur-md sm:p-4 md:p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-emerald-100 sm:text-base">Recent Joiners</h2>
              <Users2Icon className="h-4 w-4 text-emerald-300/70" />
            </div>

            <div className="space-y-2">
              {newestUsers.length === 0 && !isLoading && (
                <div className="rounded-lg border border-emerald-500/15 bg-[#06100c] px-3 py-4 text-center text-xs text-emerald-200/60">
                  No recent user data found.
                </div>
              )}

              {isLoading && (
                <div className="rounded-lg border border-emerald-500/15 bg-[#06100c] px-3 py-4 text-center text-xs text-emerald-200/60">
                  Loading recent user list...
                </div>
              )}

              {!isLoading &&
                newestUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between rounded-lg border border-emerald-500/15 bg-[#06100c] px-3 py-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-emerald-100">{user.name || "Unnamed User"}</p>
                      <p className="mt-0.5 truncate text-[11px] text-emerald-200/55">{user.email}</p>
                    </div>
                    <div className="ml-2 text-right">
                      <p className="text-[11px] text-emerald-300/80">{ROLE_LABEL[user.role]}</p>
                      <p className="text-[10px] text-emerald-300/55">{new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
            </div>

            <div className="mt-3">
              <Button asChild className="h-9 w-full rounded-lg bg-emerald-500 text-[#03210f] hover:bg-emerald-400">
                <Link href="/dashboard/manage-users" className="inline-flex items-center justify-center gap-2 text-sm font-semibold">
                  Open User Control
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-500/15 bg-[#07130f]/80 p-3 backdrop-blur-md sm:p-4 md:p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-emerald-100 sm:text-base">Admin Readiness</h2>
              <CheckCircle2Icon className="h-4 w-4 text-emerald-300" />
            </div>
            <ul className="mt-2 space-y-1.5 text-xs text-emerald-200/70">
              <li>Daily note follow-up status is available from Note Desk.</li>
              <li>Viva chat and marks are managed from Approve Viva route.</li>
              <li>Role governance and access hygiene are handled in Manage Users.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
