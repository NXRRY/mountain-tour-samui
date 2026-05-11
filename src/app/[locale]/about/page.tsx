import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Shield, Heart, Star, Users, Award, Globe } from "lucide-react";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about_page" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about_page" });

  const values = [
    { icon: Shield, title: "Safety First", description: "All tours follow strict safety protocols. Our vehicles are maintained and our guides are certified." },
    { icon: Heart, title: "Authentic Experiences", description: "We take you beyond the tourist trail to discover the real Koh Samui through local eyes." },
    { icon: Star, title: "Quality Service", description: "From first contact to final drop-off, we ensure every detail of your experience is perfect." },
    { icon: Globe, title: "Sustainability", description: "We support local communities and practice responsible tourism to preserve our island paradise." },
  ];

  const team = [
    { name: "Khun Somchai", role: "Founder & Head Guide", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80", languages: "Thai, English" },
    { name: "Khun Nok", role: "Senior Tour Guide", image: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=300&q=80", languages: "Thai, English, Chinese" },
    { name: "Khun Lek", role: "Customer Relations", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80", languages: "Thai, English" },
  ];

  return (
    <div className="pt-20">
      {/* Hero */}
      <div className="relative py-24 bg-gradient-to-br from-charcoal to-stone overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1920&q=40')", backgroundSize: "cover" }} />
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <span className="inline-block bg-orange-primary/20 text-orange-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-4">{t("badge")}</span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">{t("title")}</h1>
          <p className="text-white/60 text-lg">{t("subtitle")}</p>
        </div>
      </div>

      {/* Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="relative h-[450px] rounded-3xl overflow-hidden shadow-2xl">
                <Image src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80" alt="Koh Samui" fill className="object-cover" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-orange-primary text-white rounded-2xl p-5 shadow-xl">
                <div className="text-4xl font-bold">8+</div>
                <div className="text-sm opacity-80">Years of Excellence</div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-charcoal mb-6">Our Story</h2>
              <p className="text-stone/70 leading-relaxed mb-4">{t("story")}</p>
              <p className="text-stone/70 leading-relaxed mb-4">What started as a small family operation has grown into one of Koh Samui's most trusted tour companies. We&apos;ve had the privilege of sharing our beautiful island with thousands of visitors from around the world.</p>
              <p className="text-stone/70 leading-relaxed mb-8">Every tour we run is a personal invitation to experience Samui the way locals do — discovering hidden waterfalls, spiritual temples, and the warmth of Thai hospitality.</p>
              <div className="grid grid-cols-3 gap-4">
                {[{ v: "20+", l: "Tours" }, { v: "5K+", l: "Customers" }, { v: "4.9★", l: "Rating" }].map((s, i) => (
                  <div key={i} className="text-center bg-orange-50 rounded-2xl p-4">
                    <div className="text-2xl font-bold text-orange-primary">{s.v}</div>
                    <div className="text-xs text-stone/60 mt-1">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-orange-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-charcoal mb-6">{t("mission")}</h2>
          <p className="text-xl text-stone/70 leading-relaxed">{t("missionText")}</p>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-charcoal mb-12 text-center">{t("values")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <div key={i} className="text-center p-6 rounded-3xl border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-8 h-8 text-orange-primary" />
                </div>
                <h3 className="font-bold text-charcoal mb-2">{v.title}</h3>
                <p className="text-sm text-stone/60 leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-charcoal mb-12 text-center">{t("team")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {team.map((member, i) => (
              <div key={i} className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-orange-primary shadow-lg">
                  <Image src={member.image} alt={member.name} fill className="object-cover" />
                </div>
                <h3 className="font-bold text-charcoal">{member.name}</h3>
                <p className="text-orange-primary text-sm font-medium">{member.role}</p>
                <p className="text-stone/50 text-xs mt-1">🌐 {member.languages}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-orange-primary to-orange-dark text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Explore Koh Samui?</h2>
          <p className="text-white/80 mb-8">Join thousands of happy travelers who have discovered the island with us.</p>
          <Link href={`/${locale}/tours`} className="inline-block bg-white text-orange-primary hover:bg-orange-50 px-8 py-4 rounded-full font-bold transition-all hover:scale-105">
            View Our Tours →
          </Link>
        </div>
      </section>
    </div>
  );
}
