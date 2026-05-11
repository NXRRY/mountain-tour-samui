import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import GalleryManager from "./GalleryManager";

async function getImages() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("gallery").select("*").order("sort_order");
    return data || [];
  } catch { return []; }
}

export default async function AdminGalleryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin");

  const images = await getImages();

  return (
    <div className="lg:pl-64">
      <AdminSidebar userEmail={user.email} />
      <main className="pt-16 lg:pt-0 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-charcoal">Gallery</h1>
            <p className="text-stone/60 text-sm">Manage your photo gallery</p>
          </div>
          <GalleryManager images={images} />
        </div>
      </main>
    </div>
  );
}
