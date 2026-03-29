"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthContext";
import { User, LogOut, LayoutDashboard, Menu } from "lucide-react";
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
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const links = [
	{ title: "হোম", url: "/" },
	{ title: "সংগঠন", url: "/" },
	{ title: "কার্যক্রম", url: "/" },
	{ title: "রিপোর্ট", url: "/reports" },
	{ title: "যোগাযোগ", url: "/" },
];

export default function Navbar() {
	const [scrolled, setScrolled] = useState(false);
	const { user, logout, loading } = useAuth();

	useEffect(() => {
		const fn = () => setScrolled(window.scrollY > 30);
		window.addEventListener("scroll", fn);
		return () => window.removeEventListener("scroll", fn);
	}, []);

	return (
		<nav
			className={cn(
				"fixed inset-x-0 top-0 z-[100] h-16 transition-all duration-300",
				scrolled
					? "border-b border-[rgba(0,200,83,0.1)] bg-[rgba(5,15,8,0.92)] backdrop-blur-[20px]"
					: "border-b border-transparent bg-transparent"
			)}
		>
			<div className="mx-auto flex h-full w-full max-w-10/12 items-center px-3 sm:px-5 md:px-8 xl:px-[clamp(20px,5vw,60px)]">
				<div className="flex min-w-0 flex-1 items-center gap-2.5">
					<Link href="/" className="flex items-center gap-2.5">
						<div className="flex h-[34px] w-[34px] items-center justify-center rounded-full border border-[rgba(0,200,83,0.35)] text-base text-[#f0fff4] shadow-[0_0_12px_rgba(0,200,83,0.2)]">
							☽
						</div>
						<div className="min-w-0">
							<div className="hidden text-[13px] font-semibold leading-[1.2] tracking-[0.5px] text-[#f0fff4] sm:block">
								ইসলামী ছাত্রশিবির
							</div>
							<div className="hidden text-[9px] uppercase tracking-[2.5px] text-[rgba(0,200,83,0.65)] sm:block">
								Bangladesh
							</div>
						</div>
					</Link>
				</div>

				<div className="hidden xl:flex xl:items-center">
					<NavigationMenu>
						<NavigationMenuList className="gap-3">
							{links.map((item) => (
								<NavigationMenuItem key={item.title}>
									<NavigationMenuLink
										asChild
										className="px-2 py-1 text-[12px] tracking-[1.5px] text-[rgba(232,245,233,0.55)] transition-colors hover:bg-transparent hover:text-[#00c853]"
									>
										<Link href={item.url}>{item.title}</Link>
									</NavigationMenuLink>
								</NavigationMenuItem>
							))}
						</NavigationMenuList>
					</NavigationMenu>
				</div>

				<div className="ml-auto flex items-center gap-2">
					<div className="hidden xl:flex xl:items-center">
						{loading ? (
							<div className="h-[30px] w-[30px] animate-spin rounded-full border border-[rgba(0,200,83,0.1)] border-t-[rgba(0,200,83,0.6)]" />
						) : user ? (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<button className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-[rgba(0,200,83,0.25)] bg-[rgba(0,200,83,0.08)] text-[#00c853] transition-all hover:border-[rgba(0,200,83,0.5)] hover:bg-[rgba(0,200,83,0.15)]">
										{user.image ? (
											<img
												src={user.image}
												alt={user.name || "Profile"}
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
						) : (
							<Link
								href="/login"
								className="rounded-[4px] border border-[rgba(0,200,83,0.4)] bg-[rgba(0,200,83,0.06)] px-[22px] py-2 text-[11px] tracking-[2px] text-[#00c853] uppercase transition-all hover:border-[rgba(0,200,83,0.7)] hover:bg-[rgba(0,200,83,0.14)] hover:shadow-[0_0_18px_rgba(0,200,83,0.15)]"
							>
								লগইন
							</Link>
						)}
					</div>

					<Sheet>
						<SheetTrigger asChild className="xl:hidden">
							<Button variant="outline" size="icon" className="border-[rgba(0,200,83,0.3)] bg-[rgba(0,200,83,0.06)] text-[#00c853] hover:bg-[rgba(0,200,83,0.14)] hover:text-[#00c853]">
								<Menu className="size-4" />
							</Button>
						</SheetTrigger>
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
									<div className="mt-2 h-[30px] w-[30px] animate-spin rounded-full border border-[rgba(0,200,83,0.1)] border-t-[rgba(0,200,83,0.6)]" />
								) : user ? (
									<>
										<Link
											href="/dashboard"
											className="mt-2 rounded-md border border-[rgba(0,200,83,0.4)] bg-[rgba(0,200,83,0.06)] px-4 py-2 text-center text-[11px] tracking-[2px] text-[#00c853] uppercase transition-all hover:border-[rgba(0,200,83,0.7)] hover:bg-[rgba(0,200,83,0.14)]"
										>
											ড্যাশবোর্ড
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
											className="mt-2 rounded-[4px] border border-[rgba(0,200,83,0.4)] bg-[rgba(0,200,83,0.06)] px-4 py-2 text-center text-[11px] tracking-[2px] text-[#00c853] uppercase transition-all hover:border-[rgba(0,200,83,0.7)] hover:bg-[rgba(0,200,83,0.14)]"
										>
											লগইন
										</Link>
										<Link
											href="/register"
											className="rounded-[4px] border border-[rgba(200,162,39,0.35)] bg-[rgba(200,162,39,0.08)] px-4 py-2 text-center text-[11px] tracking-[2px] text-[#c8a227] uppercase transition-all hover:border-[rgba(200,162,39,0.6)] hover:bg-[rgba(200,162,39,0.14)]"
										>
											রেজিস্টার
										</Link>
									</>
								)}
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</nav>
	);
}
