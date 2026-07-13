"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Key, Loader2, LogOut, Mail, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/auth/shared";
import { resendEmailVerificationOTP, verifyEmailOTP } from "@/lib/authService";
import { useAuth } from "@/components/auth/AuthContext";

type VerifyEmailFormProps = {
  email: string;
};

export default function VerifyEmailForm({ email: initialEmail }: VerifyEmailFormProps) {
  const router = useRouter();
  const { setUser, logout } = useAuth();
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(120); // 2 minutes countdown
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

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
      const result = await verifyEmailOTP(email, otp);

      if (result.success && result.data) {
        setUser(result.data);
        toast.success("ইমেইল ওটিপি ভেরিফিকেশন সফল হয়েছে!", {
          description: `স্বাগতম, ${result.data.name || "ব্যবহারকারী"}!`,
        });
        router.push("/");
      } else {
        toast.error("ভেরিফিকেশন ব্যর্থ", {
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

  async function handleResend() {
    if (timer > 0) return;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: "সঠিক ইমেইল দিন" });
      return;
    }

    setErrors({});
    setResending(true);

    try {
      const result = await resendEmailVerificationOTP(email);

      if (result.success) {
        toast.success("নতুন ওটিপি কোড পাঠানো হয়েছে!");
        setTimer(120); // Reset timer
      } else {
        toast.error("ওটিপি পুনরায় পাঠানো ব্যর্থ হয়েছে", {
          description: result.message,
        });
      }
    } catch {
      toast.error("সার্ভারে সমস্যা হয়েছে", {
        description: "পরে আবার চেষ্টা করুন",
      });
    } finally {
      setResending(false);
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

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
        {loading ? "ওটিপি যাচাই হচ্ছে..." : "ওটিপি যাচাই করুন"}
      </button>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
        <button
          type="button"
          onClick={handleResend}
          disabled={timer > 0 || resending}
          style={{
            background: "none",
            border: "none",
            cursor: timer > 0 || resending ? "not-allowed" : "pointer",
            padding: 0,
            fontSize: 12,
            color: timer > 0 || resending ? "rgba(232,245,233,0.2)" : "#00c853",
            display: "flex",
            alignItems: "center",
            gap: 6,
            transition: "color .2s",
            fontFamily: "var(--font-geist-sans, sans-serif)",
          }}
          onMouseEnter={(event) => {
            if (timer === 0 && !resending) event.currentTarget.style.color = "#00e676";
          }}
          onMouseLeave={(event) => {
            if (timer === 0 && !resending) event.currentTarget.style.color = "#00c853";
          }}
        >
          {resending ? (
            <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} />
          ) : (
            <RefreshCw size={13} />
          )}
          ওটিপি পুনরায় পাঠান
        </button>

        {timer > 0 && (
          <span style={{ fontSize: 11, color: "rgba(232,245,233,0.4)", fontFamily: "var(--font-geist-mono, monospace)" }}>
            ({formatTime(timer)})
          </span>
        )}
      </div>

      <div style={{ width: "100%", height: 1, background: "rgba(0,200,83,0.1)", margin: "10px 0" }} />

      <button
        type="button"
        onClick={logout}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          width: "100%",
          padding: "11px 24px",
          borderRadius: 6,
          background: "transparent",
          color: "rgba(239,83,80,0.8)",
          fontSize: 12,
          fontWeight: 600,
          border: "1px solid rgba(239,83,80,0.3)",
          cursor: "pointer",
          transition: "all .2s",
          fontFamily: "var(--font-geist-sans, sans-serif)",
        }}
        onMouseEnter={(event) => {
          event.currentTarget.style.background = "rgba(239,83,80,0.06)";
          event.currentTarget.style.borderColor = "rgba(239,83,80,0.6)";
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.background = "transparent";
          event.currentTarget.style.borderColor = "rgba(239,83,80,0.3)";
        }}
      >
        <LogOut size={14} />
        লগআউট / বাতিল করুন
      </button>

      <style>{"@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }"}</style>
    </div>
  );
}
