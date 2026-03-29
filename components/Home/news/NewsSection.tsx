import MotionReveal from "@/components/shared/MotionReveal";

export default function NewsSection() {
	const news = [
		{
			tag: "ঘোষণা",
			tagClass:
				"text-[#00c853] bg-[rgba(0,200,83,0.09)] border-[rgba(0,200,83,0.19)]",
			date: "১৪ মার্চ ২০২৬",
			title: "জাতীয় ছাত্র সম্মেলন ২০২৬ আয়োজনের ঘোষণা",
			desc: "আগামী এপ্রিল মাসে ঢাকায় বিশাল জাতীয় সম্মেলন অনুষ্ঠিত হবে। সকল জেলার প্রতিনিধিদের অংশগ্রহণ কাম্য।",
			delay: 0.15,
		},
		{
			tag: "কার্যক্রম",
			tagClass:
				"text-[#c8a227] bg-[rgba(200,162,39,0.09)] border-[rgba(200,162,39,0.19)]",
			date: "০৮ মার্চ ২০২৬",
			title: "বিনামূল্যে কম্পিউটার প্রশিক্ষণ কর্মসূচি শুরু",
			desc: "সুবিধাবঞ্চিত তরুণদের জন্য ৬৪ জেলায় একযোগে ডিজিটাল দক্ষতা উন্নয়ন কর্মসূচি চালু হচ্ছে।",
			delay: 0.27,
		},
		{
			tag: "সাফল্য",
			tagClass:
				"text-[#00c853] bg-[rgba(0,200,83,0.09)] border-[rgba(0,200,83,0.19)]",
			date: "০১ মার্চ ২০২৬",
			title: "বার্ষিক বৃত্তি প্রদান অনুষ্ঠান সম্পন্ন",
			desc: "এ বছর সারাদেশের ১২০০ মেধাবী শিক্ষার্থীকে বৃত্তি প্রদান করা হয়েছে। মোট বরাদ্দ ১.২ কোটি টাকা।",
			delay: 0.39,
		},
	];

	return (
		<section className="border-t border-[rgba(0,200,83,0.08)] px-[clamp(20px,6vw,80px)] py-[100px]">
			<div className="mx-auto max-w-[1100px]">
				<MotionReveal delay={0.05} className="mb-12 flex flex-wrap items-end justify-between gap-5">
					<div>
						<div className="mb-2.5 font-mono text-[9px] uppercase tracking-[4px] text-[rgba(0,200,83,0.6)]">
							{"// সর্বশেষ সংবাদ"}
						</div>
						<h2 className="m-0 text-[clamp(24px,4vw,38px)] font-bold text-[#f0fff4]">
							আপডেট ও সংবাদ
						</h2>
					</div>

					<a
						href="#"
						className="border-b border-[rgba(0,200,83,0.3)] pb-0.5 font-mono text-[11px] uppercase tracking-[2px] text-[#00c853] no-underline transition-all duration-300 hover:border-[#00c853]"
					>
						সব দেখুন →
					</a>
				</MotionReveal>

				<div className="grid grid-cols-[repeat(auto-fit,minmax(290px,1fr))] gap-4">
					{news.map((n, i) => (
						<MotionReveal
							key={i}
							delay={n.delay}
							y={28}
							className="cursor-pointer rounded-[4px] border border-[rgba(0,200,83,0.1)] bg-[#0a1a0e] px-6 py-7 transition-all duration-300 hover:-translate-y-[3px] hover:border-[rgba(0,200,83,0.28)] hover:bg-[#0f2214] hover:shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
						>
							<div className="mb-4 flex items-center justify-between">
								<span
									className={`rounded-[2px] border px-2.5 py-[3px] font-mono text-[9px] uppercase tracking-[2px] ${n.tagClass}`}
								>
									{n.tag}
								</span>
								<span className="font-mono text-[10px] text-[rgba(232,245,233,0.3)]">
									{n.date}
								</span>
							</div>
							<h3 className="mb-2.5 text-[15px] font-semibold leading-[1.45] text-[#f0fff4]">
								{n.title}
							</h3>
							<p className="m-0 text-[13px] leading-[1.8] text-[rgba(232,245,233,0.42)]">
								{n.desc}
							</p>
						</MotionReveal>
					))}
				</div>
			</div>
		</section>
	);
}
