"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
import { toast } from "sonner";
import { Divider, Input, SocialBtn, socials } from "@/components/auth/shared";
import { registerUser } from "@/lib/authService";

const strengthLabels = ["", "দুর্বল", "মোটামুটি", "ভালো", "শক্তিশালী"];
const strengthColors = ["", "#ef5350", "#c8a227", "#00a844", "#00c853"];

export default function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [agreed, setAgreed] = useState(false);
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

    if (!name) validationErrors.name = "নাম দিন";

    if (!email) {
      validationErrors.email = "ইমেইল দিন";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      validationErrors.email = "সঠিক ইমেইল দিন";
    }

    if (!password) {
      validationErrors.password = "পাসওয়ার্ড দিন";
    } else if (password.length < 8) {
      validationErrors.password = "কমপক্ষে ৮ অক্ষর";
    }

    if (confirm !== password) validationErrors.confirm = "পাসওয়ার্ড মিলছে না";
    if (!agreed) validationErrors.agreed = "শর্তাবলী মানতে হবে";

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
      const result = await registerUser({ name, email, password });

      if (result.success) {
        toast.success("নিবন্ধন সফল হয়েছে!", {
          description: "এখন লগইন করুন।",
        });
        router.push("/login");
      } else {
        toast.error("নিবন্ধন ব্যর্থ", {
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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", gap: 8 }}>
        {socials.map((social) => (
          <SocialBtn key={social.id} icon={social.icon} onClick={() => {}} compact />
        ))}
      </div>

      <Divider text="অথবা ফর্ম পূরণ করুন" />

      <Input label="পূর্ণ নাম" placeholder="আপনার নাম লিখুন" icon={User} value={name} onChange={setName} error={errors.name} />

      <Input label="ইমেইল" placeholder="আপনার ইমেইল লিখুন" icon={Mail} value={email} onChange={setEmail} error={errors.email} />

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Input
          label="পাসওয়ার্ড"
          type={showPass ? "text" : "password"}
          placeholder="শক্তিশালী পাসওয়ার্ড দিন"
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
        error={errors.confirm}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
          <div
            onClick={() => setAgreed((value) => !value)}
            style={{
              width: 18,
              height: 18,
              borderRadius: 4,
              flexShrink: 0,
              marginTop: 1,
              border: `1px solid ${agreed ? "#00c853" : "rgba(0,200,83,0.25)"}`,
              background: agreed ? "rgba(0,200,83,0.15)" : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all .2s",
              cursor: "pointer",
            }}
          >
            {agreed && (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path
                  d="M1.5 5L4 7.5L8.5 2.5"
                  stroke="#00c853"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
          <span style={{ fontSize: 12, color: "rgba(232,245,233,0.45)", lineHeight: 1.6 }}>
            আমি{" "}
            <a href="#" style={{ color: "#00c853", textDecoration: "underline", textUnderlineOffset: 2 }}>
              শর্তাবলী
            </a>{" "}
            ও{" "}
            <a href="#" style={{ color: "#00c853", textDecoration: "underline", textUnderlineOffset: 2 }}>
              গোপনীয়তা নীতি
            </a>{" "}
            পড়েছি এবং সম্মত আছি।
          </span>
        </label>
        {errors.agreed && (
          <span style={{ fontSize: 11, color: "rgba(239,83,80,0.8)", marginLeft: 28 }}>{errors.agreed}</span>
        )}
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
        {loading ? "নিবন্ধন হচ্ছে..." : "নিবন্ধন করুন"}
      </button>

      <p style={{ textAlign: "center", fontSize: 12, color: "rgba(232,245,233,0.38)" }}>
        আগেই অ্যাকাউন্ট আছে?{" "}
        <Link
          href="/login"
          style={{
            color: "#00c853",
            fontSize: 12,
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
