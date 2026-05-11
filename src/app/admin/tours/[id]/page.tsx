import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import TourForm from "../TourForm";

type Props = { params: Promise<{ id: string }> };

export default async function EditTourPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin");

  const { data: tour } = await supabase
    .from("tours")
    .select("*, translations:tour_translations(*)")
    .eq("id", id)
    .single();

  if (!tour) notFound();

  const initialTranslations = Object.fromEntries(
    (tour.translations || []).map((t: any) => [t.language, t])
  );

  return (
    <div className="lg:pl-64">
      <AdminSidebar userEmail={user.email} />
      <main className="pt-16 lg:pt-0 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-charcoal">Edit Tour</h1>
            <p className="text-stone/60 text-sm">Update tour information and translations</p>
          </div>
          <TourForm
            mode="edit"
            tourId={id}
            initialData={{
              slug: tour.slug,
              price_adult: tour.price_adult,
              price_child: tour.price_child,
              duration: tour.duration,
              pickup_info: tour.pickup_info || "",
              what_to_bring: tour.what_to_bring || "",
              is_featured: tour.is_featured,
              is_active: tour.is_active,
              cover_image: tour.cover_image || "",
            }}
            initialTranslations={initialTranslations}
          />
        </div>
      </main>
    </div>
  );
}
