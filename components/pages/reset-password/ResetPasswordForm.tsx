"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Key, Loader2, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/auth/shared";
import { resetPassword } from "@/lib/authService";

type ResetPasswordFormProps = {
  email: string;
};

const strengthLabels = ["", "দুর্বল", "মোটামুটি", "ভালো", "শক্তিশালী"];
const strengthColors = ["", "#ef5350", "#c8a227", "#00a844", "#00c853"];

export default function ResetPasswordForm({ email: initialEmail }: ResetPasswordFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const strength = (() => {
    if (!password) {
      return 0;
    }

    let score = 0;

    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    return score;
  })();

  const strengthLabel = strengthLabels[strength];
  const strengthColor = strengthColors[strength];

  function validate() {
    const validationErrors: Record<string, string> = {};

    if (!email) {
      validationErrors.email = "ইমেইল দিন";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      validationErrors.email = "সঠিক ইমেইল দিন";
    }

    if (!otp) {
      validationErrors.otp = "ওটিপি কোড দিন";
    } else if (otp.length < 6) {
      validationErrors.otp = "ওটিপি কোড কমপক্ষে ৬ ডিজিটের হবে";
    }

    if (!password) {
      validationErrors.password = "পাসওয়ার্ড দিন";
    } else if (password.length < 8) {
      validationErrors.password = "কমপক্ষে ৮ অক্ষর";
    }

    if (confirm !== password) {
      validationErrors.confirm = "পাসওয়ার্ড মিলছে না";
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

    try {
      const result = await resetPassword({ email, otp, newPassword: password });

      if (result.success) {
        toast.success("পাসওয়ার্ড রিসেট সফল হয়েছে!", {
          description: "এখন নতুন পাসওয়ার্ড দিয়ে লগইন করুন।",
        });
        router.push("/login");
      } else {
        toast.error("রিসেট ব্যর্থ", {
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
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
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
        label="ওটিপি কোড"
        placeholder="৬ ডিজিটের ওটিপি লিখুন"
        icon={Key}
        value={otp}
        onChange={setOtp}
        error={errors.otp}
        onKeyDown={handleKeyDown}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Input
          label="নতুন পাসওয়ার্ড"
          type={showPass ? "text" : "password"}
          placeholder="শক্তিশালী পাসওয়ার্ড দিন"
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
                display: "flex",
                transition: "color .2s",
              }}
              onMouseEnter={(event) => (event.currentTarget.style.color = "#00c853")}
              onMouseLeave={(event) => (event.currentTarget.style.color = "rgba(232,245,233,0.3)")}
            >
              {showPass ? <EyeOff size={15} strokeWidth={1.8} /> : <Eye size={15} strokeWidth={1.8} />}
            </button>
          }
        />

        {password && (
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ display: "flex", gap: 4 }}>
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  style={{
                    flex: 1,
                    height: 3,
                    borderRadius: 2,
                    background: level <= strength ? strengthColor : "rgba(232,245,233,0.1)",
                    transition: "background .3s",
                  }}
                />
              ))}
            </div>
            <span
              style={{
                fontSize: 10,
                color: strengthColor,
                letterSpacing: "1px",
                fontFamily: "var(--font-geist-mono, monospace)",
              }}
            >
              {strengthLabel}
            </span>
          </div>
        )}
      </div>

      <Input
        label="পাসওয়ার্ড নিশ্চিত করুন"
        type="password"
        placeholder="আবার পাসওয়ার্ড দিন"
        icon={Lock}
        value={confirm}
        onChange={setConfirm}
        onKeyDown={handleKeyDown}
        error={errors.confirm}
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
        {loading ? "পাসওয়ার্ডরিসেট হচ্ছে..." : "পাসওয়ার্ড রিসেট করুন"}
      </button>

      <p style={{ textAlign: "center", fontSize: 12, color: "rgba(232,245,233,0.38)", letterSpacing: "0.3px" }}>
        লগইন করতে চান?{" "}
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
