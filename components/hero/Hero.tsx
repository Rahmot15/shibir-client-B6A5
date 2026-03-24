"use client";

import { useEffect, useState } from "react";

export default function Hero() {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setTimeout(() => setMounted(true), 100);
	}, []);

	return (
		<section
			style={{
				minHeight: "100vh",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				textAlign: "center",
				padding: "100px clamp(20px,6vw,80px) 80px",
				position: "relative",
				overflow: "hidden",
			}}
		>
			<div
				style={{
					position: "absolute",
					top: "50%",
					left: "50%",
					translate: "-50% -50%",
					width: "min(520px, 90vw)",
					height: "min(520px, 90vw)",
					border: "1px solid rgba(0,200,83,0.07)",
					borderRadius: "50%",
					pointerEvents: "none",
				}}
			/>
			<div
				style={{
					position: "absolute",
					top: "50%",
					left: "50%",
					translate: "-50% -50%",
					width: "min(380px, 70vw)",
					height: "min(380px, 70vw)",
					border: "1px solid rgba(200,162,39,0.06)",
					borderRadius: "50%",
					pointerEvents: "none",
				}}
			/>

			<div
				style={{
					display: "inline-flex",
					alignItems: "center",
					gap: 8,
					padding: "6px 18px",
					borderRadius: 2,
					border: "1px solid rgba(0,200,83,0.2)",
					background: "rgba(0,200,83,0.05)",
					marginBottom: 36,
					fontFamily: "var(--font-geist-mono, monospace)",
					fontSize: 9,
					letterSpacing: "3.5px",
					color: "rgba(0,200,83,0.7)",
					textTransform: "uppercase",
					opacity: mounted ? 1 : 0,
					transform: mounted ? "translateY(0)" : "translateY(12px)",
					transition: "all 0.7s ease 0.1s",
				}}
			>
				<span style={{ color: "#c8a227" }}>◆</span>
				প্রতিষ্ঠা ১৯৭৭ · বাংলাদেশ
				<span style={{ color: "#c8a227" }}>◆</span>
			</div>

			<h1
				style={{
					fontSize: "clamp(38px, 8vw, 88px)",
					fontWeight: 700,
					lineHeight: 1.1,
					letterSpacing: "-0.5px",
					margin: "0 0 8px",
					color: "#f0fff4",
					opacity: mounted ? 1 : 0,
					transform: mounted ? "translateY(0)" : "translateY(20px)",
					transition: "all 0.8s ease 0.25s",
				}}
			>
				বাংলাদেশ ইসলামী
			</h1>
			<h1
				style={{
					fontSize: "clamp(38px, 8vw, 88px)",
					fontWeight: 700,
					lineHeight: 1.1,
					margin: "0 0 28px",
					background:
						"linear-gradient(135deg, #00c853 0%, #00e676 50%, #c8a227 100%)",
					WebkitBackgroundClip: "text",
					WebkitTextFillColor: "transparent",
					backgroundClip: "text",
					opacity: mounted ? 1 : 0,
					transform: mounted ? "translateY(0)" : "translateY(20px)",
					transition: "all 0.8s ease 0.4s",
				}}
			>
				ছাত্রশিবির
			</h1>

			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: 12,
					justifyContent: "center",
					marginBottom: 28,
					opacity: mounted ? 1 : 0,
					transition: "opacity 0.8s ease 0.55s",
				}}
			>
				<div
					style={{
						width: 80,
						height: 1,
						background: "linear-gradient(to right, transparent, rgba(0,200,83,0.5))",
					}}
				/>
				<div
					style={{
						width: 6,
						height: 6,
						background: "#c8a227",
						transform: "rotate(45deg)",
						boxShadow: "0 0 8px rgba(200,162,39,0.6)",
					}}
				/>
				<div
					style={{
						width: 80,
						height: 1,
						background: "linear-gradient(to left, transparent, rgba(0,200,83,0.5))",
					}}
				/>
			</div>

			<p
				style={{
					fontSize: "clamp(13px, 2vw, 16px)",
					color: "rgba(232,245,233,0.55)",
					maxWidth: 480,
					lineHeight: 1.9,
					marginBottom: 14,
					letterSpacing: "0.3px",
					opacity: mounted ? 1 : 0,
					transform: mounted ? "translateY(0)" : "translateY(14px)",
					transition: "all 0.8s ease 0.65s",
				}}
			>
				সত্য, ন্যায় ও মানবতার আদর্শে গড়ে ওঠা একটি ইসলামী ছাত্র সংগঠন — যা
				আলোকিত ভবিষ্যতের পথ দেখায়
			</p>
			<p
				style={{
					fontSize: 12,
					letterSpacing: "4px",
					color: "rgba(200,162,39,0.6)",
					marginBottom: 48,
					opacity: mounted ? 1 : 0,
					transition: "opacity 0.8s ease 0.75s",
					fontFamily: "var(--font-geist-mono, monospace)",
				}}
			>
				TRUTH · JUSTICE · LIBERATION
			</p>

			<div
				style={{
					display: "flex",
					gap: 14,
					flexWrap: "wrap",
					justifyContent: "center",
					opacity: mounted ? 1 : 0,
					transform: mounted ? "translateY(0)" : "translateY(14px)",
					transition: "all 0.8s ease 0.85s",
				}}
			>
				<a
					href="#"
					style={{
						padding: "13px 36px",
						borderRadius: 4,
						background: "#00c853",
						color: "#050f08",
						fontSize: 12,
						fontWeight: 700,
						letterSpacing: "2px",
						textDecoration: "none",
						textTransform: "uppercase",
						transition: "all 0.25s",
						boxShadow: "0 0 30px rgba(0,200,83,0.3)",
						fontFamily: "var(--font-geist-mono, monospace)",
					}}
					onMouseEnter={(e) => {
						e.currentTarget.style.background = "#00e676";
						e.currentTarget.style.boxShadow = "0 0 45px rgba(0,200,83,0.45)";
						e.currentTarget.style.transform = "translateY(-2px)";
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.background = "#00c853";
						e.currentTarget.style.boxShadow = "0 0 30px rgba(0,200,83,0.3)";
						e.currentTarget.style.transform = "translateY(0)";
					}}
				>
					সদস্য হোন
				</a>

				<a
					href="#"
					style={{
						padding: "13px 36px",
						borderRadius: 4,
						background: "transparent",
						border: "1px solid rgba(0,200,83,0.3)",
						color: "#f0fff4",
						fontSize: 12,
						letterSpacing: "2px",
						textDecoration: "none",
						textTransform: "uppercase",
						transition: "all 0.25s",
						fontFamily: "var(--font-geist-mono, monospace)",
					}}
					onMouseEnter={(e) => {
						e.currentTarget.style.borderColor = "rgba(0,200,83,0.65)";
						e.currentTarget.style.background = "rgba(0,200,83,0.08)";
						e.currentTarget.style.transform = "translateY(-2px)";
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.borderColor = "rgba(0,200,83,0.3)";
						e.currentTarget.style.background = "transparent";
						e.currentTarget.style.transform = "translateY(0)";
					}}
				>
					আরও জানুন
				</a>
			</div>

			<div
				style={{
					position: "absolute",
					bottom: 36,
					left: "50%",
					translate: "-50% 0",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					gap: 6,
					opacity: mounted ? 0.45 : 0,
					transition: "opacity 1s ease 1.2s",
					animation: "bounce 2.5s ease-in-out infinite",
				}}
			>
				<div
					style={{
						width: 1,
						height: 40,
						background: "linear-gradient(to bottom, transparent, rgba(0,200,83,0.6))",
					}}
				/>
				<div
					style={{
						fontSize: 9,
						letterSpacing: "3px",
						color: "rgba(0,200,83,0.6)",
						textTransform: "uppercase",
						fontFamily: "var(--font-geist-mono, monospace)",
					}}
				>
					scroll
				</div>
			</div>

			<style>{`@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(6px)} }`}</style>
		</section>
	);
}
