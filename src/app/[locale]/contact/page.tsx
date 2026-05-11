"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const t = useTranslations("contact");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSent(true);
    setLoading(false);
  };

  const contactItems = [
    { icon: Phone, title: t("phone"), value: "+66 95 618 2397", href: "tel:+66956182397", color: "bg-orange-100 text-orange-primary" },
    { icon: Mail, title: t("email"), value: "mountaintoursamui@gmail.com", href: "mailto:mountaintoursamui@gmail.com", color: "bg-blue-100 text-blue-500" },
    { icon: Clock, title: t("hours"), value: t("hoursValue"), href: null, color: "bg-green-100 text-green-600" },
    { icon: MapPin, title: t("address"), value: t("addressValue"), href: "https://maps.google.com/?q=Koh+Samui+Thailand", color: "bg-purple-100 text-purple-600" },
  ];

  return (
    <div className="pt-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-charcoal to-stone py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=30')", backgroundSize: "cover" }} />
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <span className="inline-block bg-orange-primary/20 text-orange-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-4">{t("badge")}</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">
            {t("title")} <span className="text-orange-primary">{t("titleHighlight")}</span>
          </h1>
          <p className="text-white/60 text-lg">{t("subtitle")}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold text-charcoal mb-8">Get In Touch</h2>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/66956182397?text=Hello!%20I%27m%20interested%20in%20your%20tours."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-green-500 hover:bg-green-600 text-white p-5 rounded-2xl mb-6 transition-all hover:scale-[1.02] shadow-lg"
            >
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </div>
              <div>
                <div className="font-bold text-lg">{t("whatsapp")}</div>
                <div className="text-sm opacity-80">Fastest response — usually within minutes</div>
              </div>
            </a>

            <div className="space-y-4 mb-8">
              {contactItems.map((item, i) => (
                <div key={i} className="flex items-start gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <div className={`w-11 h-11 ${item.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-stone/50 uppercase tracking-wider">{item.title}</div>
                    {item.href ? (
                      <a href={item.href} className="font-semibold text-charcoal hover:text-orange-primary transition-colors text-sm mt-0.5 block">
                        {item.value}
                      </a>
                    ) : (
                      <div className="font-semibold text-charcoal text-sm mt-0.5">{item.value}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="bg-gray-100 rounded-2xl overflow-hidden h-48 flex items-center justify-center border border-gray-200">
              <a
                href="https://maps.google.com/?q=Koh+Samui+Surat+Thani+Thailand"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-orange-primary font-semibold hover:underline"
              >
                <MapPin className="w-5 h-5" />
                View on Google Maps →
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-charcoal mb-8">Send us a Message</h2>
            {sent ? (
              <div className="text-center py-16 bg-green-50 rounded-3xl border border-green-100">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-charcoal mb-2">Message Sent!</h3>
                <p className="text-stone/60">We&apos;ll get back to you as soon as possible.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">Your Name *</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="John Smith"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-primary text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">Email Address *</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@email.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-primary text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">Message *</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us about your travel plans..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-primary text-sm resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-orange-primary hover:bg-orange-dark disabled:opacity-60 text-white py-4 rounded-2xl font-bold transition-all"
                >
                  {loading ? (
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  ) : <Send className="w-5 h-5" />}
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
