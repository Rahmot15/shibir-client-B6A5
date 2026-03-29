"use client";

import useInView from "@/hooks/useInView";

export default function FeaturesSection() {
	const { ref, inView } = useInView();
	const features = [
		{
			icon: "◈",
			title: "ইসলামী শিক্ষা ও আদর্শ",
			desc: "পবিত্র কুরআন ও সুন্নাহর আলোকে ব্যক্তি ও সমাজ গঠনের লক্ষ্যে নিরলস কাজ করে যাওয়া।",
			color: "#00c853",
		},
		{
			icon: "◉",
			title: "নেতৃত্ব বিকাশ",
			desc: "আগামীর সুযোগ্য নেতৃত্ব তৈরিতে প্রশিক্ষণ, কর্মশালা এবং মানসিক বিকাশের কার্যক্রম পরিচালনা।",
			color: "#00c853",
		},
		{
			icon: "✦",
			title: "সামাজিক দায়বদ্ধতা",
			desc: "বন্যা, দুর্যোগ ও মানবিক সংকটে সক্রিয় ভূমিকা পালনে সদা প্রস্তুত একটি মানবিক সংগঠন।",
			color: "#c8a227",
		},
		{
			icon: "◇",
			title: "শিক্ষার্থী কল্যাণ",
			desc: "মেধাবী ও দুস্থ শিক্ষার্থীদের বৃত্তি, পাঠ্যসামগ্রী সহায়তা এবং ক্যারিয়ার গাইডেন্স প্রদান।",
			color: "#c8a227",
		},
		{
			icon: "▲",
			title: "ডিজিটাল বাংলাদেশ",
			desc: "প্রযুক্তি ও উদ্ভাবনের মাধ্যমে তরুণ প্রজন্মকে আধুনিক বিশ্বের সাথে তাল মিলিয়ে চলতে সহায়তা।",
			color: "#00c853",
		},
		{
			icon: "◐",
			title: "সাংস্কৃতিক চর্চা",
			desc: "বাংলাদেশের ঐতিহ্যবাহী সংস্কৃতি ও ইসলামী মূল্যবোধের সমন্বয়ে সুস্থ সাংস্কৃতিক পরিবেশ গড়া।",
			color: "#00c853",
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
						marginBottom: 60,
						textAlign: "center",
						opacity: inView ? 1 : 0,
						transform: inView ? "translateY(0)" : "translateY(20px)",
						transition: "all 0.7s ease",
					}}
				>
					<div
						style={{
							fontSize: 9,
							letterSpacing: "4px",
							color: "rgba(0,200,83,0.6)",
							textTransform: "uppercase",
							marginBottom: 14,
							fontFamily: "var(--font-geist-mono,monospace)",
						}}
					>
						{"// আমাদের কার্যক্রম"}
					</div>
					<h2
						style={{
							fontSize: "clamp(26px,4vw,42px)",
							fontWeight: 700,
							color: "#f0fff4",
							margin: "0 0 16px",
							letterSpacing: "-0.3px",
						}}
					>
						আমরা যা করি
					</h2>
					<p
						style={{
							fontSize: 14,
							color: "rgba(232,245,233,0.45)",
							maxWidth: 480,
							margin: "0 auto",
							lineHeight: 1.8,
						}}
					>
						ছাত্রশিবির শুধু একটি সংগঠন নয় — এটি একটি আন্দোলন, একটি পরিবার।
					</p>
				</div>

				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fit, minmax(290px,1fr))",
						gap: 1,
						background: "rgba(0,200,83,0.07)",
						border: "1px solid rgba(0,200,83,0.1)",
					}}
				>
					{features.map((f, i) => (
						<div
							key={i}
							style={{
								background: "#050f08",
								padding: "36px 32px",
								transition: "background 0.3s",
								cursor: "default",
								opacity: inView ? 1 : 0,
								transform: inView ? "translateY(0)" : "translateY(28px)",
								transitionProperty: "opacity, transform, background",
								transitionDuration: "0.7s",
								transitionDelay: `${0.1 + i * 0.1}s`,
								borderLeft: "2px solid transparent",
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.background = "#0a1a0e";
								e.currentTarget.style.borderLeftColor = f.color;
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.background = "#050f08";
								e.currentTarget.style.borderLeftColor = "transparent";
							}}
						>
							<div
								style={{
									fontSize: 22,
									color: f.color,
									marginBottom: 16,
									textShadow: `0 0 12px ${f.color}66`,
								}}
							>
								{f.icon}
							</div>
							<h3
								style={{
									fontSize: 16,
									fontWeight: 600,
									color: "#f0fff4",
									marginBottom: 10,
								}}
							>
								{f.title}
							</h3>
							<p
								style={{
									fontSize: 13,
									color: "rgba(232,245,233,0.45)",
									lineHeight: 1.8,
									margin: 0,
								}}
							>
								{f.desc}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
