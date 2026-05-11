import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { Star, Quote } from "lucide-react";
import type { Review } from "@/types";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "reviews" });
  return { title: "Customer Reviews", description: t("subtitle") };
}

const FLAGS: Record<string, string> = { "United Kingdom": "🇬🇧", Germany: "🇩🇪", China: "🇨🇳", Japan: "🇯🇵", France: "🇫🇷", Australia: "🇦🇺", USA: "🇺🇸", Thailand: "🇹🇭", Russia: "🇷🇺", Korea: "🇰🇷" };

const PLACEHOLDER: Review[] = [
  { id: "1", author_name: "Sarah Johnson", author_country: "United Kingdom", rating: 5, comment: "Absolutely amazing experience! Our guide was knowledgeable and so friendly. The tour was perfectly organized and we saw the most stunning parts of Koh Samui. The Big Buddha temple was breathtaking and the waterfall was a highlight. Highly recommend Mountain Tour Samui to everyone!", tour_id: null, is_featured: true, created_at: "2024-12-01" },
  { id: "2", author_name: "Hans Mueller", author_country: "Germany", rating: 5, comment: "We booked the island highlights tour and it exceeded all expectations. The driver was punctual and professional, the itinerary was well-planned, and we discovered hidden gems we would never have found on our own. Excellent value for money!", tour_id: null, is_featured: true, created_at: "2024-11-15" },
  { id: "3", author_name: "陈伟", author_country: "China", rating: 5, comment: "非常专业的旅游公司！导游很友善，行程安排合理，让我们全家都玩得很开心。服务态度很好，对景点介绍详细。强烈推荐！", tour_id: null, is_featured: true, created_at: "2024-11-10" },
  { id: "4", author_name: "Yuki Tanaka", author_country: "Japan", rating: 5, comment: "Best tour company in Koh Samui! Super professional service, great communication before and during the tour, and the price was very reasonable. Our whole family had an incredible time. The guide spoke excellent English and was very patient with our kids.", tour_id: null, is_featured: true, created_at: "2024-10-28" },
  { id: "5", author_name: "Marie Dupont", author_country: "France", rating: 5, comment: "Service excellent! Notre guide parlait parfaitement l'anglais et connaissait l'île comme sa poche. Le déjeuner traditionnel était délicieux et la cascade était magnifique. Une journée inoubliable. Merci infiniment!", tour_id: null, is_featured: true, created_at: "2024-10-20" },
  { id: "6", author_name: "Michael Brown", author_country: "Australia", rating: 5, comment: "Great tour with absolutely stunning scenery. The team was professional, accommodating, and truly passionate about sharing their island. The sunset at Chaweng beach at the end was just magical. 10/10 would recommend.", tour_id: null, is_featured: true, created_at: "2024-10-05" },
  { id: "7", author_name: "Anna Kowalski", author_country: "Russia", rating: 5, comment: "Perfect tour! Everything was organized flawlessly. Our guide was incredible — full of energy, funny, and very knowledgeable. We felt completely safe throughout the day. We will definitely book again on our next visit to Samui!", tour_id: null, is_featured: false, created_at: "2024-09-22" },
  { id: "8", author_name: "James Lee", author_country: "USA", rating: 5, comment: "Absolutely loved this experience! The small group size made it feel personal and special. Our guide knew all the secret spots and the local lunch was delicious. Best money spent during our Thailand trip!", tour_id: null, is_featured: false, created_at: "2024-09-15" },
  { id: "9", author_name: "김민준", author_country: "Korea", rating: 5, comment: "정말 훌륭한 투어 회사입니다! 가이드가 매우 친절하고 전문적이었으며, 섬의 숨겨진 보석들을 발견할 수 있었습니다. 가족 여행에 강력 추천합니다!", tour_id: null, is_featured: false, created_at: "2024-09-08" },
];

async function getReviews(): Promise<Review[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("reviews").select("*").eq("is_approved", true).order("created_at", { ascending: false });
    return data || [];
  } catch { return []; }
}

export default async function ReviewsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "reviews" });
  const dbReviews = await getReviews();
  const reviews = dbReviews.length > 0 ? dbReviews : PLACEHOLDER;

  const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <div className="pt-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-charcoal to-stone py-20 text-center relative overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <span className="inline-block bg-orange-primary/20 text-orange-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-4">{t("badge")}</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">
            {t("title")} <span className="text-orange-primary">{t("titleHighlight")}</span>
          </h1>
          <p className="text-white/60 text-lg mb-8">{t("subtitle")}</p>
          <div className="flex items-center justify-center gap-3">
            <div className="flex gap-1">
              {[1,2,3,4,5].map((s) => <Star key={s} className="w-7 h-7 text-yellow-400 fill-yellow-400" />)}
            </div>
            <span className="text-5xl font-bold text-white">{avgRating}</span>
            <div className="text-left text-white/60 text-sm">
              <div>{t("rating")}</div>
              <div>{t("based")} {reviews.length}+ {t("totalReviews")}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative">
              <Quote className="absolute top-6 right-6 w-8 h-8 text-orange-100" />
              <div className="flex gap-0.5 mb-4">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} className={`w-4 h-4 ${s <= r.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`} />
                ))}
              </div>
              <p className="text-stone/70 text-sm leading-relaxed mb-5">&ldquo;{r.comment}&rdquo;</p>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {r.author_name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-charcoal text-sm truncate">{r.author_name}</div>
                  <div className="text-xs text-stone/50">{FLAGS[r.author_country] || "🌍"} {r.author_country}</div>
                </div>
                {r.created_at && (
                  <div className="text-xs text-stone/40 flex-shrink-0">
                    {new Date(r.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
