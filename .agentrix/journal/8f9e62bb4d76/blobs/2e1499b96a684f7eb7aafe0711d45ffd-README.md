# Signifiya – Official Techfest Platform

Welcome to **Signifiya**, the national‑level techfest of the **School of Engineering & Technology (SOET), Adamas University**. This repository contains the official full‑stack platform for handling **registrations, event management, passes, authentication, and organiser workflows**.

---

## 🚀 What This Platform Does

- **Centralised Event Hub** – Explore, register, and manage techfest events.
- **Team Collaboration** – Create and join teams for group competitions.
- **Smart Pass System** – Auto‑generated digital passes for visitors & participants.
- **Organiser Dashboard** – View registrations, approve teams, manage event data.
- **Secure Authentication** – Better Auth with optional OAuth providers.
- **Optimised Performance** – Redis‑powered rate limiting and caching.
- **Reliable Storage** – Supabase / S3 support for uploads.

---

## 🧩 Technology Stack

- **Next.js** – Modern React framework
- **Better Auth** – Authentication and session management
- **PostgreSQL + Prisma** – Database & ORM
- **Upstash Redis** – Rate limiting & caching
- **Supabase / S3** – File storage support

---

## ⚙️ Setup & Installation

### 1. Install Dependencies
```
npm install
```

### 2. Configure Environment Variables
Copy the example file:
```
cp .env.example .env
```

You must provide values for:
- `DATABASE_URL` – PostgreSQL DB URL
- `DIRECT_URL` – Direct DB URL (for migrations)
- `BETTER_AUTH_URL` – App base URL
- `BETTER_AUTH_SECRET` – Auth signing secret
- `ADMIN_EMAILS` – Comma‑separated admin list
- `UPSTASH_REDIS_REST_URL` – Redis URL
- `UPSTASH_REDIS_REST_TOKEN` – Redis token

Generate a secure secret:
```
openssl rand -base64 32
```

OAuth, Supabase, and S3 configs are optional.

---

## ▶️ Running the Project
```
npm run dev
```
The app runs at **http://localhost:3000**.

---

## 📦 Available Scripts

- `npm run dev` – Start development server
- `npm run build` – Build production bundle
- `npm start` – Run production server
- `npm run prisma:generate` – Generate Prisma client
- `npm run prisma:migrate` – Apply database migrations

---

## 🗂️ Project Structure
```
app/               # Next.js App Router pages
components/        # Reusable UI components
lib/               # Config, helpers, utilities
prisma/            # Prisma schema & migrations
public/            # Static assets
```

---

## 📚 Resources
- https://nextjs.org
- https://prisma.io
- https://better-auth.com
- https://upstash.com

---

**End of README**