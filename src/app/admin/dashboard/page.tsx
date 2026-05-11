import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { CalendarCheck, Map, Star, Users, TrendingUp, Clock } from "lucide-react";
import Link from "next/link";

async function getStats() {
  try {
    const supabase = await createClient();
    const [bookings, tours, reviews] = await Promise.all([
      supabase.from("bookings").select("id, status, created_at", { count: "exact" }),
      supabase.from("tours").select("id", { count: "exact" }).eq("is_active", true),
      supabase.from("reviews").select("rating", { count: "exact" }).eq("is_approved", true),
    ]);

    const avgRating = reviews.data?.length
      ? (reviews.data.reduce((s: number, r: any) => s + r.rating, 0) / reviews.data.length).toFixed(1)
      : "4.9";

    const pending = bookings.data?.filter((b: any) => b.status === "pending").length || 0;
    const recentBookings = bookings.data?.slice(0, 5) || [];

    return {
      totalBookings: bookings.count || 0,
      activeTours: tours.count || 0,
      totalReviews: reviews.count || 0,
      avgRating,
      pendingBookings: pending,
      recentBookings,
    };
  } catch {
    return { totalBookings: 0, activeTours: 0, totalReviews: 0, avgRating: "4.9", pendingBookings: 0, recentBookings: [] };
  }
}

async function getUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export default async function DashboardPage() {
  const user = await getUser();
  if (!user) redirect("/admin");

  const stats = await getStats();

  const statCards = [
    { icon: CalendarCheck, label: "Total Bookings", value: stats.totalBookings, sub: `${stats.pendingBookings} pending`, color: "bg-orange-500", link: "/admin/bookings" },
    { icon: Map, label: "Active Tours", value: stats.activeTours, sub: "Tour programs", color: "bg-blue-500", link: "/admin/tours" },
    { icon: Star, label: "Average Rating", value: stats.avgRating, sub: `${stats.totalReviews} reviews`, color: "bg-yellow-500", link: "/admin/reviews" },
    { icon: Users, label: "Response Time", value: "< 2h", sub: "Average response", color: "bg-green-500", link: "/admin/bookings" },
  ];

  return (
    <div className="lg:pl-64">
      <AdminSidebar userEmail={user.email} />
      <main className="pt-16 lg:pt-0 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-charcoal">Dashboard</h1>
            <p className="text-stone/60 text-sm mt-1">
              Welcome back! Here&apos;s what&apos;s happening with Mountain Tour Samui.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {statCards.map((card, i) => (
              <Link key={i} href={card.link} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 ${card.color} rounded-xl flex items-center justify-center`}>
                    <card.icon className="w-5 h-5 text-white" />
                  </div>
                  <TrendingUp className="w-4 h-4 text-green-400" />
                </div>
                <div className="text-2xl font-bold text-charcoal mb-0.5">{card.value}</div>
                <div className="text-sm font-medium text-charcoal">{card.label}</div>
                <div className="text-xs text-stone/50 mt-0.5">{card.sub}</div>
              </Link>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-charcoal mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { href: "/admin/tours/new", label: "Add New Tour", icon: "➕", color: "bg-orange-50 hover:bg-orange-100" },
                  { href: "/admin/bookings", label: "View Bookings", icon: "📅", color: "bg-blue-50 hover:bg-blue-100" },
                  { href: "/admin/gallery", label: "Upload Photos", icon: "🖼️", color: "bg-purple-50 hover:bg-purple-100" },
                  { href: "/admin/reviews", label: "Manage Reviews", icon: "⭐", color: "bg-yellow-50 hover:bg-yellow-100" },
                ].map((a, i) => (
                  <Link key={i} href={a.href} className={`flex items-center gap-2 ${a.color} p-3.5 rounded-xl transition-colors text-sm font-medium text-charcoal`}>
                    <span>{a.icon}</span> {a.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Pending Bookings Notice */}
            {stats.pendingBookings > 0 && (
              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-orange-primary rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-charcoal mb-1">Pending Bookings</h3>
                    <p className="text-sm text-stone/60 mb-3">
                      You have <strong className="text-orange-primary">{stats.pendingBookings}</strong> booking requests waiting for confirmation.
                    </p>
                    <Link
                      href="/admin/bookings"
                      className="inline-flex items-center gap-1 bg-orange-primary hover:bg-orange-dark text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                    >
                      Review Now →
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { title: "Contact Info", content: "📞 +66 95 618 2397\n✉️ mountaintoursamui@gmail.com\n🕒 Daily 7:00 AM – 9:00 PM" },
              { title: "Website Links", content: "🌐 /en — English\n🌐 /th — Thai\n🌐 /zh — Chinese" },
              { title: "Support", content: "Need help? Check the documentation or contact your developer for technical issues." },
            ].map((card, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-bold text-charcoal mb-3 text-sm">{card.title}</h3>
                <p className="text-xs text-stone/60 whitespace-pre-line leading-relaxed">{card.content}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
