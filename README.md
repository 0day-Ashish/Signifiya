# Signifiya'26

**Signifiya** is the annual techfest of the **School of Engineering & Technology (SOET), Adamas University**. It brings together students from across the country for hackathons, coding events, workshops, quizzes, and more.

This repository is the official web app for Signifiya'26: event registration, visitor passes, team management, and the admin panel for organisers.

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | [Next.js 15](https://nextjs.org) (App Router) |
| Authentication | [Better Auth](https://www.better-auth.com) |
| Database | [PostgreSQL](https://www.postgresql.org) + [Prisma ORM](https://www.prisma.io) |
| Caching & Rate Limiting | [Upstash Redis](https://upstash.com) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Animations | [Motion (Framer Motion)](https://motion.dev) + [Lottie](https://lottiefiles.com) |
| Storage | [Supabase](https://supabase.com) / S3-compatible |
| Deployment | [Vercel](https://vercel.com) |

---

## Features

### User Features
- **Event Registration** — Browse and register for technical & non-technical events
- **Visitor Passes** — Single day, dual day, and full visitor passes with QR codes
- **Team Management** — Create teams, invite members, manage registrations
- **User Profiles** — View passes, team memberships, and booking history
- **Newsletter Subscription** — Stay updated with event announcements

### Admin Features
- **Dashboard** — Overview of users, revenue, teams, and issues
- **User Management** — Search, view, and toggle admin roles
- **Revenue Tracking** — Pass sales, team registrations, verification status
- **Event Management** — View and manage event details and registrations
- **Issue Tracking** — Handle user-reported issues
- **QR Verification** — Scan and verify passes at venue entry

### Technical Features
- **Redis Caching** — Server-side caching for schedule data, admin stats, and frequently accessed data
- **Rate Limiting** — Protection against abuse on auth, registration, and contact endpoints
- **Responsive Design** — Mobile-first design with custom cursor on desktop
- **Neo-brutalist UI** — Bold borders, shadows, and vibrant color palette
- **Smooth Animations** — Page transitions, scroll effects, and interactive elements
- **Preloader** — Animated loading screen for first-time visitors
- **Custom Fonts** — Gilton, Softura, Bicubik, BBH Bartle, Rampart One

---

## Prerequisites

- **Node.js** 18+
- **PostgreSQL** database
- **Upstash Redis** account (for caching & rate limiting)
- **Supabase** or S3-compatible storage (for avatars/uploads)

---

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Copy the example and fill in your values:

```bash
cp .env.example .env
```

**Required variables:**

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string |
| `DIRECT_URL` | Direct DB URL (for migrations) |
| `BETTER_AUTH_URL` | App URL (e.g. `http://localhost:3000`) |
| `BETTER_AUTH_SECRET` | Auth signing secret (min 32 chars) |
| `ADMIN_EMAILS` | Comma-separated admin emails |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST URL |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis token |

**Generate `BETTER_AUTH_SECRET`:**

```bash
openssl rand -base64 32
```

**Optional:** Google/GitHub OAuth (`GOOGLE_*`, `GITHUB_*`), Supabase/S3 (`NEXT_PUBLIC_SUPABASE_URL`, `S3_*`). See `.env.example` for the full list.

### 3. Database Setup

```bash
npx prisma generate
npx prisma migrate dev
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Redis Caching

The app uses Upstash Redis for server-side caching to improve performance:

| Cache Key | TTL | Description |
|-----------|-----|-------------|
| `schedule:all` | 30 min | Event schedule data |
| `admin:dashboard:stats` | 5 min | Admin dashboard statistics |
| `admin:revenue:breakdown` | 5 min | Revenue breakdown data |
| `event:{id}` | 5 min | Individual event details |

**Cache utilities** (`src/lib/cache.ts`):
- `getCache<T>(key)` — Get cached value
- `setCache<T>(key, value, ttl)` — Set cache with TTL
- `deleteCache(key)` — Invalidate cache
- `deleteCachePattern(pattern)` — Bulk invalidation

---

## Rate Limiting

Rate limiting protects critical endpoints from abuse:

| Endpoint | Limit | Window |
|----------|-------|--------|
| Auth (sign-in/sign-up) | 5 requests | 60 seconds |
| Registration | 3 requests | 60 seconds |
| Contact form | 3 requests | 60 seconds |
| Event actions | 10 requests | 60 seconds |

Implemented in `src/proxy.ts` using Upstash Redis sliding window algorithm.

---

## Design System

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Purple | `#deb3fa` | Buttons, accents, highlights |
| Deep Purple | `#9c27b0` | Gradients, headers |
| Darker Purple | `#4a148c` | Hero backgrounds |
| Light Pink | `#f3e5f5` | Subtle backgrounds |
| Success Green | `#4caf50` | Success states |
| Warning Orange | `#ff9800` | Warnings, pending states |
| Accent Yellow | `#FCD34D` | Highlights, accents |

### Typography

| Font | Usage |
|------|-------|
| **Bicubik** | Hero titles, main headings |
| **Gilton Regular** | Section headings, display text |
| **Softura Demo** | Body text, buttons, labels |
| **BBH Bartle** | Countdown timer, preloader |
| **Rampart One** | Contact cards, decorative text |

### Design Principles
- Neo-brutalist style with bold 2-4px black borders
- Consistent box shadows: `shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`
- Rounded corners: `rounded-xl` to `rounded-[2.5rem]`
- Hover effects with translate transforms
- Noise texture overlays for depth

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

`prisma generate` runs automatically after `npm install`.

---

## Deploy on Vercel

### 1. Import Project

Push to GitHub and import in [Vercel](https://vercel.com/new).

### 2. Environment Variables

In **Project → Settings → Environment Variables**, add:

- `DATABASE_URL`, `DIRECT_URL`
- `BETTER_AUTH_URL` = `https://your-domain.vercel.app`
- `NEXT_PUBLIC_BETTER_AUTH_URL` = `https://your-domain.vercel.app`
- `BETTER_AUTH_SECRET`
- `ADMIN_EMAILS`
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- Supabase/S3 vars (if using uploads)

### 3. Database Migration

Run migrations against production:

```bash
npx prisma migrate deploy
```

### 4. OAuth Callbacks (if used)

Configure in Google/GitHub app settings:
- `https://your-domain.vercel.app/api/auth/callback/google`
- `https://your-domain.vercel.app/api/auth/callback/github`

### 5. Deploy

Trigger deployment. Verify auth callbacks work with correct URLs.

---

## Project Structure

```
src/
├── app/
│   ├── admin/           # Admin dashboard pages
│   │   ├── components/  # Admin UI components
│   │   ├── events/      # Event management
│   │   ├── issues/      # Issue tracking
│   │   ├── newsletter/  # Newsletter management
│   │   ├── revenue/     # Revenue tracking
│   │   ├── teams/       # Team management
│   │   ├── users/       # User management
│   │   └── verify/      # QR verification
│   ├── api/auth/        # Better Auth API routes
│   ├── assets/          # Brand assets page
│   ├── contact/         # Contact page
│   ├── gallery/         # Photo gallery
│   ├── merch/           # Merchandise page
│   ├── profile/         # User profile
│   ├── register/        # Pass registration
│   ├── schedule/        # Event schedule
│   ├── sign-in/         # Authentication
│   └── sponsors/        # Sponsors page
├── components/          # Shared UI components
├── config/              # App configuration
├── data/                # Event data (single source of truth)
├── lib/                 # Utilities (auth, db, cache, s3)
└── proxy.ts             # Rate limiting middleware
prisma/
├── schema.prisma        # Database schema
└── migrations/          # Database migrations
public/
├── fonts/               # Custom fonts
└── ...                  # Static assets
```

---

## Configuration

Central configuration in `src/config/app.config.ts`:

- Event information (name, dates, year)
- Pass pricing
- Contact members
- Social media links

---

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Better Auth Documentation](https://www.better-auth.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Upstash Redis Documentation](https://upstash.com/docs/redis)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vercel Deployment Guide](https://nextjs.org/docs/app/building-your-application/deploying)

---

## License

This project is proprietary software for Signifiya, SOET, Adamas University.

---

**Designed & Developed by [ard.dev](https://github.com/0day-Ashish) & [subham12r](https://github.com/subham12r)**
