import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import type { BackofficeScope } from "@/lib/backoffice-types";
import { aggregateStssTransfers, getStssTransfersForScope, getStssTransfersPageForScope } from "@/lib/server/stss-service";
import {
  assertDifferentAntennas,
  assertStssAmounts,
  calculateStssAmounts,
  transitionStssStatus,
  validateCommissionRateBps
} from "@/lib/server/stss-workflow";

vi.stubEnv("NODE_ENV", "development");
vi.stubEnv("BACKOFFICE_ALLOW_DEMO", "true");

const migration = readFileSync(new URL("../db/migrations/005_stss_production.sql", import.meta.url), "utf8");

const demoScope: BackofficeScope = {
  userId: null,
  antennaId: "demo-antenne-senegal",
  role: "ANTENNE",
  countryCode: "SN",
  country: "Sénégal",
  flag: "🇸🇳",
  antennaCity: "Dakar",
  userName: "Démo",
  userTitle: "Simulation",
  permissions: ["dossiers.read"],
  isDemo: true
};

describe("STSS workflow", () => {
  it("calcule la commission en round-half-up et conserve l'invariant", () => {
    const amounts = calculateStssAmounts(550, 100);
    expect(amounts.commissionAmountMinor).toBe(6);
    expect(amounts.netAmountMinor).toBe(544);
    expect(() => assertStssAmounts(amounts)).not.toThrow();
    expect(() => assertStssAmounts({ ...amounts, netAmountMinor: 50 })).toThrow();
  });

  it("applique l'arrondi exact à chaque frontière", () => {
    expect(calculateStssAmounts(49, 100).commissionAmountMinor).toBe(0);
    expect(calculateStssAmounts(50, 100).commissionAmountMinor).toBe(1);
    expect(calculateStssAmounts(10_000, 300)).toEqual({
      grossAmountMinor: 10_000,
      netAmountMinor: 9_700,
      commissionAmountMinor: 300
    });
  });

  it("valide les commissions entre 0 et 300 bps", () => {
    expect(() => validateCommissionRateBps(0)).not.toThrow();
    expect(() => validateCommissionRateBps(300)).not.toThrow();
    expect(() => validateCommissionRateBps(-1)).toThrow();
    expect(() => validateCommissionRateBps(301)).toThrow();
    expect(() => validateCommissionRateBps(1.5)).toThrow();
  });

  it("applique uniquement les transitions explicites", () => {
    expect(transitionStssStatus("DRAFT", "PENDING_KYC")).toBe("PENDING_KYC");
    expect(transitionStssStatus("PENDING_PAYMENT", "PAYMENT_CONFIRMED")).toBe("PAYMENT_CONFIRMED");
    expect(() => transitionStssStatus("DRAFT", "FAILED")).toThrow();
    expect(() => transitionStssStatus("DRAFT", "TRANSFER_CONFIRMED")).toThrow();
    expect(() => transitionStssStatus("SIMULATION", "DRAFT")).toThrow();
  });

  it("refuse une antenne source identique à la destination", () => {
    expect(() => assertDifferentAntennas("SN-DKR", "CI-ABJ")).not.toThrow();
    expect(() => assertDifferentAntennas("SN-DKR", "SN-DKR")).toThrow();
  });
});

describe("STSS aggregation", () => {
  it("sépare strictement les montants par devise", async () => {
    const [base] = await getStssTransfersForScope(demoScope);
    if (!base) throw new Error("missing demo transfer");
    const aggregate = aggregateStssTransfers([
      base,
      {
        ...base,
        id: `${base.id}-usd`,
        currency: "USD",
        grossAmountMinor: 1_000,
        netAmountMinor: 998,
        commissionAmountMinor: 2,
        commissionRateBps: 200
      }
    ]);
    expect(aggregate.byCurrency.FCFA.grossAmountMinor).toBe(base.grossAmountMinor);
    expect(aggregate.byCurrency.USD).toEqual({
      grossAmountMinor: 1_000,
      netAmountMinor: 998,
      commissionAmountMinor: 2
    });
    expect(aggregate).not.toHaveProperty("grossAmountMinor");
    expect(aggregate).not.toHaveProperty("netAmountMinor");
    expect(aggregate).not.toHaveProperty("commissionAmountMinor");
  });

  it("refuse tout cumul au-delà du safe integer", async () => {
    const [base] = await getStssTransfersForScope(demoScope);
    if (!base) throw new Error("missing demo transfer");
    const maximum: typeof base = {
      ...base,
      grossAmountMinor: Number.MAX_SAFE_INTEGER,
      netAmountMinor: Number.MAX_SAFE_INTEGER,
      commissionAmountMinor: 0,
      commissionRateBps: 0
    };
    expect(() => aggregateStssTransfers([maximum])).not.toThrow();
    expect(() => aggregateStssTransfers([
      maximum,
      { ...maximum, grossAmountMinor: 1, netAmountMinor: 1 }
    ])).toThrow(/safe integer/);
    expect(() => aggregateStssTransfers([
      { ...maximum, grossAmountMinor: Number.MAX_SAFE_INTEGER + 1 }
    ])).toThrow(/safe integer/);
  });
});

