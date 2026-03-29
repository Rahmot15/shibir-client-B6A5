"use client";

export default function Footer() {
	const cols = [
		{
			title: "সংগঠন",
			links: ["আমাদের পরিচয়", "ইতিহাস", "নেতৃবৃন্দ", "কেন্দ্রীয় কমিটি"],
		},
		{
			title: "কার্যক্রম",
			links: ["শিক্ষা কার্যক্রম", "সমাজসেবা", "প্রশিক্ষণ", "বৃত্তি প্রকল্প"],
		},
		{
			title: "যোগাযোগ",
			links: ["ঢাকা অফিস", "জেলা শাখাসমূহ", "প্রেস বিজ্ঞপ্তি", "সদস্যপদ"],
		},
	];

	return (
		<footer
			style={{
				borderTop: "1px solid rgba(0,200,83,0.1)",
				background: "#050f08",
			}}
		>
			<div
				style={{
					maxWidth: 1100,
					margin: "0 auto",
					padding: "64px clamp(20px,6vw,80px) 48px",
					display: "grid",
					gridTemplateColumns: "1.6fr repeat(3, 1fr)",
					gap: 40,
				}}
			>
				<div>
					<div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
						<div
							style={{
								width: 36,
								height: 36,
								borderRadius: "50%",
								border: "1px solid rgba(0,200,83,0.3)",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								fontSize: 17,
								boxShadow: "0 0 12px rgba(0,200,83,0.15)",
							}}
						>
							☽
						</div>
						<div>
							<div style={{ fontSize: 13, fontWeight: 600, color: "#f0fff4" }}>
								ইসলামী ছাত্রশিবির
							</div>
							<div style={{ fontSize: 9, color: "rgba(0,200,83,0.55)", letterSpacing: "2px" }}>
								BANGLADESH
							</div>
						</div>
					</div>
					<p
						style={{
							fontSize: 12,
							color: "rgba(232,245,233,0.38)",
							lineHeight: 1.9,
							maxWidth: 240,
							marginBottom: 24,
						}}
					>
						সত্য, ন্যায় ও মানবতার পথে একটি আলোকিত বাংলাদেশ গড়ার প্রত্যয়ে আমরা
						অবিচল।
					</p>
					<div style={{ display: "flex", gap: 10 }}>
						{["f", "t", "yt", "in"].map((s) => (
							<div
								key={s}
								style={{
									width: 32,
									height: 32,
									borderRadius: 4,
									border: "1px solid rgba(0,200,83,0.15)",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									fontSize: 10,
									color: "rgba(232,245,233,0.35)",
									cursor: "pointer",
									transition: "all 0.25s",
									fontFamily: "var(--font-geist-mono,monospace)",
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.borderColor = "rgba(0,200,83,0.45)";
									e.currentTarget.style.color = "#00c853";
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.borderColor = "rgba(0,200,83,0.15)";
									e.currentTarget.style.color = "rgba(232,245,233,0.35)";
								}}
							>
								{s}
							</div>
						))}
					</div>
				</div>

				{cols.map((col, i) => (
					<div key={i}>
						<div
							style={{
								fontSize: 10,
								letterSpacing: "3px",
								color: "rgba(0,200,83,0.6)",
								textTransform: "uppercase",
								marginBottom: 20,
								fontFamily: "var(--font-geist-mono,monospace)",
							}}
						>
							{col.title}
						</div>
						<ul
							style={{
								listStyle: "none",
								margin: 0,
								padding: 0,
								display: "flex",
								flexDirection: "column",
								gap: 12,
							}}
						>
							{col.links.map((l) => (
								<li key={l}>
									<a
										href="#"
										style={{
											fontSize: 13,
											color: "rgba(232,245,233,0.4)",
											textDecoration: "none",
											transition: "color 0.25s",
										}}
										onMouseEnter={(e) => (e.currentTarget.style.color = "#f0fff4")}
										onMouseLeave={(e) =>
											(e.currentTarget.style.color = "rgba(232,245,233,0.4)")
										}
									>
										{l}
									</a>
								</li>
							))}
						</ul>
					</div>
				))}
			</div>

			<div
				style={{
					borderTop: "1px solid rgba(0,200,83,0.07)",
					padding: "20px clamp(20px,6vw,80px)",
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					flexWrap: "wrap",
					gap: 12,
				}}
			>
				<span
					style={{
						fontSize: 11,
						color: "rgba(232,245,233,0.22)",
						fontFamily: "var(--font-geist-mono,monospace)",
						letterSpacing: "1px",
					}}
				>
					© ২০২৬ বাংলাদেশ ইসলামী ছাত্রশিবির — সর্বস্বত্ব সংরক্ষিত
				</span>
				<span style={{ fontSize: 14, color: "rgba(200,162,39,0.4)", letterSpacing: "3px" }}>
					بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
				</span>
				<span
					style={{
						fontSize: 10,
						color: "rgba(232,245,233,0.2)",
						fontFamily: "var(--font-geist-mono,monospace)",
						letterSpacing: "1.5px",
					}}
				>
					TRUTH · JUSTICE · LIBERATION
				</span>
			</div>
		</footer>
	);
}
