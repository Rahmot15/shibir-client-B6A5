import MotionReveal from "@/components/shared/MotionReveal";

export default function FeaturesSection() {
	const features = [
		{
			icon: "◈",
			title: "ইসলামী শিক্ষা ও আদর্শ",
			desc: "পবিত্র কুরআন ও সুন্নাহর আলোকে ব্যক্তি ও সমাজ গঠনের লক্ষ্যে নিরলস কাজ করে যাওয়া।",
			accentClass: "text-[#00c853]",
			shadowClass: "drop-shadow-[0_0_12px_rgba(0,200,83,0.4)]",
			borderClass: "hover:border-l-[#00c853]",
			delay: 0.1,
		},
		{
			icon: "◉",
			title: "নেতৃত্ব বিকাশ",
			desc: "আগামীর সুযোগ্য নেতৃত্ব তৈরিতে প্রশিক্ষণ, কর্মশালা এবং মানসিক বিকাশের কার্যক্রম পরিচালনা।",
			accentClass: "text-[#00c853]",
			shadowClass: "drop-shadow-[0_0_12px_rgba(0,200,83,0.4)]",
			borderClass: "hover:border-l-[#00c853]",
			delay: 0.2,
		},
		{
			icon: "✦",
			title: "সামাজিক দায়বদ্ধতা",
			desc: "বন্যা, দুর্যোগ ও মানবিক সংকটে সক্রিয় ভূমিকা পালনে সদা প্রস্তুত একটি মানবিক সংগঠন।",
			accentClass: "text-[#c8a227]",
			shadowClass: "drop-shadow-[0_0_12px_rgba(200,162,39,0.4)]",
			borderClass: "hover:border-l-[#c8a227]",
			delay: 0.3,
		},
		{
			icon: "◇",
			title: "শিক্ষার্থী কল্যাণ",
			desc: "মেধাবী ও দুস্থ শিক্ষার্থীদের বৃত্তি, পাঠ্যসামগ্রী সহায়তা এবং ক্যারিয়ার গাইডেন্স প্রদান।",
			accentClass: "text-[#c8a227]",
			shadowClass: "drop-shadow-[0_0_12px_rgba(200,162,39,0.4)]",
			borderClass: "hover:border-l-[#c8a227]",
			delay: 0.4,
		},
		{
			icon: "▲",
			title: "ডিজিটাল বাংলাদেশ",
			desc: "প্রযুক্তি ও উদ্ভাবনের মাধ্যমে তরুণ প্রজন্মকে আধুনিক বিশ্বের সাথে তাল মিলিয়ে চলতে সহায়তা।",
			accentClass: "text-[#00c853]",
			shadowClass: "drop-shadow-[0_0_12px_rgba(0,200,83,0.4)]",
			borderClass: "hover:border-l-[#00c853]",
			delay: 0.5,
		},
		{
			icon: "◐",
			title: "সাংস্কৃতিক চর্চা",
			desc: "বাংলাদেশের ঐতিহ্যবাহী সংস্কৃতি ও ইসলামী মূল্যবোধের সমন্বয়ে সুস্থ সাংস্কৃতিক পরিবেশ গড়া।",
			accentClass: "text-[#00c853]",
			shadowClass: "drop-shadow-[0_0_12px_rgba(0,200,83,0.4)]",
			borderClass: "hover:border-l-[#00c853]",
			delay: 0.6,
		},
	];

	return (
		<section className="border-t border-[rgba(0,200,83,0.08)] px-[clamp(20px,6vw,80px)] py-[100px]">
			<div className="mx-auto max-w-[1100px]">
				<MotionReveal delay={0.05} className="mb-[60px] text-center">
					<div className="mb-3.5 font-mono text-[9px] uppercase tracking-[4px] text-[rgba(0,200,83,0.6)]">
						{"// আমাদের কার্যক্রম"}
					</div>
					<h2 className="mb-4 text-[clamp(26px,4vw,42px)] font-bold tracking-[-0.3px] text-[#f0fff4]">
						আমরা যা করি
					</h2>
					<p className="mx-auto max-w-[480px] text-sm leading-[1.8] text-[rgba(232,245,233,0.45)]">
						ছাত্রশিবির শুধু একটি সংগঠন নয় — এটি একটি আন্দোলন, একটি পরিবার।
					</p>
				</MotionReveal>

				<div className="grid grid-cols-[repeat(auto-fit,minmax(290px,1fr))] gap-px border border-[rgba(0,200,83,0.1)] bg-[rgba(0,200,83,0.07)]">
					{features.map((f, i) => (
						<MotionReveal
							key={i}
							delay={f.delay}
							y={28}
							className={`cursor-default border-l-2 border-l-transparent bg-[#050f08] px-8 py-9 transition-all duration-300 hover:bg-[#0a1a0e] ${f.borderClass}`}
						>
							<div className={`mb-4 text-[22px] ${f.accentClass} ${f.shadowClass}`}>
								{f.icon}
							</div>
							<h3 className="mb-2.5 text-base font-semibold text-[#f0fff4]">{f.title}</h3>
							<p className="m-0 text-[13px] leading-[1.8] text-[rgba(232,245,233,0.45)]">
								{f.desc}
							</p>
						</MotionReveal>
					))}
				</div>
			</div>
		</section>
	);
}
