import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customer_name, phone, whatsapp, email, hotel,
      tour_id, travel_date, adults, children, notes,
    } = body;

    if (!customer_name || !phone || !email || !travel_date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = await createAdminClient();

    const { data: booking, error } = await supabase
      .from("bookings")
      .insert({
        customer_name, phone, whatsapp, email, hotel,
        tour_id: tour_id || null,
        travel_date, adults: Number(adults) || 1,
        children: Number(children) || 0, notes,
        status: "pending",
      })
      .select()
      .single();

    if (error) throw error;

    // Discord webhook notification
    if (process.env.DISCORD_WEBHOOK_URL) {
      const tourName = tour_id ? `Tour ID: ${tour_id}` : "Not specified";
      await fetch(process.env.DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          embeds: [{
            title: "🏖️ New Booking Request!",
            color: 0xF97316,
            fields: [
              { name: "👤 Customer", value: customer_name, inline: true },
              { name: "📱 Phone", value: phone, inline: true },
              { name: "✉️ Email", value: email, inline: true },
              { name: "🏨 Hotel", value: hotel || "Not specified", inline: true },
              { name: "🗺️ Tour", value: tourName, inline: true },
              { name: "📅 Date", value: travel_date, inline: true },
              { name: "👥 Adults", value: String(adults), inline: true },
              { name: "👧 Children", value: String(children), inline: true },
              { name: "📝 Notes", value: notes || "None", inline: false },
            ],
            timestamp: new Date().toISOString(),
            footer: { text: "Mountain Tour Samui Booking System" },
          }],
        }),
      }).catch(() => {});
    }

    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch (err) {
    console.error("Booking error:", err);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from("bookings")
      .select(`*, tour:tours(slug, tour_translations(title, language))`)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}
