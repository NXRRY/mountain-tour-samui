import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Shield, Car, Languages, Smartphone, ArrowRight } from "lucide-react";

export default function AboutSection() {
  const t = useTranslations("about");
  const locale = useLocale();

  const features = [
    { icon: Shield, label: t("features.certified") },
    { icon: Car, label: t("features.transport") },
    { icon: Languages, label: t("features.multilingual") },
    { icon: Smartphone, label: t("features.booking") },
  ];

  const stats = [
    { value: "20+", label: t("stats.tours") },
    { value: "5K+", label: t("stats.customers") },
    { value: "8+", label: t("stats.years") },
    { value: "3", label: t("stats.languages") },
  ];

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-orange-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Images */}
          <div className="relative">
            <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80"
                alt="Koh Samui Tour"
                fill
                className="object-cover"
              />
            </div>
            {/* Floating card */}
            <div className="absolute -bottom-8 -right-8 bg-white rounded-2xl p-5 shadow-xl border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Image
                    src="/logos/logo.png"
                    alt="Logo"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <div>
                  <div className="text-2xl font-bold text-charcoal">4.9 ★</div>
                  <div className="text-sm text-stone/60">Average Rating</div>
                </div>
              </div>
            </div>
            {/* Stats floating card */}
            <div className="absolute -top-6 -left-6 bg-orange-primary text-white rounded-2xl p-4 shadow-xl">
              <div className="text-3xl font-bold">8+</div>
              <div className="text-xs opacity-80">Years of Experience</div>
            </div>
          </div>

          {/* Content */}
          <div>
            <span className="inline-block bg-orange-100 text-orange-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              {t("badge")}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal mb-6 leading-tight">
              {t("title")}{" "}
              <span className="gradient-text">{t("titleHighlight")}</span>
            </h2>
            <p className="text-stone/70 leading-relaxed mb-4">
              {t("description")}
            </p>
            <p className="text-stone/70 leading-relaxed mb-8">
              {t("description2")}
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-3 bg-white p-3.5 rounded-xl shadow-sm border border-gray-100">
                  <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <f.icon className="w-4 h-4 text-orange-primary" />
                  </div>
                  <span className="text-sm font-medium text-charcoal">{f.label}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              {stats.map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-bold text-orange-primary">{s.value}</div>
                  <div className="text-xs text-stone/60 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            <Link
              href={`/${locale}/about`}
              className="inline-flex items-center gap-2 bg-orange-primary hover:bg-orange-dark text-white px-7 py-3.5 rounded-full font-semibold transition-all btn-glow"
            >
              {t("cta")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
