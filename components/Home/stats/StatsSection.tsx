import MotionReveal from "@/components/shared/MotionReveal";

export default function StatsSection() {
	const stats = [
		{ number: "৪৭+", label: "বছরের অভিজ্ঞতা", sub: "Years of Service", delay: 0 },
		{ number: "৬৪", label: "জেলায় সক্রিয়", sub: "Active Districts", delay: 0.12 },
		{ number: "৫০০+", label: "শিক্ষা প্রতিষ্ঠান", sub: "Institutions", delay: 0.24 },
		{ number: "১০ লক্ষ+", label: "সদস্য ও সমর্থক", sub: "Members", delay: 0.36 },
	];

	return (
		<section className="border-t border-[rgba(0,200,83,0.08)] px-[clamp(20px,6vw,80px)] py-20">
			<div className="mx-auto max-w-[1100px]">
				<div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-px border border-[rgba(0,200,83,0.1)] bg-[rgba(0,200,83,0.08)]">
					{stats.map((s, i) => (
						<MotionReveal
							key={i}
							delay={s.delay}
							y={24}
							className="cursor-default bg-[#050f08] px-7 py-10 text-center transition-colors duration-300 hover:bg-[#0a1a0e]"
						>
							<div className="mb-2.5 text-[clamp(30px,5vw,46px)] font-bold leading-none text-[#00c853] drop-shadow-[0_0_30px_rgba(0,200,83,0.35)]">
								{s.number}
							</div>
							<div className="mb-1 text-sm font-medium text-[#f0fff4]">{s.label}</div>
							<div className="font-mono text-[10px] uppercase tracking-[2px] text-[rgba(232,245,233,0.3)]">
								{s.sub}
							</div>
						</MotionReveal>
					))}
				</div>
			</div>
		</section>
	);
}
