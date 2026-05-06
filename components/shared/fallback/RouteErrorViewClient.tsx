"use client"

import Link from "next/link"
import { RefreshCcw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

type Props = {
  title?: string
  description?: string
  onRetry?: () => void
}

export default function RouteErrorViewClient({
  title = "Something went wrong",
  description = "An unexpected issue interrupted this page. You can retry now or return to the homepage.",
  onRetry,
}: Props) {
  return (
    <main className="relative grid min-h-[72vh] place-items-center overflow-hidden px-4 py-10 sm:px-6">
      {/* Grid texture */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.013) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.013) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse at center, black 20%, transparent 72%)",
        }}
      />

      {/* Glow blobs */}
      <div className="pointer-events-none absolute -top-24 -right-28 h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle,rgba(220,38,38,0.08),transparent_68%)]" />
      <div className="pointer-events-none absolute -bottom-12 -left-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(251,146,60,0.05),transparent_70%)]" />

      <div className="relative flex flex-col items-center text-center">
        {/* ── Broken hex visual ── */}
        <div className="relative mb-9 flex h-[110px] w-[110px] items-center justify-center">
          {/* Dashed rotating ring */}
          <div
            className="absolute inset-[-14px] rounded-full border border-dashed border-red-500/20"
            style={{ animation: "spinSlow 12s linear infinite" }}
          >
            <span className="absolute top-0 left-1/2 h-[6px] w-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.9)]" />
          </div>

          {/* Floating sparks */}
          {[
            { style: "top-[18px] right-[8px]", delay: "0s" },
            { style: "bottom-[14px] left-[6px]", delay: "0.8s" },
            { style: "top-1/2 right-[2px]", delay: "1.6s" },
          ].map((s, i) => (
            <span
              key={i}
              className={`absolute h-[3px] w-[3px] rounded-full bg-orange-400 shadow-[0_0_6px_rgba(251,146,60,0.9)] ${s.style}`}
              style={{
                animation: `sparkFly 2.4s ease-in-out ${s.delay} infinite`,
              }}
            />
          ))}

          {/* Hex SVG */}
          <svg
            className="h-full w-full"
            viewBox="0 0 110 110"
            xmlns="http://www.w3.org/2000/svg"
            style={{ animation: "hexPulse 3s ease-in-out infinite" }}
          >
            <polygon
              points="55,8 97,31 97,79 55,102 13,79 13,31"
              fill="rgba(239,68,68,0.06)"
              stroke="rgba(239,68,68,0.25)"
              strokeWidth="1.5"
              strokeDasharray="6 3"
            />
            <polygon
              points="55,22 84,38 84,72 55,88 26,72 26,38"
              fill="none"
              stroke="rgba(239,68,68,0.1)"
              strokeWidth="1"
            />
            {/* Lightning — top half */}
            <path
              d="M 60,28 L 48,52 L 57,52"
              stroke="#ef4444"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              style={{ filter: "drop-shadow(0 0 4px rgba(239,68,68,0.7))" }}
            />
            {/* Lightning — bottom half (faded = broken) */}
            <path
              d="M 59,58 L 50,82"
              stroke="#ef4444"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.45"
              style={{ filter: "drop-shadow(0 0 4px rgba(239,68,68,0.4))" }}
            />
            {/* Spark at break */}
            <circle
              cx="58"
              cy="55"
              r="3"
              fill="#fb923c"
              style={{ filter: "drop-shadow(0 0 5px rgba(251,146,60,1))" }}
            >
              <animate
                attributeName="opacity"
                values="1;0.2;1"
                dur="0.8s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="r"
                values="3;4.5;3"
                dur="0.8s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>

        {/* Badge */}
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-500/18 bg-red-500/7 px-3 py-1 font-mono text-[10px] tracking-[2px] text-red-400 uppercase">
          <span
            className="h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)]"
            style={{ animation: "blinkDot 1.2s ease-in-out infinite" }}
          />
          System Alert
        </div>

        {/* Title */}
        <h1 className="mb-2.5 max-w-[360px] text-[clamp(1.3rem,3vw,1.85rem)] leading-snug font-medium tracking-tight text-balance text-(--text-strong)">
          {title}
        </h1>

        {/* Description */}
        <p className="mx-auto mb-9 max-w-[340px] text-[13.5px] leading-7 text-pretty text-(--text-soft)">
          {description}
        </p>

        {/* Divider */}
        <div className="mb-7 flex w-full max-w-[260px] items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-red-500/12" />
          <span className="font-mono text-[10px] tracking-[2px] text-white/15 uppercase">
            recover
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-red-500/12" />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          <Button
            type="button"
            onClick={onRetry}
            className="h-[38px] rounded-xl bg-red-600 px-4 text-white hover:bg-red-700"
          >
            <RefreshCcw className="h-3.5 w-3.5" />
            Try Again
          </Button>

          <Button
            asChild
            variant="outline"
            className="h-[38px] rounded-xl border-white/10 bg-white/[0.04] px-4 text-(--text-strong) hover:bg-white/[0.08]"
          >
            <Link href="/">
              <Home className="h-3.5 w-3.5" />
              Go Home
            </Link>
          </Button>
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes spinSlow { to { transform: rotate(360deg); } }
        @keyframes hexPulse {
          0%, 100% { filter: drop-shadow(0 0 8px rgba(239,68,68,0.25)); }
          50%       { filter: drop-shadow(0 0 22px rgba(239,68,68,0.5)); }
        }
        @keyframes blinkDot {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.2; }
        }
        @keyframes sparkFly {
          0%   { opacity: 0;   transform: scale(0.5) translate(0,0); }
          30%  { opacity: 1;   transform: scale(1)   translate(-4px,-6px); }
          60%  { opacity: 0.6; transform: scale(0.8) translate(-8px,-12px); }
          100% { opacity: 0;   transform: scale(0.3) translate(-12px,-18px); }
        }
      `}</style>
    </main>
  )
}
