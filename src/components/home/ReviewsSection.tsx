import { useTranslations, useLocale } from "next-intl";
import { Star, Quote } from "lucide-react";
import type { Review } from "@/types";

interface Props {
  reviews: Review[];
}

const PLACEHOLDER_REVIEWS: Review[] = [
  { id: "1", author_name: "Sarah Johnson", author_country: "United Kingdom", rating: 5, comment: "Absolutely amazing experience! Our guide was knowledgeable and friendly. The tour was well-organized and we saw the most beautiful parts of Koh Samui. Highly recommend!", tour_id: null, is_featured: true, created_at: "" },
  { id: "2", author_name: "Hans Mueller", author_country: "Germany", rating: 5, comment: "We booked the island tour and it was perfect. The driver was punctual, the itinerary was great, and we discovered hidden gems we would never have found on our own.", tour_id: null, is_featured: true, created_at: "" },
  { id: "3", author_name: "陈伟", author_country: "China", rating: 5, comment: "非常专业的旅游公司！导游很友善，行程安排合理，让我们全家都玩得很开心。强烈推荐！", tour_id: null, is_featured: true, created_at: "" },
  { id: "4", author_name: "Yuki Tanaka", author_country: "Japan", rating: 5, comment: "Best tour company in Koh Samui! Professional service, great communication, and the price was very reasonable. Our family had an incredible time.", tour_id: null, is_featured: true, created_at: "" },
  { id: "5", author_name: "Marie Dupont", author_country: "France", rating: 5, comment: "Service excellent! Notre guide parlait plusieurs langues. Nous avons vécu une journée magique. Merci Mountain Tour Samui!", tour_id: null, is_featured: true, created_at: "" },
  { id: "6", author_name: "Michael Brown", author_country: "Australia", rating: 5, comment: "Great tour with beautiful scenery. The team was very professional and accommodating. Would definitely book again on our next visit!", tour_id: null, is_featured: true, created_at: "" },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`}
        />
      ))}
    </div>
  );
}

function countryFlag(country: string): string {
  const flags: Record<string, string> = {
    "United Kingdom": "🇬🇧",
    Germany: "🇩🇪",
    China: "🇨🇳",
    Japan: "🇯🇵",
    France: "🇫🇷",
    Australia: "🇦🇺",
    USA: "🇺🇸",
    Thailand: "🇹🇭",
  };
  return flags[country] || "🌍";
}

export default function ReviewsSection({ reviews }: Props) {
  const t = useTranslations("reviews");

  const displayReviews = reviews.length > 0 ? reviews : PLACEHOLDER_REVIEWS;

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-white to-orange-50">
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
          <p className="text-stone/70 text-lg">{t("subtitle")}</p>

          {/* Rating summary */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <span className="text-3xl font-bold text-charcoal">4.9</span>
            <div className="text-left">
              <div className="text-sm text-stone/60">{t("rating")}</div>
              <div className="text-xs text-stone/50">{t("based")} 5,000+ {t("totalReviews")}</div>
            </div>
          </div>
        </div>

        {/* Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayReviews.slice(0, 6).map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md border border-gray-100 transition-shadow relative"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-orange-100" />
              <StarRating rating={review.rating} />
              <p className="text-stone/70 text-sm leading-relaxed mt-4 mb-5 line-clamp-3">
                &ldquo;{review.comment}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {review.author_name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-charcoal text-sm">{review.author_name}</div>
                  <div className="text-xs text-stone/50">
                    {countryFlag(review.author_country)} {review.author_country}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
