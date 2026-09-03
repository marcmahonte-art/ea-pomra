"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-[#0D2B4D] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Grille principale 5 colonnes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Col 1 : Brand & Socials (4 colonnes) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full overflow-hidden flex items-center justify-center bg-white/10">
                <Image
                  src="/assets/logo-ea-pomra-round.png"
                  alt="Logo EA-POMRA"
                  width={44}
                  height={44}
                  className="object-contain"
                />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-white block">
                  EA-POMRA
                </span>
                <span className="text-[12px] text-slate-300">
                  Étudier en Afrique, Réussir demain.
                </span>
              </div>
            </div>

            <p className="text-[13px] text-slate-300 leading-relaxed max-w-sm">
              Plateforme d&apos;Orientation, de Mobilité et de Réussite Académique au service des étudiants et des familles africaines.
            </p>

            {/* Réseaux sociaux avec SVGs haute fidélité */}
            <div className="flex items-center gap-2.5 pt-1">
              {/* Facebook */}
              <a
                href="#facebook"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-200 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              {/* Twitter / X */}
              <a
                href="#twitter"
                aria-label="Twitter / X"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-200 hover:text-white transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a
                href="#linkedin"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-200 hover:text-white transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              {/* YouTube */}
              <a
                href="#youtube"
                aria-label="YouTube"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-200 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2 : Plateforme (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-bold text-[14px] text-white tracking-wide">
              Plateforme
            </h4>
            <ul className="space-y-2 text-[13px] text-slate-300">
              <li><Link href="#apropos" className="hover:text-white transition-colors">À propos</Link></li>
              <li><Link href="#programmes" className="hover:text-white transition-colors">Programmes</Link></li>
              <li><Link href="#antennes" className="hover:text-white transition-colors">Antennes</Link></li>
              <li><Link href="#actualites" className="hover:text-white transition-colors">Actualités</Link></li>
              <li><Link href="#contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Col 3 : Ressources (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-bold text-[14px] text-white tracking-wide">
              Ressources
            </h4>
            <ul className="space-y-2 text-[13px] text-slate-300">
              <li><Link href="#guide" className="hover:text-white transition-colors">Guide étudiant</Link></li>
              <li><Link href="#faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="#documents" className="hover:text-white transition-colors">Documents utiles</Link></li>
              <li><Link href="#blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="#support" className="hover:text-white transition-colors">Support</Link></li>
            </ul>
          </div>

          {/* Col 4 : Espace (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-bold text-[14px] text-white tracking-wide">
              Espace
            </h4>
            <ul className="space-y-2 text-[13px] text-slate-300">
              <li><Link href="/etudiant/dashboard" className="hover:text-white transition-colors">Étudiant</Link></li>
              <li><Link href="/etudiant/dashboard" className="hover:text-white transition-colors">Parent</Link></li>
              <li><Link href="#professionnel" className="hover:text-white transition-colors">Professionnel</Link></li>
              <li><Link href="#bec" className="hover:text-white transition-colors">BEC / Administration</Link></li>
            </ul>
          </div>

          {/* Col 5 : Restez informé (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-bold text-[14px] text-white tracking-wide">
              Restez informé
            </h4>
            <p className="text-[12px] text-slate-300 leading-relaxed">
              Recevez nos actualités et conseils directement dans votre boîte mail.
            </p>

            <form onSubmit={(e) => { e.preventDefault(); alert("Merci pour votre inscription !"); }} className="space-y-2">
              <input
                type="email"
                required
                placeholder="Votre adresse email"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white text-[#0D2B4D] placeholder-slate-400 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#1EA362]"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#1EA362] hover:bg-[#17824E] text-white font-bold text-[13px] transition-colors cursor-pointer"
              >
                S&apos;inscrire
              </button>
            </form>
          </div>
        </div>

        {/* Ligne basse Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-slate-400">
          <p>© 2024 EA-POMRA. Tous droits réservés.</p>
          <div className="flex items-center gap-6">
            <Link href="#mentions" className="hover:text-white transition-colors">
              Mentions légales
            </Link>
            <Link href="#confidentialite" className="hover:text-white transition-colors">
              Politique de confidentialité
            </Link>
            <Link href="#cgu" className="hover:text-white transition-colors">
              Conditions d&apos;utilisation
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
