import MotionReveal from "@/components/shared/MotionReveal";

export default function Hero() {
	return (
		<section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-[clamp(20px,6vw,80px)] pb-20 pt-[100px] text-center">
			<div className="pointer-events-none absolute left-1/2 top-1/2 h-[min(520px,90vw)] w-[min(520px,90vw)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(0,200,83,0.07)]" />
			<div className="pointer-events-none absolute left-1/2 top-1/2 h-[min(380px,70vw)] w-[min(380px,70vw)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(200,162,39,0.06)]" />

			<MotionReveal
				delay={0.1}
				y={12}
				className="mb-9 inline-flex items-center gap-2 rounded-[2px] border border-[rgba(0,200,83,0.2)] bg-[rgba(0,200,83,0.05)] px-[18px] py-[6px] font-mono text-[9px] uppercase tracking-[3.5px] text-[rgba(0,200,83,0.7)]"
			>
				প্রতিষ্ঠা ১৯৭৭ · বাংলাদেশ
			</MotionReveal>

			<MotionReveal
				delay={0.25}
				duration={0.8}
				y={20}
				className="mb-2 text-[clamp(38px,8vw,88px)] font-bold leading-[1.1] tracking-[-0.5px] text-[#f0fff4]"
			>
				বাংলাদেশ ইসলামী
			</MotionReveal>

			<MotionReveal
				delay={0.4}
				duration={0.8}
				y={20}
				className="mb-7 bg-[linear-gradient(135deg,#00c853_0%,#00e676_50%,#c8a227_100%)] bg-clip-text text-[clamp(38px,8vw,88px)] font-bold leading-[1.1] text-transparent"
			>
				ছাত্রশিবির
			</MotionReveal>

			<MotionReveal delay={0.55} duration={0.8} y={0} className="mb-7 flex items-center justify-center gap-3">
				<div className="h-px w-20 bg-gradient-to-r from-transparent to-[rgba(0,200,83,0.5)]" />
				<div className="h-1.5 w-1.5 rotate-45 bg-[#c8a227] shadow-[0_0_8px_rgba(200,162,39,0.6)]" />
				<div className="h-px w-20 bg-gradient-to-l from-transparent to-[rgba(0,200,83,0.5)]" />
			</MotionReveal>

			<MotionReveal
				delay={0.65}
				duration={0.8}
				y={14}
				className="mb-3.5 max-w-[480px] text-[clamp(13px,2vw,16px)] leading-[1.9] tracking-[0.3px] text-[rgba(232,245,233,0.55)]"
			>
				সত্য, ন্যায় ও মানবতার আদর্শে গড়ে ওঠা একটি ইসলামী ছাত্র সংগঠন — যা
				আলোকিত ভবিষ্যতের পথ দেখায়
			</MotionReveal>

			<MotionReveal
				delay={0.75}
				duration={0.8}
				y={0}
				className="mb-12 font-mono text-xs tracking-[4px] text-[rgba(200,162,39,0.6)]"
			>
				TRUTH · JUSTICE · LIBERATION
			</MotionReveal>

			<MotionReveal delay={0.85} duration={0.8} y={14} className="flex flex-wrap justify-center gap-3.5">
				<a
					href="/reports"
					className="rounded-[4px] bg-[#00c853] px-9 py-[13px] font-mono text-xs font-bold uppercase tracking-[2px] text-[#050f08] no-underline shadow-[0_0_30px_rgba(0,200,83,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#00e676] hover:shadow-[0_0_45px_rgba(0,200,83,0.45)]"
				>
					রিপোর্ট রাখুন
				</a>

				<a
					href="/dashboard/note"
					className="rounded-[4px] border border-[rgba(0,200,83,0.3)] bg-transparent px-9 py-[13px] font-mono text-xs uppercase tracking-[2px] text-[#f0fff4] no-underline transition-all duration-300 hover:-translate-y-0.5 hover:border-[rgba(0,200,83,0.65)] hover:bg-[rgba(0,200,83,0.08)]"
				>
					নোট নিন
				</a>
			</MotionReveal>

			<MotionReveal
				delay={1.2}
				duration={1}
				y={0}
				className="absolute bottom-9 left-1/2 flex -translate-x-1/2 animate-[hero-bounce_2.5s_ease-in-out_infinite] flex-col items-center gap-1.5 opacity-45"
			>
				<div className="h-10 w-px bg-gradient-to-b from-transparent to-[rgba(0,200,83,0.6)]" />
				<div className="font-mono text-[9px] uppercase tracking-[3px] text-[rgba(0,200,83,0.6)]">
					scroll
				</div>
			</MotionReveal>

			<style>{`@keyframes hero-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(6px)} }`}</style>
		</section>
	);
}
