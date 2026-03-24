"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import Background from "@/components/Background";

type Mode = "login" | "register";

type AuthPageShellProps = {
  mode: Mode;
  title: string;
  subtitle: string;
  children: ReactNode;
};

export default function AuthPageShell({ mode, title, subtitle, children }: AuthPageShellProps) {
  return (
    <>
      <Background />

      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px clamp(16px,4vw,40px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 440,
            background: "rgba(10,26,14,0.82)",
            border: "1px solid rgba(0,200,83,0.14)",
            borderRadius: 12,
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,200,83,0.06)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: 2,
              background:
                "linear-gradient(to right, transparent, #00c853, rgba(200,162,39,0.8), #00c853, transparent)",
            }}
          />

          <div style={{ display: "flex", borderBottom: "1px solid rgba(0,200,83,0.1)" }}>
            <Link
              href="/login"
              style={{
                flex: 1,
                padding: "16px 0",
                textAlign: "center",
                textDecoration: "none",
                color: mode === "login" ? "#00c853" : "rgba(232,245,233,0.35)",
                fontSize: 11,
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                fontFamily: "var(--font-geist-mono, monospace)",
                borderBottom: `2px solid ${mode === "login" ? "#00c853" : "transparent"}`,
                marginBottom: -1,
                transition: "all .25s",
              }}
            >
              লগইন
            </Link>

            <Link
              href="/register"
              style={{
                flex: 1,
                padding: "16px 0",
                textAlign: "center",
                textDecoration: "none",
                color: mode === "register" ? "#00c853" : "rgba(232,245,233,0.35)",
                fontSize: 11,
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                fontFamily: "var(--font-geist-mono, monospace)",
                borderBottom: `2px solid ${mode === "register" ? "#00c853" : "transparent"}`,
                marginBottom: -1,
                transition: "all .25s",
              }}
            >
              নিবন্ধন
            </Link>
          </div>

          <div style={{ padding: "32px 28px 28px" }}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  border: "1px solid rgba(0,200,83,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  margin: "0 auto 14px",
                  boxShadow: "0 0 20px rgba(0,200,83,0.18)",
                }}
              >
                ☽
              </div>

              <h1
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#f0fff4",
                  margin: "0 0 6px",
                  letterSpacing: "0.3px",
                }}
              >
                {title}
              </h1>
              <p style={{ fontSize: 12, color: "rgba(232,245,233,0.38)", letterSpacing: "0.3px" }}>
                {subtitle}
              </p>
            </div>

            {children}
          </div>

          <div
            style={{
              padding: "14px 28px",
              borderTop: "1px solid rgba(0,200,83,0.07)",
              textAlign: "center",
            }}
          >
            <span style={{ fontSize: 10, color: "rgba(200,162,39,0.35)", letterSpacing: "3px" }}>
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
            </span>
          </div>
        </div>
      </main>
    </>
  );
}
