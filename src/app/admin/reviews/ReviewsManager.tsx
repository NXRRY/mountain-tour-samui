"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Star, Plus, Trash2, Eye, EyeOff } from "lucide-react";
import type { Review } from "@/types";

interface Props { reviews: Review[] }

export default function ReviewsManager({ reviews: initial }: Props) {
  const [reviews, setReviews] = useState<Review[]>(initial);
  const [adding, setAdding] = useState(false);
  const [newReview, setNewReview] = useState({ author_name: "", author_country: "", rating: 5, comment: "", is_featured: false });

  const toggleApproval = async (id: string, val: boolean) => {
    const supabase = createClient();
    await supabase.from("reviews").update({ is_approved: val }).eq("id", id);
    setReviews((prev) => prev.map((r) => r.id === id ? { ...r, is_approved: val } as Review : r));
  };

  const toggleFeatured = async (id: string, val: boolean) => {
    const supabase = createClient();
    await supabase.from("reviews").update({ is_featured: val }).eq("id", id);
    setReviews((prev) => prev.map((r) => r.id === id ? { ...r, is_featured: val } : r));
  };

  const deleteReview = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    const supabase = createClient();
    await supabase.from("reviews").delete().eq("id", id);
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const addReview = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.from("reviews").insert({ ...newReview, is_approved: true }).select().single();
    if (!error && data) {
      setReviews((prev) => [data, ...prev]);
      setNewReview({ author_name: "", author_country: "", rating: 5, comment: "", is_featured: false });
      setAdding(false);
    }
  };

  const inputClass = "w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-200 text-sm";

  return (
    <div className="space-y-5">
      {/* Add Review */}
      <div className="flex justify-end">
        <button onClick={() => setAdding(!adding)} className="flex items-center gap-2 bg-orange-primary hover:bg-orange-dark text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all">
          <Plus className="w-4 h-4" /> Add Review
        </button>
      </div>

      {adding && (
        <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-5 space-y-3">
          <h3 className="font-bold text-charcoal">Add New Review</h3>
          <div className="grid grid-cols-2 gap-3">
            <input value={newReview.author_name} onChange={(e) => setNewReview({ ...newReview, author_name: e.target.value })} placeholder="Author Name" className={inputClass} />
            <input value={newReview.author_country} onChange={(e) => setNewReview({ ...newReview, author_country: e.target.value })} placeholder="Country" className={inputClass} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-charcoal">Rating:</span>
            {[1, 2, 3, 4, 5].map((s) => (
              <button key={s} onClick={() => setNewReview({ ...newReview, rating: s })}>
                <Star className={`w-5 h-5 ${s <= newReview.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
              </button>
            ))}
          </div>
          <textarea value={newReview.comment} onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })} placeholder="Review comment..." rows={3} className={`${inputClass} resize-none`} />
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input type="checkbox" checked={newReview.is_featured} onChange={(e) => setNewReview({ ...newReview, is_featured: e.target.checked })} className="accent-orange-500" />
              Featured Review
            </label>
            <div className="flex gap-2">
              <button onClick={() => setAdding(false)} className="px-4 py-2 text-stone/60 hover:text-charcoal text-sm">Cancel</button>
              <button onClick={addReview} disabled={!newReview.author_name || !newReview.comment} className="bg-orange-primary hover:bg-orange-dark disabled:opacity-60 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all">Save Review</button>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-3">
        {reviews.map((review) => (
          <div key={review.id} className={`bg-white rounded-2xl border shadow-sm p-5 ${!review.is_approved ? "opacity-60 border-gray-200" : "border-gray-100"}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-primary font-bold text-sm">
                    {review.author_name.charAt(0)}
                  </div>
                  <div>
                    <span className="font-semibold text-charcoal text-sm">{review.author_name}</span>
                    {review.author_country && <span className="text-stone/50 text-xs ml-2">— {review.author_country}</span>}
                  </div>
                  <div className="flex gap-0.5 ml-2">
                    {[1,2,3,4,5].map((s) => <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`} />)}
                  </div>
                  {review.is_featured && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">⭐ Featured</span>}
                  {!review.is_approved && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">Hidden</span>}
                </div>
                <p className="text-sm text-stone/70 leading-relaxed">{review.comment}</p>
              </div>
              <div className="flex gap-1.5 flex-shrink-0">
                <button
                  onClick={() => toggleFeatured(review.id, !review.is_featured)}
                  title={review.is_featured ? "Remove from featured" : "Feature this review"}
                  className={`p-2 rounded-lg transition-colors ${review.is_featured ? "bg-yellow-100 text-yellow-600" : "bg-gray-100 text-gray-500 hover:bg-yellow-50"}`}
                >
                  <Star className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleApproval(review.id, !review.is_approved)}
                  title={review.is_approved ? "Hide review" : "Show review"}
                  className={`p-2 rounded-lg transition-colors ${review.is_approved ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}
                >
                  {review.is_approved ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button onClick={() => deleteReview(review.id)} className="p-2 rounded-lg bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {reviews.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 text-stone/50">No reviews yet.</div>
        )}
      </div>
    </div>
  );
}
