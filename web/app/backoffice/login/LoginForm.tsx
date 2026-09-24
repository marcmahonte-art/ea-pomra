"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/backoffice/actions";
import type { BackofficeRole } from "@/lib/backoffice-types";

export function BackofficeLoginForm({ defaultRole }: { defaultRole: BackofficeRole }) {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(login, { status: "idle" });

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="role" value={defaultRole} />
      <div>
        <label htmlFor="email" className="block text-xs font-bold text-[#0D2B4D]">
          Adresse professionnelle
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className="mt-1 w-full rounded-xl border border-[#D8DEE9] px-3 py-2 text-sm outline-none focus:border-[#174A7C]"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-xs font-bold text-[#0D2B4D]">
          Mot de passe
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-1 w-full rounded-xl border border-[#D8DEE9] px-3 py-2 text-sm outline-none focus:border-[#174A7C]"
        />
      </div>
      {state.status === "error" ? (
        <p className="text-xs font-semibold text-[#B42318]">{state.message}</p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-[#174A7C] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
      >
        {pending ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
