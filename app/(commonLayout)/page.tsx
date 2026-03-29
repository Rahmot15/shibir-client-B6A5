"use client";

import CtaSection from "@/components/Home/cta/CtaSection";
import FeaturesSection from "@/components/Home/features/FeaturesSection";
import Hero from "@/components/Home/hero/Hero";
import NewsSection from "@/components/Home/news/NewsSection";
import StatsSection from "@/components/Home/stats/StatsSection";

export default function LandingPage() {
  return (
    <main style={{ position: "relative" }}>
      <Hero />
      <StatsSection />
      <FeaturesSection />
      <CtaSection />
      <NewsSection />
    </main>
  );
}
