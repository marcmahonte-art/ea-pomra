import type { Metadata } from "next";
import { BackofficeLoginForm } from "./LoginForm";
import type { BackofficeRole } from "@/lib/backoffice-types";

export const metadata: Metadata = {
  title: "Connexion back-office",
  robots: { index: false, follow: false }
};

type PageProps = {
  searchParams: Promise<{ role?: string | string[] }>;
};

export default async function BackofficeLoginPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const value = Array.isArray(params.role) ? params.role[0] : params.role;
  const defaultRole: BackofficeRole = value === "BEC" || value === "EXPERT_OCO" || value === "RESPONSABLE_PAP" ? value : "ANTENNE";

  return (
    <main className="min-h-screen bg-[#F7F9FB] px-4 py-16">
      <section className="mx-auto max-w-md rounded-3xl border border-[#E6E9EF] bg-white p-8 shadow-eap-card">
        <p className="text-xs font-bold uppercase tracking-wider text-[#174A7C]">EA-POMRA</p>
        <h1 className="mt-2 text-2xl font-extrabold text-[#0D2B4D]">Connexion interne</h1>
        <p className="mt-2 text-sm text-[#667085]">
           Accès réservé aux équipes Antenne, BEC, OCO et PAP.
        </p>
        <div className="mt-6">
          <BackofficeLoginForm defaultRole={defaultRole} />
        </div>
      </section>
    </main>
  );
}
