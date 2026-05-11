"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Save, ArrowLeft, Plus, Trash2, Upload } from "lucide-react";
import Link from "next/link";

type Locale = "en" | "th" | "zh";

const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "th", label: "Thai", flag: "🇹🇭" },
  { code: "zh", label: "Chinese", flag: "🇨🇳" },
];

interface TourData {
  slug: string;
  price_adult: number;
  price_child: number;
  duration: number;
  pickup_info: string;
  what_to_bring: string;
  is_featured: boolean;
  is_active: boolean;
  cover_image: string;
}

interface TranslationData {
  title: string;
  short_description: string;
  full_description: string;
  highlights: string[];
  itinerary: { time: string; description: string }[];
  included: string[];
  excluded: string[];
}

interface Props {
  mode: "create" | "edit";
  tourId?: string;
  initialData?: Partial<TourData>;
  initialTranslations?: Partial<Record<Locale, Partial<TranslationData>>>;
}

export default function TourForm({ mode, tourId, initialData, initialTranslations }: Props) {
  const router = useRouter();
  const [activeLocale, setActiveLocale] = useState<Locale>("en");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [tour, setTour] = useState<TourData>({
    slug: "", price_adult: 1500, price_child: 750, duration: 8,
    pickup_info: "Hotel pickup provided.", what_to_bring: "Comfortable shoes, sunscreen, camera.",
    is_featured: false, is_active: true, cover_image: "",
    ...initialData,
  });

  const defaultTrans: TranslationData = { title: "", short_description: "", full_description: "", highlights: [""], itinerary: [{ time: "08:00", description: "" }], included: [""], excluded: [""] };
  const [translations, setTranslations] = useState<Record<Locale, TranslationData>>({
    en: { ...defaultTrans, ...(initialTranslations?.en || {}) },
    th: { ...defaultTrans, ...(initialTranslations?.th || {}) },
    zh: { ...defaultTrans, ...(initialTranslations?.zh || {}) },
  });

  const updateTrans = (locale: Locale, field: keyof TranslationData, value: unknown) => {
    setTranslations((prev) => ({ ...prev, [locale]: { ...prev[locale], [field]: value } }));
  };

  const uploadCoverImage = async (file: File) => {
    setUploading(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `tours/${tour.slug || "new"}-${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage.from("tour-images").upload(path, file, { upsert: true });
    if (!error && data) {
      const { data: url } = supabase.storage.from("tour-images").getPublicUrl(path);
      setTour((p) => ({ ...p, cover_image: url.publicUrl }));
    }
    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const supabase = createClient();
      let id = tourId;

      if (mode === "create") {
        const { data, error } = await supabase.from("tours").insert(tour).select().single();
        if (error) throw error;
        id = data.id;
      } else {
        const { error } = await supabase.from("tours").update(tour).eq("id", id!);
        if (error) throw error;
      }

      for (const locale of ["en", "th", "zh"] as Locale[]) {
        const trans = translations[locale];
        if (!trans.title) continue;
        const { error } = await supabase.from("tour_translations").upsert({
          tour_id: id, language: locale,
          title: trans.title,
          short_description: trans.short_description,
          full_description: trans.full_description,
          highlights: trans.highlights.filter(Boolean),
          itinerary: trans.itinerary.filter((i) => i.description),
          included: trans.included.filter(Boolean),
          excluded: trans.excluded.filter(Boolean),
        }, { onConflict: "tour_id,language" });
        if (error) throw error;
      }

      setSuccess(true);
      setTimeout(() => router.push("/admin/tours"), 1500);
    } catch (e: any) {
      setError(e.message || "Failed to save. Please try again.");
    }
    setSaving(false);
  };

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-primary text-sm";
  const labelClass = "block text-xs font-semibold text-stone/60 uppercase tracking-wider mb-1.5";

  return (
    <div className="space-y-6">
      {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">✅ Saved! Redirecting...</div>}

      {/* Basic Info */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="font-bold text-charcoal mb-5">Basic Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={labelClass}>URL Slug *</label>
            <input value={tour.slug} onChange={(e) => setTour({ ...tour, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })} placeholder="samui-island-highlights" className={inputClass} />
            <p className="text-xs text-stone/40 mt-1">Used in the URL: /tours/<strong>{tour.slug || "your-slug"}</strong></p>
          </div>
          <div>
            <label className={labelClass}>Price (Adult) ฿</label>
            <input type="number" value={tour.price_adult} onChange={(e) => setTour({ ...tour, price_adult: Number(e.target.value) })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Price (Child) ฿</label>
            <input type="number" value={tour.price_child} onChange={(e) => setTour({ ...tour, price_child: Number(e.target.value) })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Duration (hours)</label>
            <input type="number" step="0.5" value={tour.duration} onChange={(e) => setTour({ ...tour, duration: Number(e.target.value) })} className={inputClass} />
          </div>
          <div className="flex flex-col gap-3 pt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={tour.is_featured} onChange={(e) => setTour({ ...tour, is_featured: e.target.checked })} className="w-4 h-4 accent-orange-500" />
              <span className="text-sm font-medium text-charcoal">⭐ Featured Tour</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={tour.is_active} onChange={(e) => setTour({ ...tour, is_active: e.target.checked })} className="w-4 h-4 accent-green-500" />
              <span className="text-sm font-medium text-charcoal">🟢 Active (visible on site)</span>
            </label>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <label className={labelClass}>Cover Image</label>
            <div className="flex gap-3 items-center">
              <input value={tour.cover_image} onChange={(e) => setTour({ ...tour, cover_image: e.target.value })} placeholder="Paste image URL or upload" className={`${inputClass} flex-1`} />
              <label className="flex items-center gap-1.5 bg-orange-50 hover:bg-orange-100 text-orange-primary px-3 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-colors flex-shrink-0">
                <Upload className="w-4 h-4" />
                {uploading ? "..." : "Upload"}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadCoverImage(e.target.files[0])} />
              </label>
            </div>
          </div>
          <div>
            <label className={labelClass}>Pickup Information</label>
            <textarea value={tour.pickup_info} onChange={(e) => setTour({ ...tour, pickup_info: e.target.value })} rows={2} className={`${inputClass} resize-none`} />
          </div>
          <div>
            <label className={labelClass}>What to Bring</label>
            <textarea value={tour.what_to_bring} onChange={(e) => setTour({ ...tour, what_to_bring: e.target.value })} rows={2} className={`${inputClass} resize-none`} />
          </div>
        </div>
      </div>

      {/* Translations */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 flex">
          {LOCALES.map((l) => (
            <button
              key={l.code}
              onClick={() => setActiveLocale(l.code)}
              className={`flex-1 py-3.5 text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
                activeLocale === l.code ? "border-b-2 border-orange-primary text-orange-primary bg-orange-50" : "text-stone/60 hover:text-charcoal hover:bg-gray-50"
              }`}
            >
              {l.flag} {l.label}
            </button>
          ))}
        </div>
        <div className="p-6 space-y-4">
          {(["en", "th", "zh"] as Locale[]).map((locale) => (
            <div key={locale} className={locale === activeLocale ? "" : "hidden"}>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Title *</label>
                  <input value={translations[locale].title} onChange={(e) => updateTrans(locale, "title", e.target.value)} placeholder={`Tour title in ${locale.toUpperCase()}`} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Short Description</label>
                  <textarea value={translations[locale].short_description} onChange={(e) => updateTrans(locale, "short_description", e.target.value)} rows={2} className={`${inputClass} resize-none`} />
                </div>
                <div>
                  <label className={labelClass}>Full Description (HTML)</label>
                  <textarea value={translations[locale].full_description} onChange={(e) => updateTrans(locale, "full_description", e.target.value)} rows={5} className={`${inputClass} resize-none font-mono text-xs`} />
                </div>

                {/* Highlights */}
                <div>
                  <label className={labelClass}>Highlights</label>
                  {translations[locale].highlights.map((h, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <input value={h} onChange={(e) => { const arr = [...translations[locale].highlights]; arr[i] = e.target.value; updateTrans(locale, "highlights", arr); }} placeholder={`Highlight ${i + 1}`} className={`${inputClass} flex-1`} />
                      <button onClick={() => { const arr = translations[locale].highlights.filter((_, idx) => idx !== i); updateTrans(locale, "highlights", arr); }} className="text-red-400 hover:text-red-600 p-2"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                  <button onClick={() => updateTrans(locale, "highlights", [...translations[locale].highlights, ""])} className="flex items-center gap-1 text-orange-primary text-sm hover:underline">
                    <Plus className="w-4 h-4" /> Add Highlight
                  </button>
                </div>

                {/* Itinerary */}
                <div>
                  <label className={labelClass}>Itinerary</label>
                  {translations[locale].itinerary.map((item, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <input value={item.time} onChange={(e) => { const arr = [...translations[locale].itinerary]; arr[i] = { ...arr[i], time: e.target.value }; updateTrans(locale, "itinerary", arr); }} placeholder="08:00" className={`${inputClass} w-20 flex-shrink-0`} />
                      <input value={item.description} onChange={(e) => { const arr = [...translations[locale].itinerary]; arr[i] = { ...arr[i], description: e.target.value }; updateTrans(locale, "itinerary", arr); }} placeholder="Activity description" className={`${inputClass} flex-1`} />
                      <button onClick={() => { const arr = translations[locale].itinerary.filter((_, idx) => idx !== i); updateTrans(locale, "itinerary", arr); }} className="text-red-400 hover:text-red-600 p-2"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                  <button onClick={() => updateTrans(locale, "itinerary", [...translations[locale].itinerary, { time: "", description: "" }])} className="flex items-center gap-1 text-orange-primary text-sm hover:underline">
                    <Plus className="w-4 h-4" /> Add Stop
                  </button>
                </div>

                {/* Included / Excluded */}
                <div className="grid grid-cols-2 gap-4">
                  {(["included", "excluded"] as const).map((field) => (
                    <div key={field}>
                      <label className={labelClass}>{field === "included" ? "✅ Included" : "❌ Not Included"}</label>
                      {translations[locale][field].map((item: string, i: number) => (
                        <div key={i} className="flex gap-2 mb-2">
                          <input value={item} onChange={(e) => { const arr = [...translations[locale][field]]; arr[i] = e.target.value; updateTrans(locale, field, arr); }} className={`${inputClass} flex-1 text-xs`} />
                          <button onClick={() => { const arr = (translations[locale][field] as string[]).filter((_, idx) => idx !== i); updateTrans(locale, field, arr); }} className="text-red-400 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      ))}
                      <button onClick={() => updateTrans(locale, field, [...translations[locale][field], ""])} className="text-orange-primary text-xs hover:underline flex items-center gap-1">
                        <Plus className="w-3 h-3" /> Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Link href="/admin/tours" className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 text-stone rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Cancel
        </Link>
        <button
          onClick={handleSave}
          disabled={saving || !tour.slug}
          className="flex items-center gap-2 px-6 py-3 bg-orange-primary hover:bg-orange-dark disabled:opacity-60 text-white rounded-xl font-semibold text-sm transition-all"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : mode === "create" ? "Create Tour" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
