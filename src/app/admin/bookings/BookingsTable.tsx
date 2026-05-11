"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle, XCircle, Clock, Phone, Mail, Calendar, Users, Hotel, Search } from "lucide-react";
import type { Booking, BookingStatus } from "@/types";

interface Props { bookings: Booking[] }

const STATUS_CONFIG = {
  pending: { label: "Pending", icon: Clock, bg: "bg-yellow-100", text: "text-yellow-700" },
  confirmed: { label: "Confirmed", icon: CheckCircle, bg: "bg-green-100", text: "text-green-700" },
  cancelled: { label: "Cancelled", icon: XCircle, bg: "bg-red-100", text: "text-red-600" },
};

export default function BookingsTable({ bookings: initial }: Props) {
  const [bookings, setBookings] = useState<Booking[]>(initial);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | BookingStatus>("all");
  const [updating, setUpdating] = useState<string | null>(null);

  const filtered = bookings.filter((b) => {
    const matchSearch = !search || b.customer_name.toLowerCase().includes(search.toLowerCase()) || b.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || b.status === filter;
    return matchSearch && matchFilter;
  });

  const updateStatus = async (id: string, status: BookingStatus) => {
    setUpdating(id);
    const supabase = createClient();
    await supabase.from("bookings").update({ status }).eq("id", id);
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status } : b));
    setUpdating(null);
  };

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-200 text-sm"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "pending", "confirmed", "cancelled"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                filter === s ? "bg-orange-primary text-white" : "bg-white border border-gray-200 text-stone hover:bg-gray-50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <p className="text-sm text-stone/60 mb-4">{filtered.length} booking{filtered.length !== 1 ? "s" : ""}</p>

      {/* Cards */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <p className="text-stone/50">No bookings found</p>
          </div>
        ) : (
          filtered.map((booking) => {
            const conf = STATUS_CONFIG[booking.status];
            const StatusIcon = conf.icon;
            return (
              <div key={booking.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center font-bold text-orange-primary">
                        {booking.customer_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-charcoal">{booking.customer_name}</h3>
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full ${conf.bg} ${conf.text}`}>
                          <StatusIcon className="w-3 h-3" />
                          {conf.label}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-stone/60">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" />
                        <span className="truncate">{booking.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5" />
                        <span>{booking.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{booking.travel_date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" />
                        <span>{booking.adults} adult{booking.adults !== 1 ? "s" : ""}{booking.children > 0 ? `, ${booking.children} child${booking.children !== 1 ? "ren" : ""}` : ""}</span>
                      </div>
                      {booking.hotel && (
                        <div className="flex items-center gap-1.5">
                          <Hotel className="w-3.5 h-3.5" />
                          <span className="truncate">{booking.hotel}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{new Date(booking.created_at).toLocaleDateString("en-GB")}</span>
                      </div>
                    </div>
                    {booking.notes && (
                      <p className="mt-3 text-xs text-stone/60 bg-gray-50 rounded-lg p-2 italic">&ldquo;{booking.notes}&rdquo;</p>
                    )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <a
                      href={`https://wa.me/${booking.whatsapp?.replace(/\D/g, "") || booking.phone.replace(/\D/g, "")}?text=Hello%20${encodeURIComponent(booking.customer_name)}!%20Regarding%20your%20booking%20for%20${booking.travel_date}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl text-xs font-semibold transition-colors"
                    >
                      WhatsApp
                    </a>
                    {booking.status !== "confirmed" && (
                      <button
                        onClick={() => updateStatus(booking.id, "confirmed")}
                        disabled={updating === booking.id}
                        className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-xs font-semibold transition-colors disabled:opacity-60"
                      >
                        Confirm
                      </button>
                    )}
                    {booking.status !== "cancelled" && (
                      <button
                        onClick={() => updateStatus(booking.id, "cancelled")}
                        disabled={updating === booking.id}
                        className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-semibold transition-colors disabled:opacity-60"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
