import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { Clock, ArrowLeft, CheckCircle, XCircle, MapPin, Package, Star } from "lucide-react";
import type { TourWithTranslation, ItineraryItem } from "@/types";

type Props = { params: Promise<{ locale: string; slug: string }> };

async function getTour(slug: string, locale: string): Promise<TourWithTranslation | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("tours")
      .select(`*, translations:tour_translations!inner(*)`)
      .eq("slug", slug)
      .eq("is_active", true)
      .eq("tour_translations.language", locale)
      .single();

    if (!data) return null;
    return { ...data, translation: data.translations[0] };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const tour = await getTour(slug, locale);
  if (!tour) return { title: "Tour Not Found" };
  return {
    title: tour.translation?.title,
    description: tour.translation?.short_description,
    openGraph: { images: [{ url: tour.cover_image || "" }] },
  };
}

const PLACEHOLDER_TOUR: TourWithTranslation = {
  id: "1", slug: "samui-island-highlights",
  cover_image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1200&q=80",
  gallery: [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80",
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
  ],
  price_adult: 1500, price_child: 750, duration: 8,
  pickup_info: "We pick you up from your hotel. Please provide your hotel name and room number when booking.",
  what_to_bring: "Comfortable walking shoes, sunscreen, hat, camera, swimwear, and a light jacket.",
  is_featured: true, is_active: true, created_at: "",
  translation: {
    id: "1", tour_id: "1", language: "en",
    title: "Koh Samui Island Highlights Tour",
    short_description: "Discover the best of Koh Samui in one amazing day — sacred temples, stunning viewpoints, and beautiful beaches.",
    full_description: "<p>Join us on the ultimate Koh Samui experience! This full-day tour takes you to the island's most iconic landmarks and hidden treasures.</p><p>Led by our expert local guides, you'll discover the spiritual heart of Samui, marvel at panoramic ocean views, and relax on pristine beaches. Our comfortable air-conditioned vehicle ensures a relaxing journey between destinations.</p>",
    highlights: ["Visit the Big Buddha Temple (Wat Phra Yai)", "Stunning viewpoints with panoramic sea views", "Secret waterfalls in the jungle", "Crystal clear swimming spots", "Traditional local lunch included", "Small group experience (max 8 people)"],
    itinerary: [
      { time: "08:00", description: "Hotel pickup from your accommodation" },
      { time: "09:00", description: "Visit Big Buddha Temple — the island's most iconic landmark" },
      { time: "10:30", description: "Explore Hin Ta and Hin Yai rocks" },
      { time: "12:00", description: "Traditional Thai lunch at local restaurant" },
      { time: "13:30", description: "Namuang Waterfall — swim in natural pools" },
      { time: "15:00", description: "Secret viewpoint with stunning panoramic views" },
      { time: "16:30", description: "Sunset at Chaweng Beach" },
      { time: "17:30", description: "Return to your hotel" },
    ] as ItineraryItem[],
    included: ["Hotel pickup and drop-off", "Air-conditioned vehicle", "English-speaking guide", "Traditional Thai lunch", "Water and refreshments", "Entrance fees to all attractions"],
    excluded: ["Personal expenses", "Tips for guides (appreciated)", "Alcoholic beverages", "Souvenirs"],
  },
};

