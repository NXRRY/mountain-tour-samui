import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import ToursClient from "./ToursClient";
import type { TourWithTranslation } from "@/types";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tours" });
  return { title: t("title"), description: t("subtitle") };
}

async function getTours(locale: string): Promise<TourWithTranslation[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("tours")
      .select(`*, translations:tour_translations!inner(*)`)
      .eq("is_active", true)
      .eq("tour_translations.language", locale)
      .order("sort_order");

    if (!data) return [];
    return data.map((tour) => ({ ...tour, translation: tour.translations[0] }));
  } catch {
    return [];
  }
}

export default async function ToursPage({ params }: Props) {
  const { locale } = await params;
  const tours = await getTours(locale);
  return <ToursClient tours={tours} />;
}
