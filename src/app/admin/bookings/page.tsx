import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import BookingsTable from "./BookingsTable";

async function getBookings() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });
    return data || [];
  } catch { return []; }
}

export default async function BookingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin");

  const bookings = await getBookings();

  return (
    <div className="lg:pl-64">
      <AdminSidebar userEmail={user.email} />
      <main className="pt-16 lg:pt-0 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-charcoal">Bookings</h1>
            <p className="text-stone/60 text-sm">Manage customer booking requests</p>
          </div>
          <BookingsTable bookings={bookings} />
        </div>
      </main>
    </div>
  );
}
