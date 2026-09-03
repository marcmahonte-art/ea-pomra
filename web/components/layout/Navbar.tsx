"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, Menu, X } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E6E9EF]/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
        {/* Logo & Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-12 h-12 rounded-full overflow-hidden flex items-center justify-center">
            <Image
              src="/assets/logo-ea-pomra-round.png"
              alt="Logo EA-POMRA"
              width={48}
              height={48}
              className="object-contain"
              priority
            />
          </div>
          <div>
            <div className="font-extrabold text-xl tracking-tight text-[#0D2B4D] leading-none">
              EA-POMRA
            </div>
            <p className="text-[12px] font-normal text-[#5B6776] mt-1">
              Étudier en Afrique, Réussir demain
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-[14px] font-medium text-[#2D3748]">
          <Link href="/" className="relative text-[#0D2B4D] font-semibold py-2">
            Accueil
            <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#1EA362] rounded-full"></span>
          </Link>
          <Link href="#apropos" className="text-[#5B6776] hover:text-[#0D2B4D] transition-colors py-2">
            À propos
          </Link>
          <Link href="#programmes" className="text-[#5B6776] hover:text-[#0D2B4D] transition-colors py-2">
            Programmes
          </Link>
          <Link href="#antennes" className="text-[#5B6776] hover:text-[#0D2B4D] transition-colors py-2">
            Antennes
          </Link>
          <Link href="#ressources" className="text-[#5B6776] hover:text-[#0D2B4D] transition-colors py-2">
            Ressources
          </Link>
          <Link href="#actualites" className="text-[#5B6776] hover:text-[#0D2B4D] transition-colors py-2">
            Actualités
          </Link>
          <Link href="#contact" className="text-[#5B6776] hover:text-[#0D2B4D] transition-colors py-2">
            Contact
          </Link>
        </nav>

        {/* CTA Se connecter */}
        <div className="hidden sm:flex items-center">
          <Link
            href="/etudiant/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0D2B4D] hover:bg-[#123B63] text-white text-[14px] font-semibold transition-all shadow-sm cursor-pointer"
          >
            <User className="w-4 h-4" />
            <span>Se connecter</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl text-[#0D2B4D] hover:bg-[#F0F5FA]"
          aria-label="Menu mobile"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#E6E9EF] px-6 py-4 space-y-3">
          <nav className="flex flex-col gap-2 font-medium text-[14px]">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#1EA362] font-semibold py-1.5"
            >
              Accueil
            </Link>
            <Link
              href="#apropos"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#5B6776] hover:text-[#0D2B4D] py-1.5"
            >
              À propos
            </Link>
            <Link
              href="#programmes"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#5B6776] hover:text-[#0D2B4D] py-1.5"
            >
              Programmes
            </Link>
            <Link
              href="#antennes"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#5B6776] hover:text-[#0D2B4D] py-1.5"
            >
              Antennes
            </Link>
            <Link
              href="#ressources"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#5B6776] hover:text-[#0D2B4D] py-1.5"
            >
              Ressources
            </Link>
            <Link
              href="#actualites"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#5B6776] hover:text-[#0D2B4D] py-1.5"
            >
              Actualités
            </Link>
            <Link
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#5B6776] hover:text-[#0D2B4D] py-1.5"
            >
              Contact
            </Link>
          </nav>

          <div className="pt-3 border-t border-[#EDF1F6]">
            <Link
              href="/etudiant/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#0D2B4D] text-white text-[14px] font-semibold"
            >
              <User className="w-4 h-4" />
              <span>Se connecter</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
