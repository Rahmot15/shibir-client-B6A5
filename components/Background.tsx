"use client";

export default function Background() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
    >
      {/* ── 1. Base deep dark ── */}
      <div className="absolute inset-0 bg-[#050f08]" />

      {/* ── 2. Center green glow — smooth, no hard edge ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 75% 60% at 50% 40%, rgba(0,160,65,0.085) 0%, rgba(0,100,40,0.03) 55%, transparent 100%)",
        }}
      />

      {/* ── 3. Side glows ── */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 40% 35% at 0% 55%, rgba(0,130,50,0.05) 0%, transparent 100%),
            radial-gradient(ellipse 40% 35% at 100% 55%, rgba(0,130,50,0.05) 0%, transparent 100%)
          `,
        }}
      />

      {/* ── 4. Gold corner accents ── */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 28% 22% at 95% 5%,  rgba(200,162,39,0.065) 0%, transparent 100%),
            radial-gradient(ellipse 22% 18% at 5%  95%, rgba(200,162,39,0.045) 0%, transparent 100%)
          `,
        }}
      />

      {/* ── 5. Dot grid ── */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(0,180,70,0.22) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage:
            "radial-gradient(ellipse 85% 72% at 50% 48%, black 10%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 85% 72% at 50% 48%, black 10%, transparent 100%)",
          opacity: 0.18,
        }}
      />

      {/* ── 6. Breathing orb — center (green) ── */}
      <div
        className="absolute rounded-full"
        style={{
          width: "650px",
          height: "650px",
          top: "50%",
          left: "50%",
          translate: "-50% -54%",
          background:
            "radial-gradient(circle, rgba(0,190,75,0.065) 0%, rgba(0,130,50,0.02) 45%, transparent 70%)",
          animation: "breathe 7s ease-in-out infinite",
        }}
      />

      {/* ── 7. Breathing orb — top-right (gold) ── */}
      <div
        className="absolute rounded-full"
        style={{
          width: "420px",
          height: "420px",
          top: "-100px",
          right: "-80px",
          background:
            "radial-gradient(circle, rgba(200,162,39,0.068) 0%, transparent 65%)",
          animation: "breathe 9s ease-in-out infinite 2s",
        }}
      />

      {/* ── 8. Breathing orb — bottom-left (green) ── */}
      <div
        className="absolute rounded-full"
        style={{
          width: "360px",
          height: "360px",
          bottom: "-80px",
          left: "-50px",
          background:
            "radial-gradient(circle, rgba(0,170,65,0.05) 0%, transparent 65%)",
          animation: "breathe 11s ease-in-out infinite 4s",
        }}
      />

      {/* ── 9. Top edge glow line ── */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent 8%, rgba(0,200,83,0.25) 50%, transparent 92%)",
        }}
      />

      {/* ── 10. Bottom edge glow line ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent 15%, rgba(0,200,83,0.1) 50%, transparent 85%)",
        }}
      />

      {/* ── 11. Noise texture ── */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px",
          opacity: 0.028,
          mixBlendMode: "overlay",
        }}
      />

      {/* ── 12. Vignette ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 105% 105% at 50% 50%, transparent 38%, rgba(2,8,5,0.65) 100%)",
        }}
      />

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes breathe {
          0%, 100% { opacity: 0.65; scale: 1;   }
          50%       { opacity: 1;   scale: 1.1; }
        }
      `}</style>
    </div>
  );
}
