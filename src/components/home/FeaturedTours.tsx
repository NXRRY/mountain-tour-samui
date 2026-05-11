import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Clock, ArrowRight, Star } from "lucide-react";
import type { TourWithTranslation } from "@/types";

interface Props {
  tours: TourWithTranslation[];
}

export default function FeaturedTours({ tours }: Props) {
  const t = useTranslations("featured");
  const locale = useLocale();

  const placeholderTours = [
    {
      id: "1",
      slug: "samui-island-highlights",
      cover_image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&q=80",
      price_adult: 1500,
      duration: 8,
      translation: {
        title: "Koh Samui Island Highlights Tour",
        short_description: "Discover the best of Koh Samui in one amazing day — temples, viewpoints, and beaches.",
      },
    },
    {
      id: "2",
      slug: "ang-thong-marine-park",
      cover_image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80",
      price_adult: 1800,
      duration: 7,
      translation: {
        title: "Ang Thong Marine Park Tour",
        short_description: "Explore the stunning 42-island archipelago with snorkeling and kayaking.",
      },
    },
    {
      id: "3",
      slug: "samui-sunset-cruise",
      cover_image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80",
      price_adult: 1200,
      duration: 4,
      translation: {
        title: "Samui Sunset Cruise",
        short_description: "Sail around Koh Samui and watch the sunset with drinks and snacks.",
      },
    },
  ];

  const displayTours = tours.length > 0 ? tours : placeholderTours;

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block bg-orange-100 text-orange-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            {t("badge")}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal mb-4">
            {t("title")}{" "}
            <span className="gradient-text">{t("titleHighlight")}</span>
          </h2>
          <p className="text-stone/70 text-lg max-w-2xl mx-auto">{t("subtitle")}</p>
        </div>

        {/* Tour Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayTours.map((tour: any) => (
            <div key={tour.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 card-hover">
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={tour.cover_image || "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&q=80"}
                  alt={tour.translation?.title || "Tour"}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Price badge */}
                <div className="absolute top-4 right-4">
                  <div className="bg-orange-primary text-white px-3 py-1.5 rounded-xl text-sm font-bold shadow-lg">
                    ฿{tour.price_adult?.toLocaleString()}{" "}
                    <span className="text-xs font-normal opacity-80">
                      {t("perAdult")}
                    </span>
                  </div>
                </div>
                {/* Rating */}
                <div className="absolute bottom-4 left-4">
                  <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-semibold text-charcoal">4.9</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-1.5 text-stone/60 text-sm mb-3">
                  <Clock className="w-4 h-4" />
                  <span>
                    {tour.duration} {t("hours")}
                  </span>
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
                    Details
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
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-12">
          <Link
            href={`/${locale}/tours`}
            className="inline-flex items-center gap-2 border-2 border-orange-primary text-orange-primary hover:bg-orange-primary hover:text-white px-8 py-3.5 rounded-full font-semibold transition-all"
          >
            {t("viewAll")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