describe("STSS demo privacy and immutability", () => {
  it("lit les données fictives sans exposer de données privées ou provider", async () => {
    const transfers = await getStssTransfersForScope(demoScope);
    expect(transfers.length).toBeGreaterThan(0);
    for (const transfer of transfers) {
      const serialized = JSON.stringify(transfer);
      expect(transfer.status).toBe("SIMULATION");
      expect(transfer.isSimulation).toBe(true);
      expect(serialized).not.toContain("studentName");
      expect(serialized).not.toContain("email");
      expect(serialized).not.toContain("phone");
      expect(serialized).not.toContain("providerPayload");
      expect(serialized).not.toContain("idempotencyKey");
      expect(transfer.grossAmountMinor).toBe(transfer.netAmountMinor + transfer.commissionAmountMinor);
    }
  });

  it("ne mute pas la projection démo entre deux lectures", async () => {
    const first = await getStssTransfersForScope(demoScope);
    const second = await getStssTransfersForScope(demoScope);
    expect(second).toEqual(first);
  });

  it("déclare les six tables STSS et les ressources d'audit", () => {
    for (const table of [
      "stss_transfers",
      "stss_payment_attempts",
      "stss_provider_events",
      "stss_kyc_checks",
      "stss_proofs",
      "stss_commission_policies"
    ]) {
      expect(migration).toContain(table);
    }
    expect(migration).toContain("STSS_TRANSFER");
    expect(migration).toContain("STSS_PROVIDER_EVENT");
    expect(migration).not.toMatch(/INSERT\s+INTO/);
  });
});

