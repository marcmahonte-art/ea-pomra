import React from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { PillarsSection } from "@/components/home/PillarsSection";
import { MetricsBar } from "@/components/home/MetricsBar";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { ActorsSection } from "@/components/home/ActorsSection";
import { PartnersSection } from "@/components/home/PartnersSection";

export default function HomePage() {
  return (
    <>
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Les 4 cartes de services clés */}
      <PillarsSection />

      {/* 3. Bandeau 5 métriques sombres */}
      <MetricsBar />

      {/* 4. Comment ça marche ? (4 étapes) */}
      <HowItWorksSection />

      {/* 5. Une plateforme pour tous les acteurs (Étudiants, Parents, Antennes) */}
      <ActorsSection />

      {/* 6. Ils nous font confiance (Logos partenaires) */}
      <PartnersSection />
    </>
  );
}
