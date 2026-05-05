# Signifiya – Official Techfest Web Platform

Signifiya is the annual national‑level techfest of the **School of Engineering & Technology (SOET), Adamas University**. This repository contains the full-stack web application that powers registrations, event management, visitor passes, authentication, and the organiser admin dashboard.

---

## 🚀 Features

- **Event Registration System** – Students can browse and register for events and competitions.
- **Team Management** – Create, join, and manage teams for group events.
- **Visitor & Participant Passes** – Auto‑generated digital passes.
- **Admin Panel** – Tools for organisers to view participants, approve teams, manage events, etc.
- **Authentication** – Secure login via Better Auth; optional Google/GitHub OAuth.
- **Database & ORM** – PostgreSQL with Prisma.
- **Rate‑Limiting & Caching** – Powered by Upstash Redis.
- **File Storage** – Support for Supabase/S3 compatible storage (uploads, avatars).

---

## 🛠️ Tech Stack

- **Next.js**
- **Better Auth**
- **Prisma ORM**
- **PostgreSQL**
- **Upstash Redis**
- **Supabase / S3 (optional)**

---

## ⚙️ Getting Started

### 1. Install dependencies
```
npm install
```

### 2. Configure environment variables
Copy the example file:
```
cp .env.example .env
```

Fill in the required values:
- `DATABASE_URL` – PostgreSQL connection string
- `DIRECT_URL` – Direct DB URL for migrations
- `BETTER_AUTH_URL` – App base URL (`http://localhost:3000` for dev)
- `BETTER_AUTH_SECRET` – Authentication signing secret
- `ADMIN_EMAILS` – Comma-separated list of admin emails
- `UPSTASH_REDIS_REST_URL` – Redis URL
- `UPSTASH_REDIS_REST_TOKEN` – Redis token

Generate a secure secret:
```
openssl rand -base64 32
```

OAuth, S3, and Supabase credentials are optional.

---

## ▶️ Running in Development
```
npm run dev
```
App runs at **http://localhost:3000**.

---

## 📦 Scripts

- `npm run dev` – Start development server
- `npm run build` – Build for production
- `npm start` – Run production build
- `npm run prisma:generate` – Generate Prisma client
- `npm run prisma:migrate` – Run database migrations

---

## 🧱 Project Structure

A simplified view:
```
app/               # Next.js App Router
components/        # Reusable UI components
lib/               # Config & utilities
prisma/            # Prisma schema & migrations
public/            # Static assets
```

---

## 📚 Learn More
- Next.js – https://nextjs.org
- Prisma – https://prisma.io
- Better Auth – https://better-auth.com
- Upstash – https://upstash.com

---
end of readme
