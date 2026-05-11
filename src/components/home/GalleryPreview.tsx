import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { ArrowRight } from "lucide-react";

const GALLERY_IMAGES = [
  { src: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&q=80", alt: "Koh Samui Beach", className: "col-span-2 row-span-2" },
  { src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80", alt: "Mountain View" },
  { src: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&q=80", alt: "Snorkeling" },
  { src: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&q=80", alt: "Temple" },
  { src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80", alt: "Sunset" },
];

export default function GalleryPreview() {
  const t = useTranslations("gallery");
  const locale = useLocale();

  return (
    <section className="py-20 lg:py-28 bg-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <span className="inline-block bg-orange-primary/20 text-orange-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              {t("badge")}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              {t("title")}{" "}
              <span className="text-orange-primary">{t("titleHighlight")}</span>
            </h2>
            <p className="text-white/50 mt-2">{t("subtitle")}</p>
          </div>
          <Link
            href={`/${locale}/gallery`}
            className="flex-shrink-0 inline-flex items-center gap-2 border border-orange-primary text-orange-primary hover:bg-orange-primary hover:text-white px-6 py-3 rounded-full font-semibold transition-all text-sm"
          >
            {t("viewAll")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-3 grid-rows-2 gap-4 h-[480px]">
          {GALLERY_IMAGES.map((img, i) => (
            <div
              key={i}
              className={`relative overflow-hidden rounded-2xl group ${img.className || ""}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
