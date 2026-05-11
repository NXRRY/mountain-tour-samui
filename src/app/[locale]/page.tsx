import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import HeroSection from "@/components/home/HeroSection";
import FeaturedTours from "@/components/home/FeaturedTours";
import AboutSection from "@/components/home/AboutSection";
import GalleryPreview from "@/components/home/GalleryPreview";
import ReviewsSection from "@/components/home/ReviewsSection";
import ContactCTA from "@/components/home/ContactCTA";
import type { TourWithTranslation, Review } from "@/types";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hero" });
  return {
    title: "Mountain Tour Samui — Koh Samui Tour Experts",
    description: t("subtitle"),
  };
}

async function getFeaturedTours(locale: string): Promise<TourWithTranslation[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("tours")
      .select(`*, translations:tour_translations!inner(*)`)
      .eq("is_featured", true)
      .eq("is_active", true)
      .eq("tour_translations.language", locale)
      .order("sort_order")
      .limit(3);

    if (!data) return [];

    return data.map((tour) => ({
      ...tour,
      translation: tour.translations[0],
    }));
  } catch {
    return [];
  }
}

async function getFeaturedReviews(): Promise<Review[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .eq("is_featured", true)
      .eq("is_approved", true)
      .order("created_at", { ascending: false })
      .limit(6);
    return data || [];
  } catch {
    return [];
  }
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const [tours, reviews] = await Promise.all([
    getFeaturedTours(locale),
    getFeaturedReviews(),
  ]);

  return (
    <>
      <HeroSection />
      <FeaturedTours tours={tours} />
      <AboutSection />
      <GalleryPreview />
      <ReviewsSection reviews={reviews} />
      <ContactCTA />
    </>
  );
}
