"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Upload, Trash2, Plus } from "lucide-react";
import type { GalleryImage } from "@/types";

const CATEGORIES = ["general", "beaches", "nature", "temples", "water", "culture", "customers"];

interface Props { images: GalleryImage[] }

export default function GalleryManager({ images: initial }: Props) {
  const [images, setImages] = useState<GalleryImage[]>(initial);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [category, setCategory] = useState("general");
  const [caption, setCaption] = useState("");

  const uploadFile = async (file: File) => {
    setUploading(true);
    const supabase = createClient();
    const path = `gallery/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const { data: upload, error } = await supabase.storage.from("gallery").upload(path, file, { upsert: true });
    if (!error && upload) {
      const { data: url } = supabase.storage.from("gallery").getPublicUrl(path);
      await addImage(url.publicUrl);
    }
    setUploading(false);
  };

  const addImage = async (url: string) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("gallery")
      .insert({ image_url: url, caption: caption || null, category, sort_order: images.length })
      .select()
      .single();
    if (!error && data) {
      setImages((prev) => [...prev, data]);
      setUrlInput("");
      setCaption("");
    }
  };

  const deleteImage = async (id: string, imageUrl: string) => {
    if (!confirm("Delete this image?")) return;
    const supabase = createClient();
    await supabase.from("gallery").delete().eq("id", id);
    if (imageUrl.includes("supabase")) {
      const path = imageUrl.split("/gallery/")[1];
      if (path) await supabase.storage.from("gallery").remove([path]);
    }
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    files.forEach(uploadFile);
  }, [category, caption]);

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-bold text-charcoal mb-5">Upload Images</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-stone/60 uppercase tracking-wider mb-1.5">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-200 text-sm capitalize">
              {CATEGORIES.map((c) => <option key={c} value={c} className="capitalize">{c}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-stone/60 uppercase tracking-wider mb-1.5">Caption (optional)</label>
            <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="e.g. Chaweng Beach Sunset" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-200 text-sm" />
          </div>
        </div>

        {/* Drag & Drop Zone */}
        <div
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-orange-200 rounded-2xl p-8 text-center hover:border-orange-primary hover:bg-orange-50 transition-all cursor-pointer"
        >
          <Upload className="w-10 h-10 text-orange-primary mx-auto mb-3 opacity-60" />
          <p className="text-stone/60 text-sm mb-3">Drag & drop images here, or</p>
          <label className="bg-orange-primary hover:bg-orange-dark text-white px-5 py-2.5 rounded-xl font-semibold text-sm cursor-pointer transition-all">
            {uploading ? "Uploading..." : "Browse Files"}
            <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => Array.from(e.target.files || []).forEach(uploadFile)} disabled={uploading} />
          </label>
          <p className="text-stone/40 text-xs mt-2">PNG, JPG, WebP up to 10MB</p>
        </div>

        {/* URL Input */}
        <div className="flex gap-3 mt-4">
          <input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Or paste an image URL..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-200 text-sm"
          />
          <button
            onClick={() => urlInput && addImage(urlInput)}
            disabled={!urlInput}
            className="flex items-center gap-2 bg-orange-primary hover:bg-orange-dark disabled:opacity-60 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </div>

      {/* Gallery Grid */}
      <div>
        <p className="text-sm text-stone/60 mb-4">{images.length} image{images.length !== 1 ? "s" : ""}</p>
        {images.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 text-stone/50">No images yet. Upload some photos!</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {images.map((img) => (
              <div key={img.id} className="group relative bg-gray-100 rounded-2xl overflow-hidden aspect-square">
                <Image src={img.image_url} alt={img.caption || "Gallery"} fill className="object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => deleteImage(img.id, img.image_url)}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {img.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 p-2">
                    <p className="text-white text-xs truncate">{img.caption}</p>
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <span className="bg-white/80 text-charcoal text-xs px-2 py-0.5 rounded-full capitalize">{img.category}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
