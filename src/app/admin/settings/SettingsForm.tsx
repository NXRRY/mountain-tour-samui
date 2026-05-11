"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Save, CheckCircle } from "lucide-react";

interface Props { settings: Record<string, string> }

const SETTING_GROUPS = [
  {
    title: "Contact Information",
    fields: [
      { key: "contact_phone", label: "Phone / WhatsApp", placeholder: "+66 95 618 2397" },
      { key: "contact_email", label: "Email", placeholder: "mountaintoursamui@gmail.com" },
      { key: "contact_whatsapp", label: "WhatsApp Number (no +)", placeholder: "66956182397" },
    ],
  },
  {
    title: "Social Media",
    fields: [
      { key: "instagram_url", label: "Instagram URL", placeholder: "https://instagram.com/mountaintoursamui" },
      { key: "facebook_url", label: "Facebook URL", placeholder: "https://facebook.com/mountaintoursamui" },
      { key: "tiktok_url", label: "TikTok URL", placeholder: "https://tiktok.com/@mountaintoursamui" },
    ],
  },
  {
    title: "Analytics",
    fields: [
      { key: "google_analytics_id", label: "Google Analytics ID", placeholder: "G-XXXXXXXXXX" },
      { key: "google_maps_embed", label: "Google Maps Embed URL", placeholder: "https://maps.google.com/..." },
    ],
  },
];

export default function SettingsForm({ settings: initial }: Props) {
  const [values, setValues] = useState<Record<string, string>>(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();
    const updates = Object.entries(values).map(([key, value]) =>
      supabase.from("site_settings").upsert({ key, value }, { onConflict: "key" })
    );
    await Promise.all(updates);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-primary text-sm";

  return (
    <div className="space-y-6">
      {SETTING_GROUPS.map((group) => (
        <div key={group.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-charcoal mb-5">{group.title}</h2>
          <div className="space-y-4">
            {group.fields.map((field) => (
              <div key={field.key}>
                <label className="block text-xs font-semibold text-stone/60 uppercase tracking-wider mb-1.5">{field.label}</label>
                <input
                  value={values[field.key] || ""}
                  onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  className={inputClass}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-orange-primary hover:bg-orange-dark disabled:opacity-60 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Settings"}
        </button>
        {saved && (
          <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
            <CheckCircle className="w-4 h-4" /> Settings saved!
          </div>
        )}
      </div>
    </div>
  );
}
