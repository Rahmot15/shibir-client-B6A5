import MotionReveal from "@/components/shared/MotionReveal";

export default function CtaSection() {
	return (
		<section className="relative overflow-hidden border-t border-[rgba(0,200,83,0.08)] px-[clamp(20px,6vw,80px)] py-[100px]">
			<div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse,rgba(0,200,83,0.06)_0%,transparent_70%)]" />

			<MotionReveal delay={0.05} duration={0.9} y={24} className="relative mx-auto max-w-[760px] text-center">
				<div className="mb-7 text-[22px] tracking-[4px] text-[rgba(200,162,39,0.55)] drop-shadow-[0_0_20px_rgba(200,162,39,0.2)]">
					وَكُونُوا مَعَ الصَّادِقِينَ
				</div>
				<div className="mb-10 font-mono text-[9px] uppercase tracking-[3px] text-[rgba(200,162,39,0.4)]">
					&quot;সত্যবাদীদের সাথে থাকো&quot; — সূরা আত-তাওবা ৯:১১৯
				</div>

				<h2 className="mb-[18px] text-[clamp(26px,4vw,44px)] font-bold leading-[1.25] text-[#f0fff4]">
					আসুন একসাথে গড়ি{" "}
					<span className="text-[#00c853] drop-shadow-[0_0_25px_rgba(0,200,83,0.3)]">
						আলোকিত বাংলাদেশ
					</span>
				</h2>

				<p className="mx-auto mb-12 max-w-[520px] text-sm leading-[1.9] text-[rgba(232,245,233,0.45)]">
					ন্যায়ভিত্তিক সমাজ প্রতিষ্ঠার এই যাত্রায় আপনিও অংশীদার হোন। একটি সুন্দর
					আগামীর জন্য আজই যোগ দিন।
				</p>

				<div className="flex flex-wrap justify-center gap-3.5">
					<a
						href="#"
						className="rounded-[4px] bg-[#00c853] px-10 py-3.5 font-mono text-xs font-bold uppercase tracking-[2px] text-[#050f08] no-underline shadow-[0_0_35px_rgba(0,200,83,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#00e676] hover:shadow-[0_0_50px_rgba(0,200,83,0.5)]"
					>
						এখনই যোগ দিন
					</a>

					<a
						href="#"
						className="rounded-[4px] border border-[rgba(200,162,39,0.35)] bg-[rgba(200,162,39,0.05)] px-10 py-3.5 font-mono text-xs uppercase tracking-[2px] text-[#c8a227] no-underline transition-all duration-300 hover:-translate-y-0.5 hover:border-[rgba(200,162,39,0.65)] hover:bg-[rgba(200,162,39,0.12)]"
					>
						ব্রোশার ডাউনলোড
					</a>
				</div>
			</MotionReveal>
		</section>
	);
}
