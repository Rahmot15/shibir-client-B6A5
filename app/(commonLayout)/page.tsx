"use client";

import CtaSection from "@/components/cta/CtaSection";
import FeaturesSection from "@/components/features/FeaturesSection";
import Footer from "@/components/footer/Footer";
import Hero from "@/components/hero/Hero";
import Navbar from "@/components/navbar/Navbar";
import NewsSection from "@/components/news/NewsSection";
import StatsSection from "@/components/stats/StatsSection";

export default function LandingPage() {
  return (
    <main style={{ position: "relative" }}>
      <Navbar />
      <Hero />
      <StatsSection />
      <FeaturesSection />
      <CtaSection />
      <NewsSection />
      <Footer />
    </main>
  );
}
