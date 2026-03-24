"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { Divider, Input, SocialBtn, socials } from "@/components/auth/shared";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const validationErrors: Record<string, string> = {};

    if (!email) {
      validationErrors.email = "ইমেইল দিন";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      validationErrors.email = "সঠিক ইমেইল দিন";
    }

    if (!password) {
      validationErrors.password = "পাসওয়ার্ড দিন";
    }

    return validationErrors;
  }

  async function handleSubmit() {
    const validationErrors = validate();

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {socials.map((social) => (
          <SocialBtn key={social.id} icon={social.icon} label={social.label} onClick={() => {}} />
        ))}
      </div>

      <Divider text="অথবা ইমেইল দিয়ে" />

      <Input
        label="ইমেইল"
        placeholder="আপনার ইমেইল লিখুন"
        icon={Mail}
        value={email}
        onChange={setEmail}
        error={errors.email}
      />

      <Input
        label="পাসওয়ার্ড"
        type={showPass ? "text" : "password"}
        placeholder="পাসওয়ার্ড লিখুন"
        icon={Lock}
        value={password}
        onChange={setPassword}
        error={errors.password}
        rightSlot={
          <button
            type="button"
            onClick={() => setShowPass((value) => !value)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              color: "rgba(232,245,233,0.3)",
              transition: "color .2s",
              display: "flex",
            }}
            onMouseEnter={(event) => (event.currentTarget.style.color = "#00c853")}
            onMouseLeave={(event) => (event.currentTarget.style.color = "rgba(232,245,233,0.3)")}
          >
            {showPass ? <EyeOff size={15} strokeWidth={1.8} /> : <Eye size={15} strokeWidth={1.8} />}
          </button>
        }
      />

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: -10 }}>
        <a
          href="#"
          style={{
            fontSize: 11,
            color: "rgba(0,200,83,0.6)",
            textDecoration: "none",
            letterSpacing: "0.5px",
            transition: "color .2s",
            fontFamily: "var(--font-geist-mono, monospace)",
          }}
          onMouseEnter={(event) => (event.currentTarget.style.color = "#00c853")}
          onMouseLeave={(event) => (event.currentTarget.style.color = "rgba(0,200,83,0.6)")}
        >
          পাসওয়ার্ড ভুলে গেছেন?
        </a>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          width: "100%",
          padding: "13px 24px",
          borderRadius: 6,
          background: loading ? "rgba(0,200,83,0.6)" : "#00c853",
          color: "#050f08",
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "2px",
          textTransform: "uppercase",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          transition: "all .25s",
          boxShadow: "0 0 24px rgba(0,200,83,0.3)",
          fontFamily: "var(--font-geist-mono, monospace)",
        }}
        onMouseEnter={(event) => {
          if (!loading) {
            event.currentTarget.style.background = "#00e676";
            event.currentTarget.style.boxShadow = "0 0 36px rgba(0,200,83,0.45)";
          }
        }}
        onMouseLeave={(event) => {
          if (!loading) {
            event.currentTarget.style.background = "#00c853";
            event.currentTarget.style.boxShadow = "0 0 24px rgba(0,200,83,0.3)";
          }
        }}
      >
        {loading ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <ArrowRight size={16} />}
        {loading ? "লগইন হচ্ছে..." : "লগইন করুন"}
      </button>

      <p style={{ textAlign: "center", fontSize: 12, color: "rgba(232,245,233,0.38)", letterSpacing: "0.3px" }}>
        অ্যাকাউন্ট নেই?{" "}
        <Link
          href="/register"
          style={{
            color: "#00c853",
            fontSize: 12,
            letterSpacing: "0.5px",
            textDecoration: "underline",
            textUnderlineOffset: 3,
          }}
        >
          নিবন্ধন করুন
        </Link>
      </p>

      <style>{"@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }"}</style>
    </div>
  );
}
