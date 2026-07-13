"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/auth/shared";
import { forgetPassword } from "@/lib/authService";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const validationErrors: Record<string, string> = {};

    if (!email) {
      validationErrors.email = "ইমেইল দিন";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      validationErrors.email = "সঠিক ইমেইল দিন";
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
    loading || setLoading(true);

    try {
      const result = await forgetPassword(email);

      if (result.success) {
        toast.success("পাসওয়ার্ড রিসেট ওটিপি পাঠানো হয়েছে!", {
          description: "আপনার ইমেইল চেক করুন।",
        });
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      } else {
        toast.error("রিকোয়েস্ট ব্যর্থ", {
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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Input
        label="ইমেইল"
        placeholder="আপনার ইমেইল লিখুন"
        icon={Mail}
        value={email}
        onChange={setEmail}
        error={errors.email}
        onKeyDown={handleKeyDown}
      />

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
        {loading ? "ওটিপি পাঠানো হচ্ছে..." : "ওটিপি পাঠান"}
      </button>

      <p style={{ textAlign: "center", fontSize: 12, color: "rgba(232,245,233,0.38)", letterSpacing: "0.3px" }}>
        পাসওয়ার্ড মনে পড়েছে?{" "}
        <Link
          href="/login"
          style={{
            color: "#00c853",
            fontSize: 12,
            letterSpacing: "0.5px",
            textDecoration: "underline",
            textUnderlineOffset: 3,
          }}
        >
          লগইন করুন
        </Link>
      </p>

      <style>{"@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }"}</style>
    </div>
  );
}
