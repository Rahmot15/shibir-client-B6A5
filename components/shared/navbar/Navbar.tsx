"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthContext";
import { User, LogOut, LayoutDashboard } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
	const [scrolled, setScrolled] = useState(false);
	const { user, logout, loading } = useAuth();

	console.log(user);

	useEffect(() => {
		const fn = () => setScrolled(window.scrollY > 30);
		window.addEventListener("scroll", fn);
		return () => window.removeEventListener("scroll", fn);
	}, []);

	const links = ["হোম", "সংগঠন", "কার্যক্রম", "সদস্যপদ", "যোগাযোগ"];

	return (
		<nav
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				right: 0,
				zIndex: 100,
				height: 64,
				background: scrolled ? "rgba(5,15,8,0.92)" : "transparent",
				backdropFilter: scrolled ? "blur(20px)" : "none",
				WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
				borderBottom: scrolled
					? "1px solid rgba(0,200,83,0.1)"
					: "1px solid transparent",
				transition: "all 0.4s ease",
				display: "flex",
				alignItems: "center",
				padding: "0 clamp(20px, 5vw, 60px)",
			}}
		>
			<div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
				<div
					style={{
						width: 34,
						height: 34,
						borderRadius: "50%",
						border: "1px solid rgba(0,200,83,0.35)",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						fontSize: 16,
						boxShadow: "0 0 12px rgba(0,200,83,0.2)",
					}}
				>
					☽
				</div>
				<div>
					<div
						style={{
							fontSize: 13,
							fontWeight: 600,
							color: "#f0fff4",
							letterSpacing: "0.5px",
							lineHeight: 1.2,
						}}
					>
						ইসলামী ছাত্রশিবির
					</div>
					<div
						style={{
							fontSize: 9,
							color: "rgba(0,200,83,0.65)",
							letterSpacing: "2.5px",
							textTransform: "uppercase",
						}}
					>
						Bangladesh
					</div>
				</div>
			</div>

			<ul
				style={{ display: "flex", gap: 32, listStyle: "none", margin: 0, padding: 0 }}
				className="hidden-mobile"
			>
				{links.map((l) => (
					<li key={l}>
						<a
							href="/reports"
							style={{
								fontSize: 12,
								letterSpacing: "1.5px",
								color: "rgba(232,245,233,0.55)",
								textDecoration: "none",
								textTransform: "none",
								transition: "color 0.25s",
								fontFamily: "var(--font-geist-sans, sans-serif)",
							}}
							onMouseEnter={(e) => (e.currentTarget.style.color = "#00c853")}
							onMouseLeave={(e) =>
								(e.currentTarget.style.color = "rgba(232,245,233,0.55)")
							}
						>
							{l}
						</a>
					</li>
				))}
			</ul>

			<div style={{ flex: 1, display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
				{loading ? (
					<div
						style={{
							width: 30,
							height: 30,
							borderRadius: "50%",
							border: "1px solid rgba(0,200,83,0.1)",
							borderTopColor: "rgba(0,200,83,0.6)",
							animation: "spin 1s linear infinite",
						}}
					/>
				) : user ? (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<button
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									width: 38,
									height: 38,
									borderRadius: "50%",
									background: "rgba(0,200,83,0.08)",
									border: "1px solid rgba(0,200,83,0.25)",
									color: "#00c853",
									cursor: "pointer",
									transition: "all 0.25s",
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.background = "rgba(0,200,83,0.15)";
									e.currentTarget.style.borderColor = "rgba(0,200,83,0.5)";
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.background = "rgba(0,200,83,0.08)";
									e.currentTarget.style.borderColor = "rgba(0,200,83,0.25)";
								}}
							>
								{user.image ? (
									<img
										src={user.image}
										alt={user.name || "Profile"}
										style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
									/>
								) : (
									<User size={18} strokeWidth={2} />
								)}
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-56 bg-background/95 backdrop-blur-md border-green-900/40">
							<DropdownMenuLabel className="font-normal">
								<div className="flex flex-col space-y-1">
									<p className="text-sm font-medium leading-none text-green-50">{user.name}</p>
									<p className="text-xs leading-none text-green-100/50">
										{user.email}
									</p>
								</div>
							</DropdownMenuLabel>
							<DropdownMenuSeparator className="bg-green-900/30" />
							<DropdownMenuItem asChild className="cursor-pointer focus:bg-green-900/20 focus:text-green-400">
								<Link href="/dashboard" className="flex items-center w-full">
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
						style={{
							padding: "8px 22px",
							borderRadius: 4,
							border: "1px solid rgba(0,200,83,0.4)",
							color: "#00c853",
							fontSize: 11,
							letterSpacing: "2px",
							textDecoration: "none",
							textTransform: "uppercase",
							background: "rgba(0,200,83,0.06)",
							transition: "all 0.25s",
							fontFamily: "var(--font-geist-mono, monospace)",
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.background = "rgba(0,200,83,0.14)";
							e.currentTarget.style.borderColor = "rgba(0,200,83,0.7)";
							e.currentTarget.style.boxShadow = "0 0 18px rgba(0,200,83,0.15)";
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.background = "rgba(0,200,83,0.06)";
							e.currentTarget.style.borderColor = "rgba(0,200,83,0.4)";
							e.currentTarget.style.boxShadow = "none";
						}}
					>
						লগইন
					</Link>
				)}
			</div>

			<style>{`
				@keyframes spin {
					from { transform: rotate(0deg); }
					to { transform: rotate(360deg); }
				}
			`}</style>
		</nav>
	);
}