export default async function TourDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "tours" });
  const tour = await getTour(slug, locale) || (slug === "samui-island-highlights" ? PLACEHOLDER_TOUR : null);

  if (!tour) notFound();

  const highlights = Array.isArray(tour.translation?.highlights) ? tour.translation.highlights : [];
  const itinerary = Array.isArray(tour.translation?.itinerary) ? tour.translation.itinerary as ItineraryItem[] : [];
  const included = Array.isArray(tour.translation?.included) ? tour.translation.included : [];
  const excluded = Array.isArray(tour.translation?.excluded) ? tour.translation.excluded : [];
  const gallery = Array.isArray(tour.gallery) ? tour.gallery : [];

  return (
    <div className="pt-20">
      {/* Hero Image */}
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <Image
          src={tour.cover_image || "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1200&q=80"}
          alt={tour.translation?.title || "Tour"}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 hero-overlay" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 w-full">
            <Link
              href={`/${locale}/tours`}
              className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("backToTours")}
            </Link>
            <div className="flex flex-wrap items-end gap-4 justify-between">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
                  {tour.translation?.title}
                </h1>
                <div className="flex items-center gap-4 text-white/80">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{tour.duration} hours</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span>4.9 (100+ reviews)</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white/60 text-sm">From</div>
                <div className="text-4xl font-bold text-orange-primary">฿{tour.price_adult?.toLocaleString()}</div>
                <div className="text-white/60 text-sm">per adult</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold text-charcoal mb-4">About This Tour</h2>
              <div
                className="prose max-w-none text-stone/70 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: tour.translation?.full_description || "" }}
              />
            </div>

            {/* Highlights */}
            {highlights.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-charcoal mb-5">{t("highlights")}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {highlights.map((item: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 bg-orange-50 rounded-xl p-3.5">
                      <div className="w-5 h-5 bg-orange-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">✓</span>
                      </div>
                      <span className="text-sm text-charcoal">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Itinerary */}
            {itinerary.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-charcoal mb-5">{t("itinerary")}</h2>
                <div className="relative">
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-orange-100" />
                  <div className="space-y-4">
                    {itinerary.map((item, i) => (
                      <div key={i} className="flex gap-5 relative">
                        <div className="w-12 h-12 bg-orange-primary rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 z-10 shadow-md">
                          {item.time}
                        </div>
                        <div className="flex-1 bg-white rounded-xl p-4 shadow-sm border border-gray-100 mt-1">
                          <p className="text-sm text-charcoal">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Included / Excluded */}
            {(included.length > 0 || excluded.length > 0) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {included.length > 0 && (
                  <div className="bg-green-50 rounded-2xl p-6">
                    <h3 className="font-bold text-charcoal mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      {t("included")}
                    </h3>
                    <ul className="space-y-2">
                      {included.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-stone/70">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {excluded.length > 0 && (
                  <div className="bg-red-50 rounded-2xl p-6">
                    <h3 className="font-bold text-charcoal mb-4 flex items-center gap-2">
                      <XCircle className="w-5 h-5 text-red-400" />
                      {t("excluded")}
                    </h3>
                    <ul className="space-y-2">
                      {excluded.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-stone/70">
                          <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Pickup & What to Bring */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {tour.pickup_info && (
                <div className="bg-blue-50 rounded-2xl p-6">
                  <h3 className="font-bold text-charcoal mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-500" />
                    {t("pickup")}
                  </h3>
                  <p className="text-sm text-stone/70">{tour.pickup_info}</p>
                </div>
              )}
              {tour.what_to_bring && (
                <div className="bg-yellow-50 rounded-2xl p-6">
                  <h3 className="font-bold text-charcoal mb-3 flex items-center gap-2">
                    <Package className="w-5 h-5 text-yellow-600" />
                    {t("bring")}
                  </h3>
                  <p className="text-sm text-stone/70">{tour.what_to_bring}</p>
                </div>
              )}
            </div>

            {/* Gallery */}
            {gallery.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-charcoal mb-5">Tour Gallery</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {gallery.map((img: string, i: number) => (
                    <div key={i} className="relative h-32 rounded-xl overflow-hidden">
                      <Image src={img} alt={`Gallery ${i + 1}`} fill className="object-cover hover:scale-110 transition-transform duration-300" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar — Booking Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-orange-primary to-orange-dark p-6 text-white">
                  <div className="text-sm opacity-80 mb-1">Starting from</div>
                  <div className="text-4xl font-bold">฿{tour.price_adult?.toLocaleString()}</div>
                  <div className="text-sm opacity-80">per adult</div>
                  {tour.price_child && (
                    <div className="text-sm opacity-80 mt-1">Children: ฿{tour.price_child?.toLocaleString()}</div>
                  )}
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                    <span className="text-stone/60">Duration</span>
                    <span className="font-semibold text-charcoal">{tour.duration} hours</span>
                  </div>
                  <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                    <span className="text-stone/60">Group Size</span>
                    <span className="font-semibold text-charcoal">Max 8 people</span>
                  </div>
                  <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                    <span className="text-stone/60">Language</span>
                    <span className="font-semibold text-charcoal">EN / TH / ZH</span>
                  </div>
                  <Link
                    href={`/${locale.split("/")[0] || "en"}/booking?tour=${tour.slug}`}
                    className="block w-full text-center bg-orange-primary hover:bg-orange-dark text-white py-4 rounded-2xl font-bold text-base transition-all btn-glow"
                  >
                    {t("bookNow")} →
                  </Link>
                  <a
                    href={`https://wa.me/66956182397?text=Hello! I'm interested in booking the ${tour.translation?.title} tour.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-2xl font-semibold text-sm transition-all"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    WhatsApp Us
                  </a>
                  <p className="text-center text-xs text-stone/40">Free cancellation up to 24 hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
