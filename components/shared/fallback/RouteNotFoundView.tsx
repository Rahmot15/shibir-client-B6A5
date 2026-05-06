import Link from "next/link"
import { Home, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

type Props = {
  title?: string
  description?: string
}

export default function RouteNotFoundView({
  title = "This page could not be found",
  description = "The address may be incorrect, or the page was moved. Please use navigation links to continue safely.",
}: Props) {
  return (
    <main className="relative grid min-h-[72vh] place-items-center overflow-hidden px-4 py-10 sm:px-6">
      {/* Background texture grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse at center, black 20%, transparent 75%)",
        }}
      />

      {/* Glow blobs */}
      <div className="pointer-events-none absolute -left-24 -top-20 h-96 w-96 rounded-full bg-[radial-gradient(circle,oklch(0.78_0.17_147/0.06),transparent_70%)]" />
      <div className="pointer-events-none absolute -bottom-16 -right-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,oklch(0.8_0.13_84/0.05),transparent_70%)]" />

      <div className="relative flex flex-col items-center text-center">
        {/* ── 404 number ── */}
        <div className="relative mb-8 flex items-center justify-center">
          {/* Ghost 4s */}
          <span
            className="select-none text-[clamp(100px,22vw,180px)] font-semibold leading-none tracking-[-6px]"
            style={{ color: "transparent", WebkitTextStroke: "1.5px rgba(255,255,255,0.1)" }}
          >
            4
          </span>

          {/* Animated circle / compass */}
          <div className="relative z-10 mx-[-8px] flex h-[clamp(90px,18vw,150px)] w-[clamp(90px,18vw,150px)] items-center justify-center">
            {/* Orbit ring */}
            <div className="absolute inset-0 animate-spin rounded-full border border-white/[0.07] [animation-duration:20s]">
              {/* Orbit dots */}
              {[0, -6.67, -13.33].map((delay, i) => (
                <span
                  key={i}
                  className="absolute left-1/2 top-0 h-[5px] w-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[oklch(0.78_0.17_147)] shadow-[0_0_6px_oklch(0.78_0.17_147/0.6)]"
                  style={{
                    opacity: 1 - i * 0.3,
                    transformOrigin: `0px clamp(45px,9vw,75px)`,
                    animation: `spin 20s linear ${delay}s infinite`,
                  }}
                />
              ))}
            </div>

            {/* Scan line */}
            <div className="absolute inset-0 overflow-hidden rounded-full">
              <div
                className="absolute left-1/2 h-px w-[140%] -translate-x-1/2 -rotate-12 bg-gradient-to-r from-transparent via-[oklch(0.78_0.17_147/0.5)] to-transparent"
                style={{ animation: "scan 3s ease-in-out infinite alternate", top: "50%" }}
              />
            </div>

            {/* Compass icon — counter-rotates so it stays upright */}
            <div className="absolute inset-0 flex items-center justify-center [animation:spin_20s_linear_reverse_infinite]">
              <svg
                className="h-[44%] w-[44%] opacity-60"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
                <path
                  d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"
                  stroke="oklch(0.78 0.17 147)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="12" r="1" fill="oklch(0.78 0.17 147)" />
              </svg>
            </div>
          </div>

          <span
            className="select-none text-[clamp(100px,22vw,180px)] font-semibold leading-none tracking-[-6px]"
            style={{ color: "transparent", WebkitTextStroke: "1.5px rgba(255,255,255,0.1)" }}
          >
            4
          </span>
        </div>

        {/* Badge */}
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[oklch(0.78_0.17_147/0.2)] bg-[oklch(0.78_0.17_147/0.06)] px-3 py-1 font-mono text-[10px] uppercase tracking-[2px] text-[oklch(0.78_0.17_147)]">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[oklch(0.78_0.17_147)]" />
          route not found
        </div>

        {/* Title */}
        <h1 className="mb-3 max-w-[480px] text-balance text-[clamp(1.4rem,3.5vw,2.1rem)] font-medium leading-snug tracking-tight text-(--text-strong)">
          {title}
        </h1>

        {/* Description */}
        <p className="mx-auto mb-8 max-w-[400px] text-pretty text-sm leading-7 text-(--text-soft)">
          {description}
        </p>

        {/* Divider */}
        <div className="mb-7 flex w-full max-w-[280px] items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/[0.07]" />
          <span className="font-mono text-[10px] uppercase tracking-[2px] text-white/20">navigate</span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/[0.07]" />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          <Button
            asChild
            variant="outline"
            className="h-[38px] rounded-xl border-white/10 bg-white/[0.04] px-4 text-(--text-strong) hover:bg-white/[0.08]"
          >
            <Link href="/">
              <Home className="h-3.5 w-3.5" />
              Back to Home
            </Link>
          </Button>

          <Button
            asChild
            className="h-[38px] rounded-xl bg-(--status-success) px-4 text-[#05250f] hover:bg-[oklch(0.82_0.17_147)]"
          >
            <Link href="/reports">
              Open Reports
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* CSS keyframes */}
      <style>{`
        @keyframes scan {
          0%   { transform: translateX(-50%) translateY(-40px) rotate(-12deg); opacity: 0.3; }
          100% { transform: translateX(-50%) translateY(40px)  rotate(-12deg); opacity: 0.8; }
        }
      `}</style>
    </main>
  )
}
