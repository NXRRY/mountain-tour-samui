# Mountain Tour Samui — Web Application

A production-ready multilingual tourism website for Mountain Tour Samui, Koh Samui, Thailand.

Built with **Next.js 16**, **TailwindCSS v4**, **Supabase**, and deployed on **Vercel**.

---

## 🚀 Quick Start

### 1. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Open the SQL Editor and run the full contents of `supabase/schema.sql`
3. Go to **Authentication → Users** and create your admin user account
4. Then run this SQL to grant yourself admin access (replace the UUID):

```sql
INSERT INTO admin_profiles (id, role, display_name)
VALUES ('YOUR_SUPABASE_USER_UUID', 'super_admin', 'Admin');
```

### 2. Configure Environment Variables

Edit `.env.local` with your credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=           # Supabase Settings → API
NEXT_PUBLIC_SUPABASE_ANON_KEY=      # Supabase Settings → API
SUPABASE_SERVICE_ROLE_KEY=          # Supabase Settings → API (secret!)
DISCORD_WEBHOOK_URL=                # Optional: booking notifications
NEXT_PUBLIC_SITE_URL=https://mountaintoursamui.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX      # Optional: Google Analytics
```

### 3. Install & Run

```bash
npm install
npm run dev     # http://localhost:3000
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── [locale]/           # Public pages — en, th, zh
│   │   ├── page.tsx        # Home page
│   │   ├── tours/          # Tours list + detail [slug]
│   │   ├── booking/        # Booking form
│   │   ├── about/          # About us
│   │   ├── gallery/        # Photo gallery
│   │   ├── contact/        # Contact
│   │   ├── reviews/        # Customer reviews
│   │   └── faq/            # FAQ
│   ├── admin/              # Admin dashboard
│   │   ├── page.tsx        # Login
│   │   ├── dashboard/      # Overview stats
│   │   ├── tours/          # Add/Edit/Delete tours
│   │   ├── bookings/       # View & manage bookings
│   │   ├── gallery/        # Upload & delete photos
│   │   ├── reviews/        # Manage testimonials
│   │   └── settings/       # Site-wide settings
│   └── api/bookings/       # POST/GET booking API
├── components/
│   ├── layout/             # Navbar, Footer, WhatsApp button
│   ├── home/               # Home page sections
│   └── admin/              # AdminSidebar
├── lib/supabase/           # Supabase browser + server clients
├── i18n/                   # next-intl config & routing
├── types/                  # TypeScript interfaces
└── proxy.ts                # i18n routing (Next.js 16)
messages/
├── en.json                 # English translations
├── th.json                 # Thai translations
└── zh.json                 # Chinese translations
supabase/
└── schema.sql              # Full database schema + seed data
```

---

## 🌐 URLs

| URL | Description |
|-----|-------------|
| `/en` `/th` `/zh` | Home page (3 languages) |
| `/en/tours` | All tours listing |
| `/en/tours/[slug]` | Tour detail with booking |
| `/en/booking` | Booking request form |
| `/en/gallery` | Photo gallery |
| `/en/about` | About us |
| `/en/contact` | Contact + map |
| `/en/reviews` | Customer reviews |
| `/en/faq` | FAQ |
| `/admin` | Admin login |
| `/admin/dashboard` | Admin overview |
| `/sitemap.xml` | SEO sitemap |
| `/robots.txt` | Search engine rules |

---

## 🗄️ Database Tables

| Table | Purpose |
|-------|---------|
| `tours` | Tour programs — price, duration, images |
| `tour_translations` | Multilingual content per tour (en/th/zh) |
| `gallery` | Photo gallery |
| `bookings` | Customer booking requests |
| `reviews` | Customer testimonials |
| `site_settings` | Configurable key/value settings |
| `admin_profiles` | Admin user roles |

---

## 🚢 Deploy to Vercel

1. Push to GitHub
2. Import at [vercel.com/new](https://vercel.com/new)
3. Add all environment variables
4. Deploy — done!

---

## 📞 Business Contact

- **Phone / WhatsApp:** +66 95 618 2397
- **Email:** mountaintoursamui@gmail.com
- **Location:** Koh Samui, Surat Thani, Thailand
