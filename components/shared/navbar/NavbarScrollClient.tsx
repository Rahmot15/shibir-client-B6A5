"use client";

import { useEffect } from "react";

const SCROLLED_CLASSES = [
	"border-[rgba(0,200,83,0.1)]",
	"bg-[rgba(5,15,8,0.92)]",
	"backdrop-blur-[20px]",
];

const TOP_CLASSES = ["border-transparent", "bg-transparent"];

export default function NavbarScrollClient() {
	useEffect(() => {
		const nav = document.getElementById("main-navbar");
		if (!nav) {
			return;
		}

		const updateOnScroll = () => {
			const isScrolled = window.scrollY > 30;
			nav.classList.remove(...(isScrolled ? TOP_CLASSES : SCROLLED_CLASSES));
			nav.classList.add(...(isScrolled ? SCROLLED_CLASSES : TOP_CLASSES));
		};

		updateOnScroll();
		window.addEventListener("scroll", updateOnScroll, { passive: true });

		return () => {
			window.removeEventListener("scroll", updateOnScroll);
		};
	}, []);

	return null;
}
