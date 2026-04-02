"use client";

import Link from "next/link";
import { Facebook, Globe, Linkedin, MoonStar, Send, Youtube } from "lucide-react";

export default function Footer() {
	const cols = [
		{
			title: "সংগঠন",
			links: [
				{ label: "আমাদের পরিচয়", href: "/info/identity" },
				{ label: "ইতিহাস", href: "/info/history" },
				{ label: "নেতৃবৃন্দ", href: "/info/leadership" },
				{ label: "কেন্দ্রীয় কমিটি", href: "/info/central-committee" },
			],
		},
		{
			title: "কার্যক্রম",
			links: [
				{ label: "শিক্ষা কার্যক্রম", href: "/info/education-programs" },
				{ label: "সমাজসেবা", href: "/info/social-service" },
				{ label: "প্রশিক্ষণ", href: "/info/training" },
				{ label: "বৃত্তি প্রকল্প", href: "/info/scholarship" },
			],
		},
		{
			title: "যোগাযোগ",
			links: [
				{ label: "ঢাকা অফিস", href: "/info/dhaka-office" },
				{ label: "জেলা শাখাসমূহ", href: "/info/district-branches" },
				{ label: "প্রেস বিজ্ঞপ্তি", href: "/info/press" },
				{ label: "সদস্যপদ", href: "/info/membership" },
			],
		},
	];

	const socials = [
		{ label: "Facebook", href: "https://facebook.com", icon: Facebook },
		{ label: "Telegram", href: "https://t.me", icon: Send },
		{ label: "YouTube", href: "https://youtube.com", icon: Youtube },
		{ label: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
	];

	return (
		<footer className="border-t border-[rgba(0,200,83,0.1)] bg-[#050f08]">
			<div className="mx-auto grid w-full max-w-275 gap-9 px-[clamp(20px,6vw,80px)] py-12 sm:grid-cols-2 lg:grid-cols-[1.6fr_repeat(3,1fr)]">
				<div className="space-y-5">
					<Link
						href="/"
						className="inline-flex items-center gap-2.5 rounded-lg border border-[rgba(0,200,83,0.14)] bg-[rgba(0,200,83,0.04)] px-3 py-2 transition-colors hover:border-[rgba(0,200,83,0.35)]"
					>
						<span className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(0,200,83,0.3)] text-[#f0fff4] shadow-[0_0_12px_rgba(0,200,83,0.15)]">
							<MoonStar className="h-4 w-4" strokeWidth={2} />
						</span>
						<span>
							<span className="block text-[13px] font-semibold text-[#f0fff4]">ইসলামী ছাত্রশিবির</span>
							<span className="block text-[9px] tracking-[2px] text-[rgba(0,200,83,0.55)]">
								BANGLADESH
							</span>
						</span>
					</Link>

					<div className="flex flex-wrap gap-2.5">
						{socials.map((item) => (
							<a
								key={item.label}
								href={item.href}
								target="_blank"
								rel="noreferrer"
								aria-label={item.label}
								className="flex h-9 w-9 items-center justify-center rounded-lg border border-[rgba(0,200,83,0.15)] text-[rgba(232,245,233,0.45)] transition-all hover:border-[rgba(0,200,83,0.45)] hover:text-[#00c853]"
							>
								<item.icon className="h-4 w-4" />
							</a>
						))}
					</div>
				</div>

				{cols.map((col) => (
					<div key={col.title}>
						<div className="mb-4 font-mono text-[10px] uppercase tracking-[3px] text-[rgba(0,200,83,0.6)]">
							{col.title}
						</div>
						<ul className="space-y-2.5">
							{col.links.map((link) => (
								<li key={link.label}>
									<Link
										href={link.href}
										className="text-sm text-[rgba(232,245,233,0.42)] transition-colors hover:text-[#f0fff4]"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>
				))}
			</div>

			<div className="border-t border-[rgba(0,200,83,0.07)] px-[clamp(20px,6vw,80px)] py-4">
				<div className="mx-auto flex w-full max-w-275 flex-wrap items-center justify-between gap-3">
					<Link
						href="/"
						className="font-mono text-[11px] tracking-[1px] text-[rgba(232,245,233,0.22)] transition-colors hover:text-[rgba(232,245,233,0.55)]"
					>
						© ২০২৬ বাংলাদেশ ইসলামী ছাত্রশিবির
					</Link>
					<a
						href="https://www.google.com/maps/search/Dhaka"
						target="_blank"
						rel="noreferrer"
						className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[1.5px] text-[rgba(232,245,233,0.3)] transition-colors hover:text-[#c8a227]"
					>
						<Globe className="h-3.5 w-3.5" />
						ঢাকা, বাংলাদেশ
					</a>
				</div>
			</div>
		</footer>
	);
}
