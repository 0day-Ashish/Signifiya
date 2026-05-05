# Signifiya – Official Techfest Platform

Signifiya is the official full-stack platform powering the national-level techfest of the **School of Engineering & Technology (SOET), Adamas University**. It provides a seamless system for **event discovery, registrations, team workflows, authentication, digital passes, and organiser operations**.

---

## 🚀 Features

- Centralised event hub to browse and register for events
- Team creation, management, and collaboration for group competitions
- Auto-generated smart digital entry and participation passes
- Organiser dashboard for tracking registrations and managing event data
- Robust authentication using Better Auth with optional OAuth providers
- Redis-powered rate limiting and high-performance caching
- Supabase / S3 storage support for file uploads

---

## 🧩 Tech Stack

- **Next.js** – Modern React framework
- **Better Auth** – Authentication & session management
- **PostgreSQL + Prisma** – Database and ORM
- **Upstash Redis** – Caching & rate limiting
- **Supabase / AWS S3** – File storage

---

## ⚙️ Installation & Setup

### 1. Install Dependencies
```
npm install
```

### 2. Configure Environment Variables
Copy the example environment file:
```
cp .env.example .env
```

Required variables:
- DATABASE_URL
- DIRECT_URL
- BETTER_AUTH_URL
- BETTER_AUTH_SECRET
- ADMIN_EMAILS
- UPSTASH_REDIS_REST_URL
- UPSTASH_REDIS_REST_TOKEN

Generate a secure auth secret:
```
openssl rand -base64 32
```

Additional optional configs are available for OAuth (Google, GitHub, etc.), Supabase, and S3.

---

## ▶️ Running the Project

Start the development server:
```
npm run dev
```

Visit the app at:
```
http://localhost:3000
```

---

## 📦 Scripts

- `npm run dev` – Start development server
- `npm run build` – Build for production
- `npm start` – Run production build
- `npm run prisma:generate` – Generate Prisma client
- `npm run prisma:migrate` – Apply database migrations

---

## 🗂️ Project Structure
```
app/               # App Router pages & routes
components/        # Reusable UI components
lib/               # Config, utilities, helpers
prisma/            # Prisma schema & migrations
public/            # Static assets
```

---

## 📚 Useful Resources
- https://nextjs.org
- https://prisma.io
- https://better-auth.com
- https://upstash.com

---

If you'd like, I can also help rewrite documentation for contributors, add badges, or generate an architecture diagram.

hello world
