import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { createAdminClient } from "@/lib/supabase/server";
import BookingForm from "./BookingForm";
import type { Tour } from "@/types";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "booking" });
  return { title: t("title"), description: t("subtitle") };
}

const fallbackTours = [
  { id: "1", slug: "samui-island-highlights", title: "Koh Samui Island Highlights Tour" },
  { id: "2", slug: "ang-thong-marine-park", title: "Ang Thong Marine Park Tour" },
  { id: "3", slug: "samui-sunset-cruise", title: "Samui Sunset Cruise" },
];

async function getTours(locale: string): Promise<{ id: string; slug: string; title: string }[]> {
  try {
    const supabase = await createAdminClient();
    const { data } = await supabase
      .from("tours")
      .select(`id, slug, translations:tour_translations!inner(title)`)
      .eq("is_active", true)
      .eq("tour_translations.language", locale)
      .order("sort_order");

    const mapped = (data || []).map((t) => ({
      id: t.id,
      slug: t.slug,
      title: (t.translations as any)[0]?.title || t.slug,
    }));
    if (mapped.length === 0) return fallbackTours;
    return mapped;
  } catch {
    return fallbackTours;
  }
}

export default async function BookingPage({ params }: Props) {
  const { locale } = await params;
  const tours = await getTours(locale);
  return <BookingForm tours={tours} />;
}
