"use client";

import useInView from "@/hooks/useInView";

export default function CtaSection() {
	const { ref, inView } = useInView();

	return (
		<section
			ref={ref}
			style={{
				padding: "100px clamp(20px,6vw,80px)",
				borderTop: "1px solid rgba(0,200,83,0.08)",
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
					width: 600,
					height: 300,
					background:
						"radial-gradient(ellipse, rgba(0,200,83,0.06) 0%, transparent 70%)",
					pointerEvents: "none",
				}}
			/>

			<div
				style={{
					maxWidth: 760,
					margin: "0 auto",
					textAlign: "center",
					position: "relative",
					opacity: inView ? 1 : 0,
					transform: inView ? "translateY(0)" : "translateY(24px)",
					transition: "all 0.9s ease",
				}}
			>
				<div
					style={{
						fontSize: 22,
						color: "rgba(200,162,39,0.55)",
						letterSpacing: 4,
						marginBottom: 28,
						textShadow: "0 0 20px rgba(200,162,39,0.2)",
					}}
				>
					وَكُونُوا مَعَ الصَّادِقِينَ
				</div>
				<div
					style={{
						fontSize: 9,
						letterSpacing: "3px",
						color: "rgba(200,162,39,0.4)",
						textTransform: "uppercase",
						marginBottom: 40,
						fontFamily: "var(--font-geist-mono,monospace)",
					}}
				>
					&quot;সত্যবাদীদের সাথে থাকো&quot; — সূরা আত-তাওবা ৯:১১৯
				</div>

				<h2
					style={{
						fontSize: "clamp(26px,4vw,44px)",
						fontWeight: 700,
						color: "#f0fff4",
						margin: "0 0 18px",
						lineHeight: 1.25,
					}}
				>
					আসুন একসাথে গড়ি{" "}
					<span
						style={{
							color: "#00c853",
							textShadow: "0 0 25px rgba(0,200,83,0.3)",
						}}
					>
						আলোকিত বাংলাদেশ
					</span>
				</h2>

				<p
					style={{
						fontSize: 14,
						color: "rgba(232,245,233,0.45)",
						lineHeight: 1.9,
						maxWidth: 520,
						margin: "0 auto 48px",
					}}
				>
					ন্যায়ভিত্তিক সমাজ প্রতিষ্ঠার এই যাত্রায় আপনিও অংশীদার হোন। একটি সুন্দর
					আগামীর জন্য আজই যোগ দিন।
				</p>

				<div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
					<a
						href="#"
						style={{
							padding: "14px 40px",
							borderRadius: 4,
							background: "#00c853",
							color: "#050f08",
							fontSize: 12,
							fontWeight: 700,
							letterSpacing: "2px",
							textDecoration: "none",
							textTransform: "uppercase",
							boxShadow: "0 0 35px rgba(0,200,83,0.35)",
							transition: "all 0.25s",
							fontFamily: "var(--font-geist-mono,monospace)",
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.background = "#00e676";
							e.currentTarget.style.transform = "translateY(-2px)";
							e.currentTarget.style.boxShadow = "0 0 50px rgba(0,200,83,0.5)";
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.background = "#00c853";
							e.currentTarget.style.transform = "translateY(0)";
							e.currentTarget.style.boxShadow = "0 0 35px rgba(0,200,83,0.35)";
						}}
					>
						এখনই যোগ দিন
					</a>

					<a
						href="#"
						style={{
							padding: "14px 40px",
							borderRadius: 4,
							border: "1px solid rgba(200,162,39,0.35)",
							color: "#c8a227",
							fontSize: 12,
							letterSpacing: "2px",
							textDecoration: "none",
							textTransform: "uppercase",
							background: "rgba(200,162,39,0.05)",
							transition: "all 0.25s",
							fontFamily: "var(--font-geist-mono,monospace)",
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.background = "rgba(200,162,39,0.12)";
							e.currentTarget.style.borderColor = "rgba(200,162,39,0.65)";
							e.currentTarget.style.transform = "translateY(-2px)";
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.background = "rgba(200,162,39,0.05)";
							e.currentTarget.style.borderColor = "rgba(200,162,39,0.35)";
							e.currentTarget.style.transform = "translateY(0)";
						}}
					>
						ব্রোশার ডাউনলোড
					</a>
				</div>
			</div>
		</section>
	);
}
