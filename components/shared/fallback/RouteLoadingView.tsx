"use client"

import { motion } from "framer-motion"
import ShibirLogo from "../ShibirLogo/ShibirLogo"

export default function RouteLoadingView() {
  return (
    <main className="relative grid min-h-[72vh] place-items-center overflow-hidden px-4 py-10">

      {/* Grid texture */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.013) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.013) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse at center, black 20%, transparent 72%)",
        }}
      />

      {/* Glow blobs */}
      <div className="pointer-events-none absolute -left-24 -top-20 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(0,179,241,0.07),transparent_70%)]" />
      <div className="pointer-events-none absolute -bottom-12 -right-16 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(206,23,31,0.04),transparent_70%)]" />

      <div className="relative flex flex-col items-center gap-10">

        {/* ── Logo + orbit rings ── */}
        <div className="relative flex h-[120px] w-[120px] items-center justify-center">

          {/* Outer orbit ring — cyan */}
          <motion.div
            className="absolute inset-[-12px] rounded-full border border-[rgba(0,179,241,0.15)]"
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          >
            {/* Orbit dot */}
            <span className="absolute left-1/2 top-0 h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00b3f1] shadow-[0_0_10px_rgba(0,179,241,0.8)]" />
          </motion.div>

          {/* Inner orbit ring — red */}
          <motion.div
            className="absolute inset-[-4px] rounded-full border border-[rgba(206,23,31,0.2)]"
            animate={{ rotate: -360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            <span className="absolute bottom-0 left-1/2 h-[5px] w-[5px] -translate-x-1/2 translate-y-1/2 rounded-full bg-[#ce171f] shadow-[0_0_8px_rgba(206,23,31,0.7)]" />
          </motion.div>

          {/* Logo — breathe */}
          <motion.div
            className="h-full w-full"
            animate={{
              scale: [1, 1.04, 1],
              filter: [
                "drop-shadow(0 0 10px rgba(0,179,241,0.2))",
                "drop-shadow(0 0 22px rgba(0,179,241,0.45))",
                "drop-shadow(0 0 10px rgba(0,179,241,0.2))",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <ShibirLogo />
          </motion.div>
        </div>

        {/* ── Progress bar + dots ── */}
        <div className="flex flex-col items-center gap-3">

          {/* Sweep bar */}
          <div className="relative h-px w-44 overflow-hidden rounded-full bg-white/[0.06]">
            <motion.div
              className="absolute inset-y-0 rounded-full bg-[#00b3f1] shadow-[0_0_6px_rgba(0,179,241,0.6)]"
              animate={{
                left: ["0%", "40%", "100%"],
                width: ["0%", "60%", "0%"],
              }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          {/* Bounce dots */}
          <div className="flex items-center gap-1.5">
            {[0, 0.2, 0.4].map((delay, i) => (
              <motion.span
                key={i}
                className="h-1 w-1 rounded-full bg-white/20"
                animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.4, 1] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay }}
                style={i === 0 ? { background: "rgba(0,179,241,0.7)" } : undefined}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
