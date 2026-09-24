"use client";

import { BackofficeError } from "@/components/backoffice/ErrorState";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <BackofficeError error={error} reset={reset} title="Une erreur est survenue dans l’espace PAP." />;
}
