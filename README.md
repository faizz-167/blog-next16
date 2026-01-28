# NextBlog – Full-Stack Blog Application (Next.js 16 + Convex)

NextBlog is a modern full-stack blogging platform built with **Next.js 16 (App Router)**, **Convex** as the backend/database, **Better Auth** for authentication, **Tailwind CSS v4**, and **shadcn/ui (Base UI)** components.

It supports:
- Email & password authentication
- Creating and viewing blog posts
- Image uploads (Convex Storage)
- Comments on blog posts
- Real-time presence (viewers on a post)
- Dark / light theme toggle
- Static + dynamic rendering with Suspense

---

## Tech Stack

### Frontend
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui (Base UI)
- React Hook Form + Zod
- Sonner (toast notifications)
- next-themes (dark/light mode)

### Backend
- Convex (database, queries, mutations, storage)
- Convex Presence
- Better Auth (email/password auth)

---

## Project Structure (High Level)

```text
app/                → Next.js app router
components/         → UI + web components
convex/             → Convex backend (schema, queries, mutations)
lib/                → Server actions, auth helpers, utilities
schemas/            → Zod validation schemas
constants/          → Routes and navigation constants
```
Prerequisites

Make sure you have the following installed:

Node.js ≥ 18

pnpm (recommended package manager)

Convex CLI

Install Convex CLI globally:

```
npm install -g convex
```

Environment Variables

Create a .env.local file in the root of the project.

```
# Convex
NEXT_PUBLIC_CONVEX_URL=
NEXT_PUBLIC_CONVEX_SITE_URL=

# Site URL (used by Better Auth)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SITE_URL=http://localhost:3000

```

You will get NEXT_PUBLIC_CONVEX_URL and NEXT_PUBLIC_CONVEX_SITE_URL after creating a Convex project.

Setup & Installation
1. Install Dependencies
   ```
   pnpm install
   ```
2. Create a Convex Project
   ```
   convex dev
   ```
This will:

Create a Convex project
Generate backend files
Start the Convex dev server
Ask you to log in if needed
After setup, Convex will generate:

```
convex/_generated/
```
3. Run the Development Server
In a new terminal:
```
pnpm dev
```
The app will be available at:
```
http://localhost:3000
```
How Authentication Works
Uses Better Auth + Convex
Email & password authentication
Session handled via cookies
Protected routes:
/create
/blogs/[id]
Unauthenticated users are redirected to /sign-in

How Image Upload Works
Client requests an upload URL from:
```
POST /api/upload-url
```
Convex generates a temporary upload URL
Image is uploaded directly to Convex Storage
storageId is saved with the blog post
Image URL is resolved using ctx.storage.getUrl()

| Route         | Description                       |
| ------------- | --------------------------------- |
| `/`           | Home page                         |
| `/sign-in`    | User login                        |
| `/sign-up`    | User registration                 |
| `/blogs`      | List all blogs                    |
| `/blogs/[id]` | Single blog post + comments       |
| `/create`     | Create a new blog (auth required) |

