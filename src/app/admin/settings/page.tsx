import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import SettingsForm from "./SettingsForm";

async function getSettings() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("site_settings").select("*");
    return Object.fromEntries((data || []).map((s: any) => [s.key, s.value]));
  } catch { return {}; }
}

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin");

  const settings = await getSettings();

  return (
    <div className="lg:pl-64">
      <AdminSidebar userEmail={user.email} />
      <main className="pt-16 lg:pt-0 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-charcoal">Settings</h1>
            <p className="text-stone/60 text-sm">Configure your website settings</p>
          </div>
          <SettingsForm settings={settings} />
        </div>
      </main>
    </div>
  );
}
