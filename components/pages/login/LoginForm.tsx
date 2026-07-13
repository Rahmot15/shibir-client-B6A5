"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { Divider, Input, SocialBtn, socials } from "@/components/auth/shared";
import { getGoogleLoginUrl, loginUser } from "@/lib/authService";
import { useAuth } from "@/components/auth/AuthContext";

const DEMO_ADMIN_EMAIL = "demo-admin@example.com";
const DEMO_ADMIN_PASSWORD = "Demo@123";
const DEMO_SUPPORTER_EMAIL = "demo-supporter@example.com";
const DEMO_SUPPORTER_PASSWORD = "Demo@123";

type LoginCredentials = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(credentials: LoginCredentials) {
    const validationErrors: Record<string, string> = {};

    if (!credentials.email) {
      validationErrors.email = "ইমেইল দিন";
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      validationErrors.email = "সঠিক ইমেইল দিন";
    }

    if (!credentials.password) {
      validationErrors.password = "পাসওয়ার্ড দিন";
    }

    return validationErrors;
  }

  async function handleSubmit(credentials: LoginCredentials = { email, password }) {
    const validationErrors = validate(credentials);

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const result = await loginUser(credentials);

      if (result.success && result.data) {
        setUser(result.data);
        toast.success("সফলভাবে লগইন হয়েছে!", {
          description: `স্বাগতম, ${result.data.name || "ব্যবহারকারী"}!`,
        });
        router.push("/");
      } else {
        toast.error("লগইন ব্যর্থ", {
          description: result.message,
        });
      }
    } catch {
      toast.error("সার্ভারে সমস্যা হয়েছে", {
        description: "পরে আবার চেষ্টা করুন",
      });
    } finally {
      setLoading(false);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  function handleDemoLogin(demoEmail: string, demoPassword: string) {
    setEmail(demoEmail);
    setPassword(demoPassword);
    void handleSubmit({ email: demoEmail, password: demoPassword });
  }

  function handleSocialLogin(provider: string) {
    if (provider !== "google") {
      toast.info("This login provider is not available yet.");
      return;
    }

    window.location.assign(getGoogleLoginUrl());
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {socials.map((social) => (
          <SocialBtn key={social.id} icon={social.icon} label={social.label} onClick={() => handleSocialLogin(social.id)} />
        ))}
      </div>

      <Divider text="অথবা ইমেইল দিয়ে" />

      <Input
        label="ইমেইল"
        placeholder="আপনার ইমেইল লিখুন"
        icon={Mail}
        value={email}
        onChange={setEmail}
        error={errors.email}
        onKeyDown={handleKeyDown}
      />

      <Input
        label="পাসওয়ার্ড"
        type={showPass ? "text" : "password"}
        placeholder="পাসওয়ার্ড লিখুন"
        icon={Lock}
        value={password}
        onChange={setPassword}
        error={errors.password}
        onKeyDown={handleKeyDown}
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
        <Link
          href="/forgot-password"
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
          পাসওয়ার্ড ভুলে গেছেন?
        </Link>
      </div>

      <button
        type="button"
        onClick={() => handleSubmit()}
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

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 2 }}>
        <div style={{ flex: 1, height: 1, background: "rgba(0,200,83,0.1)" }} />
        <span style={{ fontSize: 10, color: "rgba(232,245,233,0.35)", letterSpacing: "0.8px" }}>
          OR TRY A DEMO ACCOUNT
        </span>
        <div style={{ flex: 1, height: 1, background: "rgba(0,200,83,0.1)" }} />
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          type="button"
          disabled={loading}
          onClick={() => handleDemoLogin(DEMO_ADMIN_EMAIL, DEMO_ADMIN_PASSWORD)}
          style={demoButtonStyle(loading)}
        >
          Demo Admin
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => handleDemoLogin(DEMO_SUPPORTER_EMAIL, DEMO_SUPPORTER_PASSWORD)}
          style={demoButtonStyle(loading)}
        >
          Demo Supporter
        </button>
      </div>

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

function demoButtonStyle(disabled: boolean): React.CSSProperties {
  return {
    flex: 1,
    padding: "10px 12px",
    borderRadius: 6,
    border: "1px solid rgba(0,200,83,0.22)",
    background: "rgba(0,200,83,0.05)",
    color: "rgba(232,245,233,0.75)",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.7px",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    transition: "all .2s",
    fontFamily: "var(--font-geist-mono, monospace)",
  };
}
