"use client";

import useInView from "@/hooks/useInView";

export default function NewsSection() {
	const { ref, inView } = useInView();
	const news = [
		{
			tag: "ঘোষণা",
			tagColor: "#00c853",
			date: "১৪ মার্চ ২০২৬",
			title: "জাতীয় ছাত্র সম্মেলন ২০২৬ আয়োজনের ঘোষণা",
			desc: "আগামী এপ্রিল মাসে ঢাকায় বিশাল জাতীয় সম্মেলন অনুষ্ঠিত হবে। সকল জেলার প্রতিনিধিদের অংশগ্রহণ কাম্য।",
		},
		{
			tag: "কার্যক্রম",
			tagColor: "#c8a227",
			date: "০৮ মার্চ ২০২৬",
			title: "বিনামূল্যে কম্পিউটার প্রশিক্ষণ কর্মসূচি শুরু",
			desc: "সুবিধাবঞ্চিত তরুণদের জন্য ৬৪ জেলায় একযোগে ডিজিটাল দক্ষতা উন্নয়ন কর্মসূচি চালু হচ্ছে।",
		},
		{
			tag: "সাফল্য",
			tagColor: "#00c853",
			date: "০১ মার্চ ২০২৬",
			title: "বার্ষিক বৃত্তি প্রদান অনুষ্ঠান সম্পন্ন",
			desc: "এ বছর সারাদেশের ১২০০ মেধাবী শিক্ষার্থীকে বৃত্তি প্রদান করা হয়েছে। মোট বরাদ্দ ১.২ কোটি টাকা।",
		},
	];

	return (
		<section
			ref={ref}
			style={{
				padding: "100px clamp(20px,6vw,80px)",
				borderTop: "1px solid rgba(0,200,83,0.08)",
			}}
		>
			<div style={{ maxWidth: 1100, margin: "0 auto" }}>
				<div
					style={{
						display: "flex",
						alignItems: "flex-end",
						justifyContent: "space-between",
						flexWrap: "wrap",
						gap: 20,
						marginBottom: 48,
						opacity: inView ? 1 : 0,
						transform: inView ? "translateY(0)" : "translateY(20px)",
						transition: "all 0.7s ease",
					}}
				>
					<div>
						<div
							style={{
								fontSize: 9,
								letterSpacing: "4px",
								color: "rgba(0,200,83,0.6)",
								textTransform: "uppercase",
								marginBottom: 10,
								fontFamily: "var(--font-geist-mono,monospace)",
							}}
						>
							{"// সর্বশেষ সংবাদ"}
						</div>
						<h2
							style={{
								fontSize: "clamp(24px,4vw,38px)",
								fontWeight: 700,
								color: "#f0fff4",
								margin: 0,
							}}
						>
							আপডেট ও সংবাদ
						</h2>
					</div>
					<a
						href="#"
						style={{
							fontSize: 11,
							letterSpacing: "2px",
							color: "#00c853",
							textDecoration: "none",
							textTransform: "uppercase",
							borderBottom: "1px solid rgba(0,200,83,0.3)",
							paddingBottom: 2,
							transition: "all 0.25s",
							fontFamily: "var(--font-geist-mono,monospace)",
						}}
						onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#00c853")}
						onMouseLeave={(e) =>
							(e.currentTarget.style.borderColor = "rgba(0,200,83,0.3)")
						}
					>
						সব দেখুন →
					</a>
				</div>

				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fit, minmax(290px,1fr))",
						gap: 16,
					}}
				>
					{news.map((n, i) => (
						<div
							key={i}
							style={{
								background: "#0a1a0e",
								border: "1px solid rgba(0,200,83,0.1)",
								borderRadius: 4,
								padding: "28px 24px",
								cursor: "pointer",
								transition: "all 0.3s",
								opacity: inView ? 1 : 0,
								transform: inView ? "translateY(0)" : "translateY(28px)",
								transitionProperty:
									"opacity, transform, border-color, background, box-shadow",
								transitionDuration: "0.7s",
								transitionDelay: `${0.15 + i * 0.12}s`,
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.borderColor = "rgba(0,200,83,0.28)";
								e.currentTarget.style.background = "#0f2214";
								e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.35)";
								e.currentTarget.style.transform = "translateY(-3px)";
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.borderColor = "rgba(0,200,83,0.1)";
								e.currentTarget.style.background = "#0a1a0e";
								e.currentTarget.style.boxShadow = "none";
								e.currentTarget.style.transform = "translateY(0)";
							}}
						>
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									marginBottom: 16,
								}}
							>
								<span
									style={{
										fontSize: 9,
										letterSpacing: "2px",
										color: n.tagColor,
										textTransform: "uppercase",
										background: `${n.tagColor}18`,
										border: `1px solid ${n.tagColor}30`,
										padding: "3px 10px",
										borderRadius: 2,
										fontFamily: "var(--font-geist-mono,monospace)",
									}}
								>
									{n.tag}
								</span>
								<span
									style={{
										fontSize: 10,
										color: "rgba(232,245,233,0.3)",
										fontFamily: "var(--font-geist-mono,monospace)",
									}}
								>
									{n.date}
								</span>
							</div>
							<h3
								style={{
									fontSize: 15,
									fontWeight: 600,
									color: "#f0fff4",
									marginBottom: 10,
									lineHeight: 1.45,
								}}
							>
								{n.title}
							</h3>
							<p
								style={{
									fontSize: 13,
									color: "rgba(232,245,233,0.42)",
									lineHeight: 1.8,
									margin: 0,
								}}
							>
								{n.desc}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
