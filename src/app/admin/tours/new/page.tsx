import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import TourForm from "../TourForm";

export default async function NewTourPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin");

  return (
    <div className="lg:pl-64">
      <AdminSidebar userEmail={user.email} />
      <main className="pt-16 lg:pt-0 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-charcoal">Add New Tour</h1>
            <p className="text-stone/60 text-sm">Create a new tour program with multilingual content</p>
          </div>
          <TourForm mode="create" />
        </div>
      </main>
    </div>
  );
}
