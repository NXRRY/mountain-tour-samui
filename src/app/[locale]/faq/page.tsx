"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";

const FAQS = [
  { q: "How do I book a tour?", a: "You can book a tour through our website booking form, by calling/WhatsApp at +66 95 618 2397, or by emailing mountaintoursamui@gmail.com. We recommend booking at least 24 hours in advance, especially during peak season." },
  { q: "Do you provide hotel pickup?", a: "Yes! We provide free hotel pickup and drop-off for all our tours. Simply provide your hotel name and room number when booking. We pick up from all major hotels and resorts in Koh Samui." },
  { q: "What is your cancellation policy?", a: "We offer free cancellation up to 24 hours before the tour start time. For cancellations within 24 hours, a 50% fee may apply. In case of severe weather or unforeseen circumstances, we will reschedule at no charge." },
  { q: "Are tours available in languages other than English?", a: "Yes! Our guides speak Thai, English, and Chinese (Mandarin). Please let us know your preferred language when booking and we will arrange a suitable guide." },
  { q: "What should I bring on a tour?", a: "We recommend bringing: comfortable walking shoes, sunscreen, a hat or cap, sunglasses, a camera, light jacket (for air-conditioned vehicles), swimwear (for water activities), and a small amount of cash for personal purchases and tips." },
  { q: "Are tours suitable for children?", a: "Absolutely! We welcome families with children of all ages. We offer special children's pricing and our guides are experienced working with kids. Please let us know the ages of your children when booking so we can plan accordingly." },
  { q: "What is included in the tour price?", a: "Most tours include: hotel pickup and drop-off, air-conditioned vehicle, licensed guide, entrance fees to attractions, and lunch or refreshments (varies by tour). Check each tour's 'What's Included' section for specific details." },
  { q: "How big are your tour groups?", a: "We keep our groups small — maximum 8-10 people — to ensure a personal and comfortable experience. Smaller groups mean more flexibility and individual attention from your guide." },
  { q: "Can I book a private tour?", a: "Yes! We offer private tours for couples, families, and groups who prefer a fully customized experience. Contact us via WhatsApp or email to discuss your preferences and get a custom quote." },
  { q: "What happens if it rains?", a: "Koh Samui has a tropical climate and brief showers are common. Most of our tours continue in light rain. In cases of severe weather or storm warnings, we will reschedule your tour or offer a full refund." },
  { q: "Do you accept credit cards?", a: "Payment can be made by cash (Thai Baht) upon pickup, or via bank transfer for pre-payments. Credit card payment options are available for online bookings. Please contact us for details." },
  { q: "Is there an age or health restriction?", a: "Most tours are suitable for all ages and fitness levels. Some activities (like waterfall hikes) may require moderate fitness. Please inform us of any health conditions or mobility limitations when booking so we can accommodate your needs." },
];

function FAQItem({ faq }: { faq: { q: string; a: string } }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      <button
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-orange-50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="font-semibold text-charcoal pr-4">{faq.q}</span>
        <ChevronDown className={`w-5 h-5 text-orange-primary flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-6 pb-5">
          <p className="text-stone/70 text-sm leading-relaxed border-t border-gray-100 pt-4">{faq.a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const t = useTranslations("faq");

  return (
    <div className="pt-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-charcoal to-stone py-20 text-center relative overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <span className="inline-block bg-orange-primary/20 text-orange-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-4">{t("badge")}</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">
            {t("title")} <span className="text-orange-primary">{t("titleHighlight")}</span>
          </h1>
          <p className="text-white/60 text-lg">{t("subtitle")}</p>
        </div>
      </div>

      {/* FAQ List */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="space-y-3">
          {FAQS.map((faq, i) => <FAQItem key={i} faq={faq} />)}
        </div>

        {/* Still have questions */}
        <div className="mt-12 text-center bg-orange-50 rounded-3xl p-8 border border-orange-100">
          <h3 className="text-xl font-bold text-charcoal mb-2">Still have questions?</h3>
          <p className="text-stone/60 mb-5 text-sm">Our team is here to help! Reach us on WhatsApp for the fastest response.</p>
          <a
            href="https://wa.me/66956182397?text=Hello!%20I%20have%20a%20question%20about%20your%20tours."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-7 py-3.5 rounded-full font-semibold transition-all"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
