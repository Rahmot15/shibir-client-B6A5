"use client"

import { useEffect, useMemo, useState } from "react"
import {
  BanIcon,
  CheckCircle2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FilterIcon,
  MoreHorizontalIcon,
  SearchIcon,
  ShieldCheckIcon,
  UserCheck2Icon,
  UserRoundIcon,
  UsersIcon,
} from "lucide-react"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  getAllUsers,
  setUserEmailVerified,
  updateUserRole as updateUserRoleApi,
  type ManagedUser,
  type UserRole,
} from "@/lib/userService"
import { cn } from "@/lib/utils"

type UserStatus = "ACTIVE" | "BANNED"

type DashboardUser = {
  id: string
  name: string
  email: string
  avatar?: string
  role: UserRole
  status: UserStatus
  joinedAt: string
  lastActive: string
}

const ROLES: UserRole[] = ["ADMIN", "ASSOCIATE", "MEMBER", "SUPPORTER", "WORKER"]
const STATUSES: Array<UserStatus | "ALL"> = ["ALL", "ACTIVE", "BANNED"]
const PAGE_SIZE = 8

function initials(name: string) {
  const parts = name.split(" ").filter(Boolean)
  return parts.slice(0, 2).map((part) => part[0]).join("").toUpperCase()
}

function roleTone(role: UserRole) {
  if (role === "ADMIN") return "text-amber-300 border-amber-500/25 bg-amber-500/12"
  if (role === "ASSOCIATE") return "text-cyan-300 border-cyan-500/25 bg-cyan-500/12"
  if (role === "MEMBER") return "text-emerald-300 border-emerald-500/25 bg-emerald-500/12"
  if (role === "SUPPORTER") return "text-indigo-300 border-indigo-500/25 bg-indigo-500/12"
  return "text-fuchsia-300 border-fuchsia-500/25 bg-fuchsia-500/12"
}

function statusTone(status: UserStatus) {
  if (status === "ACTIVE") return "text-emerald-300 border-emerald-500/25 bg-emerald-500/12"
  return "text-red-300 border-red-500/25 bg-red-500/12"
}

function mapManagedUser(user: ManagedUser): DashboardUser {
  return {
    id: user.id,
    name: user.name?.trim() || "Unnamed User",
    email: user.email,
    avatar: user.image || undefined,
    role: user.role,
    status: user.emailVerified ? "ACTIVE" : "BANNED",
    joinedAt: new Date(user.createdAt).toLocaleDateString(),
    lastActive: new Date(user.updatedAt).toLocaleDateString(),
  }
}

