"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle, AlertCircle, Calendar, Users, MessageSquare, Hotel, Phone, Mail, User } from "lucide-react";

const schema = z.object({
  customer_name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(6, "Enter a valid phone number"),
  whatsapp: z.string().default(""),
  email: z.string().email("Enter a valid email address"),
  hotel: z.string().default(""),
  tour_id: z.string().default(""),
  travel_date: z.string().min(1, "Travel date is required"),
  adults: z.coerce.number().min(1).max(50),
  children: z.coerce.number().min(0).max(50),
  notes: z.string().default(""),
});

type FormData = z.infer<typeof schema>;

interface Props {
  tours: { id: string; slug: string; title: string }[];
}

export default function BookingForm({ tours }: Props) {
  const t = useTranslations("booking");
  const searchParams = useSearchParams();
  const preselectedSlug = searchParams.get("tour");
  const preselectedTour = tours.find((t) => t.slug === preselectedSlug);

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      adults: 2,
      children: 0,
      tour_id: preselectedTour?.id || "",
    },
  });

  const onSubmit = async (data: unknown) => {
    setStatus("loading");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  const inputClass = (hasError?: boolean) =>
    `w-full px-4 py-3 rounded-xl border text-charcoal placeholder-gray-400 focus:outline-none focus:ring-2 transition-all text-sm ${
      hasError
        ? "border-red-300 focus:ring-red-200 bg-red-50"
        : "border-gray-200 focus:ring-orange-200 focus:border-orange-primary bg-white"
    }`;

  return (
    <div className="pt-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-charcoal to-stone py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <span className="inline-block bg-orange-primary/20 text-orange-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Booking
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">{t("title")}</h1>
          <p className="text-white/60">{t("subtitle")}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {status === "success" ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-charcoal mb-3">Booking Request Sent!</h2>
            <p className="text-stone/60 mb-6">{t("success")}</p>
            <button
              onClick={() => setStatus("idle")}
              className="bg-orange-primary hover:bg-orange-dark text-white px-8 py-3 rounded-xl font-semibold transition-all"
            >
              Book Another Tour
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 space-y-6">
            {status === "error" && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {t("error")}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-charcoal mb-2">
                  <User className="w-4 h-4 inline mr-1 text-orange-primary" />
                  {t("fullName")} *
                </label>
                <input {...register("customer_name")} placeholder="John Smith" className={inputClass(!!errors.customer_name)} />
                {errors.customer_name && <p className="text-red-500 text-xs mt-1">{errors.customer_name.message}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">
                  <Phone className="w-4 h-4 inline mr-1 text-orange-primary" />
                  {t("phone")} *
                </label>
                <input {...register("phone")} placeholder="+66 XX XXX XXXX" className={inputClass(!!errors.phone)} />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>

              {/* WhatsApp */}
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">
                  <svg className="w-4 h-4 inline mr-1 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  {t("whatsapp")}
                </label>
                <input {...register("whatsapp")} placeholder="+66 XX XXX XXXX" className={inputClass()} />
              </div>

              {/* Email */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-charcoal mb-2">
                  <Mail className="w-4 h-4 inline mr-1 text-orange-primary" />
                  {t("email")} *
                </label>
                <input {...register("email")} type="email" placeholder="you@email.com" className={inputClass(!!errors.email)} />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              {/* Hotel */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-charcoal mb-2">
                  <Hotel className="w-4 h-4 inline mr-1 text-orange-primary" />
                  {t("hotel")}
                </label>
                <input {...register("hotel")} placeholder="e.g. Samui Marriott Resort" className={inputClass()} />
              </div>

              {/* Tour */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-charcoal mb-2">
                  🗺️ {t("tour")}
                </label>
                <select {...register("tour_id")} className={inputClass()}>
                  <option value="">{t("selectTour")}</option>
                  {tours.map((tour) => (
                    <option key={tour.id} value={tour.id}>{tour.title}</option>
                  ))}
                </select>
              </div>

              {/* Travel Date */}
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">
                  <Calendar className="w-4 h-4 inline mr-1 text-orange-primary" />
                  {t("date")} *
                </label>
                <input
                  {...register("travel_date")}
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  className={inputClass(!!errors.travel_date)}
                />
                {errors.travel_date && <p className="text-red-500 text-xs mt-1">{errors.travel_date.message}</p>}
              </div>

              {/* Adults */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">
                    <Users className="w-4 h-4 inline mr-1 text-orange-primary" />
                    {t("adults")} *
                  </label>
                  <input {...register("adults")} type="number" min="1" max="50" className={inputClass()} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">
                    👧 {t("children")}
                  </label>
                  <input {...register("children")} type="number" min="0" max="50" className={inputClass()} />
                </div>
              </div>

              {/* Notes */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-charcoal mb-2">
                  <MessageSquare className="w-4 h-4 inline mr-1 text-orange-primary" />
                  {t("notes")}
                </label>
                <textarea
                  {...register("notes")}
                  rows={4}
                  placeholder={t("notesPlaceholder")}
                  className={`${inputClass()} resize-none`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-orange-primary hover:bg-orange-dark disabled:opacity-60 text-white py-4 rounded-2xl font-bold text-base transition-all btn-glow"
            >
              {status === "loading" ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {t("submitting")}
                </span>
              ) : t("submit")}
            </button>

            <p className="text-center text-xs text-stone/40">
              We will confirm your booking within 24 hours via email or WhatsApp.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
