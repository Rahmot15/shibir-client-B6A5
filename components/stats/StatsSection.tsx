"use client";

import useInView from "@/hooks/useInView";

export default function StatsSection() {
	const { ref, inView } = useInView();
	const stats = [
		{ number: "৪৭+", label: "বছরের অভিজ্ঞতা", sub: "Years of Service" },
		{ number: "৬৪", label: "জেলায় সক্রিয়", sub: "Active Districts" },
		{ number: "৫০০+", label: "শিক্ষা প্রতিষ্ঠান", sub: "Institutions" },
		{ number: "১০ লক্ষ+", label: "সদস্য ও সমর্থক", sub: "Members" },
	];

	return (
		<section
			ref={ref}
			style={{
				padding: "80px clamp(20px,6vw,80px)",
				borderTop: "1px solid rgba(0,200,83,0.08)",
			}}
		>
			<div style={{ maxWidth: 1100, margin: "0 auto" }}>
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
						gap: 1,
						border: "1px solid rgba(0,200,83,0.1)",
						background: "rgba(0,200,83,0.08)",
					}}
				>
					{stats.map((s, i) => (
						<div
							key={i}
							style={{
								background: "#050f08",
								padding: "40px 28px",
								textAlign: "center",
								transition: "background 0.3s",
								opacity: inView ? 1 : 0,
								transform: inView ? "translateY(0)" : "translateY(24px)",
								transitionDelay: `${i * 0.12}s`,
								transitionProperty: "opacity, transform, background",
								transitionDuration: "0.7s",
								cursor: "default",
							}}
							onMouseEnter={(e) => (e.currentTarget.style.background = "#0a1a0e")}
							onMouseLeave={(e) => (e.currentTarget.style.background = "#050f08")}
						>
							<div
								style={{
									fontSize: "clamp(30px,5vw,46px)",
									fontWeight: 700,
									color: "#00c853",
									lineHeight: 1,
									marginBottom: 10,
									textShadow: "0 0 30px rgba(0,200,83,0.35)",
								}}
							>
								{s.number}
							</div>
							<div
								style={{
									fontSize: 14,
									color: "#f0fff4",
									marginBottom: 4,
									fontWeight: 500,
								}}
							>
								{s.label}
							</div>
							<div
								style={{
									fontSize: 10,
									letterSpacing: "2px",
									color: "rgba(232,245,233,0.3)",
									textTransform: "uppercase",
									fontFamily: "var(--font-geist-mono,monospace)",
								}}
							>
								{s.sub}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
