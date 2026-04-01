"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/components/auth/AuthContext";
import { User, LogOut, LayoutDashboard, Menu, FileText } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import type { NavLink } from "./nav-links";

type NavbarActionsClientProps = {
	links: NavLink[];
};

export default function NavbarActionsClient({ links }: NavbarActionsClientProps) {
	const { user, logout, loading } = useAuth();

	return (
		<>
			<div className="hidden xl:flex xl:items-center">
				{loading ? (
					<div className="h-7.5 w-7.5 animate-spin rounded-full border border-[rgba(0,200,83,0.1)] border-t-[rgba(0,200,83,0.6)]" />
				) : user ? (
					<div className="flex items-center gap-2.5">
						<Link
							href="/reports"
							className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(200,162,39,0.55)] bg-[rgba(200,162,39,0.15)] px-3.5 py-1.5 text-[11px] tracking-[1.2px] text-[#f6d46b] transition-all hover:border-[rgba(200,162,39,0.8)] hover:bg-[rgba(200,162,39,0.22)] hover:shadow-[0_0_16px_rgba(200,162,39,0.2)]"
						>
							<FileText className="h-3.5 w-3.5" />
							<span>Report</span>
						</Link>

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<button className="flex h-9.5 w-9.5 items-center justify-center rounded-full border border-[rgba(0,200,83,0.25)] bg-[rgba(0,200,83,0.08)] text-[#00c853] transition-all hover:border-[rgba(0,200,83,0.5)] hover:bg-[rgba(0,200,83,0.15)]">
									{user.image ? (
										<Image
											src={user.image}
											alt={user.name || "Profile"}
											width={38}
											height={38}
											className="h-full w-full rounded-full object-cover"
										/>
									) : (
										<User size={18} strokeWidth={2} />
									)}
								</button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-56 border-green-900/40 bg-background/95 backdrop-blur-md">
								<DropdownMenuLabel className="font-normal">
									<div className="flex flex-col space-y-1">
										<p className="text-sm leading-none font-medium text-green-50">{user.name}</p>
										<p className="text-xs leading-none text-green-100/50">{user.email}</p>
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator className="bg-green-900/30" />
								<DropdownMenuItem asChild className="cursor-pointer focus:bg-green-900/20 focus:text-green-400">
									<Link href="/dashboard" className="flex w-full items-center">
										<LayoutDashboard className="mr-2 h-4 w-4" />
										<span>ড্যাশবোর্ড</span>
									</Link>
								</DropdownMenuItem>
								<DropdownMenuSeparator className="bg-green-900/30" />
								<DropdownMenuItem
									onClick={() => logout()}
									className="cursor-pointer text-red-400 focus:bg-red-950/40 focus:text-red-400"
								>
									<LogOut className="mr-2 h-4 w-4" />
									<span>লগআউট</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				) : (
					<Link
						href="/login"
						className="rounded-lg border border-[rgba(0,200,83,0.4)] bg-[rgba(0,200,83,0.06)] px-5.5 py-2 text-[11px] tracking-[2px] text-[#00c853] uppercase transition-all hover:border-[rgba(0,200,83,0.7)] hover:bg-[rgba(0,200,83,0.14)] hover:shadow-[0_0_18px_rgba(0,200,83,0.15)]"
					>
						লগইন
					</Link>
				)}
			</div>

			<Sheet>
				<div className="flex items-center gap-2 xl:hidden">
					{!loading && user ? (
						<Link
							href="/reports"
							className="inline-flex items-center gap-1.5 rounded-md border border-[rgba(200,162,39,0.55)] bg-[rgba(200,162,39,0.15)] px-2.5 py-2 text-[10px] tracking-[1.1px] text-[#f6d46b] uppercase transition-all hover:border-[rgba(200,162,39,0.78)] hover:bg-[rgba(200,162,39,0.23)]"
						>
							<FileText className="h-3.5 w-3.5" />
							<span>Report</span>
						</Link>
					) : null}
					<SheetTrigger asChild>
						<Button variant="outline" size="icon" className="border-[rgba(0,200,83,0.3)] bg-[rgba(0,200,83,0.06)] text-[#00c853] hover:bg-[rgba(0,200,83,0.14)] hover:text-[#00c853]">
							<Menu className="size-4" />
						</Button>
					</SheetTrigger>
				</div>
				<SheetContent side="right" className="border-l border-[rgba(0,200,83,0.18)] bg-[#07120b] text-[#f0fff4]">
					<SheetHeader>
						<SheetTitle className="text-left text-[#f0fff4]">ইসলামী ছাত্রশিবির</SheetTitle>
					</SheetHeader>
					<div className="mt-6 flex flex-col gap-3">
						{links.map((item) => (
							<Link
								key={item.title}
								href={item.url}
								className="rounded-md px-3 py-2 text-sm tracking-wide text-[rgba(232,245,233,0.72)] transition-colors hover:bg-[rgba(0,200,83,0.12)] hover:text-[#00c853]"
							>
								{item.title}
							</Link>
						))}

						{loading ? (
							<div className="mt-2 h-7.5 w-7.5 animate-spin rounded-full border border-[rgba(0,200,83,0.1)] border-t-[rgba(0,200,83,0.6)]" />
						) : user ? (
							<>
								<Link
									href="/dashboard"
									className="mt-2 rounded-md border border-[rgba(0,200,83,0.4)] bg-[rgba(0,200,83,0.06)] px-4 py-2 text-center text-[11px] tracking-[2px] text-[#00c853] uppercase transition-all hover:border-[rgba(0,200,83,0.7)] hover:bg-[rgba(0,200,83,0.14)]"
								>
									ড্যাশবোর্ড
								</Link>
								<Link
									href="/reports"
									className="rounded-md border border-[rgba(200,162,39,0.5)] bg-[rgba(200,162,39,0.14)] px-4 py-2 text-center text-[11px] tracking-[2px] text-[#f6d46b] uppercase transition-all hover:border-[rgba(200,162,39,0.75)] hover:bg-[rgba(200,162,39,0.22)]"
								>
									রিপোর্ট
								</Link>
								<button
									onClick={() => logout()}
									className="rounded-md px-3 py-2 text-left text-sm tracking-wide text-red-400 transition-colors hover:bg-red-950/40"
								>
									লগআউট
								</button>
							</>
						) : (
							<>
								<Link
									href="/login"
									className="mt-2 rounded-lg border border-[rgba(0,200,83,0.4)] bg-[rgba(0,200,83,0.06)] px-4 py-2 text-center text-[11px] tracking-[2px] text-[#00c853] uppercase transition-all hover:border-[rgba(0,200,83,0.7)] hover:bg-[rgba(0,200,83,0.14)]"
								>
									লগইন
								</Link>
								<Link
									href="/register"
									className="rounded-lg border border-[rgba(200,162,39,0.35)] bg-[rgba(200,162,39,0.08)] px-4 py-2 text-center text-[11px] tracking-[2px] text-[#c8a227] uppercase transition-all hover:border-[rgba(200,162,39,0.6)] hover:bg-[rgba(200,162,39,0.14)]"
								>
									রেজিস্টার
								</Link>
							</>
						)}
					</div>
				</SheetContent>
			</Sheet>
		</>
	);
}
