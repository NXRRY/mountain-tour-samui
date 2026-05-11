import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ReviewsManager from "./ReviewsManager";

async function getReviews() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
    return data || [];
  } catch { return []; }
}

export default async function AdminReviewsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin");

  const reviews = await getReviews();

  return (
    <div className="lg:pl-64">
      <AdminSidebar userEmail={user.email} />
      <main className="pt-16 lg:pt-0 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-charcoal">Reviews</h1>
            <p className="text-stone/60 text-sm">Manage customer testimonials</p>
          </div>
          <ReviewsManager reviews={reviews} />
        </div>
      </main>
    </div>
  );
}
