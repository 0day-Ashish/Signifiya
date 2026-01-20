# Signifiya

**Signifiya** is the annual techfest of the **School of Engineering & Technology (SOET), Adamas University**. It brings together students from across the country for hackathons, coding events, workshops, quizzes, and more.

This repository is the official web app for Signifiya: event registration, visitor passes, team management, and the admin panel for organisers.

**Tech:** [Next.js](https://nextjs.org), [Better Auth](https://www.better-auth.com), [Prisma](https://www.prisma.io), [Upstash](https://upstash.com).

---

## Prerequisites

- **Node.js** 18+
- **PostgreSQL**
- **Upstash Redis** (rate limiting)
- **Supabase** or S3-compatible storage (avatars, uploads)

---

## Getting started

### 1. Install

```bash
npm install
```

### 2. Environment variables

Copy the example and fill in your values:

```bash
cp .env.example .env
```

**Required for development:**

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string |
| `DIRECT_URL` | Direct DB URL (e.g. for migrations) |
| `BETTER_AUTH_URL` | App URL (e.g. `http://localhost:3000`) |
| `BETTER_AUTH_SECRET` | Auth signing secret (see below) |
| `ADMIN_EMAILS` | Comma-separated admin emails |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST URL |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis token |

**`BETTER_AUTH_SECRET`** — generate a random value (min 32 chars):

```bash
openssl rand -base64 32
```

Put the output in `.env` as `BETTER_AUTH_SECRET=...`.

**Optional:** Google/GitHub OAuth (`GOOGLE_*`, `GITHUB_*`), Supabase/S3 for uploads (`NEXT_PUBLIC_SUPABASE_URL`, `S3_*`). See `.env.example` for the full list.

### 3. Database

```bash
npx prisma generate
npx prisma migrate dev
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |

`prisma generate` runs automatically after `npm install`.

---

## Deploy on Vercel

### 1. Push to GitHub and import the project in [Vercel](https://vercel.com/new).

### 2. Environment variables

In **Project → Settings → Environment Variables**, add at least:

- `DATABASE_URL`, `DIRECT_URL`
- `BETTER_AUTH_URL` = `https://your-domain.vercel.app`
- `NEXT_PUBLIC_BETTER_AUTH_URL` = `https://your-domain.vercel.app`
- `BETTER_AUTH_SECRET` — generate with `openssl rand -base64 32`
- `ADMIN_EMAILS`
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- Supabase/S3 vars if you use avatars or uploads

### 3. Database

Before or on first deploy, run migrations against production:

```bash
npx prisma migrate deploy
```

Use the production `DATABASE_URL` (e.g. set it in the shell or in a one-off deploy step).

### 4. OAuth (if used)

In Google/GitHub app settings, set:

- `https://your-domain.vercel.app/api/auth/callback/google`
- `https://your-domain.vercel.app/api/auth/callback/github`

### 5. Deploy

Trigger a deploy. Ensure `BETTER_AUTH_URL` and `NEXT_PUBLIC_BETTER_AUTH_URL` match your live URL so auth callbacks work.

---

## Project structure

- `src/app/` — App Router pages and API
- `src/app/admin/` — Admin (teams, events, revenue, issues, users)
- `src/app/api/auth/` — Better Auth API
- `src/components/` — Shared UI
- `src/lib/` — Auth, DB, S3, utils
- `src/proxy.ts` — Rate limiting (auth, register, events, contact)
- `prisma/` — Schema and migrations

---

## Learn more

- [Next.js](https://nextjs.org/docs)
- [Better Auth](https://www.better-auth.com/docs)
- [Prisma](https://www.prisma.io/docs)
- [Vercel deployment](https://nextjs.org/docs/app/building-your-application/deploying)
