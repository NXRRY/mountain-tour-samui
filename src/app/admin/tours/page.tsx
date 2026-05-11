import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Plus, Edit, Clock } from "lucide-react";
import TourToggle from "./TourToggle";

async function getTours() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("tours")
      .select(`*, translations:tour_translations(title, language)`)
      .order("sort_order");
    return data || [];
  } catch { return []; }
}

export default async function AdminToursPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin");

  const tours = await getTours();

  return (
    <div className="lg:pl-64">
      <AdminSidebar userEmail={user.email} />
      <main className="pt-16 lg:pt-0 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-charcoal">Tour Programs</h1>
              <p className="text-stone/60 text-sm">{tours.length} tours total</p>
            </div>
            <Link
              href="/admin/tours/new"
              className="flex items-center gap-2 bg-orange-primary hover:bg-orange-dark text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all"
            >
              <Plus className="w-4 h-4" /> Add Tour
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {tours.map((tour: any) => {
              const enTitle = tour.translations?.find((t: any) => t.language === "en")?.title || tour.slug;
              return (
                <div key={tour.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="relative h-40">
                    {tour.cover_image ? (
                      <Image src={tour.cover_image} alt={enTitle} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm">No image</div>
                    )}
                    <div className="absolute top-3 right-3">
                      <TourToggle tourId={tour.id} initialActive={tour.is_active} />
                    </div>
                    {tour.is_featured && (
                      <div className="absolute top-3 left-3 bg-yellow-400 text-charcoal px-2 py-0.5 rounded-lg text-xs font-bold">⭐ Featured</div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-charcoal text-sm mb-1 line-clamp-2">{enTitle}</h3>
                    <div className="flex items-center gap-3 text-xs text-stone/50 mb-3">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {tour.duration}h</span>
                      <span className="font-semibold text-orange-primary">฿{tour.price_adult?.toLocaleString()}</span>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/tours/${tour.id}`}
                        className="flex-1 flex items-center justify-center gap-1 bg-orange-50 hover:bg-orange-100 text-orange-primary py-2 rounded-lg text-xs font-semibold transition-colors"
                      >
                        <Edit className="w-3 h-3" /> Edit
                      </Link>
                      <Link
                        href={`/en/tours/${tour.slug}`}
                        target="_blank"
                        className="flex-1 text-center bg-gray-50 hover:bg-gray-100 text-stone py-2 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Preview ↗
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}

            {tours.length === 0 && (
              <div className="col-span-3 text-center py-16 bg-white rounded-2xl border border-gray-100">
                <p className="text-stone/50 mb-4">No tours yet. Add your first tour!</p>
                <Link href="/admin/tours/new" className="inline-flex items-center gap-2 bg-orange-primary text-white px-5 py-2.5 rounded-xl font-semibold text-sm">
                  <Plus className="w-4 h-4" /> Add Tour
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
