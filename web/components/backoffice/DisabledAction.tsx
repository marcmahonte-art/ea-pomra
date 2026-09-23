import type { ComponentType } from "react";

/**
 * Action indisponible, avec sa raison.
 *
 * La plateforme n'expose aujourd'hui aucune route de mutation : les décisions
 * (valider, refuser, transmettre, assigner) ne peuvent pas être enregistrées.
 * Deux options s'offraient :
 *
 *   - afficher un bouton actif qui ne fait rien — l'utilisateur croit avoir
 *     agi, l'action est perdue, et le dossier reste silencieusement inchangé ;
 *   - afficher le bouton **désactivé en expliquant pourquoi**.
 *
 * La seconde est retenue. Elle rend l'absence visible au lieu de la masquer, ce
 * qui est la seule manière honnête de livrer une interface dont le backend
 * n'existe pas encore. Le jour où l'API arrive, ces boutons redeviennent actifs
 * sans que la mise en page change.
 *
 * Le composant est un composant serveur : il ne porte aucun gestionnaire
 * d'événement, seulement un état désactivé et un texte d'explication exposé via
 * `aria-describedby` — la raison doit être lisible au clavier et au lecteur
 * d'écran, pas seulement dans une infobulle à la souris.
 */
export function DisabledAction({
  id,
  label,
  icon: Icon,
  reason,
  variant = "outline",
}: {
  /** Identifiant unique, pour rattacher l'explication au bouton. */
  id: string;
  label: string;
  icon?: ComponentType<{ className?: string }>;
  reason: string;
  variant?: "outline" | "primary";
}) {
  const base =
    "inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-[11px] font-bold cursor-not-allowed opacity-55 border";
  const style =
    variant === "primary"
      ? `${base} border-[#174A7C] bg-[#174A7C] text-white`
      : `${base} border-[#E6E9EF] bg-white text-[#0D2B4D]`;

  return (
    <>
      <button
        type="button"
        disabled
        aria-describedby={`${id}-reason`}
        className={style}
      >
        {Icon ? <Icon className="w-3.5 h-3.5" aria-hidden="true" /> : null}
        {label}
      </button>
      <span id={`${id}-reason`} className="sr-only">
        {reason}
      </span>
    </>
  );
}

export default DisabledAction;
