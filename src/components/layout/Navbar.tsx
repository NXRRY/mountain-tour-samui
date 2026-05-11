"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Menu, X, Globe, ChevronDown } from "lucide-react";

const LOCALES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "th", label: "ภาษาไทย", flag: "🇹🇭" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
];

export default function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: `/${locale}`, label: t("home") },
    { href: `/${locale}/tours`, label: t("tours") },
    { href: `/${locale}/about`, label: t("about") },
    { href: `/${locale}/gallery`, label: t("gallery") },
    { href: `/${locale}/reviews`, label: t("reviews") },
    { href: `/${locale}/faq`, label: t("faq") },
    { href: `/${locale}/contact`, label: t("contact") },
  ];

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
    setLangOpen(false);
  };

  const currentLocale = LOCALES.find((l) => l.code === locale);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2 flex-shrink-0">
            <div className="relative w-12 h-12">
              <Image
                src="/logos/logo.png"
                alt="Mountain Tour Samui"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <p className={`font-bold text-sm leading-tight ${isScrolled ? "text-charcoal" : "text-white"}`}>
                MOUNTAIN TOUR
              </p>
              <p className="text-[10px] text-orange-primary font-semibold tracking-widest">
                SAMUI
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.slice(0, 6).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-orange-primary ${
                  isScrolled ? "text-stone" : "text-white/90"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right: Language + Book Now */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className={`flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-full transition-all ${
                  isScrolled
                    ? "text-stone hover:bg-gray-100"
                    : "text-white/90 hover:bg-white/10"
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>{currentLocale?.flag} {currentLocale?.code.toUpperCase()}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                  {LOCALES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => switchLocale(l.code)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-orange-50 transition-colors ${
                        l.code === locale ? "text-orange-primary font-semibold bg-orange-50" : "text-stone"
                      }`}
                    >
                      <span>{l.flag}</span>
                      <span>{l.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Book Now CTA */}
            <Link
              href={`/${locale}/booking`}
              className="bg-orange-primary hover:bg-orange-dark text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all btn-glow"
            >
              {t("bookNow")}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className={`w-6 h-6 ${isScrolled ? "text-charcoal" : "text-white"}`} />
            ) : (
              <Menu className={`w-6 h-6 ${isScrolled ? "text-charcoal" : "text-white"}`} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden bg-white rounded-2xl shadow-2xl mb-4 overflow-hidden">
            <div className="px-4 py-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-3 text-stone hover:text-orange-primary hover:bg-orange-50 rounded-xl transition-colors font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-gray-100">
                <div className="flex gap-2 mb-3">
                  {LOCALES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { switchLocale(l.code); setIsOpen(false); }}
                      className={`flex-1 py-2 text-sm rounded-lg font-medium transition-colors ${
                        l.code === locale
                          ? "bg-orange-primary text-white"
                          : "bg-gray-100 text-stone hover:bg-gray-200"
                      }`}
                    >
                      {l.flag} {l.code.toUpperCase()}
                    </button>
                  ))}
                </div>
                <Link
                  href={`/${locale}/booking`}
                  className="block w-full text-center bg-orange-primary hover:bg-orange-dark text-white px-5 py-3 rounded-xl text-sm font-semibold transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  {t("bookNow")}
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