describe("STSS migration invariants", () => {
  it("calcule la commission en bigint sans multiplication flottante", () => {
    expect(migration).toContain("(NEW.gross_amount_minor / 10000) * NEW.commission_rate_bps");
    expect(migration).toContain("NEW.gross_amount_minor % 10000");
    expect(migration).not.toMatch(/commission_amount_minor\s*<>?\s*round\s*\(/i);
  });

  it("aligne la transition SQL DRAFT vers FAILED sur le workflow", () => {
    expect(migration).not.toContain("OLD.status = 'DRAFT' AND NEW.status IN ('PENDING_KYC', 'FAILED'");
  });

  it("protège les transitions SQL et la cohérence simulation/terminaison", () => {
    expect(migration).toContain("CREATE TRIGGER stss_transfers_a_validate_invariants");
    expect(migration).toContain("CREATE TRIGGER stss_transfers_b_validate_transition");
    for (const [current, next] of [
      ["DRAFT", "PENDING_KYC"],
      ["PENDING_KYC", "PENDING_PAYMENT"],
      ["PENDING_PAYMENT", "PAYMENT_CONFIRMED"],
      ["PAYMENT_CONFIRMED", "TRANSFER_PENDING"],
      ["TRANSFER_PENDING", "TRANSFER_CONFIRMED"],
      ["TRANSFER_PENDING", "FAILED"]
    ]) {
      expect(migration).toContain(`OLD.status = '${current}' AND NEW.status IN`);
      expect(migration).toContain(`'${next}'`);
    }
    expect(migration).toContain("(NEW.status = 'SIMULATION') IS DISTINCT FROM NEW.is_simulation");
    expect(migration).toContain("STSS transfer must be inserted as DRAFT");
    expect(migration).toContain("NEW.completed_at := COALESCE(NEW.completed_at, NEW.updated_at)");
  });

  it("aligne tentative, KYC et politique active sans extension ni données", () => {
    expect(migration).toContain("stss_payment_attempts_validate_currency");
    expect(migration).toContain("stss_transfers_prevent_payment_currency_change");
    expect(migration).toContain("NEW.currency <> transfer_currency");
    expect(migration).toContain("stss_kyc_checks_decision_status_check");
    expect(migration).toContain("stss_commission_policies_no_active_overlap");
    expect(migration).toContain("pg_advisory_xact_lock");
    expect(migration).not.toMatch(/INSERT\s+INTO/);
  });
});

describe("STSS repository and projection safeguards", () => {
  it("borne et restreint les lectures sans colonnes privées", () => {
    const repository = readFileSync(new URL("../lib/server/stss-repository.ts", import.meta.url), "utf8");
    expect(repository).toContain('scope.role !== "ANTENNE" && scope.role !== "BEC"');
    expect(repository).toContain('scope.permissions.includes("dossiers.read")');
    expect(repository).toContain("d.country_code = $2");
    expect(repository).toContain("t.source_country_code = $2");
    expect(repository).toContain("t.destination_country_code = $2");
    expect(repository).toMatch(/LIMIT \$\$\{limitPosition\} OFFSET \$\$\{offsetPosition\}/);
    expect(repository).not.toContain("provider_payload");
    expect(repository).not.toContain("idempotency_key");
  });

  it("retire les formulations trompeuses des projections de simulation", () => {
    const projections = [
      "../lib/data.ts",
      "../lib/parent-data.ts",
      "../components/home/ProfilesSection.tsx",
      "../components/home/SimulatorSection.tsx",
      "../components/home/AntennesSection.tsx",
      "../components/student/QuickActions.tsx",
      "../components/student/OverviewStats.tsx",
      "../components/student/StudentSidebar.tsx",
      "../components/layout/StudentShell.tsx",
      "../components/student/JourneyProgress.tsx",
      "../components/parent/DocumentsCard.tsx",
      "../components/parent/QuickActions.tsx",
      "../app/(site)/programmes/page.tsx",
      "../app/etudiant/documents/page.tsx",
      "../app/parent/documents/page.tsx",
      "../app/(site)/stss/page.tsx",
      "../app/(site)/ressources/page.tsx",
      "../app/(site)/actualites/page.tsx",
      "../app/(site)/a-propos/page.tsx",
      "../app/parent/aide/page.tsx"
    ].map((path) => readFileSync(new URL(path, import.meta.url), "utf8")).join("\n");
    expect(projections).not.toMatch(/virés?\b/i);
    expect(projections).not.toMatch(/quittance officielle disponible/i);
    expect(projections).not.toMatch(/100\s*%\s*s[ée]curis[ée]/i);
    expect(projections).not.toMatch(/opposable/i);
    expect(projections).not.toContain("保证了 funds");
    expect(projections).not.toContain("20 000 bps");
    expect(projections).not.toContain("preuve non simulée");
  });

  it("expose un aperçu borné et des agrégats par devise", async () => {
    const page = await getStssTransfersPageForScope(demoScope, 1, 1);
    expect(page.page).toBe(1);
    expect(page.limit).toBe(1);
    expect(page.total).toBeGreaterThanOrEqual(page.items.length);
    expect(page.items.length).toBeLessThanOrEqual(1);
    expect(page.aggregate.total).toBe(page.items.length);
    expect(page.aggregate.currencies.every((currency) => page.aggregate.byCurrency[currency])).toBe(true);

    const becPage = readFileSync(new URL("../app/bec/(espace)/stss/page.tsx", import.meta.url), "utf8");
    expect(becPage).toContain("Aperçu borné");
    expect(becPage).toContain("Page");
    expect(becPage).toContain("Total disponible");
    expect(becPage).toContain("Aperçu des montants par devise");
  });

  it("retire les actions locales et les promesses de documents STSS", () => {
    const studentDocuments = readFileSync(new URL("../app/etudiant/documents/page.tsx", import.meta.url), "utf8");
    const profiles = readFileSync(new URL("../components/home/ProfilesSection.tsx", import.meta.url), "utf8");
    const simulator = readFileSync(new URL("../components/home/SimulatorSection.tsx", import.meta.url), "utf8");
    expect(studentDocuments).toContain("aperçu local");
    expect(studentDocuments).not.toMatch(/quittance officielle|Validé|Déposé le|Téléversé avec succès/i);
    expect(profiles).not.toMatch(/Quittance officielle|100\s*%|Paiement fractionné|paiement sécurisé/i);
    expect(simulator).not.toMatch(/100\s*%.*(sécuris|garanti)|Dépôt en monnaie locale|Demande initiée/i);
  });
});
