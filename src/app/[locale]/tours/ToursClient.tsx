"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Search, Clock, Star, ArrowRight, Filter } from "lucide-react";
import type { TourWithTranslation } from "@/types";

const PLACEHOLDER_TOURS: TourWithTranslation[] = [
  { id: "1", slug: "samui-island-highlights", cover_image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&q=80", gallery: [], price_adult: 1500, price_child: 750, duration: 8, pickup_info: null, what_to_bring: null, is_featured: true, is_active: true, created_at: "", translation: { id: "1", tour_id: "1", language: "en", title: "Koh Samui Island Highlights Tour", short_description: "Discover the best of Koh Samui in one amazing day — sacred temples, stunning viewpoints, and beautiful beaches.", highlights: [], itinerary: [], included: [], excluded: [] } },
  { id: "2", slug: "ang-thong-marine-park", cover_image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80", gallery: [], price_adult: 1800, price_child: 900, duration: 7, pickup_info: null, what_to_bring: null, is_featured: true, is_active: true, created_at: "", translation: { id: "2", tour_id: "2", language: "en", title: "Ang Thong Marine Park Tour", short_description: "Explore the stunning 42-island archipelago with snorkeling, kayaking, and breathtaking sea views.", highlights: [], itinerary: [], included: [], excluded: [] } },
  { id: "3", slug: "samui-sunset-cruise", cover_image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80", gallery: [], price_adult: 1200, price_child: 600, duration: 4, pickup_info: null, what_to_bring: null, is_featured: false, is_active: true, created_at: "", translation: { id: "3", tour_id: "3", language: "en", title: "Samui Sunset Cruise", short_description: "Sail around Koh Samui and watch the magical sunset with cocktails and canapés.", highlights: [], itinerary: [], included: [], excluded: [] } },
  { id: "4", slug: "koh-tao-snorkeling", cover_image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80", gallery: [], price_adult: 2200, price_child: 1100, duration: 10, pickup_info: null, what_to_bring: null, is_featured: false, is_active: true, created_at: "", translation: { id: "4", tour_id: "4", language: "en", title: "Koh Tao & Koh Nang Yuan Snorkeling", short_description: "Full day snorkeling at Thailand's best dive sites — crystal clear water and vibrant coral reefs.", highlights: [], itinerary: [], included: [], excluded: [] } },
  { id: "5", slug: "namuang-waterfall-safari", cover_image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80", gallery: [], price_adult: 900, price_child: 450, duration: 5, pickup_info: null, what_to_bring: null, is_featured: false, is_active: true, created_at: "", translation: { id: "5", tour_id: "5", language: "en", title: "Namuang Waterfall & Safari Tour", short_description: "Explore the jungle waterfalls and experience an exciting elephant safari in the heart of Samui.", highlights: [], itinerary: [], included: [], excluded: [] } },
  { id: "6", slug: "samui-temples-culture", cover_image: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=80", gallery: [], price_adult: 800, price_child: 400, duration: 4, pickup_info: null, what_to_bring: null, is_featured: false, is_active: true, created_at: "", translation: { id: "6", tour_id: "6", language: "en", title: "Temples & Culture Half Day Tour", short_description: "Discover Samui's spiritual heart — visit Big Buddha, Wat Plai Laem, and traditional Thai temples.", highlights: [], itinerary: [], included: [], excluded: [] } },
];

interface Props { tours: TourWithTranslation[] }

export default function ToursClient({ tours }: Props) {
  const t = useTranslations("tours");
  const locale = useLocale();
  const [search, setSearch] = useState("");

  const displayTours = tours.length > 0 ? tours : PLACEHOLDER_TOURS;

  const filtered = useMemo(() =>
    displayTours.filter((tour) =>
      !search ||
      tour.translation?.title.toLowerCase().includes(search.toLowerCase()) ||
      tour.translation?.short_description.toLowerCase().includes(search.toLowerCase())
    ), [displayTours, search]);

  return (
    <div className="pt-20">
      {/* Hero Banner */}
      <div className="relative py-20 bg-gradient-to-br from-charcoal via-stone to-charcoal overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1920&q=40')", backgroundSize: "cover" }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block bg-orange-primary/20 text-orange-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            {t("badge")}
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">{t("title")}</h1>
          <p className="text-white/60 text-lg">{t("subtitle")}</p>
          {/* Search */}
          <div className="relative max-w-xl mx-auto mt-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t("search")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-orange-primary"
            />
          </div>
        </div>
      </div>

      {/* Tours Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-stone/50 text-lg">{t("noResults")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((tour) => (
              <TourCard key={tour.id} tour={tour} locale={locale} t={t} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TourCard({ tour, locale, t }: { tour: TourWithTranslation; locale: string; t: ReturnType<typeof useTranslations> }) {
  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 card-hover">
      <div className="relative h-56 overflow-hidden">
        <Image
          src={tour.cover_image || "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&q=80"}
          alt={tour.translation?.title || "Tour"}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-orange-primary text-white px-3 py-1.5 rounded-xl text-sm font-bold shadow-lg">
          ฿{tour.price_adult?.toLocaleString()}
          <span className="text-xs font-normal opacity-80"> / {t("adult")}</span>
        </div>
        {tour.is_featured && (
          <div className="absolute top-4 left-4 bg-yellow-400 text-charcoal px-2 py-1 rounded-lg text-xs font-bold">
            ⭐ Featured
          </div>
        )}
        <div className="absolute bottom-4 left-4">
          <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-semibold text-charcoal">4.9</span>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-1.5 text-stone/50 text-sm mb-3">
          <Clock className="w-4 h-4" />
          <span>{tour.duration} {t("hours") || "hrs"}</span>
        </div>
        <h3 className="font-bold text-charcoal text-lg mb-2 line-clamp-2 group-hover:text-orange-primary transition-colors">
          {tour.translation?.title}
        </h3>
        <p className="text-stone/60 text-sm line-clamp-2 mb-5">
          {tour.translation?.short_description}
        </p>
        <div className="flex gap-3">
          <Link
            href={`/${locale}/tours/${tour.slug}`}
            className="flex-1 text-center border-2 border-orange-primary text-orange-primary hover:bg-orange-primary hover:text-white py-2.5 rounded-xl text-sm font-semibold transition-all"
          >
            {t("viewDetails")}
          </Link>
          <Link
            href={`/${locale}/booking?tour=${tour.slug}`}
            className="flex-1 text-center bg-orange-primary hover:bg-orange-dark text-white py-2.5 rounded-xl text-sm font-semibold transition-all"
          >
            {t("bookNow")}
          </Link>
        </div>
      </div>
    </div>
  );
}
