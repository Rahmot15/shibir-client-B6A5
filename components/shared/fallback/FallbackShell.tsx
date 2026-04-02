import type { ReactNode } from "react"

type Props = {
  badge: string
  title: string
  description: string
  icon: ReactNode
  actions?: ReactNode
}

export default function FallbackShell({
  badge,
  title,
  description,
  icon,
  actions,
}: Props) {
  return (
    <section className="relative isolate overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(165deg,rgba(255,255,255,0.06),rgba(255,255,255,0.015))] px-5 py-7 shadow-[0_18px_45px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:px-8 sm:py-10">
      <div className="pointer-events-none absolute -left-14 top-8 h-44 w-44 rounded-full bg-[radial-gradient(circle,oklch(0.78_0.17_147/0.22),transparent_70%)]" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-52 w-52 rounded-full bg-[radial-gradient(circle,oklch(0.8_0.13_84/0.2),transparent_72%)]" />

      <div className="relative mx-auto w-full max-w-2xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[2.5px] text-white/70">
          {icon}
          <span>{badge}</span>
        </div>

        <h1 className="mt-4 text-balance text-[clamp(1.65rem,4vw,2.5rem)] font-semibold leading-tight text-(--text-strong)">
          {title}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-pretty text-sm leading-7 text-(--text-soft) sm:text-base">
          {description}
        </p>

        {actions ? <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">{actions}</div> : null}
      </div>
    </section>
  )
}
