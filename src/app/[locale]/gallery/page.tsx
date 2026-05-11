import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import type { GalleryImage } from "@/types";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "gallery" });
  return { title: t("badge"), description: t("subtitle") };
}

const PLACEHOLDER_IMAGES = [
  { id: "1", image_url: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80", caption: "Chaweng Beach", category: "beaches", sort_order: 0, created_at: "" },
  { id: "2", image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80", caption: "Mountain Views", category: "nature", sort_order: 1, created_at: "" },
  { id: "3", image_url: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80", caption: "Big Buddha Temple", category: "temples", sort_order: 2, created_at: "" },
  { id: "4", image_url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80", caption: "Snorkeling Adventure", category: "water", sort_order: 3, created_at: "" },
  { id: "5", image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80", caption: "Sunset Paradise", category: "beaches", sort_order: 4, created_at: "" },
  { id: "6", image_url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80", caption: "Crystal Clear Water", category: "water", sort_order: 5, created_at: "" },
  { id: "7", image_url: "https://images.unsplash.com/photo-1546630392-db5b1f04874a?w=800&q=80", caption: "Jungle Waterfall", category: "nature", sort_order: 6, created_at: "" },
  { id: "8", image_url: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80", caption: "Island Life", category: "culture", sort_order: 7, created_at: "" },
  { id: "9", image_url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80", caption: "Panoramic Views", category: "nature", sort_order: 8, created_at: "" },
  { id: "10", image_url: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80", caption: "Beach Activities", category: "beaches", sort_order: 9, created_at: "" },
  { id: "11", image_url: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800&q=80", caption: "Happy Travelers", category: "customers", sort_order: 10, created_at: "" },
  { id: "12", image_url: "https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?w=800&q=80", caption: "Thai Culture", category: "culture", sort_order: 11, created_at: "" },
];

const CATEGORIES = ["all", "beaches", "nature", "temples", "water", "culture", "customers"];

async function getGallery(): Promise<GalleryImage[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("gallery").select("*").order("sort_order");
    return data || [];
  } catch {
    return [];
  }
}

export default async function GalleryPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "gallery" });
  const dbImages = await getGallery();
  const images = dbImages.length > 0 ? dbImages : PLACEHOLDER_IMAGES;

  return (
    <div className="pt-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-charcoal to-stone py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1920&q=30')", backgroundSize: "cover" }} />
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <span className="inline-block bg-orange-primary/20 text-orange-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-4">{t("badge")}</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">
            {t("title")} <span className="text-orange-primary">{t("titleHighlight")}</span>
          </h1>
          <p className="text-white/60 text-lg">{t("subtitle")}</p>
        </div>
      </div>

      {/* Masonry Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {images.map((img, i) => (
            <div key={img.id} className="break-inside-avoid group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all">
              <Image
                src={img.image_url}
                alt={img.caption || `Gallery ${i + 1}`}
                width={400}
                height={i % 3 === 0 ? 600 : 400}
                className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {img.caption && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-white text-sm font-medium">{img.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
