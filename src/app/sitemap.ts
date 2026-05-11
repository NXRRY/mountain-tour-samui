import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mountaintoursamui.com";
const LOCALES = ["en", "th", "zh"];
const STATIC_PAGES = ["", "/tours", "/about", "/gallery", "/reviews", "/faq", "/contact", "/booking"];

async function getTourSlugs(): Promise<string[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("tours").select("slug").eq("is_active", true);
    return data?.map((t) => t.slug) || [];
  } catch {
    return ["samui-island-highlights"];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getTourSlugs();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    for (const page of STATIC_PAGES) {
      entries.push({
        url: `${BASE_URL}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === "" ? "daily" : "weekly",
        priority: page === "" ? 1 : page === "/tours" ? 0.9 : 0.7,
      });
    }
    for (const slug of slugs) {
      entries.push({
        url: `${BASE_URL}/${locale}/tours/${slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  }

  return entries;
}
