import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/home/HeroSection";
import { PillarsSection } from "@/components/home/PillarsSection";
import { MetricsBar } from "@/components/home/MetricsBar";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { ActorsSection } from "@/components/home/ActorsSection";
import { PartnersSection } from "@/components/home/PartnersSection";
import { Footer } from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      {/* 1. Header / Navigation */}
      <Navbar />

      <main className="flex-1">
        {/* 2. Hero Section */}
        <HeroSection />

        {/* 3. Les 4 cartes de services clés */}
        <PillarsSection />

        {/* 4. Bandeau 5 métriques sombres */}
        <MetricsBar />

        {/* 5. Comment ça marche ? (4 étapes) */}
        <HowItWorksSection />

        {/* 6. Une plateforme pour tous les acteurs (Étudiants, Parents, Antennes) */}
        <ActorsSection />

        {/* 7. Ils nous font confiance (Logos partenaires) */}
        <PartnersSection />
      </main>

      {/* 8. Footer institutionnel */}
      <Footer />
    </div>
  );
}
