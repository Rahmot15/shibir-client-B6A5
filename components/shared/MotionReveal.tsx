"use client";

import { motion, type Transition } from "framer-motion";
import type { ReactNode } from "react";

type MotionRevealProps = {
	children: ReactNode;
	className?: string;
	delay?: number;
	duration?: number;
	y?: number;
	amount?: number;
	once?: boolean;
	transition?: Transition;
};

export default function MotionReveal({
	children,
	className,
	delay = 0,
	duration = 0.7,
	y = 20,
	amount = 0.15,
	once = true,
	transition,
}: MotionRevealProps) {
	return (
		<motion.div
			className={className}
			initial={{ opacity: 0, y }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once, amount }}
			transition={
				transition ?? {
					duration,
					delay,
					ease: [0.22, 1, 0.36, 1],
				}
			}
		>
			{children}
		</motion.div>
	);
}
