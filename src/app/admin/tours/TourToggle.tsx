"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Props { tourId: string; initialActive: boolean }

export default function TourToggle({ tourId, initialActive }: Props) {
  const [active, setActive] = useState(initialActive);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase.from("tours").update({ is_active: !active }).eq("id", tourId);
    setActive(!active);
    setLoading(false);
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
        active ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"
      }`}
    >
      {active ? "Live" : "Draft"}
    </button>
  );
}
