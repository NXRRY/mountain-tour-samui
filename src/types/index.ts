export type Locale = "en" | "th" | "zh";

export interface Tour {
  id: string;
  slug: string;
  cover_image: string;
  gallery: string[];
  price_adult: number;
  price_child: number | null;
  duration: number;
  pickup_info: string | null;
  what_to_bring: string | null;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  translations?: TourTranslation[];
}

export interface TourTranslation {
  id: string;
  tour_id: string;
  language: Locale;
  title: string;
  short_description: string;
  full_description?: string;
  highlights: string[];
  itinerary: ItineraryItem[];
  included: string[];
  excluded: string[];
}

export interface ItineraryItem {
  time: string;
  description: string;
}

export interface TourWithTranslation extends Tour {
  translation: TourTranslation;
}

export interface GalleryImage {
  id: string;
  image_url: string;
  caption: string | null;
  category: string;
  sort_order: number;
  created_at: string;
}

export interface Booking {
  id: string;
  customer_name: string;
  phone: string;
  whatsapp: string | null;
  email: string;
  hotel: string | null;
  tour_id: string | null;
  travel_date: string;
  adults: number;
  children: number;
  notes: string | null;
  status: BookingStatus;
  created_at: string;
  tour?: Tour;
}

export type BookingStatus = "pending" | "confirmed" | "cancelled";

export interface Review {
  id: string;
  author_name: string;
  author_country: string;
  rating: number;
  comment: string;
  tour_id: string | null;
  is_featured: boolean;
  is_approved?: boolean;
  created_at: string;
}

export interface SiteSettings {
  id: string;
  key: string;
  value: string;
}

export interface BookingFormData {
  customer_name: string;
  phone: string;
  whatsapp: string;
  email: string;
  hotel: string;
  tour_id: string;
  travel_date: string;
  adults: number;
  children: number;
  notes: string;
}
