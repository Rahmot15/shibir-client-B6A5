"use client";

import { useEffect, useState } from "react";

export default function Navbar() {
	const [scrolled, setScrolled] = useState(false);

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
							href="#"
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

			<div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
				<a
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
				</a>
			</div>
		</nav>
	);
}