export function AdminManageUsersClient() {
  const [users, setUsers] = useState<DashboardUser[]>([])
  const [query, setQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<UserRole | "ALL">("ALL")
  const [statusFilter, setStatusFilter] = useState<UserStatus | "ALL">("ALL")
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [activeMutationUserId, setActiveMutationUserId] = useState<string | null>(null)

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true)
        const apiUsers = await getAllUsers()
        setUsers(apiUsers.map(mapManagedUser))
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to load users"
        toast.error(message)
      } finally {
        setIsLoading(false)
      }
    }

    void loadUsers()
  }, [])

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase()

    return users.filter((user) => {
      const matchesQuery =
        q.length === 0 ||
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        user.id.toLowerCase().includes(q)

      const matchesRole = roleFilter === "ALL" || user.role === roleFilter
      const matchesStatus = statusFilter === "ALL" || user.status === statusFilter

      return matchesQuery && matchesRole && matchesStatus
    })
  }, [query, roleFilter, statusFilter, users])

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)

  const pageStart = (currentPage - 1) * PAGE_SIZE
  const pageUsers = filteredUsers.slice(pageStart, pageStart + PAGE_SIZE)

  const stats = useMemo(() => {
    const total = users.length
    const active = users.filter((user) => user.status === "ACTIVE").length
    const banned = users.filter((user) => user.status === "BANNED").length
    return { total, active, banned }
  }, [users])

  const updateRole = async (userId: string, nextRole: UserRole) => {
    try {
      setActiveMutationUserId(userId)
      await updateUserRoleApi(userId, nextRole)
      setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, role: nextRole } : user)))
      toast.success(`Role updated to ${nextRole}`)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update role"
      toast.error(message)
    } finally {
      setActiveMutationUserId(null)
    }
  }

  const toggleBan = async (userId: string) => {
    const target = users.find((user) => user.id === userId)
    if (!target) return

    const nextEmailVerified = target.status === "BANNED"

    try {
      setActiveMutationUserId(userId)
      await setUserEmailVerified(userId, nextEmailVerified)
      setUsers((prev) =>
        prev.map((user) => {
          if (user.id !== userId) return user
          return {
            ...user,
            status: nextEmailVerified ? "ACTIVE" : "BANNED",
          }
        }),
      )

      if (nextEmailVerified) {
        toast.success("User unbanned")
      } else {
        toast.warning("User has been banned")
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update user status"
      toast.error(message)
    } finally {
      setActiveMutationUserId(null)
    }
  }

  const clearFilters = () => {
    setQuery("")
    setRoleFilter("ALL")
    setStatusFilter("ALL")
    setPage(1)
  }

  return (
    <div className="min-h-screen bg-[#050f08] text-emerald-50">
      <section className="relative overflow-hidden border-b border-emerald-500/15 bg-[#071310] px-3 py-6 sm:px-4 md:px-8 md:py-7">
        <div className="pointer-events-none absolute -left-24 bottom-0 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-28 top-0 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-col gap-5 md:gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold tracking-[1.2px] text-emerald-300 uppercase">
                <ShieldCheckIcon className="h-3.5 w-3.5" />
                Admin Console
              </p>
              <h1 className="text-xl font-bold tracking-tight text-emerald-50 sm:text-2xl md:text-3xl">Manage Users</h1>
              <p className="mt-2 max-w-2xl text-xs text-emerald-100/70 sm:text-sm">
                Search, filter, update role, and ban or unban users from one place.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:min-w-110 lg:grid-cols-4">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/8 p-2.5 sm:p-3">
                <p className="text-[11px] text-emerald-200/70">Total Users</p>
                <p className="mt-1 text-lg font-bold text-emerald-200 sm:text-xl">{stats.total}</p>
              </div>
              <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/8 p-2.5 sm:p-3">
                <p className="text-[11px] text-cyan-200/70">Active</p>
                <p className="mt-1 text-lg font-bold text-cyan-200 sm:text-xl">{stats.active}</p>
              </div>
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/8 p-2.5 sm:p-3">
                <p className="text-[11px] text-amber-200/70">Verified</p>
                <p className="mt-1 text-lg font-bold text-amber-200 sm:text-xl">{stats.active}</p>
              </div>
              <div className="rounded-xl border border-red-500/20 bg-red-500/8 p-2.5 sm:p-3">
                <p className="text-[11px] text-red-200/70">Banned</p>
                <p className="mt-1 text-lg font-bold text-red-200 sm:text-xl">{stats.banned}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-2 py-4 sm:px-4 sm:py-6 md:px-8">
        <div className="rounded-2xl border border-emerald-500/15 bg-[#07130f]/80 p-2.5 backdrop-blur-md sm:p-4 md:p-5">
          <div className="flex flex-col gap-2.5 sm:gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-300/50" />
              <Input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value)
                  setPage(1)
                }}
                placeholder="Search by name, email, or user ID"
                className="h-9 border-emerald-500/20 bg-[#081610] pl-9 text-sm text-emerald-50 placeholder:text-emerald-200/35"
              />
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-center">
              <div className="inline-flex w-full items-center gap-2 rounded-lg border border-emerald-500/15 bg-emerald-500/8 px-2 py-1 sm:w-auto">
                <FilterIcon className="h-3.5 w-3.5 text-emerald-300/75" />
                <select
                  value={roleFilter}
                  onChange={(event) => {
                    setRoleFilter(event.target.value as UserRole | "ALL")
                    setPage(1)
                  }}
                  className="h-7 min-w-0 flex-1 rounded-md border border-emerald-500/20 bg-[#07130f] px-2 text-xs text-emerald-50 outline-none sm:min-w-29.5 sm:flex-none"
                >
                  <option value="ALL">All Roles</option>
                  {ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <div className="inline-flex w-full items-center gap-2 rounded-lg border border-emerald-500/15 bg-emerald-500/8 px-2 py-1 sm:w-auto">
                <FilterIcon className="h-3.5 w-3.5 text-emerald-300/75" />
                <select
                  value={statusFilter}
                  onChange={(event) => {
                    setStatusFilter(event.target.value as UserStatus | "ALL")
                    setPage(1)
                  }}
                  className="h-7 min-w-0 flex-1 rounded-md border border-emerald-500/20 bg-[#07130f] px-2 text-xs text-emerald-50 outline-none sm:min-w-29.5 sm:flex-none"
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status === "ALL" ? "All Status" : status}
                    </option>
                  ))}
                </select>
              </div>

              <Button variant="outline" size="sm" onClick={clearFilters} className="h-9 w-full border-emerald-500/20 bg-[#081610] text-emerald-200 hover:bg-emerald-500/15 sm:w-auto">
                Reset
              </Button>
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border border-emerald-500/15 sm:mt-5">
            <div className="hidden grid-cols-[2.3fr_1.2fr_1fr_1fr_1.2fr_0.8fr] gap-3 border-b border-emerald-500/12 bg-emerald-500/8 px-4 py-3 text-[11px] font-semibold tracking-wide text-emerald-200/70 uppercase md:grid">
              <p>User</p>
              <p>User ID</p>
              <p>Role</p>
              <p>Status</p>
              <p>Last Active</p>
              <p className="text-right">Actions</p>
            </div>

            <div className="divide-y divide-emerald-500/12 bg-[#060f0b]">
              {isLoading && (
                <div className="flex flex-col items-center justify-center gap-2 px-5 py-12 text-center">
                  <UsersIcon className="h-9 w-9 animate-pulse text-emerald-300/40" />
                  <p className="text-sm font-medium text-emerald-100/80">Loading users...</p>
                </div>
              )}

              {!isLoading && pageUsers.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-2 px-5 py-12 text-center">
                  <UsersIcon className="h-9 w-9 text-emerald-300/40" />
                  <p className="text-sm font-medium text-emerald-100/80">No users found</p>
                  <p className="text-xs text-emerald-200/50">Try changing filters or search keyword.</p>
                </div>
              )}

              {!isLoading && pageUsers.map((user) => (
                <div key={user.id} className="grid gap-3 px-3 py-3.5 sm:px-4 sm:py-4 md:grid-cols-[2.3fr_1.2fr_1fr_1fr_1.2fr_0.8fr] md:items-center">
                  <div className="flex items-center gap-3">
                    <Avatar size="sm" className="ring-1 ring-emerald-500/20">
                      {user.avatar ? <AvatarImage src={user.avatar} alt={user.name} /> : null}
                      <AvatarFallback className="bg-emerald-500/10 text-emerald-200">{initials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-emerald-50">{user.name}</p>
                      <p className="text-xs text-emerald-200/60">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-emerald-200/70 md:justify-start">
                    <UserRoundIcon className="h-3.5 w-3.5" />
                    {user.id}
                  </div>

                  <div className="flex items-center gap-2 md:block">
                    <span className="text-[10px] tracking-wide text-emerald-200/55 uppercase md:hidden">Role</span>
                    <span className={cn("inline-flex rounded-md border px-2 py-1 text-[11px] font-semibold", roleTone(user.role))}>
                      {user.role}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 md:block">
                    <span className="text-[10px] tracking-wide text-emerald-200/55 uppercase md:hidden">Status</span>
                    <span className={cn("inline-flex rounded-md border px-2 py-1 text-[11px] font-semibold", statusTone(user.status))}>
                      {user.status}
                    </span>
                  </div>

                  <p className="text-xs text-emerald-200/65"><span className="md:hidden">Last active: </span>{user.lastActive}</p>

                  <div className="flex justify-start md:justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon-sm" className="h-8 w-8 border-emerald-500/20 bg-[#081610] text-emerald-100 hover:bg-emerald-500/15 md:h-9 md:w-9">
                          <MoreHorizontalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="w-52 border border-emerald-500/20 bg-[#0b1d14] text-emerald-50">
                        <DropdownMenuLabel className="text-[11px] tracking-wide uppercase">Change Role</DropdownMenuLabel>
                        {ROLES.map((role) => (
                          <DropdownMenuItem
                            key={role}
                            onClick={() => updateRole(user.id, role)}
                            className="justify-between"
                            disabled={activeMutationUserId === user.id}
                          >
                            <span>{role}</span>
                            {user.role === role && <CheckCircle2Icon className="h-3.5 w-3.5 text-emerald-300" />}
                          </DropdownMenuItem>
                        ))}

                        <DropdownMenuSeparator className="bg-emerald-500/20" />

                        <DropdownMenuItem
                          variant={user.status === "BANNED" ? "default" : "destructive"}
                          onClick={() => toggleBan(user.id)}
                          disabled={activeMutationUserId === user.id}
                        >
                          {user.status === "BANNED" ? (
                            <>
                              <UserCheck2Icon className="h-3.5 w-3.5" />
                              Unban User
                            </>
                          ) : (
                            <>
                              <BanIcon className="h-3.5 w-3.5" />
                              Ban User
                            </>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="text-[11px] text-emerald-200/45 md:hidden">ID: {user.id} • Joined {user.joinedAt}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2.5 text-xs text-emerald-200/70 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
            <p className="px-1">
              Showing <span className="font-semibold text-emerald-100">{filteredUsers.length === 0 ? 0 : pageStart + 1}</span> to{" "}
              <span className="font-semibold text-emerald-100">{Math.min(pageStart + PAGE_SIZE, filteredUsers.length)}</span> of{" "}
              <span className="font-semibold text-emerald-100">{filteredUsers.length}</span> users
            </p>

            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:flex">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                className="h-8 w-full border-emerald-500/20 bg-[#081610] px-2 text-emerald-100 hover:bg-emerald-500/15 sm:w-auto"
              >
                <ChevronLeftIcon className="h-3.5 w-3.5" />
                Prev
              </Button>

              <span className="text-center rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-1.5 text-[11px] font-semibold tracking-wide sm:px-3">
                Page {currentPage} / {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                className="h-8 w-full border-emerald-500/20 bg-[#081610] px-2 text-emerald-100 hover:bg-emerald-500/15 sm:w-auto"
              >
                Next
                <ChevronRightIcon className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
